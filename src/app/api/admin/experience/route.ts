import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const experienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  location: z.string().min(1),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().optional().transform((str) => str ? new Date(str) : null),
  current: z.boolean().default(false),
  description: z.string().min(1),
  technologies: z.array(z.string()),
  visible: z.boolean().default(true),
});

// GET all experience entries
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    });

    return NextResponse.json({ experiences });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

// CREATE new experience
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = experienceSchema.parse(body);

    // Get max order
    const maxOrder = await prisma.experience.aggregate({
      _max: { order: true },
    });

    const experience = await prisma.experience.create({
      data: {
        ...data,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        entity: 'Experience',
        entityId: experience.id,
        newValue: experience as any,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}
