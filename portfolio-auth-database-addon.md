# Portfolio Builder - Authentication & Database Integration

## Additional Dependencies

```bash
# Authentication
npm install next-auth@beta @auth/prisma-adapter
npm install bcryptjs
npm install -D @types/bcryptjs

# Database
npm install prisma @prisma/client

# Or if using MongoDB
npm install mongodb

# Validation
npm install zod

# Initialize Prisma
npx prisma init
```

---

## Option 1: PostgreSQL with Prisma (Recommended)

### Updated Project Structure

```
portfolio/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (portfolio)/
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── config/
│   │   │   │   └── route.ts
│   │   │   └── admin/
│   │   │       ├── projects/route.ts
│   │   │       ├── experience/route.ts
│   │   │       └── settings/route.ts
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── config-loader.ts
│   │   └── ...
│   └── ...
└── ...
```

### Prisma Schema

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== AUTH MODELS ====================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?
  image         String?
  role          Role      @default(VIEWER)
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}

// ==================== PORTFOLIO MODELS ====================

model SiteConfig {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json
  updatedAt DateTime @updatedAt
}

model Profile {
  id        String   @id @default(cuid())
  name      String
  title     String
  email     String
  phone     String?
  location  String
  avatar    String?
  resumeUrl String?
  bio       String   @db.Text
  social    Json     // { github, linkedin, twitter, etc }
  updatedAt DateTime @updatedAt
}

model Project {
  id              String   @id @default(cuid())
  slug            String   @unique
  title           String
  description     String   @db.Text
  longDescription String?  @db.Text
  image           String?
  tags            String[] // Array of tags
  links           Json     // { demo, github, etc }
  featured        Boolean  @default(false)
  category        String
  order           Int      @default(0)
  visible         Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Experience {
  id           String   @id @default(cuid())
  company      String
  position     String
  location     String
  startDate    DateTime
  endDate      DateTime?
  current      Boolean  @default(false)
  description  String   @db.Text
  technologies String[]
  order        Int      @default(0)
  visible      Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Education {
  id          String   @id @default(cuid())
  institution String
  degree      String
  field       String?
  location    String
  startDate   DateTime
  endDate     DateTime?
  description String?  @db.Text
  order       Int      @default(0)
  visible     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Skill {
  id          String  @id @default(cuid())
  name        String
  icon        String?
  category    String
  proficiency Int     @default(0) // 0-100
  order       Int     @default(0)
  visible     Boolean @default(true)
}

model PageLayout {
  id        String   @id @default(cuid())
  pageName  String   @unique
  sections  Json     // Array of section configs
  updatedAt DateTime @updatedAt
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String   @db.Text
  read      Boolean  @default(false)
  archived  Boolean  @default(false)
  createdAt DateTime @default(now())
}

// ==================== AUDIT LOG ====================

model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  action    String
  entity    String
  entityId  String?
  oldValue  Json?
  newValue  Json?
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
}
```

### Prisma Client

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

---

## Authentication Setup

### Auth Configuration

Create `src/lib/auth.ts`:

```typescript
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),

    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'VIEWER', // Default role for OAuth users
        };
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'VIEWER',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Only allow admins to sign in to admin panel
      if (account?.provider !== 'credentials') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        
        // Auto-promote first user to ADMIN
        if (!existingUser) {
          const userCount = await prisma.user.count();
          if (userCount === 0) {
            // Will be handled by adapter, then we update role
            setTimeout(async () => {
              await prisma.user.update({
                where: { email: user.email! },
                data: { role: 'ADMIN' },
              });
            }, 1000);
          }
        }
      }
      return true;
    },
  },
});

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
    };
  }

  interface User {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
```

### Auth API Route

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
```

### Auth Middleware

Create `src/middleware.ts`:

```typescript
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === 'ADMIN';
  const isEditor = req.auth?.user?.role === 'EDITOR' || isAdmin;

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    // Allow login page
    if (pathname === '/admin/login') {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }

    // Require authentication
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Require ADMIN or EDITOR role
    if (!isEditor) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protected API routes
  if (pathname.startsWith('/api/admin')) {
    if (!isEditor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

---

## Admin Login Page

Create `src/app/admin/login/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Github, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  const error = searchParams.get('error');

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoginError('Invalid email or password');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the portfolio builder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error || loginError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginError || 'Authentication failed. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* OAuth Buttons */}
          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Protected Admin Layout

Update `src/app/admin/layout.tsx`:

```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Toaster } from '@/components/ui/sonner';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const isAdmin = session.user.role === 'ADMIN';
  const isEditor = session.user.role === 'EDITOR' || isAdmin;

  if (!isEditor) {
    redirect('/');
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex">
        <AdminSidebar isAdmin={isAdmin} />
        <div className="flex-1 flex flex-col">
          <AdminHeader user={session.user} />
          <main className="flex-1 overflow-auto bg-muted/30">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </SessionProvider>
  );
}
```

### Admin Sidebar

Create `src/components/admin/AdminSidebar.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  Settings,
  Users,
  MessageSquare,
  Palette,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AdminSidebarProps {
  isAdmin: boolean;
}

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/builder', label: 'Page Builder', icon: Palette },
  { href: '/admin/projects', label: 'Projects', icon: FileText },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/skills', label: 'Skills', icon: Code2 },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

const adminOnlyItems = [
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ isAdmin }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const allItems = isAdmin ? [...menuItems, ...adminOnlyItems] : menuItems;

  return (
    <aside
      className={cn(
        'bg-background border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-14 flex items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/admin" className="font-semibold text-lg">
            Portfolio Admin
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <nav className="p-2 space-y-1">
        {allItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

### Admin Header

Create `src/components/admin/AdminHeader.tsx`:

```typescript
'use client';

import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Site
          </Link>
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{user.name}</span>
            <Badge variant="secondary" className="hidden md:inline">
              {user.role}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/profile">
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
```

---

## Database API Routes

### Projects CRUD

Create `src/app/api/admin/projects/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()),
  links: z.object({
    demo: z.string().optional(),
    github: z.string().optional(),
  }),
  featured: z.boolean().default(false),
  category: z.string(),
  visible: z.boolean().default(true),
});

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// CREATE new project
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = projectSchema.parse(body);

    // Get max order
    const maxOrder = await prisma.project.aggregate({
      _max: { order: true },
    });

    const project = await prisma.project.create({
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
        entity: 'Project',
        entityId: project.id,
        newValue: project as any,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
```

Create `src/app/api/admin/projects/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  longDescription: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  links: z.object({
    demo: z.string().optional(),
    github: z.string().optional(),
  }).optional(),
  featured: z.boolean().optional(),
  category: z.string().optional(),
  visible: z.boolean().optional(),
  order: z.number().optional(),
});

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// UPDATE project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateProjectSchema.parse(body);

    const oldProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    const project = await prisma.project.update({
      where: { id: params.id },
      data,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entity: 'Project',
        entityId: project.id,
        oldValue: oldProject as any,
        newValue: project as any,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const oldProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    await prisma.project.delete({
      where: { id: params.id },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        entity: 'Project',
        entityId: params.id,
        oldValue: oldProject as any,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
```

### Page Layout API

Create `src/app/api/admin/layouts/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all page layouts
export async function GET() {
  try {
    const layouts = await prisma.pageLayout.findMany();
    
    // Convert to object format for easier use
    const layoutMap = layouts.reduce((acc, layout) => {
      acc[layout.pageName] = layout.sections;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(layoutMap);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch layouts' },
      { status: 500 }
    );
  }
}

// UPDATE page layout
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pageName, sections } = await request.json();

    const layout = await prisma.pageLayout.upsert({
      where: { pageName },
      update: { sections },
      create: { pageName, sections },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entity: 'PageLayout',
        entityId: layout.id,
        newValue: { pageName, sections },
      },
    });

    return NextResponse.json(layout);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update layout' },
      { status: 500 }
    );
  }
}
```

---

## Updated Config Loader (Database-backed)

Update `src/lib/config-loader.ts`:

```typescript
import { prisma } from '@/lib/prisma';
import { PortfolioConfig, SectionConfig } from '@/types/config';
import { cache } from 'react';

