import type { Metadata } from 'next';

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rahulshekhawat.dev';

export const siteMetadata = {
  title: 'Rahul Singh Shekhawat | Full-Stack & Cloud Engineer',
  description: 'Rahul Singh Shekhawat is a Full-Stack & Cloud Engineer specializing in scalable SaaS, AWS infrastructure, AI integrations, and serverless architecture.',
  keywords: [
    'Rahul Singh Shekhawat',
    'Rahul Shekhawat Cloud Engineer',
    'Rahul Shekhawat AWS Engineer',
    'Rahul Shekhawat Portfolio',
    'Cloud Engineer India',
    'Full Stack Developer India',
    'AWS Cloud Engineer Portfolio',
    'AI Systems Engineer Portfolio',
    'AWS Developer Portfolio',
    'Node.js Developer Portfolio',
    'AI Observability Engineer',
    'PulseGuard',
    'Observyze',
    'Software Engineer',
    'React',
    'Next.js',
    'AWS Developer India',
    'Full Stack Developer Portfolio',
    'Node.js Developer',
    'AI Engineer Portfolio',
    'Serverless Architecture Engineer',
  ],
  author: 'Rahul Singh Shekhawat',
  siteUrl: defaultUrl,
};

export function constructMetadata({
  title = siteMetadata.title,
  description = siteMetadata.description,
  image = `${siteMetadata.siteUrl}/og-image.png`, // We assume an og-image.png exists or will be added
  noIndex = false,
  path = '',
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  path?: string;
} = {}): Metadata {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${siteMetadata.siteUrl}${cleanPath === '/' ? '' : cleanPath}`;

  return {
    title,
    description,
    keywords: siteMetadata.keywords,
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.author,
    publisher: siteMetadata.author,
    metadataBase: new URL(siteMetadata.siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteMetadata.title,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
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
