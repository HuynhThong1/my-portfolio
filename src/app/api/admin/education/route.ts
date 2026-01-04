import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().optional(),
  location: z.string().min(1),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().optional().transform((str) => str ? new Date(str) : null),
  description: z.string().optional(),
  visible: z.boolean().default(true),
});

// GET all education entries
export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    });

    return NextResponse.json({ education });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    );
  }
}

// CREATE new education
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = educationSchema.parse(body);

    // Get max order
    const maxOrder = await prisma.education.aggregate({
      _max: { order: true },
    });

    const education = await prisma.education.create({
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
        entity: 'Education',
        entityId: education.id,
        newValue: education as any,
      },
    });

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create education' },
      { status: 500 }
    );
  }
}
