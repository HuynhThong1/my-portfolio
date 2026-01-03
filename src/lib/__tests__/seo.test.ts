import { generateMetadata, generateStructuredData } from '../seo';
import { PortfolioConfig } from '@/types/config';

const mockConfig: PortfolioConfig = {
  meta: {
    title: 'John Doe | Developer',
    description: 'Full-stack developer portfolio',
    keywords: ['developer', 'react', 'nextjs'],
    author: 'John Doe',
    siteUrl: 'https://johndoe.dev',
    ogImage: '/og-image.jpg',
    twitterHandle: '@johndoe',
    locale: 'en_US',
  },
  profile: {
    name: 'John Doe',
    title: 'Full-Stack Developer',
    email: 'john@example.com',
    location: 'San Francisco, CA',
    avatar: '/avatar.jpg',
    bio: 'Experienced developer',
    social: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
    },
  },
  theme: {
    mode: 'system',
    primaryColor: '#0066FF',
    accentColor: '#00D4FF',
    fontFamily: 'Inter',
    borderRadius: '0.5rem',
  },
  layout: {
    header: {
      visible: true,
      sticky: true,
      transparent: false,
      navItems: [],
    },
    footer: {
      visible: true,
      showSocial: true,
      copyright: '© 2024',
    },
  },
  pages: {},
  data: {
    projects: [],
    experience: [],
    education: [],
  },
};

describe('SEO Utilities', () => {
  describe('generateMetadata', () => {
    it('should generate correct metadata', () => {
      const metadata = generateMetadata(mockConfig);

      expect(metadata.title).toEqual({
        default: 'John Doe | Developer',
        template: '%s | John Doe',
      });
      expect(metadata.description).toBe('Full-stack developer portfolio');
      expect(metadata.keywords).toEqual(['developer', 'react', 'nextjs']);
    });

    it('should generate Open Graph metadata', () => {
      const metadata = generateMetadata(mockConfig);

      expect(metadata.openGraph).toEqual({
        type: 'website',
        locale: 'en_US',
        url: 'https://johndoe.dev',
        title: 'John Doe | Developer',
        description: 'Full-stack developer portfolio',
        siteName: 'John Doe',
        images: [
          {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'John Doe | Developer',
          },
        ],
      });
    });

    it('should generate Twitter metadata', () => {
      const metadata = generateMetadata(mockConfig);

      expect(metadata.twitter).toEqual({
        card: 'summary_large_image',
        title: 'John Doe | Developer',
        description: 'Full-stack developer portfolio',
        images: ['/og-image.jpg'],
        creator: '@johndoe',
      });
    });
  });

  describe('generateStructuredData', () => {
    it('should generate person schema', () => {
      const { personSchema } = generateStructuredData(mockConfig);

      expect(personSchema['@context']).toBe('https://schema.org');
      expect(personSchema['@type']).toBe('Person');
      expect(personSchema.name).toBe('John Doe');
      expect(personSchema.jobTitle).toBe('Full-Stack Developer');
      expect(personSchema.email).toBe('john@example.com');
    });

    it('should generate website schema', () => {
      const { websiteSchema } = generateStructuredData(mockConfig);

      expect(websiteSchema['@context']).toBe('https://schema.org');
      expect(websiteSchema['@type']).toBe('WebSite');
      expect(websiteSchema.name).toBe('John Doe | Developer');
      expect(websiteSchema.url).toBe('https://johndoe.dev');
    });
  });
});
