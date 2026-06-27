import React from 'react';
import Link from 'next/link';
import { getAllInsights } from '@/lib/insights';
import { constructMetadata } from '@/lib/metadata';

export const metadata = constructMetadata({
  title: 'Engineering Insights | Rahul Singh Shekhawat',
  description: 'Technical deep dives into cloud architecture, system design breakdowns, AWS serverless patterns, Node.js performance, and AI engineering — from real production builds.',
  path: '/insights',
});

export default function InsightsPage() {
  const insights = getAllInsights();

  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen pt-32 pb-32 px-8 md:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Engineering Insights</h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-16">
          Deep dives into system architectures, complex bug fixes, and lessons learned while building scalable software.
        </p>

        <div className="space-y-12">
          {insights.map((insight) => (
            <article key={insight.slug} className="group relative border-l-2 border-zinc-200 dark:border-zinc-800 pl-6 hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors">
              <span className="text-sm font-mono text-zinc-500 mb-2 block">{insight.date}</span>
              <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <Link href={`/insights/${insight.slug}`}>
                  {insight.title}
                  <span className="absolute inset-0"></span>
                </Link>
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {insight.summary}
              </p>
              {insight.tags && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {insight.tags.map(tag => (
                    <span key={tag} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
