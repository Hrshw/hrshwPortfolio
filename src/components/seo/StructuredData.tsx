import React from 'react';
import { ogImageUrl, siteMetadata } from '@/lib/metadata';

// ---------------------------------------------------------------------------
// Site-wide structured data.
//
// Removed in the SEO overhaul (both were invalid and risky):
//  - FAQPage: the questions were never visible on any page. Google requires the
//    content to exist on the page, and FAQ rich results are now limited to
//    authoritative government/health sites — so it was pure risk, no upside.
//  - SearchAction: it pointed at `/insights?q=…` but the site has no search.
//
// Everything emitted here is visible on the page that renders it.
// ---------------------------------------------------------------------------

const PERSON_ID = `${siteMetadata.siteUrl}/#person`;
const WEBSITE_ID = `${siteMetadata.siteUrl}/#website`;

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Rahul Singh Shekhawat',
  jobTitle: 'Full-Stack & Cloud Engineer',
  url: siteMetadata.siteUrl,
  mainEntityOfPage: siteMetadata.siteUrl,
  image: `${siteMetadata.siteUrl}/rahul.png`,
  email: 'rahulsinghpilani7@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://github.com/Hrshw',
    'https://www.linkedin.com/in/rahul-singh-shekhawat-b4ba481ab',
    'https://www.instagram.com/hr.shw/',
  ],
  description: siteMetadata.description,
  inLanguage: 'en-US',
  knowsLanguage: ['en', 'hi'],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Full-Stack & Cloud Engineer',
    skills:
      'AWS, serverless architecture, Node.js, TypeScript, React, Next.js, DynamoDB, Redis, MongoDB, LLM integration, observability, cloud cost optimization',
  },
  knowsAbout: [
    'Cloud Engineering',
    'Serverless Architecture',
    'AWS',
    'Lambda',
    'DynamoDB',
    'S3',
    'Route 53',
    'Node.js',
    'TypeScript',
    'React',
    'Next.js',
    'Fastify',
    'Redis',
    'MongoDB',
    'AI Systems',
    'LLM Integration',
    'AI Observability',
    'RAG Pipelines',
    'Observability',
    'Cloud Cost Optimization',
    'System Design',
    'Software Architecture',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: siteMetadata.name,
  url: siteMetadata.siteUrl,
  description: siteMetadata.description,
  inLanguage: 'en-US',
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
};

const pulseGuardSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PulseGuard',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  author: { '@id': PERSON_ID },
  image: ogImageUrl({ title: 'PulseGuard', eyebrow: 'Project' }),
  description:
    'AI-powered uptime monitoring, SSL certificate tracking, and global status pages with real-time anomaly detection.',
  url: `${siteMetadata.siteUrl}/#section-projects`,
};

const observyzeSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Observyze',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  author: { '@id': PERSON_ID },
  image: ogImageUrl({ title: 'Observyze', eyebrow: 'Project' }),
  description:
    'High-throughput cloud observability and telemetry ingestion platform using Fastify, Redis, and MongoDB Time-Series collections.',
  url: `${siteMetadata.siteUrl}/#section-projects`,
};

const envSecretLockSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'env-secret-lock',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  author: { '@id': PERSON_ID },
  image: ogImageUrl({ title: 'env-secret-lock', eyebrow: 'Open source' }),
  description:
    'A local-first developer CLI tool for AES-256-GCM encrypted environment secret management with Git pre-commit protection.',
  url: 'https://github.com/Hrshw/env-secret-lock',
  downloadUrl: 'https://www.npmjs.com/package/env-secret-lock',
  softwareVersion: '1.0.0',
  license: 'https://opensource.org/licenses/MIT',
};

const subtrackHubSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SubTrackHub',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  author: { '@id': PERSON_ID },
  image: ogImageUrl({ title: 'SubTrackHub', eyebrow: 'Project' }),
  description:
    'Cloud cost optimization platform that finds idle AWS resources and uses LLMs to generate efficiency scores and safe cleanup recommendations.',
  url: `${siteMetadata.siteUrl}/#section-projects`,
};

export default function StructuredData() {
  const schemas = [
    personSchema,
    websiteSchema,
    pulseGuardSchema,
    observyzeSchema,
    envSecretLockSchema,
    subtrackHubSchema,
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
