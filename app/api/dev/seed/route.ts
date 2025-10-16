import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { seedData } from '@/data/seed';

export async function POST(request: NextRequest) {
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
    const results = {
      products: { inserted: 0, errors: [] as string[] },
      leads: { inserted: 0, errors: [] as string[] },
    };

    for (const product of seedData.products) {
      const { error } = await supabase.from('products').insert(product);
      if (error) {
        if (!error.message.includes('duplicate')) {
          results.products.errors.push(error.message);
        }
      } else {
        results.products.inserted++;
      }
    }

    for (const lead of seedData.leads) {
      const { error } = await supabase.from('leads').insert(lead);
      if (error) {
        if (!error.message.includes('duplicate')) {
          results.leads.errors.push(error.message);
        }
      } else {
        results.leads.inserted++;
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database seeded successfully',
      results,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
