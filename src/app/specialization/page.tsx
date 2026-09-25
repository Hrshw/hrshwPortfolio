import React from "react";
import Link from "next/link";
import { capabilities } from "@/lib/capabilities";
import { constructMetadata, ogImageUrl, siteMetadata } from "@/lib/metadata";

// ---------------------------------------------------------------------------
// /specialization — the hub for the technical focus areas.
//
// Previously the focus-area URLs were only discoverable through the sitemap:
// nothing on the site linked to them, which is a large part of why Google
// indexed one of six. This page makes the cluster internally linked and gives
// the group a canonical entry point.
// ---------------------------------------------------------------------------

export const metadata = constructMetadata({
  title: "Technical Focus Areas | Rahul Singh Shekhawat",
  description:
    "The engineering areas I work in day to day — AWS cloud infrastructure, serverless architecture, full-stack TypeScript, Node.js services, and production AI and observability systems.",
  path: "/specialization",
  image: ogImageUrl({ title: "Technical focus areas", eyebrow: "Engineering" }),
});

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteMetadata.siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Technical Focus', item: `${siteMetadata.siteUrl}/specialization` },
  ],
};

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  url: `${siteMetadata.siteUrl}/specialization`,
  name: 'Technical Focus Areas',
  inLanguage: 'en-US',
  isPartOf: { '@id': `${siteMetadata.siteUrl}/#website` },
  author: { '@id': `${siteMetadata.siteUrl}/#person` },
  hasPart: capabilities.map((c) => ({
    '@type': 'WebPage',
    name: c.name,
    description: c.metaDescription,
    url: `${siteMetadata.siteUrl}/specialization/${c.slug}`,
  })),
};

export default function SpecializationHubPage() {
  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen pt-32 pb-32 px-8 md:px-24 transition-colors duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="max-w-5xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
            <li>
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-zinc-800 dark:text-zinc-300">
              Technical Focus
            </li>
          </ol>
        </nav>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-5">
          Technical focus areas.
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl font-light tracking-tight max-w-3xl mb-16 leading-relaxed">
          The areas I work in day to day, and the engineering decisions behind them. Each page
          covers how the work is actually done — the patterns, the trade-offs, and the numbers
          from production systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((capability) => (
            <article
              key={capability.slug}
              className="group relative bg-black/5 dark:bg-zinc-900/30 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-500"
            >
              <span className="block font-mono text-xs uppercase tracking-widest text-zinc-500 mb-4">
                {capability.eyebrow}
              </span>
              <h2 className="text-2xl font-semibold tracking-tight mb-3 text-zinc-900 dark:text-zinc-100">
                <Link
                  href={`/specialization/${capability.slug}`}
                  className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {capability.name}
                  <span className="absolute inset-0" />
                </Link>
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                {capability.summary}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-16 text-zinc-600 dark:text-zinc-400 font-light">
          Prefer depth over summary?{" "}
          <Link href="/insights" className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Engineering Insights
          </Link>{" "}
          has the long-form write-ups on these systems, including cost analysis, architecture
          breakdowns, and post-mortems of things that went wrong.
        </p>
      </div>
    </main>
  );
}
