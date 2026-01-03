# Claude Code Prompt: Professional Portfolio Builder

## Project Overview

Build a **professional developer portfolio** with the following core requirements:

- **Framework**: Next.js 15 (App Router, Server Components)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Styling**: SCSS modules for custom styles
- **Configuration**: YAML-based dynamic layout system
- **Admin Panel**: Drag-and-drop UI builder with real-time preview
- **SEO**: Fully optimized with structured data, meta tags, sitemap
- **Deployment**: Docker + Vercel compatible

---

## Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── (portfolio)/          # Public portfolio pages
│   │   │   ├── page.tsx          # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── experience/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── layout.tsx
│   │   ├── admin/                # Admin drag-drop builder
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── components/
│   │   ├── api/
│   │   │   ├── config/route.ts   # YAML config CRUD
│   │   │   └── contact/route.ts  # Contact form handler
│   │   ├── layout.tsx
│   │   └── globals.scss
│   ├── components/
│   │   ├── ui/                   # shadcn components
│   │   ├── blocks/               # Draggable content blocks
│   │   │   ├── HeroBlock.tsx
│   │   │   ├── AboutBlock.tsx
│   │   │   ├── SkillsBlock.tsx
│   │   │   ├── ProjectsBlock.tsx
│   │   │   ├── ExperienceBlock.tsx
│   │   │   ├── ContactBlock.tsx
│   │   │   └── index.ts
│   │   ├── builder/              # Drag-drop builder components
│   │   │   ├── Canvas.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BlockWrapper.tsx
│   │   │   ├── PropertyEditor.tsx
│   │   │   └── PreviewPane.tsx
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Navigation.tsx
│   │       └── ThemeToggle.tsx
│   ├── lib/
│   │   ├── config-loader.ts      # YAML parser & loader
│   │   ├── config-writer.ts      # YAML writer for admin
│   │   ├── seo.ts                # SEO utilities
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useConfig.ts
│   │   ├── useDragDrop.ts
│   │   └── useRealTimePreview.ts
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _typography.scss
│   │   └── blocks/
│   ├── types/
│   │   ├── config.ts
│   │   └── blocks.ts
│   └── config/
│       └── portfolio.yaml        # Main config file
├── public/
│   ├── images/
│   ├── resume.pdf
│   └── robots.txt
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Step 1: Initialize Project

```bash
# Create Next.js 15 project
npx create-next-app@latest portfolio --typescript --tailwind --eslint --app --src-dir

cd portfolio

# Install dependencies
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install js-yaml gray-matter
npm install framer-motion
npm install lucide-react
npm install zod
npm install sass
npm install next-seo
npm install @vercel/analytics

# Install shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input textarea badge tabs dialog sheet dropdown-menu avatar separator skeleton toast switch label select

# Dev dependencies
npm install -D @types/js-yaml
```

---

## Step 2: YAML Configuration Schema

Create `src/config/portfolio.yaml`:

