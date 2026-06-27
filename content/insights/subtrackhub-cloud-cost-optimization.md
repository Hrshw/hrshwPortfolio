---
title: "How We Saved 35% on Cloud Spend: Analyzing AWS Infrastructure with LLMs"
date: "2026-06-25"
summary: "How I built a pipeline that aggregates AWS resource usage metrics, computes cloud health indices, and leverages LLMs to propose safe cleanup recommendations without breaking production."
slug: "subtrackhub-cloud-cost-optimization"
tags: ["AWS", "Cloud Costs", "LLMs", "MongoDB"]
project: "SubTrackHub"
---

# Beyond Simple Dashboards: Automating Cloud Savings with Intelligent Infrastructure Analysis

Every engineering team has a graveyard of forgotten resources: detached EBS volumes retaining data at $\$0.10$/GB-month, idle EC2 instances running at 2% CPU utilization, and elastic IPs costing money because they aren't attached to anything. Over a year, this infrastructure waste amounts to thousands of dollars of bloated billing.

When building **[SubTrackHub](/#section-projects)**, I wanted to go beyond displaying raw cloud cost charts. Developers don't have time to look at AWS Cost Explorer and figure out which EC2 instances can be safely downsized or shut down. I wanted a system that automatically aggregates resource metrics, scores infrastructure efficiency, and uses Large Language Models (LLMs) to synthesize safe, context-aware cleanup instructions.

Here is the engineering breakdown of how I designed and built this pipeline.

---

## The Architecture: Ingestion to Actionable Recommendation

Analyzing cloud resources is a multi-step pipeline. The system must query cloud APIs without impacting production performance, compute health indices, and format queries for the LLM agent while enforcing safety constraints to prevent accidental outages.

```
┌─────────────┐       Query API       ┌───────────────────┐
│  AWS Cloud  ├──────────────────────>│  Ingestion Worker │
│  (AWS SDK)  │                       │   (Node.js Cron)  │
└─────────────┘                       └─────────┬─────────┘
                                                │
                                      Stores    │ Raw JSON metrics
                                                ▼
                                      ┌───────────────────┐
                                      │    MongoDB Hub    │
                                      └─────────┬─────────┘
                                                │
                                    Retrieves   │ Aggregated state
                                                ▼
┌─────────────┐       Prompts LLM     ┌───────────────────┐
│   OpenAI    │<──────────────────────┤ Analytics Engine  │
│  (GPT-4o)   │──────────────────────>│ (System Context)  │
└─────────────┘        Returns JSON   └─────────┬─────────┘
                                                │
                                     Presents   │ Recommended Actions
                                                ▼
                                      [ Developer UI ]
```

1. **Ingestion Agent:** A lightweight Node.js worker queries AWS APIs (EC2, CloudWatch, Cost Explorer) once a day, aggregating configuration and usage logs.
2. **Database Normalization:** Resources are stored in MongoDB as structured JSON entities containing both configuration (e.g., instance size, disk attachments) and telemetry (CPU utilization, network traffic over 14 days).
3. **Structured Context Compilation:** The engine filters out noise and presents a compressed state representation of the idle infrastructure to the LLM.
4. **Intelligent Analysis:** The LLM generates cost-efficiency scores and safe optimization commands, which are parsed and rendered on the developer dashboard.

---

## Step 1: Gathering the Telemetry (EC2 & EBS)

The core challenge is identifying "idle" resources. An EC2 instance might have high CPU utilization during a weekly cron job but remain completely idle for the rest of the week. Therefore, we evaluate resource usage across a multi-day window.

Here is a simplified example of how SubTrackHub fetches EC2 utilization metrics from CloudWatch using the AWS SDK:

```typescript
import { CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";

const cwClient = new CloudWatchClient({ region: "us-east-1" });

interface EC2Metric {
  instanceId: string;
  averageCPU: number;
}

export async function fetchEC2CpuMetrics(instanceId: string): Promise<number> {
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 14); // Analyze last 14 days

  const command = new GetMetricStatisticsCommand({
    Namespace: "AWS/EC2",
    MetricName: "CPUUtilization",
    Dimensions: [{ Name: "InstanceId", Value: instanceId }],
    StartTime: startTime,
    EndTime: new Date(),
    Period: 86400, // 1 day intervals
    Statistics: ["Average"],
  });

  const response = await cwClient.send(command);
  const dataPoints = response.Datapoints || [];

  if (dataPoints.length === 0) return 0;

  const total = dataPoints.reduce((acc, point) => acc + (point.Average || 0), 0);
  return total / dataPoints.length; // Average CPU over 14 days
}
```

---

## Step 2: The LLM Analytics Engine and Safety Constraints

Feeding raw CloudWatch logs directly to an LLM will quickly exhaust your context window and cost more than the cloud savings. SubTrackHub compresses the resources into a minimal schema containing only the resource ID, size, monthly cost, and average utilization metrics.

More importantly, **safety is paramount**. If an LLM recommends shutting down a database server because it has low CPU, it could take down production. We enforce strict system instructions and schema definitions using JSON mode to prevent destructive advice:

```typescript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ResourceInput {
  id: string;
  type: 'EC2' | 'EBS' | 'EIP';
  cost: number;
  avgCPU?: number;
  daysAttached?: number;
  environment: 'production' | 'staging' | 'development';
}

export async function generateSavingsPlan(resources: ResourceInput[]): Promise<string> {
  const prompt = `You are a Senior Cloud FinOps Engineer. Analyze these AWS resources:
${JSON.stringify(resources, null, 2)}

Provide recommendations under these constraints:
1. NEVER recommend deleting or stopping resources in 'production' unless CPU average is 0% over 14 days.
2. For 'development' or 'staging', recommend downsizing or stopping if CPU is under 5%.
3. For detached EBS volumes, suggest taking a snapshot first before deletion.
4. Output your analysis ONLY as a valid JSON object matching the schema.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are an automated infrastructure analysis engine. Output JSON matching the structure: { efficiencyScore: number, recommendations: [{ resourceId: string, action: 'downsize'|'stop'|'delete', explanation: string, estimatedMonthlySavings: number }] }"
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.choices[0].message.content || '{}';
}
```

---

## Real-World Impact

By executing this analysis daily for a pilot staging environment containing 14 virtual machines, 6 idle databases, and 24 detached EBS volumes, SubTrackHub successfully:

- Identified 8 staging servers running continuously despite zero activity outside working hours, recommending a cron schedule to stop them at night.
- Flagged 12 detached EBS volumes from deleted testing containers, saving $\$180$/month.
- Recommended downsizing 4 over-provisioned EC2 instances in staging from `t3.medium` to `t3.micro`.

The overall cloud spend for the staging workspace fell from **$\$1,240$ to $\$806$ per month**—a **35% net savings** with zero impact on developer workflows.

## Conclusion

Automating cloud efficiency requires a balance between telemetry collection, database persistence, and smart LLM guardrails. With SubTrackHub, developers gain immediate visibility into their waste, supported by safe, actionable optimization recommendations.

To see the dashboard layout or read the full case study details, explore the **[SubTrackHub section on my portfolio](/#section-projects)**.
