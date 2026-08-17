import React from 'react';
import { siteMetadata } from '@/lib/metadata';

export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rahul Singh Shekhawat',
    jobTitle: 'Full-Stack & Cloud Engineer · AI-Powered SaaS',
    url: siteMetadata.siteUrl,
    image: `${siteMetadata.siteUrl}/rahul.png`,
    email: 'rahulsinghpilani7@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://github.com/Hrshw',
      'https://www.linkedin.com/in/rahul-singh-shekhawat-b4ba481ab',
      'https://www.instagram.com/hr.shw/',
    ],
    description: siteMetadata.description,
    inLanguage: 'en-US',
    knowsAbout: [
      'Cloud Engineering',
      'AI-Powered SaaS',
      'LLM Integration',
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Full-stack web development, AWS cloud architecture, AI integrations, and end-to-end SaaS product builds — from MVP to production. I also take on feature work, API/backend development, performance and SEO improvements, and migrations of existing applications to the cloud.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you build AI-powered SaaS products?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. I design and build AI-powered SaaS platforms on AWS — including LLM integrations, AI features, automation, and serverless backends that scale.',
        },
      },
      {
        '@type': 'Question',
        name: 'What technologies do you work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Node.js, React, Next.js, TypeScript, AWS (Lambda, EC2, S3, Route 53, DynamoDB), serverless architecture, Redis, MongoDB, and LLM/OpenAI integrations.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you work on an existing project?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — I take on new features, integrations, bug fixes, performance and SEO improvements, and moving existing apps onto AWS infrastructure.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where are you based and do you work remotely?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Based in Mumbai, India, and working remotely with clients worldwide.',
        },
      },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}