```yaml
# Portfolio Configuration
# This file controls all aspects of your portfolio

meta:
  title: "John Doe | Full-Stack Developer"
  description: "Full-stack developer with 3+ years of experience in React, Next.js, .NET, and cloud technologies"
  keywords:
    - full-stack developer
    - react developer
    - nextjs
    - typescript
    - dotnet
  author: "John Doe"
  siteUrl: "https://johndoe.dev"
  ogImage: "/images/og-image.jpg"
  twitterHandle: "@johndoe"
  locale: "en_US"

profile:
  name: "John Doe"
  title: "Full-Stack Developer"
  email: "john@example.com"
  phone: "+84 123 456 789"
  location: "Ho Chi Minh City, Vietnam"
  avatar: "/images/avatar.jpg"
  resumeUrl: "/resume.pdf"
  bio: |
    Passionate full-stack developer with 3+ years of experience building 
    scalable web applications. Specialized in React, Next.js, .NET Core, 
    and cloud technologies.
  social:
    github: "https://github.com/johndoe"
    linkedin: "https://linkedin.com/in/johndoe"
    twitter: "https://twitter.com/johndoe"
    email: "mailto:john@example.com"

theme:
  mode: "system" # light | dark | system
  primaryColor: "#0066FF"
  accentColor: "#00D4FF"
  fontFamily: "Inter"
  borderRadius: "0.5rem"

layout:
  header:
    visible: true
    sticky: true
    transparent: false
    navItems:
      - label: "Home"
        href: "/"
      - label: "About"
        href: "/about"
      - label: "Projects"
        href: "/projects"
      - label: "Experience"
        href: "/experience"
      - label: "Contact"
        href: "/contact"
  footer:
    visible: true
    showSocial: true
    copyright: "© 2024 John Doe. All rights reserved."

pages:
  home:
    sections:
      - id: "hero"
        type: "hero"
        order: 1
        visible: true
        props:
          headline: "Hi, I'm John Doe"
          subheadline: "Full-Stack Developer"
          description: "I build exceptional digital experiences"
          ctaPrimary:
            label: "View Projects"
            href: "/projects"
          ctaSecondary:
            label: "Download CV"
            href: "/resume.pdf"
          showTypingEffect: true
          backgroundStyle: "gradient" # gradient | particles | none
          
      - id: "skills-preview"
        type: "skills"
        order: 2
        visible: true
        props:
          title: "Tech Stack"
          layout: "grid" # grid | carousel | list
          showProficiency: true
          categories:
            - name: "Frontend"
              skills:
                - name: "React"
                  icon: "react"
                  proficiency: 90
                - name: "Next.js"
                  icon: "nextjs"
                  proficiency: 85
                - name: "TypeScript"
                  icon: "typescript"
                  proficiency: 88
                - name: "Angular"
                  icon: "angular"
                  proficiency: 75
            - name: "Backend"
              skills:
                - name: ".NET Core"
                  icon: "dotnet"
                  proficiency: 85
                - name: "Node.js"
                  icon: "nodejs"
                  proficiency: 80
                - name: "NestJS"
                  icon: "nestjs"
                  proficiency: 78
            - name: "Database"
              skills:
                - name: "PostgreSQL"
                  icon: "postgresql"
                  proficiency: 82
                - name: "MongoDB"
                  icon: "mongodb"
                  proficiency: 80
            - name: "DevOps"
              skills:
                - name: "Docker"
                  icon: "docker"
                  proficiency: 75
                - name: "Kubernetes"
                  icon: "kubernetes"
                  proficiency: 65

      - id: "featured-projects"
        type: "projects"
        order: 3
        visible: true
        props:
          title: "Featured Projects"
          maxItems: 3
          showViewAll: true
          layout: "cards" # cards | list | masonry

      - id: "contact-cta"
        type: "contact-cta"
        order: 4
        visible: true
        props:
          title: "Let's Work Together"
          description: "Have a project in mind? Let's discuss how I can help."
          buttonLabel: "Get In Touch"

  about:
    sections:
      - id: "about-intro"
        type: "about"
        order: 1
        visible: true
        props:
          showImage: true
          imagePosition: "right"
          
      - id: "experience-timeline"
        type: "experience"
        order: 2
        visible: true
        props:
          title: "Work Experience"
          layout: "timeline"

  projects:
    sections:
      - id: "all-projects"
        type: "projects-grid"
        order: 1
        visible: true
        props:
          showFilters: true
          showSearch: true
          itemsPerPage: 6

  experience:
    sections:
      - id: "work-experience"
        type: "experience"
        order: 1
        visible: true
        props:
          layout: "detailed"
          
      - id: "education"
        type: "education"
        order: 2
        visible: true

  contact:
    sections:
      - id: "contact-form"
        type: "contact"
        order: 1
        visible: true
        props:
          showMap: false
          showSocial: true
          formFields:
            - name
            - email
            - subject
            - message

# Content Data
data:
  projects:
    - id: "project-1"
      title: "Healthcare Digital Platform"
      description: "A comprehensive digital health platform with real-time chat, patient management, and provider communication."
      longDescription: |
        Built a full-featured healthcare application enabling seamless 
        communication between patients and healthcare providers.
      image: "/images/projects/healthcare.jpg"
      tags:
        - "React"
        - "TypeScript"
        - ".NET Core"
        - "SignalR"
        - "PostgreSQL"
      links:
        demo: "https://demo.example.com"
        github: "https://github.com/johndoe/healthcare"
      featured: true
      category: "web"
      
    - id: "project-2"
      title: "HR Recruitment System"
      description: "Modern HR recruitment platform with customizable themes and workflow automation."
      image: "/images/projects/hr-system.jpg"
      tags:
        - "Angular 19"
        - "TailwindCSS"
        - "NestJS"
        - "MongoDB"
      links:
        demo: "https://hr.example.com"
      featured: true
      category: "web"

    - id: "project-3"
      title: "E-commerce Platform"
      description: "Scalable e-commerce solution with microservices architecture."
      image: "/images/projects/ecommerce.jpg"
      tags:
        - "Next.js"
        - "Node.js"
        - "Kubernetes"
        - "Redis"
      featured: true
      category: "web"

  experience:
    - id: "exp-1"
      company: "Tech Company"
      position: "Full-Stack Developer"
      location: "Ho Chi Minh City, Vietnam"
      startDate: "2022-01"
      endDate: "present"
      description: |
        - Developed and maintained healthcare digital platform
        - Implemented real-time chat using SignalR
        - Optimized database queries reducing response time by 40%
        - Led frontend architecture migration to React 18
      technologies:
        - "React"
        - ".NET Core"
        - "PostgreSQL"
        - "Docker"

    - id: "exp-2"
      company: "Startup Inc"
      position: "Frontend Developer"
      location: "Ho Chi Minh City, Vietnam"
      startDate: "2021-01"
      endDate: "2021-12"
      description: |
        - Built responsive web applications using React
        - Collaborated with UX team to implement design systems
        - Improved page load performance by 50%

  education:
    - id: "edu-1"
      institution: "University of Technology"
      degree: "Bachelor of Computer Science"
      location: "Ho Chi Minh City, Vietnam"
      startDate: "2017"
      endDate: "2021"
      description: "Focused on software engineering and web technologies"

  certifications:
    - name: "AWS Certified Developer"
      issuer: "Amazon Web Services"
      date: "2023"
      url: "https://aws.amazon.com/certification"
```

