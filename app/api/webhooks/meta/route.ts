import { NextRequest, NextResponse } from 'next/server';
import { processMetaLead, saveLead } from '@/lib/integrations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Meta webhook received:', JSON.stringify(body, null, 2));

    if (!body.email && !body.full_name) {
      return NextResponse.json(
        { status: 'error', error: 'invalid_payload', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const leadData = await processMetaLead(body);

    const result = await saveLead(leadData);

    if (!result.success) {
      return NextResponse.json(
        { status: 'error', error: 'save_failed', message: result.error },
        { status: 500 }
      );
    }

    console.log(`Meta lead processed: ${result.leadId}`);

    return NextResponse.json({
      status: 'success',
      message: 'Lead received from Meta Ads',
      leadId: result.leadId,
    });
  } catch (error) {
    console.error('Error processing Meta webhook:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'nuvra_crm_verify';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Meta webhook verified');
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json(
    { status: 'error', error: 'verification_failed', message: 'Invalid verification token' },
    { status: 403 }
  );
}
