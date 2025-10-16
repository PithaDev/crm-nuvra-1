'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Settings,
  Zap,
  Key,
  Download,
  Calendar
} from 'lucide-react';
import { colors } from '@/styles/design-tokens';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Produtos', href: '/dashboard/products', icon: Package },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Integrações', href: '/dashboard/integrations', icon: Zap },
  { name: 'Calendários', href: '/dashboard/calendars', icon: Calendar },
  { name: 'API Keys', href: '/dashboard/keys', icon: Key },
  { name: 'Export/Import', href: '/dashboard/export-import', icon: Download },
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 border-r flex flex-col"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.default,
      }}
    >
      <div className="p-6 border-b" style={{ borderColor: colors.border.default }}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Nuvra CRM Logo"
            className="w-10 h-10 transition-all duration-300 group-hover:scale-110"
          />
          <div>
            <h1 className="text-xl font-bold" style={{ color: colors.text.primary }}>
              Nuvra CRM
            </h1>
            <p className="text-xs" style={{ color: colors.text.tertiary }}>
              Versão 1.0.0
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:translate-x-1'
              )}
              style={{
                backgroundColor: isActive ? colors.background.hover : 'transparent',
                color: isActive ? colors.accent.purple : colors.text.secondary,
                borderLeft: isActive ? `3px solid ${colors.accent.purple}` : 'none',
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className="p-4 border-t"
        style={{ borderColor: colors.border.default }}
      >
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.background.tertiary }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: colors.accent.cyan }}>
            💡 Modo Demo
          </p>
          <p className="text-xs" style={{ color: colors.text.tertiary }}>
            Rodando com dados mock locais
          </p>
        </div>
      </div>
    </aside>
  );
}
