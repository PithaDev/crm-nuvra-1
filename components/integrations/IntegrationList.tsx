'use client';

import { Integration } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IntegrationListProps {
  integrations: Integration[];
  onEdit: (integration: Integration) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  onView: (integration: Integration) => void;
}

export default function IntegrationList({
  integrations,
  onEdit,
  onDelete,
  onToggle,
  onView,
}: IntegrationListProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      n8n: 'n8n Webhook',
      meta_ads: 'Meta Ads',
      form: 'Formulário',
      webhook: 'Webhook',
      custom: 'Personalizado',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-[#1a1a2e] rounded-lg border border-gray-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-[#1f1f3a]">
            <TableHead className="text-gray-400">Nome</TableHead>
            <TableHead className="text-gray-400">Tipo</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Última Execução</TableHead>
            <TableHead className="text-right text-gray-400">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                Nenhuma integração configurada
              </TableCell>
            </TableRow>
          ) : (
            integrations.map((integration) => (
              <TableRow key={integration.id} className="border-gray-800 hover:bg-[#1f1f3a]">
                <TableCell className="font-medium text-white">
                  <button
                    onClick={() => onView(integration)}
                    className="hover:underline text-left"
                  >
                    {integration.name}
                  </button>
                </TableCell>
                <TableCell className="text-gray-300">{getTypeLabel(integration.type)}</TableCell>
                <TableCell>
                  <Badge
                    variant={integration.active ? 'default' : 'secondary'}
                    className={integration.active ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-gray-700 text-gray-400'}
                  >
                    {integration.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400">
                  {integration.last_triggered_at
                    ? format(new Date(integration.last_triggered_at), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })
                    : 'Nunca'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onToggle(integration.id, !integration.active)}
                      className="hover:bg-gray-800 text-gray-400 hover:text-white"
                    >
                      {integration.active ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(integration)}
                      className="hover:bg-gray-800 text-gray-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(integration.id)}
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
