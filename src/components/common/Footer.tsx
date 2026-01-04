'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, Heart, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterProps {
  name?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  showBackToTop?: boolean;
}

export function Footer({
  name = 'John Doe',
  social,
  showBackToTop = true,
}: FooterProps) {
  const [currentYear, setCurrentYear] = useState(2024);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, href: social?.github, label: 'GitHub' },
    { icon: Linkedin, href: social?.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: social?.twitter, label: 'Twitter' },
    { icon: Mail, href: social?.email ? `mailto:${social.email}` : undefined, label: 'Email' },
  ].filter(link => link.href);

  const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Experience', href: '/experience' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="relative bg-muted/30 border-t border-border">
      {/* Back to Top Button */}
      {showBackToTop && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={scrollToTop}
              className="rounded-full shadow-lg bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ArrowUp className="h-5 w-5" />
              <span className="sr-only">Back to top</span>
            </Button>
          </motion.div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h3 className="text-xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Full-stack developer passionate about building exceptional digital experiences
              that make a difference.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.div key={label} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                    <Link href={href!} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{label}</span>
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Let&apos;s build something amazing together.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © {currentYear} {name}. Made with{' '}
              <Heart className="h-4 w-4 text-red-500 fill-red-500" /> in Vietnam
            </p>
            <p className="text-xs text-muted-foreground">
              Built with Next.js, TypeScript & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
