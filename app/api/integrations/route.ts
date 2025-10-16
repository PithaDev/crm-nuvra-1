import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const integrations = [
      {
        name: 'n8n Automation',
        type: 'webhook',
        status: process.env.N8N_WEBHOOK_URL ? 'active' : 'inactive',
        endpoint: process.env.N8N_WEBHOOK_URL || null,
        description: 'Sends new leads to n8n for automation workflows',
      },
      {
        name: 'Meta Ads',
        type: 'webhook',
        status: 'available',
        endpoint: '/api/webhooks/meta',
        description: 'Receives leads from Meta Ads campaigns',
      },
      {
        name: 'External Forms',
        type: 'webhook',
        status: 'available',
        endpoint: '/api/webhooks/form',
        description: 'Receives leads from external forms (Google Forms, Typeform, etc)',
      },
      {
        name: 'Supabase Database',
        type: 'database',
        status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'active' : 'inactive',
        description: 'Primary data storage for leads and products',
      },
    ];

    console.log(`Integrations status checked`);

    return NextResponse.json({
      status: 'success',
      data: integrations,
    });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { integration, action } = await request.json();

    if (action === 'test') {
      if (integration === 'n8n' && process.env.N8N_WEBHOOK_URL) {
        const testPayload = {
          event: 'test',
          timestamp: new Date().toISOString(),
          message: 'Test from CRM integration',
        };

        const response = await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testPayload),
        });

        if (response.ok) {
          console.log('n8n test successful');
          return NextResponse.json({
            status: 'success',
            message: 'n8n connection test successful',
          });
        } else {
          return NextResponse.json(
            { status: 'error', error: 'test_failed', message: 'n8n test failed' },
            { status: 500 }
          );
        }
      }

      return NextResponse.json(
        { status: 'error', error: 'invalid_test', message: 'Integration not available for testing' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: 'error', error: 'invalid_action', message: 'Unknown action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error testing integration:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
