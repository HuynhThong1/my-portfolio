import { getConfig } from '@/lib/config-loader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Experience',
    description: 'My professional work experience and career history',
  };
}

export default async function ExperiencePage() {
  const config = await getConfig();
  const experiences = config.data.experience;

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Work Experience</h1>
          <p className="text-lg text-muted-foreground">
            My professional journey and career highlights
          </p>
        </div>

        {experiences.length > 0 ? (
          <div className="space-y-8">
            {experiences.map((exp) => {
              const startYear = new Date(exp.startDate).getFullYear();
              const endDate = exp.endDate === 'present' ? 'Present' : new Date(exp.endDate).getFullYear();

              return (
                <Card key={exp.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          {exp.position}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {exp.company} • {exp.location}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-1">
                          {startYear} - {endDate}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{exp.description}</p>

                    {exp.technologies.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No experience entries yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
