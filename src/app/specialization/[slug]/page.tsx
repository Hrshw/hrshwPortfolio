import React from "react";
import { notFound } from "next/navigation";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SystemDesignSection from "@/components/sections/SystemDesignSection";
import CertificationsSection from "@/components/sections/CertificationsSection";
import FeedbackTeaserSection from "@/components/sections/FeedbackTeaserSection";
import ContactSection from "@/components/sections/ContactSection";
import BlueprintCanvas from "@/components/3d/BlueprintCanvas";
import StructuredData from "@/components/seo/StructuredData";
import { constructMetadata } from "@/lib/metadata";

interface SpecializationConfig {
  title: string;
  tagline: string;
  intro: string;
  metaDescription: string;
}

const specializations: Record<string, SpecializationConfig> = {
  "cloud-engineer": {
    title: "Rahul Shekhawat | Cloud Engineer Portfolio",
    tagline: "Full-Stack & Cloud Engineer building AI-powered SaaS on scalable AWS architectures, infrastructure as code, and performance tuning.",
    intro: "As a cloud engineer based in India, I design, build, and operate scalable AWS infrastructure for production SaaS platforms — from account-level architecture and infrastructure-as-code to performance tuning and FinOps cost control. My work spans EC2, ECS/Fargate, S3, DynamoDB, and serverless compute, with a focus on reliability, security, and measurable efficiency gains.",
    metaDescription: 'Hire a cloud engineer in India for AWS infrastructure, serverless architecture, and FinOps cost optimization. Rahul Singh Shekhawat builds scalable cloud systems for SaaS startups.',
  },
  "aws-developer": {
    title: "Rahul Shekhawat | AWS Developer India",
    tagline: "AWS Developer based in India, specializing in serverless API Gateway, Lambda, RDS, and cost-optimized cloud infrastructure.",
    intro: "An AWS developer specializing in the serverless stack — API Gateway, Lambda, SQS, S3, RDS, and DynamoDB — I build event-driven backends that scale without runaway costs. My AWS projects include real-time monitoring engines, telemetry ingestion pipelines, and cloud cost-optimization tooling that has cut production spend by up to 35%.",
    metaDescription: 'Hire an AWS developer in India for serverless APIs, Lambda, DynamoDB, and cost-optimized cloud infrastructure. Freelance AWS engineer for startups and SaaS products.',
  },
  "full-stack-developer": {
    title: "Rahul Shekhawat | Full Stack Developer Portfolio",
    tagline: "Full Stack Developer building AI-powered SaaS with robust Node.js backends, React interfaces, and cloud-native scalable systems.",
    intro: "I'm a full-stack developer who ships complete products: robust Node.js and Express/Fastify backends, React and Next.js interfaces, and cloud-native deployment pipelines. From transport booking platforms to AI-powered monitoring dashboards, I take projects from first architecture decision to production deployment.",
    metaDescription: 'Hire a full stack developer in India for React, Next.js, Node.js, and cloud-native SaaS. Freelance full-stack engineer building end-to-end products from MVP to production.',
  },
  "node-js-developer": {
    title: "Rahul Shekhawat | Node.js Developer",
    tagline: "Node.js Developer specializing in fast Fastify endpoints, distributed Redis workers, and secure environment CLI toolsets.",
    intro: "As a Node.js developer, I focus on high-throughput, low-latency backends — Fastify endpoints, distributed Redis/BullMQ workers, and secure developer tooling like env-secret-lock, a zero-knowledge AES-256-GCM environment secret manager used in production across engineering teams.",
    metaDescription: 'Hire a Node.js developer in India for Fastify, Express, REST APIs, and real-time backends. Freelance Node.js engineer for SaaS, APIs, and microservices.',
  },
  "ai-engineer": {
    title: "Rahul Shekhawat | AI Engineer Portfolio",
    tagline: "AI Systems & Software Engineer specializing in generative AI agent logging, trace trees, and MongoDB Time-Series telemetry.",
    intro: "An AI engineer focused on production AI systems: LLM integrations, RAG pipelines, agent observability, and telemetry that makes AI debugging tractable. Projects like Observyze process millions of AI traces monthly with PII-safe, GDPR-aware architecture — turning opaque agent behavior into structured, queryable spans.",
    metaDescription: 'Hire an AI engineer in India for LLM integrations, RAG pipelines, AI observability, and production AI systems. Freelance AI developer for SaaS and automation.',
  },
  "serverless-engineer": {
    title: "Rahul Shekhawat | Serverless Architecture Engineer",
    tagline: "Serverless Architecture Engineer specializing in event-driven AWS SQS, Lambda concurrency, and cost-efficient FinOps automation.",
    intro: "Specializing in event-driven serverless architecture, I design systems around AWS SQS, Lambda concurrency, and asynchronous processing — decoupling ingestion from databases, pacing workers, and automating FinOps so cloud costs stay predictable at scale.",
    metaDescription: 'Hire a serverless engineer in India for event-driven AWS Lambda, SQS, and cost-efficient cloud architecture. Freelance serverless developer for SaaS and startups.',
  },
};

export function generateStaticParams() {
  return Object.keys(specializations).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const config = specializations[slug];
  if (!config) return {};

  return constructMetadata({
    title: config.title,
    description: config.metaDescription,
    path: `/specialization/${slug}`,
  });
}

export default async function SpecializationPage({ params }: PageProps) {
  const { slug } = await params;
  const config = specializations[slug];

  if (!config) {
    notFound();
  }

  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 selection:bg-zinc-800 selection:text-white min-h-screen relative overflow-hidden transition-colors duration-500">
      <StructuredData />
      {/* BreadcrumbList for this specialization page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rahulshekhawat.dev' },
              { '@type': 'ListItem', position: 2, name: config.title.split(' | ')[1] || slug, item: `https://rahulshekhawat.dev/specialization/${slug}` },
            ],
          }),
        }}
      />
      {/* 3D background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />
        <BlueprintCanvas />
      </div>

      {/* Sections */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <HeroSection customTagline={config.tagline} />

        {/* Unique SEO intro to differentiate specialization landing pages */}
        <div className="px-8 md:px-24 py-10">
          <div className="bg-black/5 dark:bg-zinc-900/30 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-10 transition-colors duration-500">
            <p className="text-zinc-700 dark:text-zinc-300 text-lg md:text-xl font-light leading-relaxed max-w-4xl">
              {config.intro}
            </p>
          </div>
        </div>

        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <SystemDesignSection />
        <FeedbackTeaserSection />
        <CertificationsSection />
        <ContactSection />
      </div>
    </main>
  );
}
