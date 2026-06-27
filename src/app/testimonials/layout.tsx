import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Developer Testimonials | Rahul Singh Shekhawat',
  description: 'Read what collaborators, peers, and colleagues say about working with Rahul Singh Shekhawat, Full-Stack & Cloud Engineer.',
  path: '/testimonials',
});

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