---

## Step 3: TypeScript Types

Create `src/types/config.ts`:

```typescript
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

export interface DataConfig {
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications?: Certification[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}
```

Create `src/types/blocks.ts`:

```typescript
export type BlockType =
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'projects-grid'
  | 'experience'
  | 'education'
  | 'contact'
  | 'contact-cta'
  | 'custom';

export interface BlockDefinition {
  type: BlockType;
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  editableProps: PropDefinition[];
}

export interface PropDefinition {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'image';
  options?: { label: string; value: string }[];
  defaultValue?: any;
}

export interface DragItem {
  id: string;
  type: BlockType;
  order: number;
}
```

---

## Step 4: Config Loader Utility

Create `src/lib/config-loader.ts`:

```typescript
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { PortfolioConfig } from '@/types/config';

const CONFIG_PATH = path.join(process.cwd(), 'src/config/portfolio.yaml');

export function loadConfig(): PortfolioConfig {
  try {
    const fileContents = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config = yaml.load(fileContents) as PortfolioConfig;
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    throw new Error('Failed to load portfolio configuration');
  }
}

export function getPageSections(pageName: string): SectionConfig[] {
  const config = loadConfig();
  const page = config.pages[pageName];
  
  if (!page) {
    return [];
  }
  
  return page.sections
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);
}

export function getConfig() {
  return loadConfig();
}
```

Create `src/lib/config-writer.ts`:

```typescript
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { PortfolioConfig } from '@/types/config';

const CONFIG_PATH = path.join(process.cwd(), 'src/config/portfolio.yaml');

export async function saveConfig(config: PortfolioConfig): Promise<void> {
  try {
    const yamlString = yaml.dump(config, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
    });
    
    fs.writeFileSync(CONFIG_PATH, yamlString, 'utf8');
  } catch (error) {
    console.error('Error saving config:', error);
    throw new Error('Failed to save portfolio configuration');
  }
}

export async function updateSection(
  pageName: string,
  sectionId: string,
  updates: Partial<SectionConfig>
): Promise<void> {
  const config = loadConfig();
  const page = config.pages[pageName];
  
  if (!page) {
    throw new Error(`Page ${pageName} not found`);
  }
  
  const sectionIndex = page.sections.findIndex(s => s.id === sectionId);
  
  if (sectionIndex === -1) {
    throw new Error(`Section ${sectionId} not found`);
  }
  
  page.sections[sectionIndex] = {
    ...page.sections[sectionIndex],
    ...updates,
  };
  
  await saveConfig(config);
}

export async function reorderSections(
  pageName: string,
  sectionIds: string[]
): Promise<void> {
  const config = loadConfig();
  const page = config.pages[pageName];
  
  if (!page) {
    throw new Error(`Page ${pageName} not found`);
  }
  
  // Update order based on new array position
  sectionIds.forEach((id, index) => {
    const section = page.sections.find(s => s.id === id);
    if (section) {
      section.order = index + 1;
    }
  });
  
  await saveConfig(config);
}
```

