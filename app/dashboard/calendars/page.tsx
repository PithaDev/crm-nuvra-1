'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CalendarList from '@/components/calendars/CalendarList';
import CalendarForm from '@/components/calendars/CalendarForm';
import { Integration } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

export default function CalendarsPage() {
  const [calendars, setCalendars] = useState<Integration[]>([]);
  const [editingCalendar, setEditingCalendar] = useState<Integration | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .in('type', ['google_calendar', 'apple_calendar'])
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCalendars(data as Integration[]);
      }
    } catch (error) {
      console.error('Error fetching calendars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<Integration>) => {
    try {
      const supabase = getSupabaseClient();

      if (editingCalendar) {
        const { error } = await supabase
          .from('integrations')
          .update(data)
          .eq('id', editingCalendar.id);

        if (!error) {
          fetchCalendars();
          setShowForm(false);
          setEditingCalendar(null);
        }
      } else {
        const { error } = await supabase.from('integrations').insert([data]);

        if (!error) {
          fetchCalendars();
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error('Error saving calendar:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta integração de calendário?')) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('integrations').delete().eq('id', id);

      if (!error) {
        fetchCalendars();
      }
    } catch (error) {
      console.error('Error deleting calendar:', error);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('integrations').update({ active }).eq('id', id);

      if (!error) {
        fetchCalendars();
      }
    } catch (error) {
      console.error('Error toggling calendar:', error);
    }
  };

  const handleEdit = (calendar: Integration) => {
    setEditingCalendar(calendar);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingCalendar(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0b15]">
      <Header
        title="Calendários"
        subtitle="Conecte seu Google Calendar ou Apple Calendar para sincronizar leads e eventos"
      />

      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400">
              {calendars.length} {calendars.length === 1 ? 'calendário conectado' : 'calendários conectados'}
            </p>
          </div>
          <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Conectar Calendário
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <CalendarIcon className="w-12 h-12 text-gray-600 animate-pulse" />
              <p className="text-gray-500">Carregando calendários...</p>
            </div>
          </div>
        ) : calendars.length === 0 ? (
          <div className="bg-[#1a1a2e] rounded-lg border border-gray-800 p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum calendário conectado
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Conecte seu Google Calendar ou Apple Calendar para sincronizar automaticamente seus leads
              com eventos de calendário e nunca perder um follow-up.
            </p>
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Conectar Primeiro Calendário
            </Button>
          </div>
        ) : (
          <CalendarList
            calendars={calendars}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}

        <div className="bg-[#1a1a2e] rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Como funciona?</h3>
          <div className="space-y-3 text-gray-400">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <p>
                <strong className="text-white">Google Calendar:</strong> Use OAuth 2.0 para conectar de forma segura.
                Configure as credenciais no Google Cloud Console e adicione os escopos de calendário.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p>
                <strong className="text-white">Apple Calendar:</strong> Conecte via CalDAV usando suas credenciais do iCloud.
                Gere uma senha específica para aplicativo nas configurações de segurança do iCloud.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p>
                Sincronize automaticamente eventos de follow-up, reuniões com leads e lembretes diretamente
                no seu calendário preferido.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl bg-[#1a1a2e] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCalendar ? 'Editar' : 'Conectar'} Calendário
            </DialogTitle>
          </DialogHeader>
          <CalendarForm
            calendar={editingCalendar || undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingCalendar(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
