import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { status: 'error', error: 'supabase_not_configured', message: 'Database not configured' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseClient();

    let dateFilter = new Date();
    if (period === '7d') {
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (period === '30d') {
      dateFilter.setDate(dateFilter.getDate() - 30);
    } else if (period === '90d') {
      dateFilter.setDate(dateFilter.getDate() - 90);
    }

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', dateFilter.toISOString());

    if (error) {
      return NextResponse.json(
        { status: 'error', error: 'database_error', message: error.message },
        { status: 500 }
      );
    }

    const totalLeads = leads.length;
    const hotLeads = leads.filter((l) => l.qualification === 'hot').length;
    const warmLeads = leads.filter((l) => l.qualification === 'warm').length;
    const coldLeads = leads.filter((l) => l.qualification === 'cold').length;

    const convertedLeads = leads.filter((l) => l.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : '0.00';

    const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);

    const leadsToday = leads.filter((l) => {
      const leadDate = new Date(l.created_at);
      const today = new Date();
      return leadDate.toDateString() === today.toDateString();
    }).length;

    const bySource = leads.reduce((acc, lead) => {
      const source = lead.origin || 'unknown';
      if (!acc[source]) {
        acc[source] = { total: 0, hot: 0, warm: 0, cold: 0, converted: 0, value: 0 };
      }
      acc[source].total++;
      acc[source][lead.qualification]++;
      if (lead.status === 'converted') acc[source].converted++;
      acc[source].value += lead.value || 0;
      return acc;
    }, {} as Record<string, any>);

    const byStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byDate = leads.reduce((acc, lead) => {
      const date = new Date(lead.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`Analytics generated for ${totalLeads} leads over ${period}`);

    return NextResponse.json({
      status: 'success',
      data: {
        period,
        summary: {
          totalLeads,
          leadsToday,
          conversionRate: parseFloat(conversionRate),
          totalValue,
          hot: hotLeads,
          warm: warmLeads,
          cold: coldLeads,
        },
        bySource,
        byStatus,
        byDate,
      },
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
