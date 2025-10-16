import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { status: 'error', error: 'supabase_not_configured', message: 'Database not configured' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseClient();

    const { data: sources, error } = await supabase
      .from('leads')
      .select('origin')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { status: 'error', error: 'database_error', message: error.message },
        { status: 500 }
      );
    }

    const uniqueSources = Array.from(new Set(sources.map((s) => s.origin))).filter(Boolean);

    const sourceStats = await Promise.all(
      uniqueSources.map(async (origin) => {
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('origin', origin);

        const { data: qualityData } = await supabase
          .from('leads')
          .select('qualification')
          .eq('origin', origin);

        const hotLeads = qualityData?.filter((l) => l.qualification === 'hot').length || 0;
        const warmLeads = qualityData?.filter((l) => l.qualification === 'warm').length || 0;
        const coldLeads = qualityData?.filter((l) => l.qualification === 'cold').length || 0;

        return {
          origin,
          total: count || 0,
          hot: hotLeads,
          warm: warmLeads,
          cold: coldLeads,
        };
      })
    );

    console.log(`Fetched ${uniqueSources.length} unique sources`);

    return NextResponse.json({
      status: 'success',
      data: sourceStats,
    });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
