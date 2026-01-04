import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const skillSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  iconId: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().min(1),
  proficiency: z.number().min(0).max(100).default(0),
  visible: z.boolean().default(true),
});

// GET all skills
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ skills });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// CREATE new skill
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = skillSchema.parse(body);

    // Get max order
    const maxOrder = await prisma.skill.aggregate({
      _max: { order: true },
    });

    const skill = await prisma.skill.create({
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
        entity: 'Skill',
        entityId: skill.id,
        newValue: skill as any,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}
