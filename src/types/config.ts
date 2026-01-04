export interface PortfolioConfig {
  meta: MetaConfig;
  profile: ProfileConfig;
  theme: ThemeConfig;
  layout: LayoutConfig;
  pages: PagesConfig;
  data: DataConfig;
}

export interface MetaConfig {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  siteUrl: string;
  ogImage: string;
  twitterHandle?: string;
  locale: string;
}

export interface ProfileConfig {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  avatar: string;
  resumeUrl?: string;
  bio: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
    [key: string]: string | undefined;
  };
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface LayoutConfig {
  header: {
    visible: boolean;
    sticky: boolean;
    transparent: boolean;
    navItems: NavItem[];
  };
  footer: {
    visible: boolean;
    showSocial: boolean;
    copyright: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SectionConfig {
  id: string;
  type: string;
  order: number;
  visible: boolean;
  props: Record<string, any>;
}

export interface PageSection {
  id: string;
  type: 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'contact' | 'contact-cta';
  enabled: boolean;
  order: number;
  config: Record<string, any>;
}

export interface PagesConfig {
  [pageName: string]: {
    sections: SectionConfig[];
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  links: {
    demo?: string;
    github?: string;
    [key: string]: string | undefined;
  };
  featured: boolean;
  category: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface SkillCategory {
  name: string;
  skills: {
    name: string;
    icon?: string | null;
    proficiency: number;
  }[];
}

export interface DataConfig {
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications?: Certification[];
  skills: SkillCategory[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}
