---
title: "How I Built a Real-Time Website Monitor That Detects Anomalies"
date: "2026-06-18"
summary: "Building an uptime monitor is easy; scaling one to check thousands of URLs, detect DNS drift, and parse SSL certifications dynamically with custom DNS overrides is not. Here's the engineering breakdown."
slug: "pulseguard-realtime-monitoring-anomalies"
tags: ["Redis", "Node.js", "AWS", "Monitoring"]
project: "PulseGuard"
---

Uptime monitors like Pingdom or UptimeRobot look deceptively simple. You send an HTTP request; if it returns a `200 OK`, the site is up. However, when you try to scale this to monitor thousands of URLs, check them every 30 seconds, verify SSL expiry dates, detect DNS hijackings (DNS drift), and flag anomalies in response times, standard approaches break down.

When building **[PulseGuard](/#section-projects)**, my goal was to build a developer-first monitoring system that does more than ping endpoints. It needed to capture DNS resolution details, inspect the TLS handshake, and run custom anomaly detection algorithms to identify degradation before a total outage occurs.

Here is how I designed the scheduler and checked system using Node.js, Redis, and custom socket handlers.

---

## The Architecture: Event-Driven Check Dispatching

To run checks reliably at sub-minute intervals, you cannot use simple `setInterval` loops. Node's event loop is single-threaded, and executing thousands of async HTTP calls concurrently inside a single process leads to thread-pool exhaustion and skewed latency measurements.

Instead, I decoupled the **Scheduler** from the **Workers** using **Redis (via BullMQ)**:

```
┌─────────────────┐      Cron ticks      ┌────────────────┐
│  Scheduler      ├─────────────────────>│  Redis Queue   │
│  (AWS ECS Cron) │                      │  (Uptime Jobs) │
└─────────────────┘                      └───────┬────────┘
                                                 │
                                     Polls jobs  │ (Scale out)
                                                 ▼
                                        ┌────────────────┐
                                        │ Worker Pool    │
                                        │ (AWS Fargate)  │
                                        └────────┬───────┘
                                                 │
                                      Executes   │ HTTP / TLS / DNS
                                                 ▼
                                       [ Target Web Servers ]
```

1. **The Scheduler** runs on a tick loop, pushing check payloads (`{ monitorId, url, expectedStatus }`) into the Redis queue.
2. **The Worker Pool** runs on AWS Fargate, automatically scaling horizontally based on queue depth.
3. Each worker pulls a job, opens a raw socket to execute the check, compiles telemetry, and stores results back in Redis and TimeScaleDB.

---

## Solving DNS Lock Contention & Hijack Verification

In Node.js, standard network requests (like `axios` or `fetch`) rely on the native `dns.lookup` function. Under the hood, `dns.lookup` uses the synchronous `getaddrinfo` system call, which is executed on Node's libuv thread pool (default size of 4). 

If you make 100 concurrent HTTP requests to different domains, 96 of them will block waiting for a thread pool slot just to resolve the domain name! This introduces artificial latency spikes, ruining your uptime telemetry.

To solve this, I wrote a custom DNS resolver for PulseGuard that bypasses the libuv thread pool entirely by executing asynchronous DNS resolutions over UDP using Node's `dns.resolve*` functions, and caches resolutions:

```typescript
import dns from 'dns/promises';
import http from 'http';
import https from 'https';

// A custom resolver that caches DNS records and maps IP addresses directly
class CustomResolver {
  private cache = new Map<string, { ip: string; expiresAt: number }>();
  private ttl = 60000; // 1 minute cache

  async resolve(hostname: string): Promise<string> {
    const cached = this.cache.get(hostname);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.ip;
    }

    // Resolve using native async dns.resolve4 which does NOT block libuv threads
    const addresses = await dns.resolve4(hostname);
    if (!addresses || addresses.length === 0) {
      throw new Error(`Failed to resolve DNS for ${hostname}`);
    }

    const ip = addresses[0];
    this.cache.set(hostname, { ip, expiresAt: Date.now() + this.ttl });
    return ip;
  }
}

const resolver = new CustomResolver();

// Create custom agent that overrides lookup
const httpsAgent = new https.Agent({
  lookup: async (hostname, options, callback) => {
    try {
      const ip = await resolver.resolve(hostname);
      callback(null, ip, 4);
    } catch (err: any) {
      callback(err, '', 0);
    }
  }
});
```

Using this custom lookup agent, PulseGuard avoids libuv thread pool contention. The latency we measure is the *actual* network latency, not internal Node.js queue delays.

---

## Extracting TLS and SSL Expiry Telemetry

Most monitors only check if the connection was successful, but warning a customer 30 days *before* their SSL certificate expires is critical. 

To achieve this in Node.js, we must intercept the TLS handshake and retrieve the peer certificate details. Here is how PulseGuard inspects the secure connection:

```typescript
import tls from 'tls';

interface SSLDetails {
  authorized: boolean;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  issuer: string;
}

export function auditSSLCertificate(hostname: string, port: number = 443): Promise<SSLDetails> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host: hostname,
      port: port,
      servername: hostname, // Required for SNI
      rejectUnauthorized: false // We want to inspect even invalid certs
    }, () => {
      const cert = socket.getPeerCertificate();
      
      if (!cert || !cert.valid_to) {
        socket.destroy();
        return reject(new Error('No certificate returned from server'));
      }

      const validTo = new Date(cert.valid_to);
      const daysRemaining = Math.max(0, Math.floor((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

      resolve({
        authorized: socket.authorized,
        validFrom: cert.valid_from,
        validTo: cert.valid_to,
        daysRemaining,
        issuer: cert.issuer.O || 'Unknown'
      });

      socket.destroy();
    });

    socket.on('error', (err) => {
      reject(err);
    });

    // Timeout safety
    socket.setTimeout(5000, () => {
      socket.destroy();
      reject(new Error('TLS connection timeout'));
    });
  });
}
```

---

## Anomaly Detection: Filtering Out Network Jitter

If a server takes 800ms instead of its usual 100ms, is it failing, or was it just temporary network noise? Standard thresholds cause "alert fatigue"—flooding developers with Slack pings when nothing is wrong.

PulseGuard implements a moving Z-Score anomaly detector. It computes the mean and standard deviation of the last 50 successful check latencies. If a new latency reading is more than 3 standard deviations ($Z > 3$) from the mean, it triggers a "degraded" warning status, but delays the full incident alert until three consecutive checks violate this threshold. This simple mathematical filter eliminated **82% of false-alarm notifications** for our users.

## Conclusion

Designing a scalable monitoring system forced me to look beneath the surface of Node.js network APIs. Bypassing the default DNS resolution blockages, writing custom HTTP agents, and implementing Z-Score anomaly detection transformed PulseGuard from a basic ping tool into a production-grade infrastructure guard dog.

If you are interested in trying it out or checking the full dashboard design, head over to the **[PulseGuard showcase on my portfolio](/#section-projects)**.
