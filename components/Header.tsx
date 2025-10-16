'use client';

import { useState } from 'react';
import { Bell, Search, User, LogOut, X } from 'lucide-react';
import { colors } from '@/styles/design-tokens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Novo lead: Maria Silva da TechCorp', time: '5 min atrás', unread: true },
    { id: 2, text: 'Lead convertido: João Santos', time: '1 hora atrás', unread: true },
    { id: 3, text: 'Reunião agendada para amanhã', time: '2 horas atrás', unread: true },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Busca:', searchQuery);
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <header
      className="sticky top-0 z-10 border-b backdrop-blur-md"
      style={{
        backgroundColor: colors.background.primary + 'cc',
        borderColor: colors.border.default,
      }}
    >
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm mt-1" style={{ color: colors.text.tertiary }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: colors.text.muted }}
            />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 border-0"
              style={{
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
              }}
            />
          </form>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:scale-110 transition-transform"
              >
                <Bell className="w-5 h-5" style={{ color: colors.text.secondary }} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold"
                    style={{
                      backgroundColor: colors.accent.purple,
                      color: colors.text.primary,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.default,
              }}
            >
              <div
                className="p-4 border-b"
                style={{ borderColor: colors.border.default }}
              >
                <h3 className="font-semibold" style={{ color: colors.text.primary }}>
                  Notificações
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm" style={{ color: colors.text.tertiary }}>
                      Nenhuma notificação
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b hover:bg-opacity-50 cursor-pointer group"
                      style={{
                        borderColor: colors.border.default,
                        backgroundColor: notification.unread ? colors.background.hover : 'transparent',
                      }}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p
                            className="text-sm mb-1"
                            style={{
                              color: notification.unread ? colors.text.primary : colors.text.secondary,
                              fontWeight: notification.unread ? 500 : 400,
                            }}
                          >
                            {notification.text}
                          </p>
                          <p className="text-xs" style={{ color: colors.text.tertiary }}>
                            {notification.time}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                        >
                          <X className="w-3 h-3" style={{ color: colors.text.muted }} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.cyan})`,
              }}
            >
              <User className="w-5 h-5 text-white" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:scale-110 transition-transform"
            >
              <LogOut className="w-5 h-5" style={{ color: colors.text.secondary }} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
