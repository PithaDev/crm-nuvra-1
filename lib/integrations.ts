import { getSupabaseClient } from './supabase';

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  origin: string;
  metadata?: Record<string, any>;
  qualification?: 'cold' | 'warm' | 'hot';
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  value?: number;
  notes?: string;
  product_id?: string;
}

export async function sendToN8N(leadData: LeadData): Promise<boolean> {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    console.warn('N8N_WEBHOOK_URL not configured');
    return false;
  }

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'lead.created',
        lead: leadData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      console.log(`Lead sent to n8n: ${leadData.email}`);
      return true;
    } else {
      console.error(`n8n webhook failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('Error sending to n8n:', error);
    return false;
  }
}

export async function processMetaLead(metaData: any): Promise<LeadData> {
  return {
    name: metaData.full_name || metaData.name || 'Unknown',
    email: metaData.email || '',
    phone: metaData.phone_number || metaData.phone || '',
    company: metaData.company_name || '',
    origin: 'meta_ads',
    metadata: {
      campaign_id: metaData.campaign_id,
      ad_id: metaData.ad_id,
      form_id: metaData.form_id,
      raw: metaData,
    },
    qualification: 'warm',
    status: 'new',
    value: 0,
    notes: 'Lead from Meta Ads campaign',
  };
}

export async function processFormLead(formData: any): Promise<LeadData> {
  return {
    name: formData.name || formData.full_name || 'Unknown',
    email: formData.email || '',
    phone: formData.phone || formData.phone_number || '',
    company: formData.company || formData.company_name || '',
    origin: formData.source || 'form',
    metadata: {
      form_name: formData.form_name,
      form_url: formData.form_url,
      raw: formData,
    },
    qualification: 'cold',
    status: 'new',
    value: 0,
    notes: formData.message || formData.notes || 'Lead from external form',
  };
}

export async function saveLead(leadData: LeadData): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    const supabase = getSupabaseClient();

    const { data: insertedLead, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (error) {
      console.error('Error saving lead:', error);
      return { success: false, error: error.message };
    }

    console.log(`Lead saved: ${insertedLead.id}`);

    await sendToN8N(insertedLead);

    return { success: true, leadId: insertedLead.id };
  } catch (error) {
    console.error('Error in saveLead:', error);
    return { success: false, error: String(error) };
  }
}
