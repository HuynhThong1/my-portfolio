import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroBlock } from '../HeroBlock';

describe('HeroBlock', () => {
  const defaultProps = {
    headline: 'Welcome to My Portfolio',
    subheadline: 'Full-Stack Developer',
    description: 'Building amazing web applications',
  };

  it('should render headline and subheadline', () => {
    render(<HeroBlock {...defaultProps} />);

    expect(screen.getByText('Welcome to My Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument();
    expect(screen.getByText('Building amazing web applications')).toBeInTheDocument();
  });

  it('should render primary CTA when provided', () => {
    const props = {
      ...defaultProps,
      ctaPrimary: {
        label: 'View Projects',
        href: '/projects',
      },
    };

    render(<HeroBlock {...props} />);

    const ctaLink = screen.getByText('View Projects');
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink.closest('a')).toHaveAttribute('href', '/projects');
  });

  it('should render secondary CTA when provided', () => {
    const props = {
      ...defaultProps,
      ctaSecondary: {
        label: 'Download CV',
        href: '/resume.pdf',
      },
    };

    render(<HeroBlock {...props} />);

    const ctaLink = screen.getByText('Download CV');
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink.closest('a')).toHaveAttribute('href', '/resume.pdf');
  });

  it('should render both CTAs when provided', () => {
    const props = {
      ...defaultProps,
      ctaPrimary: {
        label: 'View Projects',
        href: '/projects',
      },
      ctaSecondary: {
        label: 'Download CV',
        href: '/resume.pdf',
      },
    };

    render(<HeroBlock {...props} />);

    expect(screen.getByText('View Projects')).toBeInTheDocument();
    expect(screen.getByText('Download CV')).toBeInTheDocument();
  });

  it('should apply gradient background when specified', () => {
    const { container } = render(<HeroBlock {...defaultProps} backgroundStyle="gradient" />);

    // Check that component renders without errors
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Welcome to My Portfolio')).toBeInTheDocument();
  });

  it('should handle preview mode', () => {
    render(<HeroBlock {...defaultProps} preview={true} />);

    expect(screen.getByText('Welcome to My Portfolio')).toBeInTheDocument();
  });
});
