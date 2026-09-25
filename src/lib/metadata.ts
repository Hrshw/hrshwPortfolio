import type { Metadata } from 'next';

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rahulshekhawat.dev';

export const siteMetadata = {
  name: 'Rahul Singh Shekhawat',
  title: 'Rahul Singh Shekhawat | Full-Stack & Cloud Engineer · AI SaaS',
  description:
    'Full-stack and cloud engineer based in Mumbai, India. I build and run production systems on AWS — serverless architecture, Node.js backends, and AI-powered SaaS — and write about how they actually work.',
  author: 'Rahul Singh Shekhawat',
  siteUrl: defaultUrl,
  /**
   * Google has ignored <meta name="keywords"> since 2009, so this list is
   * deliberately short and descriptive. It is documentation, not a ranking
   * signal — do not grow it back into a keyword-stuffed service pitch.
   */
  keywords: [
    'Rahul Singh Shekhawat',
    'Rahul Shekhawat engineer',
    'AWS serverless architecture',
    'Node.js performance',
    'AI observability',
    'LLM engineering',
    'cloud cost optimization',
    'system design',
    'TypeScript',
    'Next.js',
  ],
};

interface ConstructMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  path?: string;
  /** `article` unlocks OpenGraph article timestamps for blog posts. */
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  section?: string;
  keywords?: string[];
}

/**
 * Build a per-page Open Graph image URL served by the `/og` route handler.
 * Keeps social cards unique per page instead of reusing one static file.
 */
export function ogImageUrl({
  title,
  eyebrow,
  subtitle,
}: {
  title: string;
  /** Small label above the title, e.g. "Insights" or the post's first tag. */
  eyebrow?: string;
  subtitle?: string;
}): string {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set('eyebrow', eyebrow);
  if (subtitle) params.set('subtitle', subtitle);
  return `${siteMetadata.siteUrl}/og?${params.toString()}`;
}

export function constructMetadata({
  title = siteMetadata.title,
  description = siteMetadata.description,
  image = `${siteMetadata.siteUrl}/og-image.png`,
  imageAlt,
  noIndex = false,
  path = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
  section,
  keywords = siteMetadata.keywords,
}: ConstructMetadataOptions = {}): Metadata {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${siteMetadata.siteUrl}${cleanPath === '/' ? '' : cleanPath}`;

  const openGraphBase = {
    title,
    description,
    url: canonicalUrl,
    siteName: siteMetadata.name,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: imageAlt ?? title,
      },
    ],
    locale: 'en_US',
  };

  const openGraph: Metadata['openGraph'] =
    type === 'article'
      ? {
          ...openGraphBase,
          type: 'article',
          publishedTime,
          modifiedTime,
          authors: [`${siteMetadata.siteUrl}/#person`],
          tags,
          section,
        }
      : { ...openGraphBase, type: 'website' };

  return {
    title,
    description,
    keywords,
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.author,
    publisher: siteMetadata.author,
    metadataBase: new URL(siteMetadata.siteUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        'x-default': canonicalUrl,
      },
      // Feed autodiscovery so readers and aggregators find the RSS feed.
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/rss.xml`,
      },
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Google Search Console verification. Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    // to your GSC verification token to enable the meta tag (inert otherwise).
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}
