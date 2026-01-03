import { Metadata } from 'next';
import { PortfolioConfig } from '@/types/config';

export function generateMetadata(config: PortfolioConfig): Metadata {
  const { meta, profile } = config;

  return {
    title: {
      default: meta.title,
      template: `%s | ${profile.name}`,
    },
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: meta.author }],
    creator: meta.author,
    metadataBase: new URL(meta.siteUrl),
    openGraph: {
      type: 'website',
      locale: meta.locale,
      url: meta.siteUrl,
      title: meta.title,
      description: meta.description,
      siteName: profile.name,
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [meta.ogImage],
      creator: meta.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: meta.siteUrl,
    },
  };
}

export function generateStructuredData(config: PortfolioConfig) {
  const { meta, profile, data } = config;

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    email: profile.email,
    url: meta.siteUrl,
    image: `${meta.siteUrl}${profile.avatar}`,
    sameAs: Object.values(profile.social).filter(Boolean),
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location,
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: meta.title,
    url: meta.siteUrl,
    author: {
      '@type': 'Person',
      name: profile.name,
    },
  };

  return { personSchema, websiteSchema };
}
