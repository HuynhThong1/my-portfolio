import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, Code2, MessageSquare } from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  // Get counts
  const [projectsCount, experienceCount, skillsCount, messagesCount] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.skill.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const stats = [
    {
      title: 'Projects',
      value: projectsCount,
      description: 'Total projects in portfolio',
      icon: FileText,
      href: '/admin/projects',
    },
    {
      title: 'Experience',
      value: experienceCount,
      description: 'Work experience entries',
      icon: Briefcase,
      href: '/admin/experience',
    },
    {
      title: 'Skills',
      value: skillsCount,
      description: 'Technical skills listed',
      icon: Code2,
      href: '/admin/skills',
    },
    {
      title: 'Messages',
      value: messagesCount,
      description: 'Unread contact messages',
      icon: MessageSquare,
      href: '/admin/messages',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your portfolio
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • Create a new project<br />
            • Update your profile<br />
            • Manage page layouts<br />
            • View analytics
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
