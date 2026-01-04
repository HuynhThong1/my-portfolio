import React from 'react';
import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '../index';
import { SectionConfig } from '@/types/config';

describe('BlockRenderer', () => {
  it('should render hero block', () => {
    const section: SectionConfig = {
      id: 'hero-1',
      type: 'hero',
      order: 1,
      visible: true,
      props: {
        headline: 'Test Hero',
        subheadline: 'Test Subheadline',
        description: 'Test Description',
      },
    };

    render(<BlockRenderer section={section} />);

    expect(screen.getByText('Test Hero')).toBeInTheDocument();
    expect(screen.getByText('Test Subheadline')).toBeInTheDocument();
  });

  it('should render about block', () => {
    const section: SectionConfig = {
      id: 'about-1',
      type: 'about',
      order: 1,
      visible: true,
      props: {
        title: 'About Me',
        content: 'This is my story',
      },
    };

    render(<BlockRenderer section={section} />);

    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('should render skills block', () => {
    const section: SectionConfig = {
      id: 'skills-1',
      type: 'skills',
      order: 1,
      visible: true,
      props: {
        title: 'My Skills',
      },
    };

    const data = {
      categories: [
        {
          name: 'Frontend',
          skills: [
            { name: 'React', proficiency: 90 },
            { name: 'TypeScript', proficiency: 85 },
          ],
        },
      ],
    };

    render(<BlockRenderer section={section} data={data} />);

    expect(screen.getByText('My Skills')).toBeInTheDocument();
  });

  it('should render projects block', () => {
    const section: SectionConfig = {
      id: 'projects-1',
      type: 'projects',
      order: 1,
      visible: true,
      props: {
        title: 'My Projects',
        maxItems: 3,
      },
    };

    const data = {
      projects: [
        {
          id: '1',
          title: 'Project 1',
          description: 'Description 1',
          image: '/test.jpg',
          tags: ['React'],
          links: {},
          featured: true,
          category: 'web',
        },
      ],
    };

    render(<BlockRenderer section={section} data={data} />);

    expect(screen.getByText('My Projects')).toBeInTheDocument();
  });

  it('should render experience block', () => {
    const section: SectionConfig = {
      id: 'experience-1',
      type: 'experience',
      order: 1,
      visible: true,
      props: {
        title: 'Experience',
      },
    };

    const data = {
      experiences: [
        {
          id: '1',
          company: 'Tech Co',
          position: 'Developer',
          location: 'City',
          startDate: '2022-01-01',
          endDate: '2023-01-01',
          description: 'Worked on stuff',
          technologies: ['React'],
        },
      ],
    };

    render(<BlockRenderer section={section} data={data} />);

    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  it('should render contact block', () => {
    const section: SectionConfig = {
      id: 'contact-1',
      type: 'contact',
      order: 1,
      visible: true,
      props: {
        title: 'Get In Touch',
        description: 'Contact me',
      },
    };

    const { container } = render(<BlockRenderer section={section} />);

    // Check component renders
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });

  it('should render unknown block type message', () => {
    const section: SectionConfig = {
      id: 'unknown-1',
      type: 'unknown-type',
      order: 1,
      visible: true,
      props: {},
    };

    render(<BlockRenderer section={section} />);

    expect(screen.getByText(/Unknown block type: unknown-type/)).toBeInTheDocument();
  });

  it('should merge section props with data', () => {
    const section: SectionConfig = {
      id: 'projects-1',
      type: 'projects',
      order: 1,
      visible: true,
      props: {
        title: 'Featured Work',
      },
    };

    const data = {
      projects: [
        {
          id: '1',
          title: 'Test Project',
          description: 'Test',
          image: '/test.jpg',
          tags: [],
          links: {},
          featured: true,
          category: 'web',
        },
      ],
    };

    render(<BlockRenderer section={section} data={data} />);

    expect(screen.getByText('Featured Work')).toBeInTheDocument();
  });

  it('should pass preview prop to component', () => {
    const section: SectionConfig = {
      id: 'hero-1',
      type: 'hero',
      order: 1,
      visible: true,
      props: {
        headline: 'Test',
        subheadline: 'Test',
        description: 'Test',
      },
    };

    const { container } = render(<BlockRenderer section={section} preview={true} />);

    expect(container).toBeInTheDocument();
  });

  it('should handle contact-cta block type', () => {
    const section: SectionConfig = {
      id: 'contact-cta-1',
      type: 'contact-cta',
      order: 1,
      visible: true,
      props: {
        title: 'Let\'s Work Together',
        description: 'Get in touch',
      },
    };

    render(<BlockRenderer section={section} />);

    expect(screen.getByText('Let\'s Work Together')).toBeInTheDocument();
  });

  it('should handle projects-grid block type', () => {
    const section: SectionConfig = {
      id: 'projects-grid-1',
      type: 'projects-grid',
      order: 1,
      visible: true,
      props: {
        title: 'All Projects',
      },
    };

    const data = {
      projects: [],
    };

    render(<BlockRenderer section={section} data={data} />);

    expect(screen.getByText('All Projects')).toBeInTheDocument();
  });
});