---

## Step 5: Drag and Drop Builder Components

Create `src/components/builder/Canvas.tsx`:

```typescript
'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SectionConfig } from '@/types/config';
import { BlockWrapper } from './BlockWrapper';
import { BlockRenderer } from '../blocks';

interface CanvasProps {
  sections: SectionConfig[];
  onReorder: (sections: SectionConfig[]) => void;
  onSelectSection: (section: SectionConfig | null) => void;
  selectedSectionId: string | null;
}

export function Canvas({
  sections,
  onReorder,
  onSelectSection,
  selectedSectionId,
}: CanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex).map(
        (section, index) => ({
          ...section,
          order: index + 1,
        })
      );
      
      onReorder(newSections);
    }
    
    setActiveId(null);
  };

  const activeSection = activeId
    ? sections.find(s => s.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="canvas-container min-h-screen bg-muted/30 p-4">
        <SortableContext
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map(section => (
            <BlockWrapper
              key={section.id}
              section={section}
              isSelected={selectedSectionId === section.id}
              onClick={() => onSelectSection(section)}
            >
              <BlockRenderer section={section} preview />
            </BlockWrapper>
          ))}
        </SortableContext>
      </div>
      
      <DragOverlay>
        {activeSection ? (
          <div className="opacity-80">
            <BlockRenderer section={activeSection} preview />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

Create `src/components/builder/BlockWrapper.tsx`:

```typescript
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2, Settings } from 'lucide-react';
import { SectionConfig } from '@/types/config';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BlockWrapperProps {
  section: SectionConfig;
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function BlockWrapper({
  section,
  isSelected,
  onClick,
  children,
}: BlockWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group mb-4 rounded-lg border-2 transition-all',
        isSelected ? 'border-primary' : 'border-transparent hover:border-muted-foreground/20',
        isDragging && 'opacity-50',
        !section.visible && 'opacity-50'
      )}
      onClick={onClick}
    >
      {/* Block Controls */}
      <div className="absolute -top-3 left-4 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          className="flex items-center gap-1 bg-background border rounded-md px-2 py-1 shadow-sm"
        >
          <button
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <span className="text-xs font-medium text-muted-foreground px-2">
            {section.type}
          </span>
          
          <Button variant="ghost" size="icon" className="h-6 w-6">
            {section.visible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </Button>
          
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Settings className="h-3 w-3" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Block Content */}
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  );
}
```

Create `src/components/builder/PropertyEditor.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { SectionConfig } from '@/types/config';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PropertyEditorProps {
  section: SectionConfig | null;
  onUpdate: (updates: Partial<SectionConfig>) => void;
}

