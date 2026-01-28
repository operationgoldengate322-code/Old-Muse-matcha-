export function extractJson(content: string) {
  const trimmed = content.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }
  const match = trimmed.match(/\{[\s\S]*\}/);
  return match ? match[0] : "{}";
}

export async function withRetries<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 250
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return withRetries(fn, retries - 1, delayMs * 2);
  }
}

export function emptyResearchOutput() {
  return {
    name: "Unknown supplier",
    region: null,
    country: null,
    website: null,
    emails: [],
    socials: [],
    product_notes: "",
    moq: null,
    pricing_hints: null,
    quality_signals: [],
  };
}
