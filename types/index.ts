export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: 'website' | 'referral' | 'social' | 'direct' | 'api';
  qualification: 'hot' | 'warm' | 'cold' | 'quente' | 'morno' | 'frio';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'novo' | 'contatado' | 'qualificado' | 'convertido' | 'perdido';
  value: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: string;
  features: string[];
  apiEnabled: boolean;
  apiKey?: string;
  icon: string;
  color: string;
}

export interface Stats {
  totalLeads: number;
  leadsToday: number;
  conversionRate: number;
  totalRevenue: number;
  activeProducts: number;
  apiCalls: number;
}

export interface InsightData {
  date: string;
  leads: number;
  conversions: number;
  revenue: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface Integration {
  id: string;
  name: string;
  type: 'n8n' | 'meta_ads' | 'form' | 'webhook' | 'custom' | 'google_calendar' | 'apple_calendar';
  url?: string;
  headers?: Record<string, string>;
  config?: Record<string, any>;
  field_mapping?: Record<string, string>;
  active: boolean;
  last_triggered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  product_id?: string;
  key_prefix: string;
  name: string;
  active: boolean;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface IntegrationLog {
  id: string;
  integration_id?: string;
  event_type: 'webhook_received' | 'webhook_sent' | 'test' | 'error';
  payload?: any;
  status: 'success' | 'error' | 'pending';
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AnalyticsData {
  period: '7d' | '30d' | '90d';
  summary: {
    totalLeads: number;
    leadsToday: number;
    conversionRate: number;
    totalValue: number;
    hot: number;
    warm: number;
    cold: number;
  };
  bySource: Record<string, {
    total: number;
    hot: number;
    warm: number;
    cold: number;
    converted: number;
    value: number;
  }>;
  byStatus: Record<string, number>;
  byDate: Record<string, number>;
}
