'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Code2,
  Database,
  Cloud,
  Wrench,
  Layers,
  Smartphone
} from 'lucide-react';

interface SkillsBlockProps {
  title?: string;
  layout?: 'grid' | 'carousel' | 'list';
  showProficiency?: boolean;
  categories?: Array<{
    name: string;
    skills: Array<{
      name: string;
      icon?: string;
      proficiency?: number;
    }>;
  }>;
  preview?: boolean;
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ElementType> = {
  'Frontend': Code2,
  'Backend': Database,
  'Cloud': Cloud,
  'DevOps': Cloud,
  'Tools': Wrench,
  'Mobile': Smartphone,
  'Frameworks': Layers,
};

export function SkillsBlock({
  title = 'Skills',
  layout = 'grid',
  showProficiency = true,
  categories = [],
  preview = false,
}: SkillsBlockProps) {
  return (
    <section className="py-20 md:py-32 px-4 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[32px_32px]" />

      <div className="container relative">
        <motion.div
          initial={preview ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Section Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Tech Stack</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[category.name] || Code2;

            return (
              <motion.div
                key={category.name}
                initial={preview ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 group bg-background/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={preview ? false : { opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.1) + (skillIndex * 0.05) }}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-medium">{skill.name}</span>
                          {showProficiency && skill.proficiency && (
                            <span className="text-xs font-medium text-primary">
                              {skill.proficiency}%
                            </span>
                          )}
                        </div>
                        {showProficiency && skill.proficiency && (
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: (index * 0.1) + (skillIndex * 0.05) }}
                              className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Skills Badges */}
        <motion.div
          initial={preview ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">Also experienced with</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Git', 'Docker', 'REST APIs', 'GraphQL', 'CI/CD', 'Agile', 'TDD'].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-sm bg-background border border-border rounded-full hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
