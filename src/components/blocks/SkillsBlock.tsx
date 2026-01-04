'use client';

import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { getIconById } from '@/components/icons/TechIcons';

interface SkillsBlockProps {
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'carousel' | 'list';
  showProficiency?: boolean;
  categories?: Array<{
    name: string;
    skills: Array<{
      name: string;
      icon?: string;
      iconId?: string;
      imageUrl?: string;
      proficiency?: number;
    }>;
  }>;
  preview?: boolean;
}

// Render icon helper - checks for iconId first, then imageUrl, then emoji icon
function renderSkillIcon(skill: { name: string; icon?: string; iconId?: string; imageUrl?: string }, size: 'sm' | 'md' | 'lg' = 'md') {
  const sizeClasses = {
    sm: 'w-6 h-6 md:w-7 md:h-7',
    md: 'w-10 h-10 md:w-12 md:h-12',
    lg: 'w-14 h-14 md:w-16 md:h-16',
  };
  const textSizes = {
    sm: 'text-xl md:text-2xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
  };

  // Try iconId first (from our icon library)
  if (skill.iconId) {
    const techIcon = getIconById(skill.iconId);
    if (techIcon) {
      const IconComponent = techIcon.icon;
      return (
        <div className={`${sizeClasses[size]} flex items-center justify-center`}>
          <IconComponent size={size === 'sm' ? 24 : size === 'md' ? 40 : 56} />
        </div>
      );
    }
  }

  // Then try imageUrl
  if (skill.imageUrl) {
    return (
      <img
        src={skill.imageUrl}
        alt={skill.name}
        className={`${sizeClasses[size]} object-contain`}
      />
    );
  }

  // Then try emoji icon
  if (skill.icon) {
    return (
      <span className={textSizes[size]}>
        {skill.icon}
      </span>
    );
  }

  // Fallback to first letter
  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center`}>
      <span className="text-xl md:text-2xl font-bold text-muted-foreground">
        {skill.name.charAt(0)}
      </span>
    </div>
  );
}

// Skill card component with hover effects
function SkillCard({
  skill,
  index,
  preview,
}: {
  skill: { name: string; icon?: string; iconId?: string; imageUrl?: string; category: string };
  index: number;
  preview: boolean;
}) {
  return (
    <motion.div
      initial={preview ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.03,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="relative flex flex-col items-center p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80 transition-all duration-500 cursor-pointer overflow-hidden">
        {/* Gradient glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        </div>

        {/* Animated border gradient */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-sm" />
        </div>

        {/* Icon container */}
        <motion.div
          className="relative z-10 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mb-4 group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
        >
          <div className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:drop-shadow-[0_0_12px_var(--glow-primary)]">
            {renderSkillIcon(skill, 'lg')}
          </div>
        </motion.div>

        {/* Skill name */}
        <span className="relative z-10 text-sm md:text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center">
          {skill.name}
        </span>

        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-foreground/5 to-transparent group-hover:left-full transition-all duration-1000 ease-in-out" />
        </div>
      </div>
    </motion.div>
  );
}

// Marquee row for infinite scroll effect
function MarqueeRow({
  skills,
  direction = 'left',
  speed = 30,
}: {
  skills: Array<{ name: string; icon?: string; iconId?: string; imageUrl?: string; category: string }>;
  direction?: 'left' | 'right';
  speed?: number;
}) {
  return (
    <div className="relative flex overflow-hidden py-4 group/marquee">
      <motion.div
        className="flex gap-4 md:gap-6"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        style={{ willChange: 'transform' }}
      >
        {/* Double the items for seamless loop */}
        {[...skills, ...skills].map((skill, index) => (
          <motion.div
            key={`${skill.name}-${index}`}
            whileHover={{ scale: 1.1, y: -4 }}
            className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-full bg-card/80 border border-border hover:border-primary/50 hover:bg-card transition-all duration-300 cursor-pointer group/item"
          >
            <div className="grayscale-[30%] group-hover/item:grayscale-0 transition-all duration-300">
              {renderSkillIcon(skill, 'sm')}
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover/item:text-foreground transition-colors whitespace-nowrap">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export function SkillsBlock({
  title = 'Tech Stack',
  subtitle = 'Technologies I work with',
  categories = [],
  preview = false,
}: SkillsBlockProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Flatten all skills
  const allSkills = categories.flatMap((category) =>
    category.skills.map((skill) => ({
      ...skill,
      category: category.name,
    }))
  );

  // Split skills for marquee rows
  const midPoint = Math.ceil(allSkills.length / 2);
  const firstRow = allSkills.slice(0, midPoint);
  const secondRow = allSkills.slice(midPoint);

  // For parallax scroll effect on title
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative py-20 md:py-32 bg-section-dark overflow-hidden scroll-mt-24"
    >
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <motion.div
          style={{ y: preview ? 0 : titleY }}
          className="text-center mb-16"
        >
          <motion.div
            initial={preview ? false : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {title}
            </span>
          </motion.div>

          <motion.h2
            initial={preview ? false : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Skills & Technologies
          </motion.h2>

          <motion.p
            initial={preview ? false : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Marquee section - visible on all screens */}
        <div className="mb-16 -mx-4 md:mx-0">
          <MarqueeRow skills={firstRow} direction="left" speed={40} />
          {secondRow.length > 0 && (
            <MarqueeRow skills={secondRow} direction="right" speed={35} />
          )}
        </div>

        {/* Grid section */}
        <motion.div
          initial={preview ? false : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Category-based grid */}
          {categories.length > 0 && (
            <div className="space-y-12">
              {categories.map((category, catIndex) => (
                <motion.div
                  key={category.name}
                  initial={preview ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  {/* Category label */}
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      {category.name}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                  </div>

                  {/* Skills grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillCard
                        key={skill.name}
                        skill={{ ...skill, category: category.name }}
                        index={skillIndex}
                        preview={preview}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
