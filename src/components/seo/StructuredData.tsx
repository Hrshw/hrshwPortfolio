import React from 'react';
import { siteMetadata } from '@/lib/metadata';

export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rahul Singh Shekhawat',
    jobTitle: 'Full-Stack & Cloud Engineer',
    url: siteMetadata.siteUrl,
    image: `${siteMetadata.siteUrl}/rahul.jpg`,
    email: 'rahulsinghpilani7@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://github.com/Hrshw',
      'https://www.linkedin.com/in/rahul-singh-shekhawat-b4ba481ab',
      'https://www.instagram.com/hrshw_/',
    ],
    description: siteMetadata.description,
    inLanguage: 'en-US',
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
      'Serverless Architecture',
      'SaaS Development',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetadata.title,
    url: siteMetadata.siteUrl,
    description: siteMetadata.description,
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteMetadata.siteUrl}/insights?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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
      url: siteMetadata.siteUrl,
    },
    description: 'AI-powered uptime monitoring, SSL certificate tracking, and global status pages with real-time anomaly detection.',
    url: 'https://pulseguard.in',
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
      url: siteMetadata.siteUrl,
    },
    description: 'High-throughput cloud observability and telemetry ingestion platform using Fastify, Redis, and MongoDB Time-Series collections.',
    url: `${siteMetadata.siteUrl}/#section-projects`,
  };

  const envSecretLockSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'env-secret-lock',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, macOS, Linux',
    author: {
      '@type': 'Person',
      name: 'Rahul Singh Shekhawat',
      url: siteMetadata.siteUrl,
    },
    description: 'A local-first developer CLI tool for AES-256-GCM encrypted environment secret management with Git pre-commit protection.',
    url: 'https://github.com/Hrshw/env-secret-lock',
    downloadUrl: 'https://www.npmjs.com/package/env-secret-lock',
    softwareVersion: '1.0.0',
    license: 'https://opensource.org/licenses/MIT',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(envSecretLockSchema) }}
      />
    </>
  );
}


