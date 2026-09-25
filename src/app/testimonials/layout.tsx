import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/metadata';

// NOTE: this layout used to emit a hardcoded aggregateRating (5/5 from 5
// reviews). It was removed because:
//  1. Google does not render review snippets for `Person`, so it earned nothing.
//  2. A hardcoded self-serving rating is a structured-data policy violation.
// Real, page-visible reviews are now emitted by the page itself from the
// actual approved testimonials.

export const metadata: Metadata = constructMetadata({
  title: 'Developer Testimonials | Rahul Singh Shekhawat',
  description:
    'What engineers, founders, and collaborators say about building software with Rahul Singh Shekhawat — Full-Stack & Cloud Engineer working on AWS, Node.js, and AI systems.',
  path: '/testimonials',
});

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
