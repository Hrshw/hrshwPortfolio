---
title: "Architecting for Scale: Production Best Practices for AWS Lambda & API Gateway"
date: "2026-06-26"
summary: "Cold starts, connection pooling, IAM lockdowns, and event-driven architectures. Here is a battle-tested guide to scaling serverless applications."
slug: "aws-serverless-lambda-best-practices"
tags: ["AWS", "Serverless", "Lambda", "Architecture"]
---

Serverless architecture promises automatic scaling, zero idle costs, and reduced operational overhead. But when you move from a basic "Hello World" function to a production API processing millions of requests, you run into real-world engineering bottlenecks: database connection exhaustion, latency spikes from cold starts, and complex permission hierarchies.

Through building scalable backends like the **[Observyze](/#section-projects)** ingestion pipeline, I have compiled a set of battle-tested patterns and practices for deploying high-throughput, secure, and cost-effective serverless architectures on AWS using Lambda and API Gateway.

---

## 1. Conquering Cold Starts: Provisioned vs. Optimized Runtime

A "cold start" happens when AWS needs to spin up a new micro-container instance to execute your Lambda function. If your function code or dependencies are bloated, the cold start latency can exceed 3 seconds, degrading the user experience.

### Mitigation Strategies:

- **Minimize Package Size:** Do not package your entire `node_modules` folder. Use bundlers like Esbuild (often default in AWS CDK or Serverless Framework) to tree-shake code, packaging only what is executed.
- **Bypass Heavy SDKs:** If you are only using DynamoDB, do not import the entire AWS SDK. Import only the specific client you need:
  
  ```typescript
  // Bad: Imports the entire SDK
  import AWS from 'aws-sdk'; 
  
  // Good: Imports only the Client (v3)
  import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
  ```
- **Provisioned Concurrency:** For latency-critical client endpoints (like checkout or login), configure a baseline count of pre-warmed execution environments using AWS Provisioned Concurrency.

---

## 2. Preventing Database Connection Exhaustion

In traditional server architectures, a Node.js process keeps a persistent connection pool open to a database like PostgreSQL or MongoDB. However, Lambda functions are stateless and ephemeral. If 1,000 Lambda functions run concurrently, they will try to open 1,000 separate database connections, immediately crashing your database pool.

### The Connection Pooling Pattern:

To prevent this, define the database connection variable **outside the Lambda handler function**. This leverages container reuse; if the micro-container is reused for subsequent invocations, the database connection is preserved:

```typescript
import { MongoClient } from 'mongodb';

// Declared in global scope (persisted across warm starts)
let cachedDbClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedDbClient) {
    return cachedDbClient;
  }
  
  // Connect and cache the instance
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  cachedDbClient = client;
  return client;
}

export const handler = async (event: any) => {
  const db = await connectToDatabase();
  // Execute database queries...
};
```

For SQL databases like PostgreSQL, utilize **AWS RDS Proxy**. The proxy acts as a centralized database connection pooler, allowing thousands of ephemeral Lambdas to query the database safely without exhausting connections.

---

## 3. Strict IAM Isolation: Principle of Least Privilege

Deploying all Lambda functions under a single wildcard (`*`) administrator IAM role is a massive security hazard. If one serverless microservice is compromised via a dependency exploit, the attacker gains full control over your entire AWS infrastructure.

### Rules for Secure Roles:
- **One Role Per Function:** Define unique IAM roles for every single Lambda function.
- **Restrict Actions:** If a function only needs to read from a DynamoDB table, grant it exactly `dynamodb:GetItem` and `dynamodb:Query` permissions on that specific table's ARN—not `dynamodb:*` on all tables.
- **Network Isolation:** Put databases and ingestion workers inside private VPC subnets, and configure Security Groups to restrict access only to the Lambda functions that require it.

```yaml
# Serverless Framework configuration example
functions:
  getTelemetry:
    handler: handler.getTelemetry
    iamRoleStatements:
      - Effect: "Allow"
        Action:
          - "dynamodb:GetItem"
        Resource: "arn:aws:dynamodb:us-east-1:123456789012:table/TelemetryTable"
```

---

## 4. Going Asynchronous with Event-Driven Architecture

For high-throughput endpoints (like telemetry collectors), do not make the client wait for database writes. If your API Gateway invokes a Lambda that writes directly to MongoDB, the client latency equals the DB write time. Under load, database locks will cause API timeouts.

Instead, decouple the API Gateway from processing using **AWS SQS (Simple Queue Service)** or **AWS Kinesis**:

```
┌──────────────┐         Pushes Job         ┌─────────────┐
│ API Gateway  ├───────────────────────────>│  AWS SQS    │
│ (HTTP POST)  │ (Returns 202 Accepted)    │  (Buffer)   │
└──────────────┘                            └──────┬──────┘
                                                   │
                                    Invokes batch  │ (Paced rate)
                                                   ▼
                                            ┌─────────────┐
                                            │ AWS Lambda  │
                                            │ (Consumer)  │
                                            └──────┬──────┘
                                                   │
                                                   ▼
                                            [ MongoDB Atlas ]
```

API Gateway accepts the payload, immediately pushes it to SQS, and returns `202 Accepted` to the client in under 50ms. SQS then invokes the consumer Lambda in batches, shielding your database from traffic spikes.

---

## Conclusion

Transitioning to serverless requires a shift in how we think about state, networking, and permissions. By applying connection caching, limiting bundle sizes, enforcing least-privilege IAM rules, and building event-driven queues, you can deploy serverless systems that are both highly secure and capable of scaling to millions of hits seamlessly.

For more details on serverless architectures I have built in production, check out the **[System Design section on my homepage](/#section-system-design)**.
