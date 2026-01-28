import { z } from "zod";

export const researchSchema = z.object({
  name: z.string().min(1),
  region: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  emails: z.array(z.string()).default([]),
  socials: z.array(z.string()).default([]),
  product_notes: z.string().default(""),
  moq: z.string().nullable().optional(),
  pricing_hints: z.string().nullable().optional(),
  quality_signals: z.array(z.string()).default([]),
});

export const outreachSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
});

export type ResearchOutput = z.infer<typeof researchSchema>;
export type OutreachOutput = z.infer<typeof outreachSchema>;
