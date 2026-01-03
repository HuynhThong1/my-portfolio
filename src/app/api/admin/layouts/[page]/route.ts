import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;
    const layout = await prisma.pageLayout.findUnique({
      where: { pageName: page },
    });

    if (!layout) {
      return NextResponse.json({ sections: [] });
    }

    return NextResponse.json(layout.sections);
  } catch (error) {
    console.error('Failed to fetch layout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch layout' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { page } = await params;
    const body = await request.json();
    const { sections } = body;

    const layout = await prisma.pageLayout.upsert({
      where: { pageName: page },
      update: {
        sections,
        updatedAt: new Date(),
      },
      create: {
        pageName: page,
        sections,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entity: 'PageLayout',
        entityId: layout.id,
        newValue: { page, sectionsCount: sections.length },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save layout:', error);
    return NextResponse.json(
      { error: 'Failed to save layout' },
      { status: 500 }
    );
  }
}
