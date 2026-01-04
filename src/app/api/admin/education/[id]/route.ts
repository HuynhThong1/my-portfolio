import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const educationSchema = z.object({
  institution: z.string().min(1).optional(),
  degree: z.string().min(1).optional(),
  field: z.string().optional(),
  location: z.string().min(1).optional(),
  startDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  endDate: z.string().optional().transform((str) => str ? new Date(str) : null),
  description: z.string().optional(),
  visible: z.boolean().optional(),
  order: z.number().optional(),
});

// GET single education
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const education = await prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      return NextResponse.json(
        { error: 'Education not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    );
  }
}

// UPDATE education
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = educationSchema.parse(body);

    const education = await prisma.education.update({
      where: { id },
      data,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entity: 'Education',
        entityId: education.id,
        newValue: education as any,
      },
    });

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/about');

    return NextResponse.json(education);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update education' },
      { status: 500 }
    );
  }
}

// DELETE education
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.education.delete({
      where: { id },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        entity: 'Education',
        entityId: id,
      },
    });

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/about');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete education' },
      { status: 500 }
    );
  }
}
