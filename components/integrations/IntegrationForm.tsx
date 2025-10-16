'use client';

import { useState, useEffect } from 'react';
import { Integration } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface IntegrationFormProps {
  integration?: Integration;
  onSave: (data: Partial<Integration>) => void;
  onCancel: () => void;
}

export default function IntegrationForm({ integration, onSave, onCancel }: IntegrationFormProps) {
  const [formData, setFormData] = useState({
    name: integration?.name || '',
    type: integration?.type || 'webhook',
    url: integration?.url || '',
    headers: integration?.headers ? JSON.stringify(integration.headers, null, 2) : '{}',
    config: integration?.config ? JSON.stringify(integration.config, null, 2) : '{}',
    field_mapping: integration?.field_mapping
      ? JSON.stringify(integration.field_mapping, null, 2)
      : '{}',
    active: integration?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const integrationTypes = ['n8n', 'meta_ads', 'form', 'webhook', 'custom'] as const;
      const validType = integrationTypes.includes(formData.type as any)
        ? (formData.type as Integration['type'])
        : 'webhook';

      const data: Partial<Integration> = {
        name: formData.name,
        type: validType,
        url: formData.url || undefined,
        headers: JSON.parse(formData.headers),
        config: JSON.parse(formData.config),
        field_mapping: JSON.parse(formData.field_mapping),
        active: formData.active,
      };

      onSave(data);
    } catch (error) {
      alert('Erro ao processar JSON. Verifique os campos.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-gray-300">Nome da Integração</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Ex: n8n Webhook Principal"
          className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      <div>
        <Label htmlFor="type" className="text-gray-300">Tipo</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as Integration['type'] })}
        >
          <SelectTrigger className="bg-[#0b0b15] border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-gray-700">
            <SelectItem value="n8n" className="text-white hover:bg-gray-800">n8n Webhook</SelectItem>
            <SelectItem value="meta_ads" className="text-white hover:bg-gray-800">Meta Ads</SelectItem>
            <SelectItem value="form" className="text-white hover:bg-gray-800">Formulário</SelectItem>
            <SelectItem value="webhook" className="text-white hover:bg-gray-800">Webhook Genérico</SelectItem>
            <SelectItem value="custom" className="text-white hover:bg-gray-800">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="url" className="text-gray-300">URL do Webhook</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://..."
          className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      <div>
        <Label htmlFor="headers" className="text-gray-300">Headers (JSON)</Label>
        <Textarea
          id="headers"
          value={formData.headers}
          onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
          rows={4}
          className="font-mono text-sm bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
          placeholder='{"Authorization": "Bearer token"}'
        />
      </div>

      <div>
        <Label htmlFor="field_mapping" className="text-gray-300">Mapeamento de Campos (JSON)</Label>
        <Textarea
          id="field_mapping"
          value={formData.field_mapping}
          onChange={(e) => setFormData({ ...formData, field_mapping: e.target.value })}
          rows={4}
          className="font-mono text-sm bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
          placeholder='{"full_name": "name", "email_address": "email"}'
        />
        <p className="text-xs text-gray-500 mt-1">
          Mapeia campos recebidos (chave) para campos do CRM (valor)
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
          className="data-[state=checked]:bg-blue-600"
        />
        <Label htmlFor="active" className="text-gray-300">Integração Ativa</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-gray-700 text-gray-300 hover:bg-gray-800">
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {integration ? 'Atualizar' : 'Criar'} Integração
        </Button>
      </div>
    </form>
  );
}
