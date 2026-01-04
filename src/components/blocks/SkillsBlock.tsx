'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkillsBlockProps {
  title?: string;
  layout?: 'grid' | 'carousel' | 'list';
  showProficiency?: boolean;
  categories?: Array<{
    name: string;
    skills: Array<{
      name: string;
      icon?: string;
      imageUrl?: string;
      proficiency?: number;
    }>;
  }>;
  preview?: boolean;
}

export function SkillsBlock({
  categories = [],
  preview = false,
}: SkillsBlockProps) {
  // Flatten all skills from all categories into a single array
  const allSkills = categories.flatMap((category) =>
    category.skills.map((skill) => ({
      ...skill,
      category: category.name,
    }))
  );

  return (
    <section className="py-16 md:py-24 px-4 bg-zinc-950 relative overflow-hidden">
      <div className="container relative">
        {/* Section Label */}
        <motion.div
          initial={preview ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em]">
            STACK
          </span>
        </motion.div>

        {/* Skills Row */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          {allSkills.map((skill, index) => (
            <motion.div
              key={`${skill.category}-${skill.name}`}
              initial={preview ? false : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              {/* Skill Icon/Image */}
              <div className="flex items-center justify-center h-8 w-8 md:h-10 md:w-10 grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer">
                {skill.imageUrl ? (
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    title={skill.name}
                    className="w-full h-full object-contain"
                  />
                ) : skill.icon ? (
                  <span className="text-2xl md:text-3xl" title={skill.name}>
                    {skill.icon}
                  </span>
                ) : (
                  <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-sm font-bold text-zinc-400">
                      {skill.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="text-xs text-zinc-400 whitespace-nowrap">
                  {skill.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
