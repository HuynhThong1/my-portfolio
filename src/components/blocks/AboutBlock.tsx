'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Code2, Palette, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import Three.js component to avoid SSR issues
const FloatingShapesBackground = dynamic(
  () => import('@/components/three/FloatingShapes').then((mod) => mod.FloatingShapesBackground),
  { ssr: false }
);

interface AboutBlockProps {
  // Content
  sectionLabel?: string;
  title?: string;
  titleHighlight?: string;
  description?: string[];
  // Skills
  skills?: Array<{ name: string; icon?: string }>;
  // Stats
  yearsExperience?: number;
  projectsCount?: number;
  // Highlights
  highlights?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  // Display options
  showImage?: boolean;
  showThreeBackground?: boolean;
  imagePosition?: 'left' | 'right';
  profileEmoji?: string;
  preview?: boolean;
}

const defaultHighlights = [
  { icon: 'code', title: 'Clean Code', description: 'Writing maintainable, scalable code' },
  { icon: 'palette', title: 'UI/UX Focus', description: 'Creating beautiful user experiences' },
];

const defaultSkills = [
  { name: 'React & Next.js' },
  { name: 'TypeScript' },
  { name: 'Node.js' },
  { name: '.NET Core' },
  { name: 'PostgreSQL' },
  { name: 'AWS & Azure' },
];

const defaultDescription = [
  "I'm a passionate full-stack developer with over 3 years of experience building scalable web applications and beautiful user interfaces.",
  "My expertise lies in React, Next.js, .NET Core, and cloud technologies. I love creating intuitive, user-friendly applications that solve real-world problems and deliver exceptional user experiences.",
  "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.",
];

const iconMap = {
  code: Code2,
  palette: Palette,
  zap: Zap,
} as const;

type IconKey = keyof typeof iconMap;

export function AboutBlock({
  sectionLabel = 'About Me',
  title = 'Passionate Developer,',
  titleHighlight = 'Problem Solver',
  description = defaultDescription,
  skills = defaultSkills,
  yearsExperience = 3,
  projectsCount = 20,
  highlights = defaultHighlights,
  showImage = true,
  showThreeBackground = true,
  imagePosition = 'right',
  profileEmoji = '👨‍💻',
  preview = false,
}: AboutBlockProps) {
  return (
    <section className="relative py-20 md:py-32 px-4 bg-zinc-950 overflow-hidden">
      {/* Three.js Background */}
      {showThreeBackground && (
        <Suspense fallback={null}>
          <FloatingShapesBackground />
        </Suspense>
      )}

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-zinc-950/80 pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={preview ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={imagePosition === 'right' ? 'order-1' : 'order-2'}
          >
            {/* Section Label */}
            <motion.div
              initial={preview ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {sectionLabel}
              </span>
            </motion.div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white leading-tight">
              {title}
              <br />
              <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            </h2>

            {/* Description */}
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              {description.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={preview ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className={index === 0 ? 'text-lg text-zinc-300' : ''}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={preview ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center gap-2 group"
                >
                  <CheckCircle2 className="h-4 w-4 text-violet-500 shrink-0 group-hover:text-violet-400 transition-colors" />
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={preview ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Button
                asChild
                size="lg"
                className="group bg-white text-zinc-900 hover:bg-zinc-100"
              >
                <Link href="/experience">
                  View Experience
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600"
              >
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual Side */}
          {showImage && (
            <motion.div
              initial={preview ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={imagePosition === 'right' ? 'order-2' : 'order-1'}
            >
              <div className="relative">
                {/* Main Visual Container */}
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                  {/* Grid pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Profile emoji/image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-8xl md:text-9xl"
                    >
                      {profileEmoji}
                    </motion.div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 to-transparent" />
                </div>

                {/* Years Experience Card */}
                <motion.div
                  initial={preview ? false : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6"
                >
                  <div className="flex items-center gap-3 px-5 py-4 bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-800 shadow-xl">
                    <div className="p-2.5 bg-violet-500/20 rounded-xl">
                      <Zap className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">{yearsExperience}+</div>
                      <div className="text-xs text-zinc-500 font-medium">Years Exp.</div>
                    </div>
                  </div>
                </motion.div>

                {/* Projects Count Card */}
                <motion.div
                  initial={preview ? false : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-4 -right-4 md:-top-6 md:-right-6"
                >
                  <div className="flex items-center gap-3 px-5 py-4 bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-800 shadow-xl">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl">
                      <Code2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">{projectsCount}+</div>
                      <div className="text-xs text-zinc-500 font-medium">Projects</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Highlight Cards */}
              <div className="grid grid-cols-2 gap-4 mt-8 md:mt-12">
                {highlights.slice(0, 2).map((item, index) => {
                  const iconKey = (item.icon || 'code') as IconKey;
                  const IconComponent = iconMap[iconKey] || Code2;
                  return (
                    <motion.div
                      key={item.title}
                      initial={preview ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all group"
                    >
                      <div className="p-2.5 bg-zinc-800 rounded-xl w-fit mb-3 group-hover:bg-violet-500/20 transition-colors">
                        <IconComponent className="h-5 w-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                      </div>
                      <div className="font-semibold text-white mb-1">{item.title}</div>
                      <div className="text-sm text-zinc-500">{item.description}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
