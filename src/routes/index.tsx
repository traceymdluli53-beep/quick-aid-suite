import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessagesSquare, NotebookPen } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartAssist AI — Emails, meeting notes & chat in one place" },
      { name: "description", content: "Write professional emails, summarize meeting notes and chat with an AI assistant. No sign-up needed." },
      { property: "og:title", content: "SmartAssist AI" },
      { property: "og:description", content: "Three AI productivity tools in one dashboard. No sign-up needed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Turn a topic and a few points into a polished email in the tone you need.", tag: "Write" },
  { to: "/summarizer", icon: NotebookPen, title: "Meeting Notes Summarizer", desc: "Paste messy notes, get key points, decisions, action items and deadlines.", tag: "Summarize" },
  { to: "/chat", icon: MessagesSquare, title: "AI Chatbot", desc: "Ask anything and keep the conversation going with follow-up questions.", tag: "Ask" },
] as const;

function Dashboard() {
  return (
    <div>
      <section className="animate-rise py-6 md:py-12">
        <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          No sign-up · Free to use
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Less admin. <span className="text-primary">More doing.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          SmartAssist AI brings three time-saving tools together for students, educators, IT facilitators and professionals.
        </p>
      </section>
      <section className="grid gap-5 md:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, desc, tag }, i) => (
          <Link
            key={to}
            to={to}
            style={{ animationDelay: `${100 + i * 80}ms` }}
            className="group animate-rise rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{tag}</span>
            </div>
            <h2 className="mt-6 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Open tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
