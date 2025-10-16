'use client';

import { useState, useEffect } from 'react';
import { Integration, IntegrationLog } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TestTube, Send, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IntegrationDetailProps {
  integration: Integration;
  onClose: () => void;
}

export default function IntegrationDetail({ integration, onClose }: IntegrationDetailProps) {
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [integration.id]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/integrations/${integration.id}/logs`);
      const result = await response.json();
      if (result.status === 'success') {
        setLogs(result.data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const testWebhook = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetch(`/api/integrations/${integration.id}/test`, {
        method: 'POST',
      });
      const result = await response.json();

      setTestResult({
        success: result.status === 'success',
        message: result.message || 'Teste concluído',
      });

      fetchLogs();
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro ao executar teste',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a2e] border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{integration.name}</h2>
            <p className="text-gray-400">
              {integration.type} •{' '}
              <Badge
                variant={integration.active ? 'default' : 'secondary'}
                className={integration.active ? 'bg-green-600/20 text-green-400' : 'bg-gray-700 text-gray-400'}
              >
                {integration.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </p>
          </div>
          <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-300 hover:bg-gray-800">
            Fechar
          </Button>
        </div>

        {testResult && (
          <Alert className="mb-4" variant={testResult.success ? 'default' : 'destructive'}>
            {testResult.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#0b0b15]">
            <TabsTrigger value="info" className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-white">Informações</TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-white">Logs ({logs.length})</TabsTrigger>
            <TabsTrigger value="test" className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-white">Testes</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 text-white">URL</h3>
                <p className="text-sm text-gray-400 font-mono break-all">
                  {integration.url || 'Não configurado'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">Última Execução</h3>
                <p className="text-sm text-gray-400">
                  {integration.last_triggered_at
                    ? format(new Date(integration.last_triggered_at), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })
                    : 'Nunca'}
                </p>
              </div>
            </div>

            {integration.headers && Object.keys(integration.headers).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-white">Headers</h3>
                <pre className="text-sm bg-[#0b0b15] text-gray-300 p-3 rounded border border-gray-800 overflow-x-auto">
                  {JSON.stringify(integration.headers, null, 2)}
                </pre>
              </div>
            )}

            {integration.field_mapping && Object.keys(integration.field_mapping).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-white">Mapeamento de Campos</h3>
                <pre className="text-sm bg-[#0b0b15] text-gray-300 p-3 rounded border border-gray-800 overflow-x-auto">
                  {JSON.stringify(integration.field_mapping, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs">
            <div className="bg-[#0b0b15] rounded-lg border border-gray-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-[#1f1f3a]">
                    <TableHead className="text-gray-400">Data/Hora</TableHead>
                    <TableHead className="text-gray-400">Tipo</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-right text-gray-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                        Nenhum log disponível
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id} className="border-gray-800 hover:bg-[#1f1f3a]">
                        <TableCell className="text-gray-300">
                          {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell className="text-gray-300">{log.event_type}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.status === 'success'
                                ? 'default'
                                : log.status === 'error'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className={
                              log.status === 'success'
                                ? 'bg-green-600/20 text-green-400'
                                : log.status === 'error'
                                ? 'bg-red-600/20 text-red-400'
                                : 'bg-gray-700 text-gray-400'
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" className="hover:bg-gray-800 text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="space-y-4">
              <Button onClick={testWebhook} disabled={loading || !integration.url} className="bg-blue-600 hover:bg-blue-700">
                <TestTube className="w-4 h-4 mr-2" />
                {loading ? 'Testando...' : 'Testar Webhook'}
              </Button>

              <div>
                <h3 className="font-semibold mb-2 text-white">Payload de Teste</h3>
                <pre className="text-sm bg-[#0b0b15] text-gray-300 p-3 rounded border border-gray-800 overflow-x-auto">
                  {JSON.stringify(
                    {
                      test: true,
                      timestamp: new Date().toISOString(),
                      sample_lead: {
                        name: 'Teste Nuvra',
                        email: 'teste@nuvra.com',
                        phone: '+5511999999999',
                        origin: 'integrations_test',
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
