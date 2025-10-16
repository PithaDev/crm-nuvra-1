'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview';
import LeadsBySourceChart from '@/components/analytics/LeadsBySourceChart';
import QualificationDonut from '@/components/analytics/QualificationDonut';
import TimeSeriesLeads from '@/components/analytics/TimeSeriesLeads';
import PeriodFilter from '@/components/analytics/PeriodFilter';
import { AnalyticsData } from '@/types';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?period=${period}`);
      const result = await response.json();

      if (result.status === 'success') {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;

    const csvData = Object.entries(data.byDate).map(([date, count]) => ({
      date,
      leads: count,
    }));

    const headers = ['Data', 'Leads'];
    const rows = csvData.map(row => [row.date, row.leads]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${period}-${new Date().toISOString()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div>
        <Header title="Analytics" subtitle="Análise detalhada de desempenho" />
        <div className="p-8 flex items-center justify-center">
          <div className="text-gray-500">Carregando dados...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <Header title="Analytics" subtitle="Análise detalhada de desempenho" />
        <div className="p-8 flex items-center justify-center">
          <div className="text-gray-500">Nenhum dado disponível</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Analytics" subtitle="Análise detalhada de desempenho" />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <PeriodFilter period={period} onChange={setPeriod} />
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        <AnalyticsOverview data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadsBySourceChart data={data} />
          <QualificationDonut data={data} />
        </div>

        <TimeSeriesLeads data={data} />
      </div>
    </div>
  );
}
