'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { InsightData } from '@/types';
import { mockInsightData } from '@/data/seed';
import { colors } from '@/styles/design-tokens';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InsightsPage() {
  const [data, setData] = useState<InsightData[]>([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem('nuvra_insights');
    const insightData = storedData ? JSON.parse(storedData) : mockInsightData;
    setData(insightData);
  }, []);

  const totalLeads = data.reduce((sum, d) => sum + d.leads, 0);
  const totalConversions = data.reduce((sum, d) => sum + d.conversions, 0);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const avgConversionRate = totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const aiInsights = [
    {
      title: 'Tendência de Crescimento',
      description: 'Seus leads aumentaram 35% na última semana. Continue focando em canais de social media.',
      icon: TrendingUp,
      color: colors.status.success,
    },
    {
      title: 'Melhor Dia da Semana',
      description: 'Sextas-feiras apresentam 42% mais conversões. Considere campanhas direcionadas.',
      icon: Users,
      color: colors.accent.purple,
    },
    {
      title: 'Oportunidade de Receita',
      description: 'Leads qualificados como "hot" têm 78% mais chance de conversão em 48h.',
      icon: DollarSign,
      color: colors.status.warning,
    },
  ];

  return (
    <div>
      <Header
        title="Insights & Analytics"
        subtitle="Análises inteligentes do seu CRM"
      />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Leads', value: totalLeads, color: colors.accent.purple },
            { label: 'Conversões', value: totalConversions, color: colors.accent.cyan },
            { label: 'Taxa Conversão', value: `${avgConversionRate}%`, color: colors.status.success },
            { label: 'Receita', value: formatCurrency(totalRevenue), color: colors.status.warning },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.default,
              }}
            >
              <p className="text-sm mb-2" style={{ color: colors.text.secondary }}>
                {stat.label}
              </p>
              <p className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.default,
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.accent.purple + '20' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: colors.accent.purple }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: colors.text.primary }}>
              Insights Gerados por IA
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <Card
                  className="border h-full"
                  style={{
                    backgroundColor: colors.background.tertiary,
                    borderColor: colors.border.default,
                  }}
                >
                  <CardHeader>
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: insight.color + '20' }}
                    >
                      <insight.icon className="w-6 h-6" style={{ color: insight.color }} />
                    </div>
                    <CardTitle className="text-lg" style={{ color: colors.text.primary }}>
                      {insight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription style={{ color: colors.text.secondary }}>
                      {insight.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.default,
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Dados dos Últimos 8 Dias
          </h3>

          <div className="space-y-3">
            {data.map((day, index) => {
              const maxValue = Math.max(...data.map((d) => d.leads));
              const barWidth = (day.leads / maxValue) * 100;

              return (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: colors.text.secondary }}>
                      {new Date(day.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    <div className="flex gap-4">
                      <span style={{ color: colors.text.tertiary }}>
                        {day.leads} leads
                      </span>
                      <span style={{ color: colors.accent.cyan }}>
                        {day.conversions} conversões
                      </span>
                      <span style={{ color: colors.accent.purple }}>
                        {formatCurrency(day.revenue)}
                      </span>
                    </div>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.background.tertiary }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${colors.accent.purple}, ${colors.accent.cyan})`,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div
          className="rounded-xl p-6 border text-center"
          style={{
            backgroundColor: colors.background.tertiary,
            borderColor: colors.border.default,
          }}
        >
          <p className="text-sm" style={{ color: colors.text.tertiary }}>
            💡 <strong style={{ color: colors.text.secondary }}>Nota:</strong> Estes são dados
            mock gerados localmente. Em produção, conecte a API para dados reais.
          </p>
        </div>
      </div>
    </div>
  );
}