export function PropertyEditor({ section, onUpdate }: PropertyEditorProps) {
  const [localProps, setLocalProps] = useState<Record<string, any>>({});

  useEffect(() => {
    if (section) {
      setLocalProps(section.props);
    }
  }, [section]);

  if (!section) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select a section to edit its properties
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value };
    setLocalProps(newProps);
    onUpdate({ props: newProps });
  };

  const renderPropEditor = (key: string, value: any) => {
    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center justify-between" key={key}>
          <Label htmlFor={key}>{formatLabel(key)}</Label>
          <Switch
            id={key}
            checked={value}
            onCheckedChange={(checked) => handlePropChange(key, checked)}
          />
        </div>
      );
    }

    if (typeof value === 'string' && value.length > 100) {
      return (
        <div className="space-y-2" key={key}>
          <Label htmlFor={key}>{formatLabel(key)}</Label>
          <Textarea
            id={key}
            value={value}
            onChange={(e) => handlePropChange(key, e.target.value)}
            rows={4}
          />
        </div>
      );
    }

    if (typeof value === 'string') {
      return (
        <div className="space-y-2" key={key}>
          <Label htmlFor={key}>{formatLabel(key)}</Label>
          <Input
            id={key}
            value={value}
            onChange={(e) => handlePropChange(key, e.target.value)}
          />
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div className="space-y-2" key={key}>
          <Label htmlFor={key}>{formatLabel(key)}</Label>
          <Input
            id={key}
            type="number"
            value={value}
            onChange={(e) => handlePropChange(key, Number(e.target.value))}
          />
        </div>
      );
    }

    return null;
  };

  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{section.type}</h3>
        <p className="text-sm text-muted-foreground">ID: {section.id}</p>
      </div>
      
      <Separator />
      
      <div className="flex items-center justify-between">
        <Label htmlFor="visible">Visible</Label>
        <Switch
          id="visible"
          checked={section.visible}
          onCheckedChange={(checked) => onUpdate({ visible: checked })}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="font-medium">Properties</h4>
        {Object.entries(localProps).map(([key, value]) => 
          renderPropEditor(key, value)
        )}
      </div>
    </div>
  );
}
```

Create `src/app/admin/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@/components/builder/Canvas';
import { Sidebar } from '@/components/builder/Sidebar';
import { PropertyEditor } from '@/components/builder/PropertyEditor';
import { PreviewPane } from '@/components/builder/PreviewPane';
import { SectionConfig, PortfolioConfig } from '@/types/config';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Eye, Undo, Redo } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [selectedSection, setSelectedSection] = useState<SectionConfig | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (config && config.pages[currentPage]) {
      setSections(
        config.pages[currentPage].sections.sort((a, b) => a.order - b.order)
      );
    }
  }, [config, currentPage]);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      toast.error('Failed to load configuration');
    }
  };

  const handleReorder = (newSections: SectionConfig[]) => {
    setSections(newSections);
    // Update config locally
    if (config) {
      setConfig({
        ...config,
        pages: {
          ...config.pages,
          [currentPage]: {
            ...config.pages[currentPage],
            sections: newSections,
          },
        },
      });
    }
  };

  const handleSectionUpdate = (updates: Partial<SectionConfig>) => {
    if (!selectedSection) return;

    const newSections = sections.map((s) =>
      s.id === selectedSection.id ? { ...s, ...updates } : s
    );
    
    setSections(newSections);
    setSelectedSection({ ...selectedSection, ...updates });
    
    // Update config
    if (config) {
      setConfig({
        ...config,
        pages: {
          ...config.pages,
          [currentPage]: {
            ...config.pages[currentPage],
            sections: newSections,
          },
        },
      });
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        toast.success('Configuration saved successfully');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold">Portfolio Builder</h1>
          
          <Select value={currentPage} onValueChange={setCurrentPage}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(config.pages).map((page) => (
                <SelectItem key={page} value={page}>
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Undo className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button variant="outline" size="sm">
            <Redo className="h-4 w-4 mr-1" />
            Redo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="h-4 w-4 mr-1" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Block Library */}
        <Sidebar onAddSection={(type) => {
          // Add new section logic
        }} />

        {/* Canvas */}
        <main className="flex-1 overflow-auto">
          {isPreviewMode ? (
            <PreviewPane sections={sections} config={config} />
          ) : (
            <Canvas
              sections={sections}
              onReorder={handleReorder}
              onSelectSection={setSelectedSection}
              selectedSectionId={selectedSection?.id || null}
            />
          )}
        </main>

        {/* Right Sidebar - Property Editor */}
        <aside className="w-80 border-l overflow-auto">
          <Tabs defaultValue="properties">
            <TabsList className="w-full">
              <TabsTrigger value="properties" className="flex-1">
                Properties
              </TabsTrigger>
              <TabsTrigger value="styles" className="flex-1">
                Styles
              </TabsTrigger>
            </TabsList>
            <TabsContent value="properties">
              <PropertyEditor
                section={selectedSection}
                onUpdate={handleSectionUpdate}
              />
            </TabsContent>
            <TabsContent value="styles">
              {/* Style editor */}
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}
```

---

## Step 6: API Routes

Create `src/app/api/config/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { loadConfig, saveConfig } from '@/lib/config-loader';

export async function GET() {
  try {
    const config = loadConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const config = await request.json();
    await saveConfig(config);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}
```

---

## Step 7: SEO Utilities

Create `src/lib/seo.ts`:

```typescript
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
```

---

## Step 8: Block Components

Create `src/components/blocks/HeroBlock.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';

interface HeroBlockProps {
  headline: string;
  subheadline: string;
  description: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  showTypingEffect?: boolean;
  backgroundStyle?: 'gradient' | 'particles' | 'none';
  preview?: boolean;
}

export function HeroBlock({
  headline,
  subheadline,
  description,
  ctaPrimary,
  ctaSecondary,
  showTypingEffect = true,
  backgroundStyle = 'gradient',
  preview = false,
}: HeroBlockProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {backgroundStyle === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      )}
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={preview ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.p
            initial={preview ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary font-medium mb-4"
          >
            {subheadline}
          </motion.p>
          
          <motion.h1
            initial={preview ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            {headline}
          </motion.h1>
          
          <motion.p
            initial={preview ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto"
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={preview ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {ctaPrimary && (
              <Button asChild size="lg">
                <Link href={ctaPrimary.href}>
                  {ctaPrimary.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            
            {ctaSecondary && (
              <Button asChild variant="outline" size="lg">
                <Link href={ctaSecondary.href}>
                  <Download className="mr-2 h-4 w-4" />
                  {ctaSecondary.label}
                </Link>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```

Create `src/components/blocks/index.ts`:

```typescript
import { SectionConfig } from '@/types/config';
import { HeroBlock } from './HeroBlock';
import { AboutBlock } from './AboutBlock';
import { SkillsBlock } from './SkillsBlock';
import { ProjectsBlock } from './ProjectsBlock';
import { ExperienceBlock } from './ExperienceBlock';
import { ContactBlock } from './ContactBlock';

interface BlockRendererProps {
  section: SectionConfig;
  preview?: boolean;
}

const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  about: AboutBlock,
  skills: SkillsBlock,
  projects: ProjectsBlock,
  'projects-grid': ProjectsBlock,
  experience: ExperienceBlock,
  contact: ContactBlock,
  'contact-cta': ContactBlock,
};

export function BlockRenderer({ section, preview = false }: BlockRendererProps) {
  const Component = blockComponents[section.type];
  
  if (!Component) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Unknown block type: {section.type}
      </div>
    );
  }
  
  return <Component {...section.props} preview={preview} />;
}

export {
  HeroBlock,
  AboutBlock,
  SkillsBlock,
  ProjectsBlock,
  ExperienceBlock,
  ContactBlock,
};
```

---

## Step 9: Docker Configuration

Create `Dockerfile`:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/config ./src/config

# Set correct permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  portfolio:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./src/config:/app/src/config
    restart: unless-stopped
```

Create `.dockerignore`:

```
node_modules
.next
.git
.gitignore
*.md
.env*
Dockerfile
docker-compose.yml
.dockerignore
```

Update `next.config.ts` for standalone output:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
};

export default nextConfig;
```

---

## Step 10: Vercel Deployment

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["sin1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

---

## Build & Run Commands

```bash
# Development
npm run dev

# Build
npm run build

# Docker build
docker build -t portfolio .

# Docker run
docker run -p 3000:3000 portfolio

# Docker compose
docker-compose up -d

# Deploy to Vercel
vercel --prod
```

---

## Key Features Summary

1. **YAML Configuration**: All content and layout controlled via single YAML file
2. **Drag & Drop Builder**: Admin panel with real-time preview
3. **SEO Optimized**: Meta tags, Open Graph, structured data, sitemap
4. **Responsive Design**: Mobile-first with shadcn/ui components
5. **Dark/Light Mode**: System preference + manual toggle
6. **Docker Ready**: Multi-stage build for production
7. **Vercel Compatible**: Standalone output for edge deployment

---

## Notes for Claude Code

- Start by setting up the project structure exactly as specified
- Install all dependencies in the correct order
- Create the YAML config file first as it's the data source
- Implement blocks one at a time, testing each
- The admin builder is the most complex part - build it last
- Test the Docker build locally before deploying
- Ensure the YAML file is writable in the container for admin edits
