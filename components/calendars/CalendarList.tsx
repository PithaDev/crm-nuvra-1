'use client';

import { Integration } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Play, Pause, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarListProps {
  calendars: Integration[];
  onEdit: (calendar: Integration) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
}

export default function CalendarList({
  calendars,
  onEdit,
  onDelete,
  onToggle,
}: CalendarListProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      google_calendar: 'Google Calendar',
      apple_calendar: 'Apple Calendar',
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    return <Calendar className="w-4 h-4" />;
  };

  return (
    <div className="bg-[#1a1a2e] rounded-lg border border-gray-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-[#1f1f3a]">
            <TableHead className="text-gray-400">Calendário</TableHead>
            <TableHead className="text-gray-400">Tipo</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Última Sincronização</TableHead>
            <TableHead className="text-right text-gray-400">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calendars.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                Nenhum calendário conectado
              </TableCell>
            </TableRow>
          ) : (
            calendars.map((calendar) => (
              <TableRow key={calendar.id} className="border-gray-800 hover:bg-[#1f1f3a]">
                <TableCell className="font-medium text-white">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(calendar.type)}
                    {calendar.name}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{getTypeLabel(calendar.type)}</TableCell>
                <TableCell>
                  <Badge
                    variant={calendar.active ? 'default' : 'secondary'}
                    className={calendar.active ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-gray-700 text-gray-400'}
                  >
                    {calendar.active ? 'Conectado' : 'Desconectado'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400">
                  {calendar.last_triggered_at
                    ? format(new Date(calendar.last_triggered_at), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })
                    : 'Nunca sincronizado'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onToggle(calendar.id, !calendar.active)}
                      className="hover:bg-gray-800 text-gray-400 hover:text-white"
                    >
                      {calendar.active ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(calendar)}
                      className="hover:bg-gray-800 text-gray-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(calendar.id)}
                      className="hover:bg-gray-800 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