// Cache config for 60 seconds in production
export const getConfig = cache(async (): Promise<PortfolioConfig> => {
  const [
    siteConfig,
    profile,
    projects,
    experience,
    education,
    skills,
    layouts,
  ] = await Promise.all([
    prisma.siteConfig.findMany(),
    prisma.profile.findFirst(),
    prisma.project.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    }),
    prisma.experience.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    }),
    prisma.education.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    }),
    prisma.skill.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    }),
    prisma.pageLayout.findMany(),
  ]);

  // Convert site config array to object
  const configMap = siteConfig.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, any>);

  // Convert layouts array to object
  const pagesConfig = layouts.reduce((acc, layout) => {
    acc[layout.pageName] = { sections: layout.sections as SectionConfig[] };
    return acc;
  }, {} as Record<string, { sections: SectionConfig[] }>);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push({
      name: skill.name,
      icon: skill.icon,
      proficiency: skill.proficiency,
    });
    return acc;
  }, {} as Record<string, any[]>);

  return {
    meta: configMap.meta || {},
    profile: profile ? {
      name: profile.name,
      title: profile.title,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      avatar: profile.avatar,
      resumeUrl: profile.resumeUrl,
      bio: profile.bio,
      social: profile.social as any,
    } : {} as any,
    theme: configMap.theme || {},
    layout: configMap.layout || {},
    pages: pagesConfig,
    data: {
      projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        longDescription: p.longDescription,
        image: p.image,
        tags: p.tags,
        links: p.links as any,
        featured: p.featured,
        category: p.category,
      })),
      experience: experience.map(e => ({
        id: e.id,
        company: e.company,
        position: e.position,
        location: e.location,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate?.toISOString() || 'present',
        description: e.description,
        technologies: e.technologies,
      })),
      education: education.map(ed => ({
        id: ed.id,
        institution: ed.institution,
        degree: ed.degree,
        location: ed.location,
        startDate: ed.startDate.toISOString(),
        endDate: ed.endDate?.toISOString() || '',
        description: ed.description,
      })),
      skills: Object.entries(skillsByCategory).map(([name, skills]) => ({
        name,
        skills,
      })),
    },
  };
});

