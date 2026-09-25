import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import StructuredData from "@/components/seo/StructuredData";
import { capabilities, getCapability } from "@/lib/capabilities";
import { getInsightCards } from "@/lib/insights";
import { constructMetadata, ogImageUrl, siteMetadata } from "@/lib/metadata";

// ---------------------------------------------------------------------------
// Technical focus areas.
//
// Each page used to render the same hero, the same section stack, and a single
// unique paragraph — which made all six URLs near-duplicates of each other and
// of the homepage, and Google indexed exactly one of them. They now carry their
// own <h1>, their own metadata, ~800 words of unique technical content, and
// links into the Engineering Insights cluster for the same topic.
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return capabilities.map((c) => ({ slug: c.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const capability = getCapability(slug);
  if (!capability) return {};

  return constructMetadata({
    title: capability.title,
    description: capability.metaDescription,
    path: `/specialization/${slug}`,
    image: ogImageUrl({
      title: `${capability.h1} ${capability.h1Accent}`,
      eyebrow: capability.name,
    }),
    keywords: [capability.name, ...siteMetadata.keywords],
  });
}

export default async function SpecializationPage({ params }: PageProps) {
  const { slug } = await params;
  const capability = getCapability(slug);

  if (!capability) {
    notFound();
  }

  const pageUrl = `${siteMetadata.siteUrl}/specialization/${capability.slug}`;
  const relatedPosts = getInsightCards(capability.relatedPosts);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteMetadata.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Technical Focus', item: `${siteMetadata.siteUrl}/specialization` },
      { '@type': 'ListItem', position: 3, name: capability.name, item: pageUrl },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#page`,
    url: pageUrl,
    name: capability.title,
    description: capability.metaDescription,
    inLanguage: 'en-US',
    isPartOf: { '@id': `${siteMetadata.siteUrl}/#website` },
    author: { '@id': `${siteMetadata.siteUrl}/#person` },
    about: { '@type': 'Thing', name: capability.name },
    breadcrumb,
  };

  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 selection:bg-zinc-800 selection:text-white min-h-screen relative overflow-hidden transition-colors duration-500">
      <StructuredData />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* 3D background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <HeroSection
          heading={capability.h1}
          headingAccent={capability.h1Accent}
          eyebrow={capability.eyebrow}
          customTagline={capability.summary}
        />

        <div className="px-8 md:px-24 pb-32">
          {/* Visible breadcrumb trail, matching the BreadcrumbList schema above */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
              <li>
                <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/specialization"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Technical Focus
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-zinc-800 dark:text-zinc-300">
                {capability.name}
              </li>
            </ol>
          </nav>

          {/* Lead paragraph */}
          <div className="bg-black/5 dark:bg-zinc-900/30 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-10 transition-colors duration-500">
            <p className="text-zinc-700 dark:text-zinc-300 text-lg md:text-xl font-light leading-relaxed max-w-4xl">
              {capability.intro}
            </p>
          </div>

          {/* Approach */}
          <div className="mt-20 space-y-14">
            {capability.approach.map((section) => (
              <section key={section.heading}>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-5 transition-colors duration-500">
                  {section.heading}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-light max-w-4xl transition-colors duration-500">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          {/* Patterns + stack */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-black/5 dark:bg-zinc-900/30 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-10 transition-colors duration-500">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 transition-colors duration-500">
                Decisions that show up in production
              </h2>
              <ul className="space-y-4">
                {capability.patterns.map((pattern) => (
                  <li key={pattern} className="flex gap-3 text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                    <span className="text-[var(--color-primary)] select-none" aria-hidden="true">
                      —
                    </span>
                    <span>{pattern}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="space-y-6">
              <section className="bg-black/5 dark:bg-zinc-900/30 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8 transition-colors duration-500">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-5">
                  By the numbers
                </h2>
                <dl className="space-y-5">
                  {capability.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt className="sr-only">{metric.label}</dt>
                      <dd>
                        <span className="block text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                          {metric.value}
                        </span>
                        <span className="block text-sm text-zinc-500 dark:text-zinc-500 font-light mt-1">
                          {metric.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="bg-black/5 dark:bg-zinc-900/30 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8 transition-colors duration-500">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-5">
                  Stack
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {capability.stack.map((item) => (
                    <li
                      key={item}
                      className="px-3 py-1.5 bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-full border border-black/10 dark:border-white/10"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {/* Topic cluster: related writing */}
          {relatedPosts.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8 transition-colors duration-500">
                Related writing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="group relative bg-black/5 dark:bg-zinc-900/30 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-7 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-500"
                  >
                    <span className="block font-mono text-xs text-zinc-500 mb-3">{post.date}</span>
                    <h3 className="text-lg font-semibold tracking-tight mb-3 text-zinc-900 dark:text-zinc-100">
                      <Link href={`/insights/${post.slug}`} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                        <span className="absolute inset-0" />
                      </Link>
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                      {post.summary}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Cross-links to the other focus areas — keeps the cluster crawlable */}
          <section className="mt-20">

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8 transition-colors duration-500">
              Other focus areas
            </h2>
            <ul className="flex flex-wrap gap-3">
              {capabilities
                .filter((c) => c.slug !== capability.slug)
                .map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/specialization/${c.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-sm text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </div>

        <ProjectsSection />
      </div>
    </main>
  );
}
