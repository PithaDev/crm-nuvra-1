'use client';

import { useState } from 'react';
import { colors } from '@/styles/design-tokens';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, Database, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import Link from 'next/link';

export default function BackupPage() {
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = () => {
    const data = {
      leads: sessionStorage.getItem('nuvra_leads'),
      products: sessionStorage.getItem('nuvra_products'),
      stats: sessionStorage.getItem('nuvra_stats'),
      insights: sessionStorage.getItem('nuvra_insights'),
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nuvra-crm-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (data.leads) sessionStorage.setItem('nuvra_leads', data.leads);
        if (data.products) sessionStorage.setItem('nuvra_products', data.products);
        if (data.stats) sessionStorage.setItem('nuvra_stats', data.stats);
        if (data.insights) sessionStorage.setItem('nuvra_insights', data.insights);

        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch (error) {
        alert('Erro ao importar arquivo. Verifique o formato.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground density="low" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="mb-6">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="gap-2"
              style={{ color: colors.accent.purple }}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div
              className="p-4 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.cyan})`,
              }}
            >
              <Database className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.text.primary }}>
            Backup & Exportação
          </h1>
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            Gerencie seus dados mock para portabilidade entre projetos
          </p>
        </div>

        {exportSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert
              style={{
                backgroundColor: colors.status.success + '20',
                borderColor: colors.status.success,
              }}
            >
              <Check className="h-4 w-4" style={{ color: colors.status.success }} />
              <AlertDescription style={{ color: colors.text.primary }}>
                Backup exportado com sucesso!
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {importSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert
              style={{
                backgroundColor: colors.status.success + '20',
                borderColor: colors.status.success,
              }}
            >
              <Check className="h-4 w-4" style={{ color: colors.status.success }} />
              <AlertDescription style={{ color: colors.text.primary }}>
                Dados importados com sucesso! Recarregue a página.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="border"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.default,
            }}
          >
            <CardHeader>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: colors.accent.purple + '20' }}
              >
                <Download className="w-6 h-6" style={{ color: colors.accent.purple }} />
              </div>
              <CardTitle style={{ color: colors.text.primary }}>
                Exportar Dados
              </CardTitle>
              <CardDescription style={{ color: colors.text.tertiary }}>
                Faça backup dos seus dados mock em formato JSON
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm" style={{ color: colors.text.secondary }}>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: colors.status.success }} />
                  Todos os leads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: colors.status.success }} />
                  Produtos e API keys
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: colors.status.success }} />
                  Estatísticas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: colors.status.success }} />
                  Dados de insights
                </li>
              </ul>

              <Button
                onClick={handleExport}
                className="w-full gap-2"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.cyan})`,
                  color: colors.text.primary,
                }}
              >
                <Download className="w-4 h-4" />
                Baixar Backup (JSON)
              </Button>
            </CardContent>
          </Card>

          <Card
            className="border"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.default,
            }}
          >
            <CardHeader>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: colors.accent.cyan + '20' }}
              >
                <Upload className="w-6 h-6" style={{ color: colors.accent.cyan }} />
              </div>
              <CardTitle style={{ color: colors.text.primary }}>
                Importar Dados
              </CardTitle>
              <CardDescription style={{ color: colors.text.tertiary }}>
                Restaure um backup anterior dos seus dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert
                style={{
                  backgroundColor: colors.status.warning + '20',
                  borderColor: colors.status.warning,
                }}
              >
                <AlertDescription className="text-xs" style={{ color: colors.text.primary }}>
                  Importar substituirá todos os dados atuais. Faça backup antes!
                </AlertDescription>
              </Alert>

              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                />
                <label htmlFor="import-file">
                  <Button
                    type="button"
                    className="w-full gap-2 cursor-pointer"
                    style={{
                      backgroundColor: colors.background.tertiary,
                      borderColor: colors.accent.cyan,
                      color: colors.accent.cyan,
                      border: `2px solid ${colors.accent.cyan}`,
                    }}
                    onClick={() => document.getElementById('import-file')?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Selecionar Arquivo JSON
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card
          className="border mt-6"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.default,
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: colors.text.primary }}>
              Instruções de Migração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm" style={{ color: colors.text.secondary }}>
            <div>
              <strong style={{ color: colors.accent.purple }}>1. Exportar o Projeto Completo:</strong>
              <p className="ml-4 mt-1">
                No Bolt, use "Download ZIP" para baixar todo o código do projeto.
              </p>
            </div>
            <div>
              <strong style={{ color: colors.accent.cyan }}>2. Exportar os Dados Mock:</strong>
              <p className="ml-4 mt-1">
                Use o botão "Baixar Backup (JSON)" acima para salvar seus dados.
              </p>
            </div>
            <div>
              <strong style={{ color: colors.accent.purple }}>3. Importar em Nova Conta:</strong>
              <p className="ml-4 mt-1">
                Upload do ZIP no novo Bolt, então importe o JSON de backup nesta página.
              </p>
            </div>
            <div
              className="p-3 rounded-lg mt-4"
              style={{ backgroundColor: colors.background.tertiary }}
            >
              <p className="text-xs" style={{ color: colors.text.tertiary }}>
                Para instruções detalhadas, consulte README_MIGRATION.md no repositório.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
