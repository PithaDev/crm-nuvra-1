'use client';

import { useState } from 'react';
import { Lead } from '@/types';
import { colors } from '@/styles/design-tokens';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadTableProps {
  leads: Lead[];
  onViewDetails?: (lead: Lead) => void;
}

const qualificationColors: Record<string, string> = {
  quente: colors.status.error,
  morno: colors.status.warning,
  frio: colors.accent.cyan,
  hot: colors.status.error,
  warm: colors.status.warning,
  cold: colors.accent.cyan,
};

const statusColors: Record<string, string> = {
  novo: colors.accent.purple,
  contatado: colors.accent.cyan,
  qualificado: colors.status.warning,
  convertido: colors.status.success,
  perdido: colors.text.muted,
  new: colors.accent.purple,
  contacted: colors.accent.cyan,
  qualified: colors.status.warning,
  converted: colors.status.success,
  lost: colors.text.muted,
};

export default function LeadTable({ leads, onViewDetails }: LeadTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.default,
      }}
    >
      <Table>
        <TableHeader>
          <TableRow
            style={{
              borderColor: colors.border.default,
              backgroundColor: colors.background.tertiary,
            }}
          >
            <TableHead style={{ color: colors.text.secondary }}>Nome</TableHead>
            <TableHead style={{ color: colors.text.secondary }}>Empresa</TableHead>
            <TableHead style={{ color: colors.text.secondary }}>Contato</TableHead>
            <TableHead style={{ color: colors.text.secondary }}>Origem</TableHead>
            <TableHead style={{ color: colors.text.secondary }}>Qualificação</TableHead>
            <TableHead style={{ color: colors.text.secondary }}>Status</TableHead>
            <TableHead style={{ color: colors.text.secondary }}>Valor</TableHead>
            <TableHead style={{ color: colors.text.secondary }}>Data</TableHead>
            <TableHead style={{ color: colors.text.secondary }}>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => (
            <motion.tr
              key={lead.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredRow(lead.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                borderColor: colors.border.default,
                backgroundColor:
                  hoveredRow === lead.id ? colors.background.hover : 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              <TableCell style={{ color: colors.text.primary }} className="font-medium">
                {lead.name}
              </TableCell>
              <TableCell style={{ color: colors.text.secondary }}>{lead.company}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${lead.email}`}
                    className="hover:scale-110 transition-transform"
                  >
                    <Mail className="w-4 h-4" style={{ color: colors.accent.cyan }} />
                  </a>
                  <a
                    href={`tel:${lead.phone}`}
                    className="hover:scale-110 transition-transform"
                  >
                    <Phone className="w-4 h-4" style={{ color: colors.accent.purple }} />
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="capitalize"
                  style={{
                    borderColor: colors.border.default,
                    color: colors.text.secondary,
                  }}
                >
                  {lead.source}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className="capitalize"
                  style={{
                    backgroundColor: qualificationColors[lead.qualification] + '20',
                    color: qualificationColors[lead.qualification],
                    border: `1px solid ${qualificationColors[lead.qualification]}`,
                  }}
                >
                  {lead.qualification}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className="capitalize"
                  style={{
                    backgroundColor: statusColors[lead.status] + '20',
                    color: statusColors[lead.status],
                    border: `1px solid ${statusColors[lead.status]}`,
                  }}
                >
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell style={{ color: colors.text.primary }} className="font-semibold">
                {formatCurrency(lead.value)}
              </TableCell>
              <TableCell style={{ color: colors.text.tertiary }} className="text-sm">
                {formatDate(lead.createdAt)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails?.(lead)}
                  className="hover:scale-110 transition-transform"
                >
                  <Eye className="w-4 h-4" style={{ color: colors.accent.purple }} />
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
