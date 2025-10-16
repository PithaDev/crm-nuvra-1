'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors } from '@/styles/design-tokens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import { mockUsers } from '@/data/seed';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDemoMode = process.env.NEXT_PUBLIC_DEV_BOOTSTRAP === 'true';
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);

      if (user) {
        sessionStorage.setItem('nuvra_auth', JSON.stringify({
          isAuthenticated: true,
          user,
          token: 'mock_token_' + Date.now(),
        }));
        router.push('/dashboard');
      } else {
        setError('Email ou senha inválidos. Use: demo@nuvracrm.com');
      }
      setLoading(false);
    }, 800);
  };

  const handleDemoMode = () => {
    const demoUser = mockUsers[1];
    sessionStorage.setItem('nuvra_auth', JSON.stringify({
      isAuthenticated: true,
      user: demoUser,
      token: 'demo_token_' + Date.now(),
    }));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground density="low" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img
              src="/logo.png"
              alt="Nuvra CRM Logo"
              className="w-12 h-12"
            />
            <h1 className="text-4xl font-bold" style={{ color: colors.text.primary }}>
              Nuvra CRM
            </h1>
          </div>
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            Bem-vindo ao seu CRM inteligente
          </p>
        </div>

        <Card
          className="border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.default,
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: colors.text.primary }}>Login</CardTitle>
            <CardDescription style={{ color: colors.text.tertiary }}>
              Entre com suas credenciais ou use o modo demo
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {isDemoMode && !apiBase && (
              <Alert
                style={{
                  backgroundColor: colors.accent.cyan + '20',
                  borderColor: colors.accent.cyan,
                }}
              >
                <Info className="h-4 w-4" style={{ color: colors.accent.cyan }} />
                <AlertDescription style={{ color: colors.text.primary }}>
                  Rodando em modo demo com dados mock locais
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert
                style={{
                  backgroundColor: colors.status.error + '20',
                  borderColor: colors.status.error,
                }}
              >
                <AlertDescription style={{ color: colors.text.primary }}>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label style={{ color: colors.text.secondary }}>Email</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    backgroundColor: colors.background.tertiary,
                    borderColor: colors.border.default,
                    color: colors.text.primary,
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ color: colors.text.secondary }}>Senha</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    backgroundColor: colors.background.tertiary,
                    borderColor: colors.border.default,
                    color: colors.text.primary,
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.cyan})`,
                  color: colors.text.primary,
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {isDemoMode && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" style={{ borderColor: colors.border.default }} />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span
                      className="px-2"
                      style={{
                        backgroundColor: colors.background.secondary,
                        color: colors.text.tertiary,
                      }}
                    >
                      Ou
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleDemoMode}
                  style={{
                    borderColor: colors.accent.cyan,
                    color: colors.accent.cyan,
                  }}
                >
                  <Database className="w-4 h-4" />
                  Rodar em Modo Demo (Offline)
                </Button>

                <div
                  className="text-xs p-3 rounded-lg"
                  style={{
                    backgroundColor: colors.background.tertiary,
                    color: colors.text.tertiary,
                  }}
                >
                  <strong style={{ color: colors.text.secondary }}>Credenciais demo:</strong>
                  <br />
                  Email: demo@nuvracrm.com
                  <br />
                  Email: admin@nuvracrm.com
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div
          className="mt-6 text-center text-sm p-4 rounded-lg"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.tertiary,
          }}
        >
          <p className="mb-2">
            <strong style={{ color: colors.text.secondary }}>📦 Projeto Portável</strong>
          </p>
          <p>
            Este projeto pode ser exportado e importado entre contas Bolt.
            <br />
            Veja README_MIGRATION.md para instruções.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
