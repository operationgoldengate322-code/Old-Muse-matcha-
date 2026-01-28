import { z } from "zod";

import { supplierStatuses } from "@/lib/constants";

const optionalString = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .nullable()
  .optional();

const optionalNumber = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  },
  z.number().int().nonnegative().optional()
);

export const supplierSchema = z.object({
  name: z.string().min(1, "Name is required."),
  country: optionalString,
  region: optionalString,
  website: optionalString,
  email: optionalString,
  notes: optionalString,
  status: z.enum(supplierStatuses).default("discovered"),
  lead_score: optionalNumber,
  moq: optionalNumber,
});

export type SupplierInput = z.infer<typeof supplierSchema>;
