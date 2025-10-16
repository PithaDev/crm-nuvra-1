'use client';

import { AnalyticsData } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { colors } from '@/styles/design-tokens';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimeSeriesLeadsProps {
  data: AnalyticsData;
}

export default function TimeSeriesLeads({ data }: TimeSeriesLeadsProps) {
  const chartData = Object.entries(data.byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      leads: count,
      displayDate: format(parseISO(date), 'dd/MM', { locale: ptBR }),
    }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
        Leads ao Longo do Tempo
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border.default} />
          <XAxis
            dataKey="displayDate"
            stroke={colors.text.secondary}
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke={colors.text.secondary} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: `1px solid ${colors.border.default}`,
              borderRadius: '8px',
            }}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="leads"
            stroke={colors.accent.purple}
            strokeWidth={2}
            dot={{ fill: colors.accent.purple, r: 4 }}
            activeDot={{ r: 6 }}
            name="Leads"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
