'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Sparkles, Code2, Rocket } from 'lucide-react';
import Link from 'next/link';

interface HeroBlockProps {
  headline: string;
  subheadline: string;
  description: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  showTypingEffect?: boolean;
  backgroundStyle?: 'gradient' | 'particles' | 'none';
  stats?: Array<{ value: string; label: string }>;
  preview?: boolean;
}

// Floating animation variants
const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const floatingDelayedVariants = {
  animate: {
    y: [10, -10, 10],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export function HeroBlock({
  headline,
  subheadline,
  description,
  ctaPrimary,
  ctaSecondary,
  showTypingEffect = true,
  backgroundStyle = 'gradient',
  stats = [
    { value: '3+', label: 'Years Experience' },
    { value: '20+', label: 'Projects Completed' },
    { value: '10+', label: 'Happy Clients' },
  ],
  preview = false,
}: HeroBlockProps) {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
      {/* Enhanced Background */}
      {backgroundStyle === 'gradient' && (
        <>
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />

          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

          {/* Glow effects */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          />
        </>
      )}

      {/* Floating decorative elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-10 hidden lg:block"
      >
        <div className="p-3 bg-primary/10 rounded-2xl backdrop-blur-sm border border-primary/20">
          <Code2 className="h-6 w-6 text-primary" />
        </div>
      </motion.div>

      <motion.div
        variants={floatingDelayedVariants}
        animate="animate"
        className="absolute top-40 right-20 hidden lg:block"
      >
        <div className="p-3 bg-accent/10 rounded-2xl backdrop-blur-sm border border-accent/20">
          <Rocket className="h-6 w-6 text-primary" />
        </div>
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-32 left-20 hidden lg:block"
      >
        <div className="p-3 bg-primary/10 rounded-2xl backdrop-blur-sm border border-primary/20">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
      </motion.div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={preview ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={preview ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">{subheadline}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={preview ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              {headline}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={preview ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={preview ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {ctaPrimary && (
              <Button asChild size="lg" className="group text-base px-8 h-12">
                <Link href={ctaPrimary.href}>
                  {ctaPrimary.label}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}

            {ctaSecondary && (
              <Button asChild variant="outline" size="lg" className="text-base px-8 h-12 group">
                <Link href={ctaSecondary.href}>
                  <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  {ctaSecondary.label}
                </Link>
              </Button>
            )}
          </motion.div>

          {/* Stats or trust indicators */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={preview ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 pt-8 border-t border-border/50"
            >
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
