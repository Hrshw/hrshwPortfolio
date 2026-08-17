import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Add syntax highlighting theme
import { getInsightBySlug, getInsightSlugs } from '@/lib/insights';
import { constructMetadata, siteMetadata } from '@/lib/metadata';
import Link from 'next/link';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const slugs = getInsightSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ''),
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { title, summary, slug } = getInsightBySlug(params.slug);
  return constructMetadata({
    title: `${title} | Engineering Insights`,
    description: summary,
    path: `/insights/${slug}`,
  });
}

export default async function InsightPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { title, date, content, tags, summary, slug } = getInsightBySlug(params.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: summary,
    datePublished: date,
    dateModified: date,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: 'Rahul Singh Shekhawat',
      url: siteMetadata.siteUrl,
      image: `${siteMetadata.siteUrl}/rahul.png`,
    },
    publisher: {
      '@type': 'Person',
      name: 'Rahul Singh Shekhawat',
      url: siteMetadata.siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteMetadata.siteUrl}/insights/${slug}`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteMetadata.siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Insights', item: `${siteMetadata.siteUrl}/insights` },
        { '@type': 'ListItem', position: 3, name: title, item: `${siteMetadata.siteUrl}/insights/${slug}` },
      ],
    },
    keywords: tags ? tags.join(', ') : '',
  };

  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen pt-32 px-8 md:px-24 pb-32">
      {/* Dynamic JSON-LD Structured Data for BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-3xl mx-auto">
        <Link href="/insights" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8 inline-block font-mono text-sm">
          ← Back to Insights
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">{title}</h1>
          <div className="flex items-center gap-4 text-zinc-500 font-mono text-sm">
            <span>{date}</span>
            {tags && tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="text-xs bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <article className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
            prose-code:text-pink-500 dark:prose-code:text-pink-400
            prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
