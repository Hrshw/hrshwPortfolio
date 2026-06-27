import { MetadataRoute } from 'next';
import { getInsightSlugs } from '@/lib/insights';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rahulshekhawat.dev'; // Replace with actual domain

  const insightSlugs = getInsightSlugs();
  const insightUrls: MetadataRoute.Sitemap = insightSlugs.map((slug) => ({
    url: `${baseUrl}/insights/${slug.replace(/\.md$/, '')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const specializations = [
    'cloud-engineer',
    'aws-developer',
    'full-stack-developer',
    'node-js-developer',
    'ai-engineer',
    'serverless-engineer',
  ];

  const specializationUrls: MetadataRoute.Sitemap = specializations.map((slug) => ({
    url: `${baseUrl}/specialization/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/system-design`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...insightUrls,
    ...specializationUrls,
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
  ];
}
