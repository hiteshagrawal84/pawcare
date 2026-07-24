'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Briefcase,
  Calendar,
  PawPrint,
  Heart,
  Package,
  ShoppingBag,
  FileText,
  Image,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/pets', label: 'Pets', icon: PawPrint },
  { href: '/admin/adoption', label: 'Adoption', icon: Heart },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout, hydrate } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isLoading && (!user || !['admin', 'super_admin'].includes(user.role))) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-paw-green font-semibold animate-pulse">Loading admin...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] flex">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-paw-charcoal text-white transform transition-transform lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-5 border-b border-white/10 flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <div>
            <div className="font-extrabold font-[family-name:var(--font-jakarta)]">
              Paw<span className="text-paw-green">Care</span>
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Admin Panel</div>
          </div>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active ? 'bg-paw-green text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 w-full"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 w-64">
              <Search size={16} className="text-gray-400" />
              <input placeholder="Search..." className="bg-transparent text-sm outline-none w-full" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-gray-50">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-paw-orange rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-paw-green/20 text-paw-green flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-sm">
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-paw-muted capitalize">{user.role.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
