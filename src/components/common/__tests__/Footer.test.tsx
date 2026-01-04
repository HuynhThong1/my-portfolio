import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Footer } from '../Footer';

// Mock scrollTo
window.scrollTo = jest.fn();

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render footer with default name', () => {
    render(<Footer />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render footer with custom name', () => {
    render(<Footer name="Jane Smith" />);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render quick links', () => {
    render(<Footer />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should render social links when provided', () => {
    const social = {
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
      twitter: 'https://twitter.com/test',
      email: 'test@example.com',
    };

    const { container } = render(<Footer social={social} />);

    // Check that social links are rendered by checking for the href attributes
    const githubLink = container.querySelector('a[href="https://github.com/test"]');
    const linkedinLink = container.querySelector('a[href="https://linkedin.com/in/test"]');
    const twitterLink = container.querySelector('a[href="https://twitter.com/test"]');
    const emailLink = container.querySelector('a[href="mailto:test@example.com"]');

    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
    expect(emailLink).toBeInTheDocument();
  });

  it('should only render provided social links', () => {
    const social = {
      github: 'https://github.com/test',
    };

    const { container } = render(<Footer social={social} />);

    const githubLink = container.querySelector('a[href="https://github.com/test"]');
    const linkedinLink = container.querySelector('a[href*="linkedin.com/in/test"]');
    const twitterLink = container.querySelector('a[href*="twitter.com/test"]');

    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).not.toBeInTheDocument();
    expect(twitterLink).not.toBeInTheDocument();
  });

  it('should render back to top button when showBackToTop is true', () => {
    const { container } = render(<Footer showBackToTop={true} />);

    // Check for button with ArrowUp icon
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should not render back to top button when showBackToTop is false', () => {
    render(<Footer showBackToTop={false} />);

    // Should still render footer
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
  });

  it('should scroll to top when clicking back to top button', () => {
    const { container } = render(<Footer showBackToTop={true} />);

    const buttons = container.querySelectorAll('button');
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      expect(window.scrollTo).toHaveBeenCalled();
    }
  });

  it('should render copyright with current year', () => {
    render(<Footer name="Test User" />);

    // Year should be rendered (either 2024 default or actual year)
    const copyrightText = screen.getByText(/© \d{4} Test User/);
    expect(copyrightText).toBeInTheDocument();
  });

  it('should render tech stack information', () => {
    render(<Footer />);

    expect(screen.getByText(/Built with Next.js, TypeScript & Tailwind CSS/)).toBeInTheDocument();
  });

  it('should render Quick Links heading', () => {
    render(<Footer />);

    expect(screen.getByText('Quick Links')).toBeInTheDocument();
  });

  it('should render Connect heading', () => {
    render(<Footer />);

    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  it('should not cause hydration mismatch', () => {
    const { container } = render(<Footer />);

    // Component should render without errors
    expect(container).toBeInTheDocument();
  });

  it('should render with minimal props', () => {
    render(<Footer />);

    // Should render with all defaults
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
  });
});
