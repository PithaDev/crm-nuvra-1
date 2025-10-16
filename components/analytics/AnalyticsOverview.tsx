'use client';

import { AnalyticsData } from '@/types';
import StatsCard from '@/components/StatsCard';
import { TrendingUp, Users, Target, DollarSign, Zap } from 'lucide-react';
import { colors } from '@/styles/design-tokens';

interface AnalyticsOverviewProps {
  data: AnalyticsData;
}

export default function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const topSource = Object.entries(data.bySource)
    .sort(([, a], [, b]) => b.total - a.total)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatsCard
        title="Total de Leads"
        value={data.summary.totalLeads}
        change={`${data.period === '7d' ? '7 dias' : data.period === '30d' ? '30 dias' : '90 dias'}`}
        changeType="neutral"
        icon={Users}
        iconColor={colors.accent.purple}
      />
      <StatsCard
        title="Leads Hoje"
        value={data.summary.leadsToday}
        change="Últimas 24h"
        changeType="positive"
        icon={TrendingUp}
        iconColor={colors.accent.cyan}
      />
      <StatsCard
        title="Taxa de Conversão"
        value={`${data.summary.conversionRate.toFixed(1)}%`}
        change={data.period}
        changeType={data.summary.conversionRate > 20 ? 'positive' : 'neutral'}
        icon={Zap}
        iconColor={colors.status.success}
      />
      <StatsCard
        title="Valor Total"
        value={formatCurrency(data.summary.totalValue)}
        change={data.period}
        changeType="positive"
        icon={DollarSign}
        iconColor={colors.status.warning}
      />
      <StatsCard
        title="Origem Principal"
        value={topSource ? topSource[0] : 'N/A'}
        change={topSource ? `${topSource[1].total} leads` : 'Sem dados'}
        changeType="neutral"
        icon={Target}
        iconColor={colors.accent.purple}
      />
    </div>
  );
}
