import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(32);
  return `nuvra_${randomBytes.toString('hex')}`;
}

function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, product_id } = body;

    if (!name) {
      return NextResponse.json(
        { status: 'error', error: 'missing_name', message: 'Name is required' },
        { status: 400 }
      );
    }

    const apiKey = generateApiKey();
    const keyHash = hashKey(apiKey);
    const keyPrefix = apiKey.substring(0, 12);

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          name,
          product_id: product_id || null,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating API key:', error);
      return NextResponse.json(
        { status: 'error', error: 'database_error', message: error.message },
        { status: 500 }
      );
    }

    console.log(`API key created: ${name}`);

    return NextResponse.json({
      status: 'success',
      data: {
        id: data.id,
        key: apiKey,
      },
    });
  } catch (error) {
    console.error('Error in POST /api/keys:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
