import React from 'react';
import Link from 'next/link';
import SystemDesignSection from '@/components/sections/SystemDesignSection';
import { constructMetadata, ogImageUrl, siteMetadata } from '@/lib/metadata';

export const metadata = constructMetadata({
  title: 'Cloud Architecture & System Design | Rahul Singh Shekhawat',
  description:
    'Production-grade cloud blueprints and system design specifications, detailing Fastify ingestion nodes, Redis workers, AWS serverless configurations, and in-memory key overrides.',
  path: '/system-design',
  image: ogImageUrl({ title: 'Cloud architecture and system design', eyebrow: 'Engineering' }),
});

const pageUrl = `${siteMetadata.siteUrl}/system-design`;

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteMetadata.siteUrl },
    { '@type': 'ListItem', position: 2, name: 'System Design', item: pageUrl },
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${pageUrl}#page`,
  url: pageUrl,
  name: 'Cloud Architecture & System Design',
  inLanguage: 'en-US',
  isPartOf: { '@id': `${siteMetadata.siteUrl}/#website` },
  author: { '@id': `${siteMetadata.siteUrl}/#person` },
  breadcrumb,
};

export default function SystemDesignPage() {
  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* No horizontal padding here — SystemDesignSection applies its own. */}
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-10 px-8 md:px-24">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
            <li>
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-zinc-800 dark:text-zinc-300">
              System Design
            </li>
          </ol>
        </nav>

        <SystemDesignSection headingLevel="h1" />

        <p className="mt-16 px-8 md:px-24 text-zinc-600 dark:text-zinc-400 font-light max-w-3xl">
          The long-form reasoning behind these designs is in{" "}
          <Link
            href="/insights/aws-serverless-lambda-best-practices"
            className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            the serverless best-practices write-up
          </Link>
          , and the ingestion pipeline itself is covered in{" "}
          <Link
            href="/insights/building-observyze-ai-observability-platform"
            className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            the Observyze build notes
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
