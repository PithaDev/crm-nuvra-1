import { NextRequest, NextResponse } from 'next/server';
import { processFormLead, saveLead } from '@/lib/integrations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Form webhook received:', JSON.stringify(body, null, 2));

    if (!body.email && !body.name) {
      return NextResponse.json(
        { status: 'error', error: 'invalid_payload', message: 'Missing required fields (email or name)' },
        { status: 400 }
      );
    }

    const leadData = await processFormLead(body);

    const result = await saveLead(leadData);

    if (!result.success) {
      return NextResponse.json(
        { status: 'error', error: 'save_failed', message: result.error },
        { status: 500 }
      );
    }

    console.log(`Form lead processed: ${result.leadId}`);

    return NextResponse.json({
      status: 'success',
      message: 'Lead received from external form',
      leadId: result.leadId,
    });
  } catch (error) {
    console.error('Error processing form webhook:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
