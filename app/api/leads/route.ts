import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { LeadSchema, PaginationSchema } from '@/lib/validations';
import { scoreLead } from '@/lib/scoring';
import { z } from 'zod';
import { leads as mockLeads } from '@/data/seed';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { status: 'error', error: 'missing_api_key', message: 'API key is required in x-api-key header' },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { status: 'error', error: 'supabase_not_configured', message: 'Supabase credentials missing in .env. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseClient();

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, api_enabled')
      .eq('api_key', apiKey)
      .maybeSingle();

    if (productError) {
      return NextResponse.json(
        { status: 'error', error: 'database_error', message: productError.message },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { status: 'error', error: 'invalid_api_key', message: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (!product.api_enabled) {
      return NextResponse.json(
        { status: 'error', error: 'api_disabled', message: 'API access is disabled for this product' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = LeadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'validation_error',
          message: 'Invalid lead data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const leadData = validationResult.data;

    if (!leadData.qualification) {
      const scoringResult = scoreLead(leadData);
      leadData.qualification = scoringResult.qualification;
      leadData.metadata = {
        ...leadData.metadata,
        scoring: {
          score: scoringResult.score,
          reasons: scoringResult.reasons,
        },
      };
    }

    leadData.product_id = product.id;

    const { data: insertedLead, error: insertError } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { status: 'error', error: 'insert_error', message: insertError.message },
        { status: 500 }
      );
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead.created',
            lead: insertedLead,
            product: product.name,
          }),
        });
      } catch (webhookError) {
        console.warn('Failed to send webhook to n8n:', webhookError);
      }
    }

    return NextResponse.json({
      status: 'success',
      leadId: insertedLead.id,
      qualification: insertedLead.qualification,
      data: insertedLead,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paginationResult = PaginationSchema.safeParse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '50',
    });

    if (!paginationResult.success) {
      return NextResponse.json(
        { status: 'error', error: 'validation_error', details: paginationResult.error.errors },
        { status: 400 }
      );
    }

    const { page, limit } = paginationResult.data;
    const offset = (page - 1) * limit;

    if (!isSupabaseConfigured()) {
      const paginatedMockLeads = mockLeads.slice(offset, offset + limit);
      return NextResponse.json({
        status: 'success',
        data: paginatedMockLeads,
        pagination: {
          page,
          limit,
          total: mockLeads.length,
          totalPages: Math.ceil(mockLeads.length / limit),
        },
        mode: 'mock',
      });
    }

    const supabase = getSupabaseClient();

    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { status: 'error', error: 'database_error', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: leads,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json(
        { status: 'error', error: 'missing_id', message: 'Lead ID is required' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { status: 'error', error: 'supabase_not_configured', message: 'Database not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const supabase = getSupabaseClient();

    const { data: updatedLead, error } = await supabase
      .from('leads')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { status: 'error', error: 'update_error', message: error.message },
        { status: 500 }
      );
    }

    console.log(`Lead updated: ${leadId}`);

    return NextResponse.json({
      status: 'success',
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json(
        { status: 'error', error: 'missing_id', message: 'Lead ID is required' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { status: 'error', error: 'supabase_not_configured', message: 'Database not configured' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (error) {
      return NextResponse.json(
        { status: 'error', error: 'delete_error', message: error.message },
        { status: 500 }
      );
    }

    console.log(`Lead deleted: ${leadId}`);

    return NextResponse.json({
      status: 'success',
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { status: 'error', error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
