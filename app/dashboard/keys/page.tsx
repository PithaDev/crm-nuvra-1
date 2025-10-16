'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { ApiKey, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Copy, Trash2, Key, AlertCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyData, setNewKeyData] = useState({ name: '', product_id: '' });
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();

      const [keysResult, productsResult] = await Promise.all([
        supabase.from('api_keys').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('name'),
      ]);

      if (keysResult.data) setApiKeys(keysResult.data as ApiKey[]);
      if (productsResult.data) setProducts(productsResult.data as Product[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (!newKeyData.name) {
      alert('Por favor, insira um nome para a chave');
      return;
    }

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKeyData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setGeneratedKey(result.data.key);
        setNewKeyData({ name: '', product_id: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error generating key:', error);
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm('Tem certeza que deseja revogar esta chave? Esta ação não pode ser desfeita.'))
      return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('api_keys').delete().eq('id', id);

      if (!error) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <Header title="API Keys" subtitle="Gerencie chaves de acesso à API" />

      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">{apiKeys.length} chaves ativas</p>
          </div>
          <Button onClick={() => setShowNewKeyDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Chave
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            As chaves de API são exibidas apenas uma vez no momento da criação. Guarde-as em um local
            seguro.
          </AlertDescription>
        </Alert>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Prefixo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Uso</TableHead>
                  <TableHead>Criada Em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      Nenhuma chave criada
                    </TableCell>
                  </TableRow>
                ) : (
                  apiKeys.map((key) => {
                    const product = products.find((p) => p.id === key.product_id);
                    return (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {key.key_prefix}...
                          </code>
                        </TableCell>
                        <TableCell>{product?.name || 'Geral'}</TableCell>
                        <TableCell>
                          <Badge variant={key.active ? 'default' : 'secondary'}>
                            {key.active ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {key.last_used_at
                            ? format(new Date(key.last_used_at), 'dd/MM/yyyy', { locale: ptBR })
                            : 'Nunca'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(key.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteKey(key.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Chave de API</DialogTitle>
          </DialogHeader>

          {generatedKey ? (
            <div className="space-y-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  Esta é a única vez que você verá esta chave. Copie e guarde-a em um local seguro.
                </AlertDescription>
              </Alert>

              <div>
                <Label>Sua Chave de API</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={generatedKey} readOnly className="font-mono text-sm" />
                  <Button onClick={() => copyToClipboard(generatedKey)} variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => {
                  setGeneratedKey(null);
                  setShowNewKeyDialog(false);
                }}
                className="w-full"
              >
                Fechar
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">Nome da Chave</Label>
                <Input
                  id="keyName"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                  placeholder="Ex: Produção - API Principal"
                />
              </div>

              <div>
                <Label htmlFor="product">Produto (Opcional)</Label>
                <Select
                  value={newKeyData.product_id}
                  onValueChange={(value) => setNewKeyData({ ...newKeyData, product_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum (Geral)</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={generateApiKey}>Gerar Chave</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
