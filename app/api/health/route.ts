import { NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        supabase: {
          configured: false,
          connected: false,
          message: '',
        },
      },
    };

    if (!isSupabaseConfigured()) {
      health.checks.supabase.message = 'Supabase not configured. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY';
      health.status = 'degraded';
      return NextResponse.json(health, { status: 200 });
    }

    health.checks.supabase.configured = true;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });

      if (error) {
        health.checks.supabase.connected = false;
        health.checks.supabase.message = `Connection failed: ${error.message}`;
        health.status = 'unhealthy';
        return NextResponse.json(health, { status: 503 });
      }

      health.checks.supabase.connected = true;
      health.checks.supabase.message = 'Connected successfully';
    } catch (connectionError) {
      health.checks.supabase.connected = false;
      health.checks.supabase.message = `Connection error: ${connectionError instanceof Error ? connectionError.message : 'Unknown error'}`;
      health.status = 'unhealthy';
      return NextResponse.json(health, { status: 503 });
    }

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