export async function getPageSections(pageName: string): Promise<SectionConfig[]> {
  const layout = await prisma.pageLayout.findUnique({
    where: { pageName },
  });

  if (!layout) {
    return [];
  }

  return (layout.sections as SectionConfig[])
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);
}
```

---

## Database Seeding

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create default profile
  const profile = await prisma.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'John Doe',
      title: 'Full-Stack Developer',
      email: 'john@example.com',
      location: 'Ho Chi Minh City, Vietnam',
      bio: 'Passionate full-stack developer with 3+ years of experience.',
      social: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
      },
    },
  });

  console.log('Created profile:', profile.name);

  // Create site config
  const configs = [
    {
      key: 'meta',
      value: {
        title: 'John Doe | Full-Stack Developer',
        description: 'Full-stack developer portfolio',
        keywords: ['developer', 'react', 'nextjs'],
        siteUrl: 'https://johndoe.dev',
      },
    },
    {
      key: 'theme',
      value: {
        mode: 'system',
        primaryColor: '#0066FF',
        accentColor: '#00D4FF',
      },
    },
    {
      key: 'layout',
      value: {
        header: {
          visible: true,
          sticky: true,
          navItems: [
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        footer: {
          visible: true,
          copyright: '© 2024 John Doe',
        },
      },
    },
  ];

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
  }

  console.log('Created site configs');

  // Create default page layouts
  const homeLayout = await prisma.pageLayout.upsert({
    where: { pageName: 'home' },
    update: {},
    create: {
      pageName: 'home',
      sections: [
        {
          id: 'hero',
          type: 'hero',
          order: 1,
          visible: true,
          props: {
            headline: "Hi, I'm John Doe",
            subheadline: 'Full-Stack Developer',
            description: 'I build exceptional digital experiences',
          },
        },
        {
          id: 'skills',
          type: 'skills',
          order: 2,
          visible: true,
          props: {
            title: 'Tech Stack',
            layout: 'grid',
          },
        },
        {
          id: 'projects',
          type: 'projects',
          order: 3,
          visible: true,
          props: {
            title: 'Featured Projects',
            maxItems: 3,
          },
        },
      ],
    },
  });

  console.log('Created page layouts');

  // Create sample projects
  const sampleProjects = [
    {
      slug: 'healthcare-platform',
      title: 'Healthcare Digital Platform',
      description: 'A comprehensive digital health platform with real-time chat.',
      tags: ['React', 'TypeScript', '.NET Core', 'SignalR'],
      links: { demo: 'https://demo.example.com' },
      featured: true,
      category: 'web',
      order: 1,
    },
    {
      slug: 'hr-recruitment',
      title: 'HR Recruitment System',
      description: 'Modern HR recruitment platform with customizable themes.',
      tags: ['Angular', 'NestJS', 'MongoDB'],
      links: {},
      featured: true,
      category: 'web',
      order: 2,
    },
  ];

  for (const project of sampleProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  console.log('Created sample projects');

  // Create sample skills
  const skills = [
    { name: 'React', category: 'Frontend', proficiency: 90, order: 1 },
    { name: 'Next.js', category: 'Frontend', proficiency: 85, order: 2 },
    { name: 'TypeScript', category: 'Frontend', proficiency: 88, order: 3 },
    { name: '.NET Core', category: 'Backend', proficiency: 85, order: 1 },
    { name: 'Node.js', category: 'Backend', proficiency: 80, order: 2 },
    { name: 'PostgreSQL', category: 'Database', proficiency: 82, order: 1 },
    { name: 'Docker', category: 'DevOps', proficiency: 75, order: 1 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: skill,
    });
  }

  console.log('Created skills');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Update `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## Environment Variables

Create `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (optional)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Admin (for initial setup)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

---

## Updated Docker Configuration

Update `Dockerfile`:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  portfolio:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/portfolio
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=portfolio
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
```

---

## Run Commands

```bash
# Setup database
npx prisma migrate dev --name init
npx prisma db seed

# Development
npm run dev

# Production with Docker
docker-compose up -d

# View logs
docker-compose logs -f portfolio

# Run migrations in production
docker-compose exec portfolio npx prisma migrate deploy
```

---

## Security Checklist

1. ✅ Password hashing with bcrypt
2. ✅ JWT session strategy
3. ✅ Role-based access control (ADMIN, EDITOR, VIEWER)
4. ✅ Protected API routes with middleware
5. ✅ Input validation with Zod
6. ✅ Audit logging for all changes
7. ✅ CSRF protection (built into NextAuth)
8. ✅ Secure session cookies

## Notes

- First user registered via OAuth becomes ADMIN automatically
- Use credentials login for testing with seeded admin user
- All database changes are logged in AuditLog table
- Page layouts are stored as JSON in database for flexibility
- Config is cached in React for performance
