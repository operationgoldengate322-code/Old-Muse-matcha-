import { describe, expect, it } from "vitest";

import { outreachSchema, researchSchema } from "@/lib/ai/schemas";

describe("AI schemas", () => {
  it("validates research output", () => {
    const parsed = researchSchema.safeParse({
      name: "Hoshino Tea",
      region: "Uji",
      country: "Japan",
      website: "https://example.com",
      emails: ["hello@example.com"],
      socials: ["https://instagram.com/example"],
      product_notes: "Ceremonial grade matcha",
      moq: "5kg",
      pricing_hints: "Competitive for wholesale",
      quality_signals: ["Stone-milled", "Shade-grown"],
    });
    expect(parsed.success).toBe(true);
  });

  it("validates outreach output", () => {
    const parsed = outreachSchema.safeParse({
      subject: "Hello from Old Muse Matcha",
      body: "Hi there, we would love to learn more about your matcha.",
    });
    expect(parsed.success).toBe(true);
  });
});
