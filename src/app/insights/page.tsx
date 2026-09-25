import React from 'react';
import Link from 'next/link';
import { getAllInsights } from '@/lib/insights';
import { capabilities } from '@/lib/capabilities';
import { constructMetadata, ogImageUrl, siteMetadata } from '@/lib/metadata';

export const metadata = constructMetadata({
  title: 'Engineering Insights | Rahul Singh Shekhawat',
  description:
    'Technical deep dives into cloud architecture, system design breakdowns, AWS serverless patterns, Node.js performance, and AI engineering — from real production builds.',
  path: '/insights',
  image: ogImageUrl({ title: 'Engineering Insights', eyebrow: 'Writing' }),
});

export default function InsightsPage() {
  const insights = getAllInsights();

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteMetadata.siteUrl}/insights#collection`,
    url: `${siteMetadata.siteUrl}/insights`,
    name: 'Engineering Insights',
    description:
      'Technical write-ups on cloud architecture, serverless patterns, Node.js performance, and AI engineering.',
    inLanguage: 'en-US',
    isPartOf: { '@id': `${siteMetadata.siteUrl}/#website` },
    author: { '@id': `${siteMetadata.siteUrl}/#person` },
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: insights.length,
      itemListElement: insights.map((insight, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteMetadata.siteUrl}/insights/${insight.slug}`,
        name: insight.title,
      })),
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteMetadata.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Engineering Insights', item: `${siteMetadata.siteUrl}/insights` },
    ],
  };

  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen pt-32 pb-32 px-8 md:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
            <li>
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-zinc-800 dark:text-zinc-300">
              Engineering Insights
            </li>
          </ol>
        </nav>

        <h1 className="text-5xl font-bold tracking-tight mb-4">Engineering Insights</h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-6">
          Deep dives into system architectures, complex bug fixes, and lessons learned while
          building scalable software.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm font-mono mb-10">
          <a
            href="/rss.xml"
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            RSS feed
          </a>
          <span className="text-zinc-400 dark:text-zinc-600" aria-hidden="true">•</span>
          <Link
            href="/specialization"
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Technical focus areas
          </Link>
        </div>

        {/* Browse by focus area — crawlable links that keep the cluster connected */}
        <section className="mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">
            Browse by focus area
          </h2>
          <ul className="flex flex-wrap gap-3">
            {capabilities.map((capability) => (
              <li key={capability.slug}>
                <Link
                  href={`/specialization/${capability.slug}`}
                  className="inline-flex items-center px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-sm text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300"
                >
                  {capability.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-12">
          {insights.map((insight) => (
            <article key={insight.slug} className="group relative border-l-2 border-zinc-200 dark:border-zinc-800 pl-6 hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors">
              <time dateTime={insight.date} className="text-sm font-mono text-zinc-500 mb-2 block">
                {insight.date}
              </time>
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
