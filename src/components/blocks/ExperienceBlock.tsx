'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Experience } from '@/types/config';

interface ExperienceBlockProps {
  title?: string;
  layout?: 'timeline' | 'detailed' | 'list';
  experiences?: Experience[];
  preview?: boolean;
}

export function ExperienceBlock({
  title = 'Experience',
  layout = 'timeline',
  experiences = [],
  preview = false,
}: ExperienceBlockProps) {
  return (
    <section className="py-20 px-4">
      <div className="container">
        <motion.div
          initial={preview ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={preview ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 pb-8 border-l-2 border-muted last:border-l-0 last:pb-0"
            >
              <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary -translate-x-[9px]" />

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{exp.position}</h3>
                <p className="text-muted-foreground font-medium">{exp.company}</p>
                <p className="text-sm text-muted-foreground">
                  {exp.location} • {exp.startDate} - {exp.endDate}
                </p>

                <div className="prose prose-sm max-w-none text-muted-foreground mt-4">
                  {exp.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
