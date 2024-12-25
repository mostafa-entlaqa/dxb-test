import * as z from 'zod'

export const formBusinessSchema = z.object({
  listingType: z.enum(['free', 'paid']),
  businessName: z.string().min(1).max(255),
  description: z.string().min(10).max(2000),
  opportunityName: z.string().min(1).max(255),
  acquisition_type: z.enum(['Buy', 'Invest']),
  investmentPercentage: z.number().min(1).max(100).optional().nullable(),
  images: z.array(z.string()).optional().default([]),
  area_id: z.number(),
  category_id: z.number(),
  monthlyRevenue: z.number().min(0),
  profitMargin: z.number().min(0).max(100),
  sellingPrice: z.number().min(0),
  revenuePerYear: z.record(z.string(), z.number()).default({}),
  cost: z.record(z.string(), z.number()).default({}),
  presentation: z.string().optional(),
  financialStatement: z.string().optional(),
  form_status: z.enum(['pending', 'published', 'cancelled']),
})

export type FormData = z.infer<typeof formBusinessSchema>
