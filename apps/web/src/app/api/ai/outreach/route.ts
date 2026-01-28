import { NextResponse } from "next/server";
import { z } from "zod";

import { openai } from "@/lib/ai/openai";
import { buildOutreachPrompt } from "@/lib/ai/prompts";
import { outreachSchema } from "@/lib/ai/schemas";
import { extractJson, withRetries } from "@/lib/ai/utils";

const requestSchema = z.object({
  supplier: z.record(z.unknown()),
  brandVoice: z.string().min(1),
  goal: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = requestSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const prompt = buildOutreachPrompt(payload.data);
    const requestId = crypto.randomUUID();

    console.info("[ai:outreach] start", { requestId });

    const completion = await withRetries(() =>
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        temperature: 0.4,
      })
    );

    const content = completion.choices[0]?.message?.content ?? "{}";
    const json = extractJson(content);
    let parsed = outreachSchema.safeParse({});
    try {
      parsed = outreachSchema.safeParse(JSON.parse(json));
    } catch (parseError) {
      console.warn("[ai:outreach] parse-error", { requestId, parseError });
    }

    if (!parsed.success) {
      console.warn("[ai:outreach] invalid-json", { requestId, error: parsed.error });
      return NextResponse.json({
        subject: "Hello from Old Muse Matcha",
        body:
          "Hi there,\n\nWe are Old Muse Matcha, a curated matcha subscription brand. We would love to learn more about your matcha offerings and minimum order quantities. If you are open to it, could you share a catalog or sample options?\n\nWarmly,\nOld Muse Matcha",
      });
    }

    console.info("[ai:outreach] success", { requestId });
    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("[ai:outreach] error", error);
    return NextResponse.json(
      { error: "Unable to process outreach request." },
      { status: 500 }
    );
  }
}
