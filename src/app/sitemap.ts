import { MetadataRoute } from 'next';
import { getAllInsights } from '@/lib/insights';
import { capabilities } from '@/lib/capabilities';

export const dynamic = 'force-static';

// ---------------------------------------------------------------------------
// Sitemap
//
// Previously every entry carried `lastModified: new Date()`, so all 21 URLs
// reported the same build timestamp and the signal was worthless. Posts now
// report their real publication/update date from frontmatter; pages with no
// meaningful modification date simply omit the field rather than fake it.
// ---------------------------------------------------------------------------
function contentDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rahulshekhawat.dev';

  const insightUrls: MetadataRoute.Sitemap = getAllInsights().map((post) => ({
    url: `${baseUrl}/insights/${post.slug}`,
    lastModified: contentDate(post.updated ?? post.date),
    changeFrequency: 'yearly',
    priority: 0.8,
  }));

  const specializationUrls: MetadataRoute.Sitemap = capabilities.map((capability) => ({
    url: `${baseUrl}/specialization/${capability.slug}`,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      changeFrequency: 'monthly',
      priority: 1,
      images: [`${baseUrl}/og-image.png`, `${baseUrl}/rahul.png`],
    },
    {
      url: `${baseUrl}/insights`,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [`${baseUrl}/og?title=Engineering%20Insights&eyebrow=Writing`],
    },
    ...insightUrls,
    {
      url: `${baseUrl}/specialization`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...specializationUrls,
    {
      url: `${baseUrl}/system-design`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/testimonials`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ];
}
