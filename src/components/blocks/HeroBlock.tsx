'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Download,
  Sparkles,
  Code2,
  Rocket,
  Zap,
  Leaf,
  Sun,
  Mountain,
  Coffee,
  Heart,
} from 'lucide-react';
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

// Interactive greeting messages for different times of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', icon: Coffee, emoji: 'sunrise' };
  if (hour < 17) return { text: 'Good Afternoon', icon: Sun, emoji: 'sunny' };
  if (hour < 21) return { text: 'Good Evening', icon: Mountain, emoji: 'sunset' };
  return { text: 'Good Night', icon: Sparkles, emoji: 'stars' };
};

// Floating elements data with static class names for Tailwind
const floatingElements = [
  { Icon: Code2, position: 'top-32 left-[10%]', delay: 0, bgClass: 'bg-primary/10 hover:bg-primary/20', borderClass: 'border-primary/20', iconClass: 'text-primary' },
  { Icon: Rocket, position: 'top-40 right-[15%]', delay: 0.5, bgClass: 'bg-accent/10 hover:bg-accent/20', borderClass: 'border-accent/20', iconClass: 'text-accent' },
  { Icon: Leaf, position: 'bottom-40 left-[15%]', delay: 1, bgClass: 'bg-secondary/10 hover:bg-secondary/20', borderClass: 'border-secondary/20', iconClass: 'text-secondary' },
  { Icon: Zap, position: 'bottom-32 right-[10%]', delay: 1.5, bgClass: 'bg-accent/10 hover:bg-accent/20', borderClass: 'border-accent/20', iconClass: 'text-accent' },
];

// Interactive card component
function InteractiveCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-50, 50], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function HeroBlock({
  headline,
  subheadline,
  description,
  ctaPrimary,
  ctaSecondary,
  backgroundStyle = 'gradient',
  stats = [
    { value: '3+', label: 'Years Experience' },
    { value: '20+', label: 'Projects Completed' },
    { value: '10+', label: 'Happy Clients' },
  ],
  preview = false,
}: HeroBlockProps) {
  const [greeting, setGreeting] = useState(getGreeting());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const GreetingIcon = greeting.icon;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Nature-Inspired Background */}
      {backgroundStyle === 'gradient' && (
        <>
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />

          {/* Aurora-like gradient overlays - using CSS variables */}
          <motion.div
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_20%_20%,var(--glow-primary),transparent_50%)]"
          />
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_80%_80%,var(--glow-secondary),transparent_50%)]"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_50%_50%,var(--glow-accent),transparent_40%)]"
          />

          {/* Organic mesh pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Interactive glow that follows mouse */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none bg-[radial-gradient(circle,var(--glow-primary),transparent_60%)]"
            animate={{
              x: mousePosition.x - 300,
              y: mousePosition.y - 300,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          />

          {/* Breathing glow orbs */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.3, 1, 1.3], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 1.4, 1.1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 right-1/3 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
          />
        </>
      )}

      {/* Floating decorative elements */}
      {floatingElements.map(({ Icon, position, delay, bgClass, borderClass, iconClass }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.5 }}
          className={`absolute ${position} hidden lg:block`}
        >
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
            transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.2, rotate: 10 }}
            className={`p-4 ${bgClass} rounded-2xl backdrop-blur-sm border ${borderClass} cursor-pointer transition-colors`}
          >
            <Icon className={`h-6 w-6 ${iconClass}`} />
          </motion.div>
        </motion.div>
      ))}

      <div className="container relative z-10 px-4">
        <motion.div
          initial={preview ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-5xl mx-auto"
        >
          {/* Interactive Greeting Card */}
          <InteractiveCard className="mb-8">
            <motion.div
              initial={preview ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5"
            >
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <GreetingIcon className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="text-sm font-medium bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                {greeting.text}! Welcome to my portfolio
              </span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-4 w-4 text-primary/60" />
              </motion.span>
            </motion.div>
          </InteractiveCard>

          {/* Status Badge - Active and Interactive */}
          <motion.div
            initial={preview ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 group"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors">{subheadline}</span>
            </motion.div>
          </motion.div>

          {/* Main Headline with gradient animation */}
          <motion.div
            initial={preview ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <motion.span
                className="inline-block bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 200%' }}
              >
                {headline}
              </motion.span>
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-4 h-1.5 w-32 mx-auto rounded-full bg-gradient-to-r from-primary via-accent to-secondary"
            />
          </motion.div>

          {/* Description with highlight */}
          <motion.p
            initial={preview ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-center"
          >
            {description}
          </motion.p>

          {/* CTA Buttons with enhanced styling */}
          <motion.div
            initial={preview ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {ctaPrimary && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  size="lg"
                  className="group text-base px-8 h-14 rounded-2xl bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30"
                >
                  <Link href={ctaPrimary.href} className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    {ctaPrimary.label}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            )}

            {ctaSecondary && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group text-base px-8 h-14 rounded-2xl border-2 border-secondary/30 hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-300"
                >
                  <Link href={ctaSecondary.href} className="flex items-center gap-3">
                    <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {ctaSecondary.label}
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Interactive Stats Cards */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={preview ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {stats.map((stat, index) => (
                  <InteractiveCard key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="relative px-8 py-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <motion.div
                          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {stat.value}
                        </motion.div>
                        <div className="text-sm text-muted-foreground mt-1 font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  </InteractiveCard>
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
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground/60 font-medium tracking-wider uppercase">
            Scroll to explore
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/20 flex justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 bg-primary/60 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
