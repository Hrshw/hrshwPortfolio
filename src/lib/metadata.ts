import type { Metadata } from 'next';

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rahulshekhawat.dev';

export const siteMetadata = {
  title: 'Rahul Singh Shekhawat | Software & Cloud Engineer',
  description: 'Portfolio of Rahul Singh Shekhawat, Software & Cloud Engineer specializing in Next.js, Node.js, AWS infrastructure, and AI integrations.',
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
  ],
  author: 'Rahul Singh Shekhawat',
  siteUrl: defaultUrl,
  twitterHandle: '@rahulshekhawat', // Replace with actual Twitter handle if applicable
};

export function constructMetadata({
  title = siteMetadata.title,
  description = siteMetadata.description,
  image = `${siteMetadata.siteUrl}/og-image.png`, // We assume an og-image.png exists or will be added
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: siteMetadata.keywords,
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.author,
    publisher: siteMetadata.author,
    metadataBase: new URL(siteMetadata.siteUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: siteMetadata.siteUrl,
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
      creator: siteMetadata.twitterHandle,
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
  };
}
