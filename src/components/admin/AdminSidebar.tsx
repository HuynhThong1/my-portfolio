'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Code2,
  Settings,
  MessageSquare,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isAdmin: boolean;
}

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/builder', label: 'Page Builder', icon: Palette },
  { href: '/admin/projects', label: 'Projects', icon: FileText },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', icon: Code2 },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

const adminOnlyItems = [
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ isAdmin }: AdminSidebarProps) {
  const pathname = usePathname();

  const allItems = isAdmin ? [...menuItems, ...adminOnlyItems] : menuItems;

  return (
    <aside className="w-64 bg-background border-r">
      <div className="h-14 flex items-center px-4 border-b">
        <Link href="/admin" className="font-semibold text-lg">
          Portfolio Admin
        </Link>
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
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
