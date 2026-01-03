import { getConfig } from '@/lib/config-loader';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();

  return {
    title: config.meta?.title || 'Professional Portfolio',
    description: config.meta?.description || 'Full-stack developer portfolio',
    keywords: config.meta?.keywords,
    authors: [{ name: config.meta?.author || config.profile?.name }],
    openGraph: {
      title: config.meta?.title,
      description: config.meta?.description,
      url: config.meta?.siteUrl,
      siteName: config.profile?.name,
      locale: config.meta?.locale || 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.meta?.title,
      description: config.meta?.description,
      creator: config.meta?.twitterHandle,
    },
  };
}

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getConfig();

  const navItems = config.layout?.header?.navItems || [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Experience', href: '/experience' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        navItems={navItems}
        sticky={config.layout?.header?.sticky ?? true}
        transparent={config.layout?.header?.transparent ?? false}
        social={config.profile?.social}
      />
      <main className="flex-1 pt-16 md:pt-20">
        {children}
      </main>
      <Footer
        name={config.profile?.name}
        social={config.profile?.social}
        showBackToTop={true}
      />
    </div>
  );
}
