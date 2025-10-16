import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('integration_logs')
      .select('*')
      .eq('integration_id', params.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching logs:', error);
      return NextResponse.json(
        { status: 'error', error: 'database_error', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: data || [],
    });
  } catch (error) {
    console.error('Error in GET /api/integrations/[id]/logs:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
