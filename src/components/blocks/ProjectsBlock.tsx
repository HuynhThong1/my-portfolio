'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, ArrowRight, Folder } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/types/config';

interface ProjectsBlockProps {
  title?: string;
  projects: Project[];
  maxItems?: number;
  showViewAll?: boolean;
  layout?: 'cards' | 'list' | 'masonry';
  preview?: boolean;
}

export function ProjectsBlock({
  title = 'Projects',
  projects = [],
  maxItems,
  showViewAll = false,
  layout = 'cards',
  preview = false,
}: ProjectsBlockProps) {
  const displayProjects = maxItems ? projects.slice(0, maxItems) : projects;

  return (
    <section className="py-20 md:py-32 px-4">
      <div className="container">
        <motion.div
          initial={preview ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Section Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <Folder className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Portfolio</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore some of my recent work and side projects
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={preview ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden bg-background/50 backdrop-blur-sm">
                {/* Project Image */}
                <div className="relative aspect-video bg-linear-to-br from-primary/10 to-accent/10 overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[16px_16px]" />

                  {/* Placeholder/Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                      {project.category}
                    </Badge>
                  </div>

                  {/* Hover overlay with links */}
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    {project.links.demo && (
                      <Button asChild size="sm" className="shadow-lg">
                        <Link href={project.links.demo} target="_blank">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                    {project.links.github && (
                      <Button asChild size="sm" variant="outline" className="shadow-lg bg-background">
                        <Link href={project.links.github} target="_blank">
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs font-normal">
                        +{project.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {showViewAll && (
          <motion.div
            initial={preview ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button asChild size="lg" variant="outline" className="group">
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
