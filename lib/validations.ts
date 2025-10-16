import { z } from 'zod';

export const LeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().default(''),
  company: z.string().optional().default(''),
  origin: z.string().default('api'),
  metadata: z.record(z.any()).optional().default({}),
  qualification: z.enum(['cold', 'warm', 'hot']).optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional().default('new'),
  value: z.number().optional().default(0),
  notes: z.string().optional().default(''),
  product_id: z.string().uuid().optional().nullable(),
});

export type LeadInput = z.infer<typeof LeadSchema>;

export const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Product slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional().default(''),
  category: z.string().optional().default(''),
  pricing: z.string().optional().default(''),
  features: z.array(z.string()).optional().default([]),
  api_enabled: z.boolean().optional().default(false),
  api_key: z.string().optional().nullable(),
  icon: z.string().optional().default('box'),
  color: z.string().optional().default('blue'),
});

export type ProductInput = z.infer<typeof ProductSchema>;

export const InteractionSchema = z.object({
  lead_id: z.string().uuid('Invalid lead ID'),
  source: z.string().min(1, 'Source is required'),
  content: z.string().optional().default(''),
  timestamp: z.string().datetime().optional(),
});

export type InteractionInput = z.infer<typeof InteractionSchema>;

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;
