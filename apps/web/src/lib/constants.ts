export const supplierStatuses = [
  "discovered",
  "qualified",
  "contacted",
  "responded",
  "sampling",
  "negotiation",
  "approved",
  "onboarded",
] as const;

export type SupplierStatus = (typeof supplierStatuses)[number];
