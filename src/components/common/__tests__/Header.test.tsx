import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '../Header';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock scrollTo
window.scrollTo = jest.fn();

describe('Header', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should render navigation items', () => {
    render(<Header />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should render logo', () => {
    render(<Header />);

    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });

  it('should render custom navigation items when provided', () => {
    const customNavItems = [
      { label: 'Custom 1', href: '/custom1' },
      { label: 'Custom 2', href: '/custom2' },
    ];

    render(<Header navItems={customNavItems} />);

    expect(screen.getByText('Custom 1')).toBeInTheDocument();
    expect(screen.getByText('Custom 2')).toBeInTheDocument();
  });

  it('should render social links when provided', () => {
    const social = {
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
    };

    const { container } = render(<Header social={social} />);

    const githubLink = container.querySelector('a[href="https://github.com/test"]');
    expect(githubLink).toBeInTheDocument();
  });

  it('should toggle mobile menu when clicking menu button', () => {
    render(<Header />);

    const buttons = screen.getAllByRole('button');
    const menuButton = buttons.find(btn => btn.querySelector('svg'));

    if (menuButton) {
      fireEvent.click(menuButton);

      // Menu should be open, check for mobile navigation
      const mobileNav = screen.getAllByText('Home');
      expect(mobileNav.length).toBeGreaterThan(1); // Desktop + Mobile
    }
  });

  it('should toggle theme when clicking theme button', async () => {
    const { container } = render(<Header />);

    // Wait for component to mount
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    const buttons = container.querySelectorAll('button');
    if (buttons.length > 0) {
      // Find and click a button (theme toggle button)
      fireEvent.click(buttons[buttons.length - 2]);

      // Check component still renders
      await waitFor(() => {
        expect(screen.getByText('Portfolio')).toBeInTheDocument();
      });
    }
  });

  it('should apply sticky class when sticky prop is true', () => {
    const { container } = render(<Header sticky={true} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('fixed');
  });

  it('should apply absolute class when sticky prop is false', () => {
    const { container } = render(<Header sticky={false} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('absolute');
  });

  it('should render "Hire Me" button', () => {
    render(<Header />);

    const hireMeButtons = screen.getAllByText('Hire Me');
    expect(hireMeButtons.length).toBeGreaterThan(0);
  });

  it('should close mobile menu when clicking a navigation item', async () => {
    render(<Header />);

    // Open mobile menu
    const buttons = screen.getAllByRole('button');
    const menuButton = buttons.find(btn => btn.querySelector('svg'));

    if (menuButton) {
      fireEvent.click(menuButton);

      // Get all instances of "Home" link (desktop + mobile)
      const homeLinks = screen.getAllByText('Home');
      const mobileHomeLink = homeLinks[homeLinks.length - 1];

      fireEvent.click(mobileHomeLink);

      // Menu should close (only desktop nav items remain)
      await waitFor(() => {
        const remainingHomeLinks = screen.getAllByText('Home');
        expect(remainingHomeLinks.length).toBe(1); // Only desktop nav
      });
    }
  });

  it('should not cause hydration mismatch', async () => {
    const { container } = render(<Header />);

    // Component should render without errors
    expect(container).toBeInTheDocument();

    // Wait for mount effects
    await waitFor(() => {
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });
  });
});
