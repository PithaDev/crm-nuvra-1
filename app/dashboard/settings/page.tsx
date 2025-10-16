'use client';

import Header from '@/components/Header';
import { colors } from '@/styles/design-tokens';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Settings as SettingsIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div>
      <Header
        title="Configurações"
        subtitle="Gerencie suas preferências e dados"
      />

      <div className="p-8 space-y-6">
        <Card
          className="border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.default,
          }}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.accent.purple + '20' }}
              >
                <SettingsIcon className="w-5 h-5" style={{ color: colors.accent.purple }} />
              </div>
              <div>
                <CardTitle style={{ color: colors.text.primary }}>
                  Preferências
                </CardTitle>
                <CardDescription style={{ color: colors.text.tertiary }}>
                  Configure as opções do sistema
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.background.tertiary }}
            >
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                Esta seção estará disponível quando o backend for integrado.
              </p>
            </div>
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
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.accent.cyan + '20' }}
              >
                <Database className="w-5 h-5" style={{ color: colors.accent.cyan }} />
              </div>
              <div>
                <CardTitle style={{ color: colors.text.primary }}>
                  Gerenciamento de Dados
                </CardTitle>
                <CardDescription style={{ color: colors.text.tertiary }}>
                  Backup e exportação de dados mock
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Faça backup dos seus dados mock para migrar entre contas Bolt ou projetos.
            </p>
            <Button
              onClick={() => router.push('/backup')}
              className="gap-2"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.cyan})`,
                color: colors.text.primary,
              }}
            >
              <Download className="w-4 h-4" />
              Acessar Backup & Export
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
