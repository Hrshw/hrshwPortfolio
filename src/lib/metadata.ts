import type { Metadata } from 'next';

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rahulshekhawat.dev';

export const siteMetadata = {
  title: 'Rahul Singh Shekhawat | Full-Stack & Cloud Engineer · AI SaaS',
  description: 'Full-Stack & Cloud Engineer in India building AI-powered SaaS, AWS cloud infrastructure, and serverless backends. Available for freelance projects, SaaS MVPs, cloud migration, and AI integrations.',
  keywords: [
    // Brand
    'Rahul Singh Shekhawat',
    'Rahul Shekhawat Cloud Engineer',
    'Rahul Shekhawat AWS Engineer',
    'Rahul Shekhawat Portfolio',
    'Rahul Singh Shekhawat Developer',
    // Client-intent (hire)
    'Hire Full Stack Developer India',
    'Hire AWS Developer India',
    'Hire React Developer Mumbai',
    'Hire Node.js Developer India',
    'Hire Cloud Engineer India',
    'Hire Next.js Developer India',
    'Hire SaaS Developer India',
    'Hire AI Developer India',
    'Freelance Full Stack Developer India',
    'Freelance AWS Cloud Engineer',
    'Freelance React Developer Mumbai',
    'Freelance SaaS MVP Developer',
    // Service keywords
    'Full Stack Developer India',
    'Full Stack Developer for SaaS',
    'Cloud Engineer India',
    'AWS Cloud Engineer Portfolio',
    'AWS Developer India',
    'AWS Developer for Startups India',
    'AWS Serverless Developer India',
    'AI SaaS Developer',
    'AI-Powered SaaS Engineer India',
    'AI App Developer India',
    'AI Integration Developer',
    'AI Observability Engineer',
    'SaaS MVP Development India',
    'SaaS Product Developer India',
    'Node.js Developer India',
    'Node.js Developer for Hire',
    'React Developer Mumbai',
    'Next.js Developer India',
    'Serverless Backend Developer',
    'Serverless Architecture Engineer',
    // Project-type keywords
    'Build SaaS MVP India',
    'SaaS Startup Developer India',
    'Cloud Migration Developer India',
    'AWS Infrastructure Engineer India',
    'AI SaaS MVP Developer',
    'Custom SaaS Development India',
    'Startup Technical Co-founder India',
    'CTO as a Service India',
    // Tech stack
    'React', 'Next.js', 'Node.js', 'TypeScript', 'AWS', 'DynamoDB',
    'Lambda', 'Serverless', 'Redis', 'MongoDB', 'Docker',
    // Products
    'PulseGuard', 'Observyze', 'SubTrackHub',
    // Role variants
    'Software Engineer', 'AI Systems Engineer Portfolio', 'AWS Developer Portfolio',
    'Full Stack Developer Portfolio', 'Node.js Developer Portfolio',
    'AI Engineer Portfolio', 'Cloud Engineer Portfolio India',
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
      languages: {
        'en': canonicalUrl,
      },
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
