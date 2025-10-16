'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import IntegrationList from '@/components/integrations/IntegrationList';
import IntegrationForm from '@/components/integrations/IntegrationForm';
import IntegrationDetail from '@/components/integrations/IntegrationDetail';
import { Integration } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setIntegrations(data as Integration[]);
      }
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<Integration>) => {
    try {
      const supabase = getSupabaseClient();

      if (editingIntegration) {
        const { error } = await supabase
          .from('integrations')
          .update(data)
          .eq('id', editingIntegration.id);

        if (!error) {
          fetchIntegrations();
          setShowForm(false);
          setEditingIntegration(null);
        }
      } else {
        const { error } = await supabase.from('integrations').insert([data]);

        if (!error) {
          fetchIntegrations();
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error('Error saving integration:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta integração?')) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('integrations').delete().eq('id', id);

      if (!error) {
        fetchIntegrations();
      }
    } catch (error) {
      console.error('Error deleting integration:', error);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('integrations').update({ active }).eq('id', id);

      if (!error) {
        fetchIntegrations();
      }
    } catch (error) {
      console.error('Error toggling integration:', error);
    }
  };

  const handleEdit = (integration: Integration) => {
    setEditingIntegration(integration);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingIntegration(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0b15]">
      <Header
        title="Integrações"
        subtitle="Gerencie conexões com ferramentas externas"
      />

      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400">
              {integrations.length} integrações configuradas
            </p>
          </div>
          <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Integração
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : (
          <IntegrationList
            integrations={integrations}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onView={setSelectedIntegration}
          />
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl bg-[#1a1a2e] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingIntegration ? 'Editar' : 'Nova'} Integração
            </DialogTitle>
          </DialogHeader>
          <IntegrationForm
            integration={editingIntegration || undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingIntegration(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {selectedIntegration && (
        <IntegrationDetail
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
        />
      )}
    </div>
  );
}
