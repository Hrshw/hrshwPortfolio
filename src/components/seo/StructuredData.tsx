import React from 'react';
import { siteMetadata } from '@/lib/metadata';

export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rahul Singh Shekhawat',
    jobTitle: 'Full-Stack & Cloud Engineer',
    url: siteMetadata.siteUrl,
    sameAs: [
      'https://github.com/hrshw',
      'https://www.linkedin.com/in/rahul-singh-shekhawat-b4ba481ab',
    ],
    description: siteMetadata.description,
    knowsAbout: [
      'Cloud Engineering',
      'AWS',
      'Node.js',
      'React',
      'Next.js',
      'DynamoDB',
      'Lambda',
      'EC2',
      'S3',
      'Redis',
      'MongoDB',
      'AI Systems',
      'Observability',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetadata.title,
    url: siteMetadata.siteUrl,
    description: siteMetadata.description,
  };

  const pulseGuardSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PulseGuard',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    author: {
      '@type': 'Person',
      name: 'Rahul Singh Shekhawat',
    },
    description: 'An AI Systems and Observability platform.',
    url: `${siteMetadata.siteUrl}/#section-projects`, // Update if there's a dedicated page
  };

  const observyzeSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Observyze',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    author: {
      '@type': 'Person',
      name: 'Rahul Singh Shekhawat',
    },
    description: 'Cloud observability and monitoring solution.',
    url: `${siteMetadata.siteUrl}/#section-projects`, // Update if there's a dedicated page
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pulseGuardSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(observyzeSchema) }}
      />
    </>
  );
}
