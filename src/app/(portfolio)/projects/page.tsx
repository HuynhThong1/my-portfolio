import { getConfig } from '@/lib/config-loader';
import { ProjectCard } from '@/components/ProjectCard';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projects',
    description: 'Browse my portfolio of projects and work',
  };
}

export default async function ProjectsPage() {
  const config = await getConfig();
  const projects = config.data.projects;

  // Group projects by category
  const categories = Array.from(new Set(projects.map(p => p.category)));

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <p className="text-lg text-muted-foreground">
            Explore my portfolio of work across different technologies and domains
          </p>
        </div>

        {categories.map((category) => {
          const categoryProjects = projects.filter(p => p.category === category);

          return (
            <section key={category} className="mb-16">
              <h2 className="text-2xl font-bold mb-6 capitalize">{category}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          );
        })}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects to display yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
