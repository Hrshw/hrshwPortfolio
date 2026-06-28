import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/metadata';
import { siteMetadata } from '@/lib/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Developer Testimonials | Rahul Singh Shekhawat',
  description: 'Read what collaborators, peers, and colleagues say about working with Rahul Singh Shekhawat, Full-Stack & Cloud Engineer.',
  path: '/testimonials',
});

const aggregateRatingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rahul Singh Shekhawat',
  url: siteMetadata.siteUrl,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '5',
    reviewCount: '5',
  },
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />
      {children}
    </>
  );
}

