import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().min(1),
  avatar: z.string().optional(),
  resumeUrl: z.string().optional(),
  bio: z.string().min(1),
  social: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional(),
  }),
});

// GET profile settings
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findFirst();

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// UPDATE profile settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = profileSchema.parse(body);

    // Check if profile exists
    const existingProfile = await prisma.profile.findFirst();

    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data,
      });
    } else {
      profile = await prisma.profile.create({
        data,
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: existingProfile ? 'UPDATE' : 'CREATE',
        entity: 'Profile',
        entityId: profile.id,
        newValue: profile as any,
      },
    });

    // Revalidate all pages since profile data is used site-wide
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');

    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
