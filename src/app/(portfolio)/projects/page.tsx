'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Folder,
  Search,
  X,
  Grid3X3,
  LayoutList,
  Sparkles,
  ExternalLink,
  Github,
  Eye,
  ChevronRight,
  Filter,
  ArrowLeft,
  Layers,
  Monitor,
} from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/types/config';

// Fetch projects from API
async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/config');
  const config = await res.json();
  return config.data?.projects || [];
}

// Project Card Component (matching the one in ProjectsBlock)
function ProjectCard({
  project,
  index,
  onClick,
  layout,
}: {
  project: Project;
  index: number;
  onClick: () => void;
  layout: 'grid' | 'list';
}) {
  const [isHovered, setIsHovered] = useState(false);

  if (layout === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.05 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className="group relative cursor-pointer"
      >
        <div className="relative flex gap-6 p-6 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
          {/* Left - Visual */}
          <div className="relative w-48 h-32 rounded-xl overflow-hidden shrink-0 hidden sm:block">
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg,
                  hsl(var(--primary) / 0.15) 0%,
                  hsl(var(--primary) / 0.05) 50%,
                  hsl(var(--primary) / 0.1) 100%)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '16px 16px',
              }}
            />
            {project.featured && (
              <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5">
                <Sparkles className="h-2.5 w-2.5 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Right - Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <Badge variant="secondary" className="mb-2 text-xs">
                  {project.category}
                </Badge>
                <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </div>
              <motion.div
                className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
                animate={{ x: isHovered ? 0 : 10 }}
              >
                {project.links.demo && (
                  <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                    <Link href={project.links.demo} target="_blank" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {project.links.github && (
                  <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                    <Link href={project.links.github} target="_blank" onClick={(e) => e.stopPropagation()}>
                      <Github className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </motion.div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal bg-muted/30">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 5 && (
                <Badge variant="outline" className="text-xs font-normal bg-muted/30">
                  +{project.tags.length - 5}
                </Badge>
              )}
            </div>
          </div>

          {/* Hover indicator */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    );
  }

  // Grid layout card
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="relative h-full rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
        {/* Project Image / Visual Area */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg,
                hsl(var(--primary) / 0.15) 0%,
                hsl(var(--primary) / 0.05) 50%,
                hsl(var(--primary) / 0.1) 100%)`,
            }}
          />
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

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/10 blur-xl"
            animate={{
              scale: isHovered ? 1.5 : 1,
              opacity: isHovered ? 0.8 : 0.4,
            }}
            transition={{ duration: 0.5 }}
          />

          {project.featured && (
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center gap-1.5 px-3 py-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            </div>
          )}

          <div className="absolute bottom-4 left-4 z-10">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-md border border-border/50 shadow-lg">
              {project.category}
            </Badge>
          </div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-3 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
            <div className="relative flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                transition={{ delay: 0.05, duration: 0.3 }}
              >
                <Button size="sm" variant="secondary" className="shadow-xl bg-background/90 backdrop-blur-sm">
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
                    className="shadow-xl shadow-primary/20"
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
                    className="bg-background/90 backdrop-blur-sm shadow-xl"
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
          <motion.h3
            className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary"
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h3>

          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs font-normal bg-muted/50 hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-default"
              >
                {tag}
              </Badge>
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
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

// Project Detail Modal
function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full rounded-3xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
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

                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="relative"
                      >
                        <div className="relative w-72 h-48 md:w-96 md:h-64 rounded-xl bg-background/90 backdrop-blur border border-border/50 shadow-2xl overflow-hidden">
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
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {project.longDescription}
                        </p>
                      </motion.div>
                    )}

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

                    <div className="flex-1" />

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
                        <Button asChild size="lg" variant="outline" className="gap-2 flex-1 sm:flex-none">
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

              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full pointer-events-none" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      setFilteredProjects(data);
      const cats = Array.from(new Set(data.map((p) => p.category)));
      setCategories(cats);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, selectedCategory, searchQuery]);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  }, []);

  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <>
      <main className="min-h-screen relative overflow-hidden">
        {/* Background decorations */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Hero Section */}
        <section className="pt-24 pb-12 px-4">
          <div className="container max-w-7xl mx-auto">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>

            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
              >
                <Folder className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Portfolio</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
              >
                My Projects
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8"
              >
                Explore my portfolio of work across different technologies and domains
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-8 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{projects.length}</strong> Projects
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{featuredCount}</strong> Featured
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{categories.length}</strong> Categories
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-16 z-30 py-4 px-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="container max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative w-full md:w-80"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>

              {/* Category filters */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto justify-start md:justify-center"
              >
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="rounded-full whitespace-nowrap"
                >
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  All
                  <Badge variant="secondary" className="ml-2 bg-background/50">
                    {projects.length}
                  </Badge>
                </Button>
                {categories.map((category) => {
                  const count = projects.filter((p) => p.category === category).length;
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="rounded-full whitespace-nowrap"
                    >
                      {category}
                      <Badge variant="secondary" className="ml-2 bg-background/50">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </motion.div>

              {/* Layout toggle */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1 p-1 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm"
              >
                <button
                  onClick={() => setLayout('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    layout === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={`p-2 rounded-md transition-colors ${
                    layout === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Grid/List */}
        <section className="py-12 px-4">
          <div className="container max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-2xl bg-muted/50 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={
                  layout === 'grid'
                    ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col gap-4'
                }
              >
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      onClick={() => handleProjectClick(project)}
                      layout={layout}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Results count */}
            {!isLoading && filteredProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-12 text-sm text-muted-foreground"
              >
                Showing {filteredProjects.length} of {projects.length} projects
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
