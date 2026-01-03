'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Code2, Palette, Zap, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface AboutBlockProps {
  showImage?: boolean;
  imagePosition?: 'left' | 'right';
  preview?: boolean;
}

const highlights = [
  { icon: Code2, title: 'Clean Code', description: 'Writing maintainable, scalable code' },
  { icon: Palette, title: 'UI/UX Focus', description: 'Creating beautiful user experiences' },
  { icon: Zap, title: 'Performance', description: 'Optimizing for speed and efficiency' },
  { icon: Users, title: 'Collaboration', description: 'Working effectively in teams' },
];

const skills = [
  'React & Next.js',
  'TypeScript',
  'Node.js',
  '.NET Core',
  'PostgreSQL',
  'AWS & Azure',
];

export function AboutBlock({
  showImage = true,
  imagePosition = 'right',
  preview = false,
}: AboutBlockProps) {
  return (
    <section className="py-20 md:py-32 px-4 bg-muted/20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={preview ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={imagePosition === 'right' ? 'order-1' : 'order-2'}
          >
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">About Me</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Passionate Developer,{' '}
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Problem Solver
              </span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                I&apos;m a passionate full-stack developer with over 3 years of experience
                building scalable web applications and beautiful user interfaces.
              </p>
              <p>
                My expertise lies in React, Next.js, .NET Core, and cloud technologies.
                I love creating intuitive, user-friendly applications that solve real-world problems
                and deliver exceptional user experiences.
              </p>
              <p>
                When I&apos;m not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with the developer community.
              </p>
            </div>

            {/* Quick Skills List */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={preview ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium">{skill}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="group">
                <Link href="/experience">
                  View Experience
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </motion.div>

          {showImage && (
            <motion.div
              initial={preview ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={imagePosition === 'right' ? 'order-2' : 'order-1'}
            >
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-primary/20 to-accent/20 border border-border/50">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[20px_20px]" />

                  {/* Placeholder for profile image */}
                  <div className="absolute inset-8 rounded-xl bg-muted flex items-center justify-center">
                    <span className="text-6xl">👨‍💻</span>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  initial={preview ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-6 -left-6 p-4 bg-background rounded-xl shadow-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">3+</div>
                      <div className="text-xs text-muted-foreground">Years Exp.</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={preview ? false : { opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-6 -right-6 p-4 bg-background rounded-xl shadow-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Code2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">20+</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Highlight Cards */}
              <div className="grid grid-cols-2 gap-4 mt-12">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={preview ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <item.icon className="h-5 w-5 text-primary mb-2" />
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
