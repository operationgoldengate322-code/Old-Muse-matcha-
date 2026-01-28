type ResearchPromptInput = {
  input: string;
  url?: string | null;
};

export function buildResearchPrompt({ input, url }: ResearchPromptInput) {
  const system = [
    "You extract supplier data for a matcha sourcing CRM.",
    "Return only valid JSON with the exact keys provided.",
    "If a field is unknown, use null or an empty array.",
    "Never fabricate emails or prices. Be concise.",
  ].join(" ");

  const user = [
    "Extract supplier data in this JSON shape:",
    `{
  "name": string,
  "region": string | null,
  "country": string | null,
  "website": string | null,
  "emails": string[],
  "socials": string[],
  "product_notes": string,
  "moq": string | null,
  "pricing_hints": string | null,
  "quality_signals": string[]
}`,
    url ? `Source URL: ${url}` : "",
    "Source content:",
    input,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { system, user };
}

type OutreachPromptInput = {
  supplier: Record<string, unknown>;
  brandVoice: string;
  goal: string;
};

export function buildOutreachPrompt({
  supplier,
  brandVoice,
  goal,
}: OutreachPromptInput) {
  const system = [
    "You write short, human outreach emails for supplier discovery.",
    "Tone: calm, non-salesy, relationship-first.",
    "Return only JSON with subject and body fields.",
    "Keep body under 120 words and avoid pressure.",
  ].join(" ");

  const user = [
    "Brand voice:",
    brandVoice,
    "Goal:",
    goal,
    "Supplier data:",
    JSON.stringify(supplier, null, 2),
    `Return JSON: { "subject": string, "body": string }`,
  ].join("\n\n");

  return { system, user };
}
