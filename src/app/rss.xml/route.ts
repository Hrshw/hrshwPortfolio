import { getAllInsights } from '@/lib/insights';
import { siteMetadata } from '@/lib/metadata';

// ---------------------------------------------------------------------------
// /rss.xml — RSS 2.0 feed of the Engineering Insights posts.
//
// Discoverable via the <link rel="alternate" type="application/rss+xml"> tag
// that constructMetadata adds to every page. Static-generated at build time.
// ---------------------------------------------------------------------------

export const dynamic = 'force-static';

const FEED_URL = `${siteMetadata.siteUrl}/rss.xml`;
const FEED_TITLE = `${siteMetadata.name} — Engineering Insights`;
const FEED_DESCRIPTION =
  'Technical write-ups on AWS serverless architecture, Node.js backends, AI observability, cloud cost optimization, and production system design.';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const insights = getAllInsights();

  const items = insights
    .map((post) => {
      const url = `${siteMetadata.siteUrl}/insights/${post.slug}`;
      const published = new Date(post.date);
      const pubDate = Number.isNaN(published.getTime())
        ? new Date().toUTCString()
        : published.toUTCString();

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.summary)}</description>
      <author>noreply@rahulshekhawat.dev (${escapeXml(siteMetadata.author)})</author>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${siteMetadata.siteUrl}/insights</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
