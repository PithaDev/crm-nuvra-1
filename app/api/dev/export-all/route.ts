import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceKey = searchParams.get('key');
    const expectedKey = process.env.SERVICE_KEY;

    if (!expectedKey) {
      return NextResponse.json(
        { status: 'error', error: 'service_key_not_configured', message: 'SERVICE_KEY not configured in .env' },
        { status: 500 }
      );
    }

    if (!serviceKey || serviceKey !== expectedKey) {
      return NextResponse.json(
        { status: 'error', error: 'unauthorized', message: 'Invalid or missing service key' },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { status: 'error', error: 'supabase_not_configured', message: 'Supabase not configured. Check .env' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (productsError) {
      return NextResponse.json(
        { status: 'error', error: 'products_fetch_error', message: productsError.message },
        { status: 500 }
      );
    }

    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: true });

    if (leadsError) {
      return NextResponse.json(
        { status: 'error', error: 'leads_fetch_error', message: leadsError.message },
        { status: 500 }
      );
    }

    const { data: interactions, error: interactionsError } = await supabase
      .from('interactions')
      .select('*')
      .order('created_at', { ascending: true });

    if (interactionsError) {
      return NextResponse.json(
        { status: 'error', error: 'interactions_fetch_error', message: interactionsError.message },
        { status: 500 }
      );
    }

    const exportData = {
      exported_at: new Date().toISOString(),
      version: '1.0.0',
      tables: {
        products: products || [],
        leads: leads || [],
        interactions: interactions || [],
      },
      counts: {
        products: products?.length || 0,
        leads: leads?.length || 0,
        interactions: interactions?.length || 0,
      },
    };

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="backup-${new Date().toISOString().split('T')[0]}.json"`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
