import { getConfig, getPageSections } from '@/lib/config-loader';
import { BlockRenderer } from '@/components/blocks';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

function BlockSkeleton() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const config = await getConfig();
  const sections = await getPageSections('home');

  // Get skills data formatted for the SkillsBlock
  const skillCategories = config.data.skills;

  return (
    <>
      {sections.map((section) => (
        <Suspense key={section.id} fallback={<BlockSkeleton />}>
          <BlockRenderer
            section={section}
            data={{
              projects: config.data.projects.filter((p) => p.featured),
              categories: skillCategories,
              experiences: config.data.experience,
              about: config.data.about,
            }}
          />
        </Suspense>
      ))}
    </>
  );
}
