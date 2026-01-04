'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Github, Linkedin, Moon, Sun, Sparkles } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

interface HeaderProps {
  navItems?: NavItem[];
  sticky?: boolean;
  transparent?: boolean;
  social?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export function Header({
  navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Experience', href: '/experience' },
    { label: 'Contact', href: '/contact' },
  ],
  sticky = true,
  transparent = false,
  social,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <header
      className={`${sticky ? 'fixed' : 'absolute'} top-4 left-4 right-4 z-50 transition-all duration-500`}
    >
      {/* Centered Floating Navbar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-4xl mx-auto"
      >
        <nav
          className={`
            flex items-center justify-between gap-2 px-3 py-2 rounded-2xl
            transition-all duration-300
            ${scrolled || !transparent
              ? 'bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5'
              : 'bg-background/40 backdrop-blur-md border border-border/30'
            }
          `}
        >
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 px-2 shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">T</span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 -z-10 blur-sm"
                />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-1 bg-muted/50 rounded-xl px-1 py-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-background/80 group"
                >
                  {item.label}
                  <motion.span
                    className="absolute inset-x-2 -bottom-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions - Right */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {social?.github && (
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted" asChild>
                <Link href={social.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
            )}
            {social?.linkedin && (
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted" asChild>
                <Link href={social.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-muted"
              onClick={toggleTheme}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.div>
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              asChild
              size="sm"
              className="ml-1 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
            >
              <Link href="/contact" className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Hire Me</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </Button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl overflow-hidden"
            >
              <nav className="p-3 flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-border/50">
                  {social?.github && (
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" asChild>
                      <Link href={social.github} target="_blank">
                        <Github className="h-5 w-5" />
                      </Link>
                    </Button>
                  )}
                  {social?.linkedin && (
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" asChild>
                      <Link href={social.linkedin} target="_blank">
                        <Linkedin className="h-5 w-5" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={toggleTheme}>
                    {mounted && isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="ml-auto rounded-xl bg-gradient-to-r from-primary to-primary/80"
                  >
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Hire Me
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
