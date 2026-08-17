import React from 'react';
import SystemDesignSection from '@/components/sections/SystemDesignSection';
import { constructMetadata } from '@/lib/metadata';

export const metadata = constructMetadata({
  title: 'Cloud Architecture & System Design | Rahul Singh Shekhawat',
  description: 'Production-grade cloud blueprints and system design specifications, detailing Fastify ingestion nodes, Redis workers, AWS serverless configurations, and in-memory key overrides.',
  path: '/system-design',
});

export default function SystemDesignPage() {
  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto">
        <SystemDesignSection headingLevel="h1" />
      </div>
    </main>
  );
}
