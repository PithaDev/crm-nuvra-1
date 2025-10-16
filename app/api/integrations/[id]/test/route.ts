import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    const { data: integration, error: fetchError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !integration) {
      return NextResponse.json(
        { status: 'error', error: 'not_found', message: 'Integration not found' },
        { status: 404 }
      );
    }

    if (!integration.url) {
      return NextResponse.json(
        { status: 'error', error: 'no_url', message: 'Integration has no URL configured' },
        { status: 400 }
      );
    }

    const testPayload = {
      test: true,
      timestamp: new Date().toISOString(),
      sample_lead: {
        name: 'Teste Nuvra',
        email: 'teste@nuvra.com',
        phone: '+5511999999999',
        origin: 'integrations_test',
      },
    };

    try {
      const response = await fetch(integration.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(integration.headers || {}),
        },
        body: JSON.stringify(testPayload),
      });

      const status = response.ok ? 'success' : 'error';
      const responseText = await response.text();

      await supabase.from('integration_logs').insert([
        {
          integration_id: id,
          event_type: 'test',
          payload: testPayload,
          status,
          error_message: response.ok ? null : `HTTP ${response.status}: ${responseText}`,
          metadata: {
            status_code: response.status,
            response: responseText,
          },
        },
      ]);

      await supabase
        .from('integrations')
        .update({ last_triggered_at: new Date().toISOString() })
        .eq('id', id);

      console.log(`Integration test ${status} for ${integration.name}`);

      return NextResponse.json({
        status,
        message: response.ok ? 'Teste realizado com sucesso' : 'Teste falhou',
      });
    } catch (webhookError: any) {
      await supabase.from('integration_logs').insert([
        {
          integration_id: id,
          event_type: 'test',
          payload: testPayload,
          status: 'error',
          error_message: webhookError.message,
        },
      ]);

      return NextResponse.json(
        {
          status: 'error',
          error: 'webhook_failed',
          message: `Erro ao chamar webhook: ${webhookError.message}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/integrations/[id]/test:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
