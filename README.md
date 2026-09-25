# Rahul Singh Shekhawat — Portfolio

Full-stack / cloud engineer portfolio built with **Next.js 16 (App Router)**, React 19, Tailwind CSS, GSAP, Three.js, and Upstash Redis.

## Features

- **Homepage** — hero, about, experience, skills, projects, system design, certifications, testimonials, support, and contact sections (dark/light themes).
- **Testimonials** (`/testimonials`) — visitors leave ratings + notes. Submissions are **spam-filtered**, **rate-limited**, and held for **admin approval** before going live.
- **Contact form** — server-validated, honeypot + time-trap spam filtering, per-IP and global rate limits. Messages land in the admin inbox.
- **Admin panel** (`/admin`) — passcode-protected moderation of testimonials (approve / delete), inbox messages (read / delete), a manual donations tracker (+1 per UPI payment, optional amount, total in ₹), and a project **Inquiries** pipeline (New → Contacted → Quoted → Won/Lost). Login attempts are throttled; passcode comparison is constant-time.
- **Hire page** (`/hire`, private) — a project-brief page shared directly with potential clients: services, rate ranges, typical project pricing, and a structured brief form. Deliberately **not linked in the nav and noindexed** (robots.txt + meta robots) so it stays out of search engines. Submissions generate a scope summary, land in the admin Inquiries tab, and email a copy to you plus a confirmation to the client. **English + Hindi** (auto-detects Hindi browsers; toggle in the header); client confirmation emails are sent in the client's language while data stays stored in canonical English. Adjust rates/bundles in `src/lib/hire.ts`, translations in `src/lib/hire-i18n.ts`.
- **Support / donations** — "Buy me a coffee" section. Payments use **UPI deep links generated server-side** (payee can never be tampered with) with strict amount validation (₹10–₹10,000, ≤2 decimals). An optional **Polar** hosted-checkout button can be enabled via env var.
- **Insights blog** — markdown-powered posts under `content/insights`, with an RSS feed (`/rss.xml`), a generated table of contents, related-post and focus-area links, and author details on every post.
- **Technical focus areas** (`/specialization`) — six capability pages (cloud, AWS/serverless, full-stack, Node.js, AI, serverless architecture) plus a hub. Each has its own heading, metadata and long-form content, and they're linked from the nav, footer, insights index and every matching post.
- **Analytics** — Vercel Web Analytics (`@vercel/analytics`), which is same-origin under `/_vercel/*` and therefore needs no CSP exceptions. Custom events fire on the hero CTAs and on a successful contact submit.
- **SEO** — per-page metadata and OpenGraph data, a dynamic `/og` image route that renders a unique 1200×630 card per page, article-typed OpenGraph data with published/modified timestamps for posts, RSS autodiscovery, `BlogPosting`/`WebPage`/`BreadcrumbList`/`Person`/`SoftwareApplication` structured data, an `llms.txt` summary, and a sitemap carrying real per-post dates.

> **Positioning note:** the site describes systems that were built, not services for sale. `/hire` stays `noindex` and `Disallow`ed, and the marketing pages deliberately avoid "hire me" / "available for freelance" framing and job-title page titles. If you change that intent, update `src/lib/metadata.ts`, `src/lib/capabilities.ts`, `public/llms.txt` and `src/app/robots.ts` together.

## Local development

```bash
npm install
cp .env.example .env      # optional locally; REQUIRED in production
npm run dev
```

Open http://localhost:3000.

Without Redis env vars the app uses an in-memory fallback so everything works locally — data resets on restart. **Set `KV_REST_API_URL` / `KV_REST_API_TOKEN` in production.**

## Production deployment (Vercel / any Node host)

1. Create a free [Upstash Redis](https://upstash.com) database and copy `KV_REST_API_URL` + `KV_REST_API_TOKEN`.
2. Set a strong `ADMIN_PASSCODE` (long, random — e.g. `openssl rand -base64 24`).
3. Generate a secret `RATE_LIMIT_SALT` — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
4. Set `NEXT_PUBLIC_SITE_URL` to your canonical domain.
5. **Payments** — decide which option:
   - **UPI (default, zero setup):** the code already ships with your UPI ID (`7082739587@jupiteraxis`), overridable via `SUPPORT_UPI_ID`. Visitors pay you directly via any UPI app. `SUPPORT_UPI_NAME` / `SUPPORT_UPI_REF_PREFIX` are optional.
   - **Polar:** create a donation checkout in your [Polar dashboard](https://polar.sh) and paste the link into `POLAR_CHECKOUT_URL` for card / international payments. For full Polar integration (webhooks, verifying payments server-side) add the Polar SDK + a webhook route.
6. **Email notifications (recommended, no third party needed):** enable 2-Step Verification on your Google account, create an [App Password](https://myaccount.google.com/apppasswords), and set `SMTP_USER=rahulsinghpilani7@gmail.com` + `SMTP_PASS=<app password>`. Your site then emails through your own Gmail. (Prefer Resend? Set `RESEND_API_KEY` instead — it's used when SMTP creds are absent.) Owner notifications (new contact messages + project inquiries) are emailed **only** to `rahulsinghpilani7@gmail.com` by default (override via `CONTACT_EMAIL_TO`), with `Reply-To` set to the sender, *and* stored in `/admin`. Without either transport, messages appear only in the `/admin` inbox.
8. **Analytics (optional but recommended):** enable **Web Analytics** for the project in the Vercel dashboard. No extra env vars are needed — the client falls back to a silent no-op when it isn't on Vercel, which is why the script 404s in local development.
9. Build & ship: `npm run build && npm run start`.

## Security notes

- All user input is sanitized server-side (HTML/control characters stripped, Unicode preserved) and validated (email format, LinkedIn hostname, rating range, message lengths).
- Anti-abuse: honeypot field, submission time-trap, per-IP rate limits, and daily global caps — applied to both contact and feedback.
- Admin auth: passcode lives only in server env, compared in constant time, login attempts throttled per IP (10 / 15 min), admin routes blocked from search engines and robots.txt.
- Payments: the UPI payee ID is never derived from user input — it comes from server env and the intent URL is built server-side.
- Production security headers are applied via `next.config.ts` (CSP, nosniff, X-Frame-Options DENY, etc.). CSP uses `'unsafe-inline'` for Next's inline bootstrap scripts; a nonce-based CSP is a recommended follow-up.
- IPs are stored only as salted hashes (never raw), with a per-deployment salt.

### Recommended follow-ups

- Tighten CSP with nonces once you add a nonce middleware.
- Move testimonial moderation behind a real auth provider (e.g. Auth.js) if you need multi-admin or sessions.
- Add webhook-based payment verification if you enable Polar.
