import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Loader2, RefreshCw, Square, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — SmartAssist AI" },
      { name: "description", content: "Ask questions and follow up in a conversation with the SmartAssist AI assistant." },
      { property: "og:title", content: "AI Chatbot — SmartAssist AI" },
      { property: "og:description", content: "Your on-demand assistant for study, teaching and work questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});

const KEY = "sa-chat-history";
const SUGGESTIONS = [
  "Explain the OSI model in simple terms",
  "Give me 5 icebreakers for a training session",
  "How do I write a good lesson objective?",
];

const textOf = (m: UIMessage) => m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

function ChatPage() {
  const [input, setInput] = useState("");
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { messages, setMessages, sendMessage, status, error, stop, regenerate, clearError } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch { /* ignore */ }
    setLoaded(true);
    inputRef.current?.focus();
  }, [setMessages]);

  useEffect(() => {
    if (loaded && status !== "streaming") localStorage.setItem(KEY, JSON.stringify(messages));
  }, [messages, status, loaded]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    if (status === "ready") inputRef.current?.focus();
  }, [messages, status]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    clearError();
    sendMessage({ text: t });
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="AI Chatbot" subtitle="Ask anything. Your chat history is saved in this browser." />
        <Button variant="outline" disabled={!messages.length || busy} onClick={() => { setMessages([]); localStorage.removeItem(KEY); clearError(); }}>
          <Trash2 className="h-4 w-4" /> Clear chat
        </Button>
      </div>
      <div className="animate-rise flex h-[calc(100vh-17rem)] min-h-[420px] flex-col rounded-2xl border border-border bg-card shadow-card">
        <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Bot className="h-7 w-7" /></span>
              <p className="mt-4 font-display text-lg font-semibold">How can I help today?</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-border px-4 py-2 text-sm transition-all hover:border-primary/50 hover:bg-secondary active:scale-95">{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end animate-rise">
                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground">{textOf(m)}</div>
              </div>
            ) : (
              <div key={m.id} className="group flex gap-3 animate-rise">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Bot className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  {textOf(m) ? <Markdown>{textOf(m)}</Markdown> : <Thinking />}
                  {i === messages.length - 1 && !busy && textOf(m) && (
                    <div className="mt-2 flex gap-2 opacity-70 transition-opacity group-hover:opacity-100">
                      <CopyButton text={textOf(m)} />
                      <Button variant="ghost" size="sm" onClick={() => regenerate()}><RefreshCw className="h-4 w-4" /> Regenerate</Button>
                    </div>
                  )}
                </div>
              </div>
            ),
          )}
          {status === "submitted" && messages.at(-1)?.role === "user" && (
            <div className="flex gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Bot className="h-4 w-4" /></span><Thinking /></div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
                {error.message || "Something went wrong."}
                <Button size="sm" variant="outline" onClick={() => regenerate()}>Try again</Button>
              </AlertDescription>
            </Alert>
          )}
          <div ref={endRef} />
        </div>
        <form className="border-t border-border p-3 md:p-4" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <div className="flex items-end gap-2 rounded-xl border border-input bg-background p-2 focus-within:ring-2 focus-within:ring-ring/40">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Type your question... (Shift+Enter for new line)"
              className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] outline-none placeholder:text-muted-foreground"
            />
            {busy ? (
              <Button type="button" size="icon" variant="secondary" onClick={stop} aria-label="Stop"><Square className="h-4 w-4" /></Button>
            ) : (
              <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send"><ArrowUp className="h-4 w-4" /></Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
    </div>
  );
}
