import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const MODEL = "openai/gpt-6-astra";

export function streamAi(request: Request, instructions: string, messages: ModelMessage[]) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI is not configured on the server." }, { status: 500 });
  }
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses(MODEL),
    instructions,
    messages,
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      onError: (err: unknown) => {
        const e = err as { statusCode?: number; message?: string };
        if (e?.statusCode === 429) return "Too many requests right now. Please wait a moment and try again.";
        if (e?.statusCode === 402) return "AI credits have run out. Please add credits to continue.";
        if (e?.statusCode === 403) return "This request was blocked by the AI provider.";
        return "Something went wrong while generating. Please try again.";
      },
    }),
    runIdFetch,
  );
}
