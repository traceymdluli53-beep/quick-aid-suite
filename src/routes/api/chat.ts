import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { streamAi } from "@/lib/ai/gateway.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages: UIMessage[] };
        if (!Array.isArray(messages) || messages.length === 0) {
          return Response.json({ error: "No messages provided." }, { status: 400 });
        }
        return streamAi(
          request,
          "You are SmartAssist, a friendly, concise assistant for students, educators, IT facilitators and professionals. Answer clearly using markdown where it helps (lists, headings, code blocks).",
          await convertToModelMessages(messages),
        );
      },
    },
  },
});
