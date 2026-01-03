import React from 'react';
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Next.js link
jest.mock('next/link', () => {
  return function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return React.createElement('a', { href }, children);
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: function MotionDiv({ children, ...props }: any) {
        return React.createElement('div', props, children);
      },
      p: function MotionP({ children, ...props }: any) {
        return React.createElement('p', props, children);
      },
      h1: function MotionH1({ children, ...props }: any) {
        return React.createElement('h1', props, children);
      },
      section: function MotionSection({ children, ...props }: any) {
        return React.createElement('section', props, children);
      },
    },
    AnimatePresence: function AnimatePresence({ children }: { children: React.ReactNode }) {
      return children;
    },
  };
});
