'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import LeadTable from '@/components/LeadTable';
import { Lead, Stats } from '@/types';
import { mockLeads, mockStats } from '@/data/seed';
import { Users, TrendingUp, DollarSign, Zap, Target } from 'lucide-react';
import { colors } from '@/styles/design-tokens';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>(mockStats);
  const [topSource, setTopSource] = useState<{ name: string; count: number } | null>(null);

  useEffect(() => {
    const storedLeads = sessionStorage.getItem('nuvra_leads');
    const storedStats = sessionStorage.getItem('nuvra_stats');

    if (storedLeads) {
      const allLeads = JSON.parse(storedLeads);
      setLeads(allLeads.slice(0, 5));

      const sourceCounts: Record<string, number> = {};
      allLeads.forEach((lead: Lead) => {
        const source = lead.source || 'unknown';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      const top = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0];
      if (top) {
        setTopSource({ name: top[0], count: top[1] });
      }
    } else {
      setLeads(mockLeads.slice(0, 5));

      const sourceCounts: Record<string, number> = {};
      mockLeads.forEach((lead: Lead) => {
        const source = lead.source || 'unknown';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      const top = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0];
      if (top) {
        setTopSource({ name: top[0], count: top[1] });
      }
    }

    if (storedStats) {
      setStats(JSON.parse(storedStats));
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Visão geral do seu CRM"
      />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Total de Leads"
            value={stats.totalLeads}
            change="+12% este mês"
            changeType="positive"
            icon={Users}
            iconColor={colors.accent.purple}
          />
          <StatsCard
            title="Leads Hoje"
            value={stats.leadsToday}
            change="5 nas últimas 2h"
            changeType="positive"
            icon={TrendingUp}
            iconColor={colors.accent.cyan}
          />
          <StatsCard
            title="Taxa de Conversão"
            value={`${stats.conversionRate}%`}
            change="+2.3% este mês"
            changeType="positive"
            icon={Zap}
            iconColor={colors.status.success}
          />
          <StatsCard
            title="Receita Total"
            value={formatCurrency(stats.totalRevenue)}
            change="+18% este mês"
            changeType="positive"
            icon={DollarSign}
            iconColor={colors.status.warning}
          />
          <StatsCard
            title="Origem Principal"
            value={topSource?.name || 'N/A'}
            change={topSource ? `${topSource.count} leads` : 'Sem dados'}
            changeType="neutral"
            icon={Target}
            iconColor={colors.accent.purple}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Leads Recentes
            </h2>
            <a
              href="/dashboard/leads"
              className="text-sm font-medium hover:underline"
              style={{ color: colors.accent.purple }}
            >
              Ver todos →
            </a>
          </div>
          <LeadTable leads={leads} />
        </div>
      </div>
    </div>
  );
}
