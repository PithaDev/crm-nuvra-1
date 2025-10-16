'use client';

import { useState } from 'react';
import { Integration } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Key, Settings } from 'lucide-react';

interface CalendarFormProps {
  calendar?: Integration;
  onSave: (data: Partial<Integration>) => void;
  onCancel: () => void;
}

export default function CalendarForm({ calendar, onSave, onCancel }: CalendarFormProps) {
  const [formData, setFormData] = useState({
    name: calendar?.name || '',
    type: (calendar?.type as 'google_calendar' | 'apple_calendar') || 'google_calendar',
    config: calendar?.config ? JSON.stringify(calendar.config, null, 2) : '{}',
    active: calendar?.active ?? true,
  });

  const [googleConfig, setGoogleConfig] = useState({
    clientId: calendar?.config?.clientId || '',
    clientSecret: calendar?.config?.clientSecret || '',
    refreshToken: calendar?.config?.refreshToken || '',
    calendarId: calendar?.config?.calendarId || 'primary',
  });

  const [appleConfig, setAppleConfig] = useState({
    username: calendar?.config?.username || '',
    password: calendar?.config?.password || '',
    caldavUrl: calendar?.config?.caldavUrl || 'https://caldav.icloud.com',
    calendarName: calendar?.config?.calendarName || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let config = {};

      if (formData.type === 'google_calendar') {
        config = googleConfig;
      } else if (formData.type === 'apple_calendar') {
        config = appleConfig;
      }

      const data: Partial<Integration> = {
        name: formData.name,
        type: formData.type,
        config,
        active: formData.active,
      };

      onSave(data);
    } catch (error) {
      alert('Erro ao processar configuração. Verifique os campos.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-gray-300">Nome da Conexão</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Ex: Meu Google Calendar Principal"
          className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      <div>
        <Label htmlFor="type" className="text-gray-300">Tipo de Calendário</Label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            setFormData({ ...formData, type: value as 'google_calendar' | 'apple_calendar' })
          }
        >
          <SelectTrigger className="bg-[#0b0b15] border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-gray-700">
            <SelectItem value="google_calendar" className="text-white hover:bg-gray-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Google Calendar
              </div>
            </SelectItem>
            <SelectItem value="apple_calendar" className="text-white hover:bg-gray-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Apple Calendar (iCloud)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="credentials" className="w-full">
        <TabsList className="bg-[#0b0b15] border-gray-700">
          <TabsTrigger value="credentials" className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-white">
            <Key className="w-4 h-4 mr-2" />
            Credenciais
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-4 mt-4">
          {formData.type === 'google_calendar' ? (
            <>
              <div>
                <Label htmlFor="clientId" className="text-gray-300">Client ID</Label>
                <Input
                  id="clientId"
                  value={googleConfig.clientId}
                  onChange={(e) => setGoogleConfig({ ...googleConfig, clientId: e.target.value })}
                  placeholder="Seu Client ID do Google Cloud"
                  className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Obtenha em: Google Cloud Console → APIs & Services → Credentials
                </p>
              </div>

              <div>
                <Label htmlFor="clientSecret" className="text-gray-300">Client Secret</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  value={googleConfig.clientSecret}
                  onChange={(e) => setGoogleConfig({ ...googleConfig, clientSecret: e.target.value })}
                  placeholder="Seu Client Secret"
                  className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="refreshToken" className="text-gray-300">Refresh Token</Label>
                <Textarea
                  id="refreshToken"
                  value={googleConfig.refreshToken}
                  onChange={(e) => setGoogleConfig({ ...googleConfig, refreshToken: e.target.value })}
                  placeholder="Token de atualização OAuth 2.0"
                  rows={3}
                  className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use o OAuth 2.0 Playground para gerar o refresh token
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="username" className="text-gray-300">Apple ID / iCloud Email</Label>
                <Input
                  id="username"
                  type="email"
                  value={appleConfig.username}
                  onChange={(e) => setAppleConfig({ ...appleConfig, username: e.target.value })}
                  placeholder="seu@email.com"
                  className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">Senha Específica do App</Label>
                <Input
                  id="password"
                  type="password"
                  value={appleConfig.password}
                  onChange={(e) => setAppleConfig({ ...appleConfig, password: e.target.value })}
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gere em: appleid.apple.com → Segurança → Senhas específicas do app
                </p>
              </div>

              <div>
                <Label htmlFor="caldavUrl" className="text-gray-300">URL do CalDAV</Label>
                <Input
                  id="caldavUrl"
                  value={appleConfig.caldavUrl}
                  onChange={(e) => setAppleConfig({ ...appleConfig, caldavUrl: e.target.value })}
                  placeholder="https://caldav.icloud.com"
                  className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          {formData.type === 'google_calendar' ? (
            <div>
              <Label htmlFor="calendarId" className="text-gray-300">ID do Calendário</Label>
              <Input
                id="calendarId"
                value={googleConfig.calendarId}
                onChange={(e) => setGoogleConfig({ ...googleConfig, calendarId: e.target.value })}
                placeholder="primary"
                className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use 'primary' para o calendário principal ou o ID específico do calendário
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="calendarName" className="text-gray-300">Nome do Calendário</Label>
              <Input
                id="calendarName"
                value={appleConfig.calendarName}
                onChange={(e) => setAppleConfig({ ...appleConfig, calendarName: e.target.value })}
                placeholder="Calendário"
                className="bg-[#0b0b15] border-gray-700 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nome do calendário no iCloud onde os eventos serão sincronizados
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label htmlFor="active" className="text-gray-300">Sincronização Ativa</Label>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          <strong>Dica:</strong> Após conectar, os eventos de follow-up e reuniões com leads serão
          automaticamente criados no seu calendário.
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-gray-700 text-gray-300 hover:bg-gray-800">
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {calendar ? 'Atualizar' : 'Conectar'} Calendário
        </Button>
      </div>
    </form>
  );
}
