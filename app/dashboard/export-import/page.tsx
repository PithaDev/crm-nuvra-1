'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, Database, FileJson, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ExportImportPage() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setResult(null);

    try {
      const response = await fetch('/api/dev/export-all');
      const data = await response.json();

      if (data.status === 'success') {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nuvra-crm-backup-${new Date().toISOString()}.json`;
        a.click();

        setResult({
          success: true,
          message: 'Dados exportados com sucesso!',
        });
      } else {
        setResult({
          success: false,
          message: data.message || 'Erro ao exportar dados',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao exportar dados',
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const response = await fetch('/api/dev/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      setResult({
        success: result.status === 'success',
        message: result.message || 'Dados importados com sucesso!',
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao importar dados. Verifique o formato do arquivo.',
      });
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <Header
        title="Exportar & Importar"
        subtitle="Faça backup e restaure seus dados"
      />

      <div className="p-8 space-y-6 max-w-4xl">
        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'}>
            {result.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Exportar Dados</h3>
              <p className="text-gray-600 mb-4">
                Faça download de todos os seus dados em formato JSON. Inclui leads, produtos,
                integrações e configurações.
              </p>
              <Button onClick={handleExport} disabled={exporting}>
                {exporting ? (
                  <>Exportando...</>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Todos os Dados
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Importar Dados</h3>
              <p className="text-gray-600 mb-4">
                Restaure seus dados a partir de um arquivo JSON de backup. Todos os dados existentes
                serão preservados.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={importing}
                  className="hidden"
                  id="import-file"
                />
                <Button asChild disabled={importing}>
                  <label htmlFor="import-file" className="cursor-pointer">
                    {importing ? (
                      <>Importando...</>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Selecionar Arquivo
                      </>
                    )}
                  </label>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Dica:</strong> Faça backups regulares dos seus dados para evitar perda de
            informações importantes. Os backups podem ser usados para migrar entre ambientes ou
            restaurar dados.
          </AlertDescription>
        </Alert>

        <Card className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            Formato do Arquivo
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            O arquivo de exportação contém os seguintes dados:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Leads e histórico de interações</li>
            <li>Produtos e configurações de API</li>
            <li>Integrações e mapeamentos</li>
            <li>Logs de integrações (últimos 30 dias)</li>
            <li>Metadados e configurações do sistema</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
