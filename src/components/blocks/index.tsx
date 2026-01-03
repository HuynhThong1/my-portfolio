import { SectionConfig } from '@/types/config';
import { HeroBlock } from './HeroBlock';
import { AboutBlock } from './AboutBlock';
import { SkillsBlock } from './SkillsBlock';
import { ProjectsBlock } from './ProjectsBlock';
import { ExperienceBlock } from './ExperienceBlock';
import { ContactBlock } from './ContactBlock';
import { ContactCTABlock } from './ContactCTABlock';

interface BlockRendererProps {
  section: SectionConfig;
  preview?: boolean;
  data?: any;
}

const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  about: AboutBlock,
  skills: SkillsBlock,
  projects: ProjectsBlock,
  'projects-grid': ProjectsBlock,
  experience: ExperienceBlock,
  contact: ContactBlock,
  'contact-cta': ContactCTABlock,
};

export function BlockRenderer({ section, preview = false, data }: BlockRendererProps) {
  const Component = blockComponents[section.type];

  if (!Component) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Unknown block type: {section.type}
      </div>
    );
  }

  // Merge section props with data if available
  const props = {
    ...section.props,
    ...(data && { ...data }),
    preview,
  };

  return <Component {...props} />;
}

export {
  HeroBlock,
  AboutBlock,
  SkillsBlock,
  ProjectsBlock,
  ExperienceBlock,
  ContactBlock,
  ContactCTABlock,
};
