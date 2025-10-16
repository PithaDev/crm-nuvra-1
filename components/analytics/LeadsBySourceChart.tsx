'use client';

import { AnalyticsData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { colors } from '@/styles/design-tokens';

interface LeadsBySourceChartProps {
  data: AnalyticsData;
}

export default function LeadsBySourceChart({ data }: LeadsBySourceChartProps) {
  const chartData = Object.entries(data.bySource).map(([source, stats]) => ({
    name: source,
    total: stats.total,
    quente: stats.hot,
    morno: stats.warm,
    frio: stats.cold,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
        Leads por Origem
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border.default} />
          <XAxis dataKey="name" stroke={colors.text.secondary} />
          <YAxis stroke={colors.text.secondary} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: `1px solid ${colors.border.default}`,
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="quente" fill={colors.status.error} name="Quente" />
          <Bar dataKey="morno" fill={colors.status.warning} name="Morno" />
          <Bar dataKey="frio" fill={colors.accent.cyan} name="Frio" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
