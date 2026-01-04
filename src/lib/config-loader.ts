import { prisma } from '@/lib/prisma';
import { PortfolioConfig, SectionConfig } from '@/types/config';
import { cache } from 'react';

// Cache config for performance
export const getConfig = cache(async (): Promise<PortfolioConfig> => {
  const [
    siteConfig,
    profile,
    projects,
    experience,
    education,
    skills,
    layouts,
  ] = await Promise.all([
    prisma.siteConfig.findMany(),
    prisma.profile.findFirst(),
    prisma.project.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    }),
    prisma.experience.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    }),
    prisma.education.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    }),
    prisma.skill.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    }),
    prisma.pageLayout.findMany(),
  ]);

  // Convert site config array to object
  const configMap = siteConfig.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, any>);

  // Convert layouts array to object and transform section format
  const pagesConfig = layouts.reduce((acc, layout) => {
    const sections = (layout.sections as any[]).map(section => ({
      id: section.id,
      type: section.type,
      order: section.order,
      visible: section.enabled ?? section.visible ?? true,
      props: section.config ?? section.props ?? {},
    }));
    acc[layout.pageName] = { sections };
    return acc;
  }, {} as Record<string, { sections: SectionConfig[] }>);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push({
      name: skill.name,
      icon: skill.icon,
      proficiency: skill.proficiency,
    });
    return acc;
  }, {} as Record<string, any[]>);

  return {
    meta: configMap.meta || {},
    profile: profile ? {
      name: profile.name,
      title: profile.title,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      avatar: profile.avatar,
      resumeUrl: profile.resumeUrl,
      bio: profile.bio,
      social: profile.social as any,
    } : {} as any,
    theme: configMap.theme || {},
    layout: configMap.layout || {},
    pages: pagesConfig,
    data: {
      projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        longDescription: p.longDescription ?? undefined,
        image: p.image ?? '',
        tags: p.tags,
        links: p.links as any,
        featured: p.featured,
        category: p.category,
      })),
      experience: experience.map(e => ({
        id: e.id,
        company: e.company,
        position: e.position,
        location: e.location,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate?.toISOString() || 'present',
        description: e.description,
        technologies: e.technologies,
      })),
      education: education.map(ed => ({
        id: ed.id,
        institution: ed.institution,
        degree: ed.degree,
        location: ed.location,
        startDate: ed.startDate.toISOString(),
        endDate: ed.endDate?.toISOString() || '',
        description: ed.description ?? undefined,
      })),
      skills: Object.entries(skillsByCategory).map(([name, skills]) => ({
        name,
        skills,
      })),
    },
  };
});

export async function getPageSections(pageName: string): Promise<SectionConfig[]> {
  const layout = await prisma.pageLayout.findUnique({
    where: { pageName },
  });

  if (!layout) {
    return [];
  }

  // Transform PageSection format to SectionConfig format
  const sections = layout.sections as any[];
  return sections
    .map(section => ({
      id: section.id,
      type: section.type,
      order: section.order,
      visible: section.enabled ?? section.visible ?? true,
      props: section.config ?? section.props ?? {},
    }))
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);
}
