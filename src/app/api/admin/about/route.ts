import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const aboutSchema = z.object({
  sectionLabel: z.string().min(1).default('About Me'),
  title: z.string().min(1).default('Passionate Developer,'),
  titleHighlight: z.string().min(1).default('Problem Solver'),
  description: z.array(z.string()).default([]),
  skills: z.array(z.object({
    name: z.string(),
    icon: z.string().optional(),
  })).default([]),
  yearsExperience: z.number().min(0).default(3),
  projectsCount: z.number().min(0).default(20),
  highlights: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    description: z.string(),
  })).default([]),
  profileEmoji: z.string().default('👨‍💻'),
  showImage: z.boolean().default(true),
  showThreeBackground: z.boolean().default(true),
  imagePosition: z.enum(['left', 'right']).default('right'),
});

// GET about section data
export async function GET() {
  try {
    let about = await prisma.aboutSection.findFirst();

    // If no about section exists, create default one
    if (!about) {
      about = await prisma.aboutSection.create({
        data: {
          sectionLabel: 'About Me',
          title: 'Passionate Developer,',
          titleHighlight: 'Problem Solver',
          description: [
            "I'm a passionate full-stack developer with over 3 years of experience building scalable web applications and beautiful user interfaces.",
            "My expertise lies in React, Next.js, .NET Core, and cloud technologies. I love creating intuitive, user-friendly applications that solve real-world problems and deliver exceptional user experiences.",
            "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.",
          ],
          skills: [
            { name: 'React & Next.js' },
            { name: 'TypeScript' },
            { name: 'Node.js' },
            { name: '.NET Core' },
            { name: 'PostgreSQL' },
            { name: 'AWS & Azure' },
          ],
          yearsExperience: 3,
          projectsCount: 20,
          highlights: [
            { icon: 'code', title: 'Clean Code', description: 'Writing maintainable, scalable code' },
            { icon: 'palette', title: 'UI/UX Focus', description: 'Creating beautiful user experiences' },
          ],
          profileEmoji: '👨‍💻',
          showImage: true,
          showThreeBackground: true,
          imagePosition: 'right',
        },
      });
    }

    return NextResponse.json({ about });
  } catch (error) {
    console.error('Failed to fetch about section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about section' },
      { status: 500 }
    );
  }
}

// UPDATE about section
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = aboutSchema.parse(body);

    // Find existing or get first
    let about = await prisma.aboutSection.findFirst();

    if (about) {
      // Update existing
      about = await prisma.aboutSection.update({
        where: { id: about.id },
        data: {
          ...data,
          skills: data.skills as any,
          highlights: data.highlights as any,
        },
      });
    } else {
      // Create new
      about = await prisma.aboutSection.create({
        data: {
          ...data,
          skills: data.skills as any,
          highlights: data.highlights as any,
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entity: 'AboutSection',
        entityId: about.id,
        newValue: about as any,
      },
    });

    return NextResponse.json({ about });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Failed to update about section:', error);
    return NextResponse.json(
      { error: 'Failed to update about section' },
      { status: 500 }
    );
  }
}
