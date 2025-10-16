import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin credentials. Check SUPABASE_SERVICE_ROLE_KEY in .env');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
};

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          category: string;
          pricing: string;
          features: string[];
          api_enabled: boolean;
          api_key: string | null;
          icon: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          category?: string;
          pricing?: string;
          features?: string[];
          api_enabled?: boolean;
          api_key?: string | null;
          icon?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          category?: string;
          pricing?: string;
          features?: string[];
          api_enabled?: boolean;
          api_key?: string | null;
          icon?: string;
          color?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          company: string;
          origin: string;
          metadata: Record<string, any>;
          qualification: 'cold' | 'warm' | 'hot';
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
          value: number;
          notes: string;
          product_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          company?: string;
          origin?: string;
          metadata?: Record<string, any>;
          qualification?: 'cold' | 'warm' | 'hot';
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
          value?: number;
          notes?: string;
          product_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string;
          origin?: string;
          metadata?: Record<string, any>;
          qualification?: 'cold' | 'warm' | 'hot';
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
          value?: number;
          notes?: string;
          product_id?: string | null;
          updated_at?: string;
        };
      };
      interactions: {
        Row: {
          id: string;
          lead_id: string;
          source: string;
          content: string;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          source: string;
          content?: string;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          source?: string;
          content?: string;
          timestamp?: string;
        };
      };
    };
  };
};
