import { NextResponse } from "next/server";

import { openai } from "@/lib/ai/openai";
import { buildResearchPrompt } from "@/lib/ai/prompts";
import { researchSchema } from "@/lib/ai/schemas";
import { emptyResearchOutput, extractJson, withRetries } from "@/lib/ai/utils";

function isUrl(value: string) {
  try {
    const url = new URL(value);
    return Boolean(url.protocol.startsWith("http"));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { input } = (await request.json()) as { input?: string };
    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Input is required." }, { status: 400 });
    }

    let sourceText = input;
    let sourceUrl: string | null = null;

    if (isUrl(input)) {
      sourceUrl = input;
      const response = await fetch(input, {
        headers: { "User-Agent": "KoyoClubBot/1.0" },
      });
      if (response.ok) {
        const html = await response.text();
        sourceText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 12000);
      }
    }

    const prompt = buildResearchPrompt({ input: sourceText.slice(0, 12000), url: sourceUrl });
    const requestId = crypto.randomUUID();

    console.info("[ai:research] start", { requestId, sourceUrl });

    const completion = await withRetries(() =>
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        temperature: 0.2,
      })
    );

    const content = completion.choices[0]?.message?.content ?? "{}";
    const json = extractJson(content);
    let parsed = researchSchema.safeParse({});
    try {
      parsed = researchSchema.safeParse(JSON.parse(json));
    } catch (parseError) {
      console.warn("[ai:research] parse-error", { requestId, parseError });
    }

    if (!parsed.success) {
      console.warn("[ai:research] invalid-json", { requestId, error: parsed.error });
      return NextResponse.json({ data: emptyResearchOutput() });
    }

    console.info("[ai:research] success", { requestId });
    return NextResponse.json({ data: parsed.data });
  } catch (error) {
    console.error("[ai:research] error", error);
    return NextResponse.json(
      { error: "Unable to process research request." },
      { status: 500 }
    );
  }
}
