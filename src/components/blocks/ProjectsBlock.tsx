'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  Github,
  ArrowRight,
  Folder,
  Sparkles,
  X,
  Calendar,
  Layers,
  Monitor,
  ChevronRight,
  Eye,
} from 'lucide-react';
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

// 3D Tilt Card Component
function TiltCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      <div
        style={{
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
        }}
        className="h-full"
      >
        {children}
      </div>
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-0 blur-xl transition-opacity duration-500 -z-10"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.1))',
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.div>
  );
}

// Animated gradient background for cards
function AnimatedGradient({ isHovered }: { isHovered: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 opacity-0 transition-opacity duration-500"
      style={{
        background: `
          radial-gradient(
            600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            hsl(var(--primary) / 0.15),
            transparent 40%
          )
        `,
      }}
      animate={{ opacity: isHovered ? 1 : 0 }}
    />
  );
}

// Project Detail Modal Component
function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full rounded-3xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </motion.button>

              <div className="h-full overflow-y-auto">
                <div className="grid lg:grid-cols-2 min-h-full">
                  {/* Left side - Visual */}
                  <div className="relative h-64 lg:h-full bg-gradient-to-br from-primary/20 via-primary/5 to-background overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0">
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `
                            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: '32px 32px',
                        }}
                        animate={{
                          backgroundPosition: ['0px 0px', '32px 32px'],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    </div>

                    {/* Floating decorations */}
                    <motion.div
                      className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-3xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-primary/10 blur-3xl"
                      animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                    />

                    {/* Project visual representation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="relative"
                      >
                        {/* Device frame mockup */}
                        <div className="relative w-72 h-48 md:w-96 md:h-64 rounded-xl bg-background/90 backdrop-blur border border-border/50 shadow-2xl overflow-hidden">
                          {/* Browser chrome */}
                          <div className="h-8 bg-muted/50 border-b border-border/50 flex items-center px-3 gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500/80" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                              <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="h-5 bg-background/80 rounded-md flex items-center px-2">
                                <span className="text-[10px] text-muted-foreground truncate">
                                  {project.links.demo || `${project.title.toLowerCase().replace(/\s+/g, '-')}.app`}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Content area */}
                          <div className="p-4 h-full bg-gradient-to-br from-primary/10 to-transparent">
                            <div className="space-y-3">
                              <div className="h-4 bg-primary/20 rounded w-3/4" />
                              <div className="h-3 bg-muted/50 rounded w-full" />
                              <div className="h-3 bg-muted/50 rounded w-5/6" />
                              <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className="h-16 bg-primary/10 rounded-lg" />
                                <div className="h-16 bg-primary/10 rounded-lg" />
                                <div className="h-16 bg-primary/10 rounded-lg" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Floating elements around device */}
                        <motion.div
                          className="absolute -top-4 -right-4 p-3 rounded-xl bg-background/90 backdrop-blur border border-border/50 shadow-lg"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Monitor className="h-5 w-5 text-primary" />
                        </motion.div>
                        <motion.div
                          className="absolute -bottom-2 -left-4 p-3 rounded-xl bg-background/90 backdrop-blur border border-border/50 shadow-lg"
                          animate={{ y: [0, 8, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <Layers className="h-5 w-5 text-primary" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Badges overlay */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {project.featured && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Badge className="bg-primary text-primary-foreground shadow-lg flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3" />
                            Featured
                          </Badge>
                        </motion.div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                          {project.category}
                        </Badge>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="p-6 md:p-8 lg:p-12 flex flex-col">
                    {/* Header */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-6"
                    >
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                        {project.title}
                      </h2>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {project.description}
                      </p>
                    </motion.div>

                    {/* Long description */}
                    {project.longDescription && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                      >
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Overview
                        </h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {project.longDescription}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Tech Stack */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-8"
                    >
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <motion.div
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                          >
                            <Badge
                              variant="outline"
                              className="px-3 py-1.5 text-sm bg-muted/30 hover:bg-primary/10 hover:border-primary/30 transition-all cursor-default"
                            >
                              {tag}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Action buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-wrap gap-3 pt-6 border-t border-border/50"
                    >
                      {project.links.demo && (
                        <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20 flex-1 sm:flex-none">
                          <Link href={project.links.demo} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                            View Live Demo
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      )}
                      {project.links.github && (
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="gap-2 flex-1 sm:flex-none"
                        >
                          <Link href={project.links.github} target="_blank">
                            <Github className="h-4 w-4" />
                            View Source Code
                          </Link>
                        </Button>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full pointer-events-none" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <>
      <section id="projects" className="py-20 md:py-32 px-4 scroll-mt-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container">
          <motion.div
            initial={preview ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Section Label */}
            <motion.div
              initial={preview ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
            >
              <Folder className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Portfolio</span>
            </motion.div>

            <motion.h2
              initial={preview ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={preview ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
            >
              Explore some of my recent work and side projects
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial={preview ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"
            style={{ perspective: '1000px' }}
          >
            {displayProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                variants={itemVariants}
                index={index}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </motion.div>

          {showViewAll && (
            <motion.div
              initial={preview ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center mt-16"
            >
              <Button asChild size="lg" className="group relative overflow-hidden">
                <Link href="/projects">
                  <span className="relative z-10 flex items-center">
                    View All Projects
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-primary/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

// Separate ProjectCard component for better organization
function ProjectCard({
  project,
  variants,
  index,
  onClick,
}: {
  project: Project;
  variants: any;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on links
    if ((e.target as HTMLElement).closest('a')) return;
    onClick();
  };

  return (
    <motion.div variants={variants} className="group relative">
      <TiltCard className="relative cursor-pointer" onClick={handleCardClick}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative h-full rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
        >
          {/* Animated gradient background */}
          <AnimatedGradient isHovered={isHovered} />

          {/* Project Image / Visual Area */}
          <div className="relative aspect-[16/10] overflow-hidden">
            {/* Gradient background */}
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg,
                  hsl(var(--primary) / 0.15) 0%,
                  hsl(var(--primary) / 0.05) 50%,
                  hsl(var(--primary) / 0.1) 100%)`,
              }}
            />

            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Floating decoration elements */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/10 blur-xl"
              animate={{
                scale: isHovered ? 1.5 : 1,
                opacity: isHovered ? 0.8 : 0.4,
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Featured badge */}
            {project.featured && (
              <motion.div
                className="absolute top-4 right-4 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center gap-1.5 px-3 py-1">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </Badge>
              </motion.div>
            )}

            {/* Category badge */}
            <motion.div
              className="absolute bottom-4 left-4 z-10"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                variant="secondary"
                className="bg-background/90 backdrop-blur-md border border-border/50 shadow-lg"
              >
                {project.category}
              </Badge>
            </motion.div>

            {/* Hover overlay with action buttons */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-3 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
              <div className="relative flex items-center gap-3">
                {/* View Details button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    className="shadow-xl bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick();
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </motion.div>
                {project.links.demo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <Button
                      asChild
                      size="sm"
                      className="shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                    >
                      <Link href={project.links.demo} target="_blank" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </Link>
                    </Button>
                  </motion.div>
                )}
                {project.links.github && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                  >
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="bg-background/90 backdrop-blur-sm shadow-xl hover:bg-background transition-colors"
                    >
                      <Link href={project.links.github} target="_blank" onClick={(e) => e.stopPropagation()}>
                        <Github className="h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Content area */}
          <div className="p-6 space-y-4">
            {/* Title with hover effect */}
            <motion.h3
              className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {project.title}
            </motion.h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {project.description}
            </p>

            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.tags.slice(0, 4).map((tag, tagIndex) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * tagIndex }}
                >
                  <Badge
                    variant="outline"
                    className="text-xs font-normal bg-muted/50 hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-default"
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
              {project.tags.length > 4 && (
                <Badge variant="outline" className="text-xs font-normal bg-muted/50">
                  +{project.tags.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Bottom gradient line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Click indicator */}
          <motion.div
            className="absolute bottom-4 right-4 text-xs text-muted-foreground/60 flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            Click for details
            <ChevronRight className="h-3 w-3" />
          </motion.div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
