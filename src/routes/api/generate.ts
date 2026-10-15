import { createFileRoute } from "@tanstack/react-router";
import { streamAi } from "@/lib/ai/gateway.server";

const EMAIL_PROMPT =
  "You write professional emails. Output ONLY the email: first line 'Subject: ...', a blank line, then the body with greeting and sign-off (use [Your Name] as placeholder). No commentary, no markdown formatting.";

const SUMMARY_PROMPT = `You summarize meeting notes. Output markdown with exactly these sections:
## Summary
(2-4 sentence overview)
## Key Points
## Decisions
## Action Items
(format: - **Owner**: task — *due date if known*)
## Deadlines
Write "None identified" under a section if nothing applies. Do not invent facts.`;

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { kind?: string; topic?: string; recipient?: string; points?: string; tone?: string; variation?: string; notes?: string };
        if (body.kind === "email") {
          const { topic, recipient, points, tone, variation } = body;
          if (!topic?.trim()) return Response.json({ error: "Please add a topic." }, { status: 400 });
          const prompt = `Write an email.\nTopic: ${topic}\nRecipient: ${recipient || "unspecified"}\nTone: ${tone || "professional"}\nKey points:\n${points || "(none)"}${variation ? "\nWrite a fresh variation, different from previous drafts." : ""}`;
          return streamAi(request, EMAIL_PROMPT, [{ role: "user", content: prompt }]);
        }
        if (body.kind === "summary") {
          const notes = body.notes?.trim();
          if (!notes || notes.length < 20)
            return Response.json({ error: "Please paste a bit more of your meeting notes." }, { status: 400 });
          if (notes.length > 60000)
            return Response.json({ error: "Notes are too long. Please shorten them." }, { status: 400 });
          return streamAi(request, SUMMARY_PROMPT, [{ role: "user", content: notes }]);
        }
        return Response.json({ error: "Unknown request." }, { status: 400 });
      },
    },
  },
});
