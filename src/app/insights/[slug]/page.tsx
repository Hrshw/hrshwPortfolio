import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllInsights,
  getInsightBySlugOrNull,
  getInsightSlugs,
} from '@/lib/insights';
import { capabilitiesForTags } from '@/lib/capabilities';
import { constructMetadata, ogImageUrl, siteMetadata } from '@/lib/metadata';
import {
  extractHeadings,
  nodeToText,
  readingTimeMinutes,
  slugifyHeading,
  wordCount,
} from '@/lib/markdown-toc';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return getInsightSlugs().map((slug) => ({ slug: slug.replace(/\.md$/, '') }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getInsightBySlugOrNull(slug);
  // Returning empty metadata lets the route fall through to the 404 page
  // instead of throwing a 500 for an unknown slug.
  if (!post) return {};

  const published = post.date;
  const modified = post.updated ?? post.date;

  return constructMetadata({
    title: `${post.title} | Engineering Insights`,
    description: post.summary,
    path: `/insights/${post.slug}`,
    type: 'article',
    publishedTime: published,
    modifiedTime: modified,
    tags: post.tags,
    section: post.tags[0],
    image: ogImageUrl({
      title: post.title,
      eyebrow: post.tags[0] ?? 'Engineering Insights',
    }),
  });
}

/** Headings get ids so the in-page table of contents can link to them. */
const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 id={slugifyHeading(nodeToText(children))} className="scroll-mt-32">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={slugifyHeading(nodeToText(children))} className="scroll-mt-32">
      {children}
    </h3>
  ),
  a: ({ href, children }) => {
    const isExternal = Boolean(href && /^https?:\/\//.test(href));
    if (!isExternal) return <a href={href}>{children}</a>;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
};

export default async function InsightPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getInsightBySlugOrNull(slug);

  if (!post) {
    notFound();
  }

  const { title, date, updated, content, tags, summary, project } = post;
  const modified = updated ?? date;

  const postUrl = `${siteMetadata.siteUrl}/insights/${post.slug}`;
  const words = wordCount(content);
  const minutes = readingTimeMinutes(content);
  const headings = extractHeadings(content);
  const focusAreas = capabilitiesForTags(tags);

  // Related posts: most shared tags wins, then recency. Cheap and honest.
  const related = getAllInsights()
    .filter((other) => other.slug !== post.slug)
    .map((other) => ({
      ...other,
      shared: other.tags.filter((t) => tags.includes(t)).length,
    }))
    .sort((a, b) => b.shared - a.shared || (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  const articleImage = ogImageUrl({
    title,
    eyebrow: tags[0] ?? 'Engineering Insights',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl}#article`,
    headline: title,
    description: summary,
    image: [articleImage],
    thumbnailUrl: articleImage,
    datePublished: date,
    dateModified: modified,
    wordCount: words,
    timeRequired: `PT${minutes}M`,
    inLanguage: 'en-US',
    articleSection: tags[0],
    keywords: tags.join(', '),
    author: { '@id': `${siteMetadata.siteUrl}/#person` },
    publisher: { '@id': `${siteMetadata.siteUrl}/#person` },
    isPartOf: { '@id': `${siteMetadata.siteUrl}/#website` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    ...(project ? { about: { '@type': 'SoftwareApplication', name: project } } : {}),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteMetadata.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Engineering Insights', item: `${siteMetadata.siteUrl}/insights` },
      { '@type': 'ListItem', position: 3, name: title, item: postUrl },
    ],
  };

  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen pt-32 px-8 md:px-24 pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="max-w-3xl mx-auto">
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
              <Link href="/insights" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Insights
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-zinc-800 dark:text-zinc-300 truncate max-w-[40ch]">
              {title}
            </li>
          </ol>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-zinc-500 font-mono text-sm">
            <time dateTime={date}>{date}</time>
            {updated && updated !== date && (
              <span className="text-zinc-400 dark:text-zinc-600">
                (updated <time dateTime={updated}>{updated}</time>)
              </span>
            )}
            <span aria-hidden="true">•</span>
            <span>
              {minutes} min read
            </span>
            {tags.length > 0 && (
              <>
                <span aria-hidden="true">•</span>
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Table of contents — anchor links also feed jump-to-section results */}
        {headings.length > 2 && (
          <nav
            aria-label="On this page"
            className="mb-12 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-2xl p-6 md:p-8"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">
              On this page
            </p>
            <ol className="space-y-2 text-sm">
              {headings.map((heading) => (
                <li key={heading.id} className={heading.depth === 3 ? 'pl-5' : ''}>
                  <a
                    href={`#${heading.id}`}
                    className={
                      heading.depth === 3
                        ? 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors'
                    }
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <article className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
            prose-code:text-pink-500 dark:prose-code:text-pink-400
            prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </article>

        {/* Author box — E-E-A-T signal plus a route into the cluster pages */}
        <aside className="mt-16 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">
            Written by
          </p>
          <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
            Rahul Singh Shekhawat
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mb-5">
            Full-Stack &amp; Cloud Engineer in Mumbai, India. I build production systems on AWS —
            serverless architecture, Node.js backends, and AI-powered SaaS — and write about the
            architecture and the trade-offs behind them.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/specialization" className="underline underline-offset-4 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Technical focus areas
            </Link>
            <a
              href="https://github.com/Hrshw"
              target="_blank"
              rel="me noopener noreferrer"
              className="underline underline-offset-4 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/rahul-singh-shekhawat-b4ba481ab"
              target="_blank"
              rel="me noopener noreferrer"
              className="underline underline-offset-4 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <Link href="/contact" className="underline underline-offset-4 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Get in touch
            </Link>
          </div>
        </aside>

        {/* Topic cluster: the focus areas covering this post's tags */}
        {focusAreas.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">
              Related focus areas
            </h2>
            <ul className="flex flex-wrap gap-3">
              {focusAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/specialization/${area.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-sm text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related writing */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">More writing</h2>
            <div className="space-y-6">
              {related.map((other) => (
                <article
                  key={other.slug}
                  className="group relative border-l-2 border-zinc-200 dark:border-zinc-800 pl-6 hover:border-zinc-500 transition-colors"
                >
                  <time dateTime={other.date} className="text-sm font-mono text-zinc-500 mb-2 block">
                    {other.date}
                  </time>
                  <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                    <Link
                      href={`/insights/${other.slug}`}
                      className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      {other.title}
                      <span className="absolute inset-0" />
                    </Link>
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                    {other.summary}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 flex flex-wrap gap-4 items-center">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-mono text-sm"
          >
            ← All Engineering Insights
          </Link>
          <a
            href={`mailto:rahulsinghpilani7@gmail.com?subject=${encodeURIComponent(`Re: ${title}`)}`}
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-mono text-sm"
          >
            Discuss this post
          </a>
        </div>
      </div>
    </main>
  );
}
