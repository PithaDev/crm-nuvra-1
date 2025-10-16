'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import LeadTable from '@/components/LeadTable';
import { Lead } from '@/types';
import { mockLeads } from '@/data/seed';
import { colors } from '@/styles/design-tokens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Filter, Search } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [qualificationFilter, setQualificationFilter] = useState<string>('all');

  useEffect(() => {
    const storedLeads = sessionStorage.getItem('nuvra_leads');
    const allLeads = storedLeads ? JSON.parse(storedLeads) : mockLeads;
    setLeads(allLeads);
    setFilteredLeads(allLeads);
  }, []);

  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.source === sourceFilter);
    }

    if (qualificationFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.qualification === qualificationFilter);
    }

    setFilteredLeads(filtered);
  }, [searchTerm, sourceFilter, qualificationFilter, leads]);

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div>
      <Header
        title="Gestão de Leads"
        subtitle={`${filteredLeads.length} leads encontrados`}
      />

      <div className="p-8 space-y-6">
        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.default,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" style={{ color: colors.accent.purple }} />
            <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>
              Filtros
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: colors.text.muted }}
              />
              <Input
                placeholder="Buscar por nome, empresa ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.default,
                  color: colors.text.primary,
                }}
              />
            </div>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.default,
                  color: colors.text.primary,
                }}
              >
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as origens</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>

            <Select value={qualificationFilter} onValueChange={setQualificationFilter}>
              <SelectTrigger
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.default,
                  color: colors.text.primary,
                }}
              >
                <SelectValue placeholder="Qualificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as qualificações</SelectItem>
                <SelectItem value="quente">Quente</SelectItem>
                <SelectItem value="morno">Morno</SelectItem>
                <SelectItem value="frio">Frio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <LeadTable leads={filteredLeads} onViewDetails={handleViewDetails} />
      </div>

      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.default,
          }}
        >
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle style={{ color: colors.text.primary }}>
                  {selectedLead.name}
                </DialogTitle>
                <DialogDescription style={{ color: colors.text.tertiary }}>
                  {selectedLead.company}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                    Email
                  </p>
                  <p className="text-sm" style={{ color: colors.text.primary }}>
                    {selectedLead.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                    Telefone
                  </p>
                  <p className="text-sm" style={{ color: colors.text.primary }}>
                    {selectedLead.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                    Valor Estimado
                  </p>
                  <p className="text-lg font-bold" style={{ color: colors.accent.purple }}>
                    {formatCurrency(selectedLead.value)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                    Notas
                  </p>
                  <p className="text-sm" style={{ color: colors.text.primary }}>
                    {selectedLead.notes}
                  </p>
                </div>

                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: colors.background.tertiary }}
                >
                  <p className="text-xs" style={{ color: colors.text.tertiary }}>
                    Modo visualização apenas. Edições não são persistidas nesta versão demo.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
