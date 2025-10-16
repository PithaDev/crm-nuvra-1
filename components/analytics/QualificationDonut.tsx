'use client';

import { AnalyticsData } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { colors } from '@/styles/design-tokens';

interface QualificationDonutProps {
  data: AnalyticsData;
}

export default function QualificationDonut({ data }: QualificationDonutProps) {
  const chartData = [
    { name: 'Quente', value: data.summary.hot, color: colors.status.error },
    { name: 'Morno', value: data.summary.warm, color: colors.status.warning },
    { name: 'Frio', value: data.summary.cold, color: colors.accent.cyan },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
        Distribuição por Qualificação
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: `1px solid ${colors.border.default}`,
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
