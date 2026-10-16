import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessagesSquare, NotebookPen, Library, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace, itemPath } from "@/lib/workspace";
import workspaceImage from "@/assets/workspace.jpg";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "SmartWork AI Assistant — Your productivity workspace" },
    { name: "description", content: "Write emails, summarize meetings, ask questions and organize saved work in SmartWork. No login required." },
    { property: "og:title", content: "SmartWork AI Assistant" },
    { property: "og:description", content: "Your emails, meeting notes, AI conversations and saved library in one workspace." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Dashboard,
});
const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", tag: "01 / WRITE", action: "Write an email" },
  { to: "/summarizer", icon: NotebookPen, title: "Meeting Notes Summarizer", tag: "02 / ORGANIZE", action: "Summarize notes" },
  { to: "/chat", icon: MessagesSquare, title: "AI Chatbot", tag: "03 / EXPLORE", action: "Start a conversation" },
] as const;
function Dashboard() {
  const { items } = useWorkspace();
  return <div className="space-y-8">
    <section className="relative isolate overflow-hidden border-b border-border py-10 md:py-14">
      <img src={workspaceImage} width={1536} height={1024} className="absolute inset-0 -z-10 h-full w-full object-cover object-center" alt="Notebook, teal pen and laptop on a white workspace" />
      <div className="max-w-md bg-background/90 p-5 md:bg-transparent md:p-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">A little less busy. A lot more done.</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-navy">SmartWork<br/>AI Assistant</h1>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy">Clearer emails. Organized meetings.<br/>Answers that move your work forward.</p>
        <Button asChild className="mt-6"><Link to="/email">Let's get to work <ArrowRight /></Link></Button>
      </div>
    </section>
    <section><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Your tools</h2><span className="text-xs text-muted-foreground">One workspace. Three ways forward.</span></div>
      <div className="grid gap-4 md:grid-cols-3">{tools.map(({to,icon:Icon,title,tag,action}) => <Link key={to} to={to} className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary"><div className="flex items-center justify-between"><Icon className="h-7 w-7 text-primary"/><span className="text-[10px] font-semibold tracking-widest text-muted-foreground">{tag}</span></div><h3 className="mt-6 min-h-14 text-xl font-semibold">{title}</h3><span className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm text-primary">{action}<ArrowRight className="h-4 w-4"/></span></Link>)}</div>
    </section>
    <section><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-semibold"><Clock className="h-4 w-4 text-primary"/> Recent work</h2><Button asChild variant="ghost" size="sm"><Link to="/library">Saved library <ArrowRight/></Link></Button></div>
      {items.length ? <div className="divide-y divide-border">{items.slice(0,3).map(item => <Link key={item.id} to={itemPath(item.kind)} search={{saved:item.id}} className="flex items-center gap-3 py-4"><FileText className="h-5 w-5 shrink-0 text-primary"/><span className="min-w-0 flex-1 truncate font-medium">{item.title}</span><span className="text-xs text-muted-foreground">{new Date(item.updatedAt).toLocaleDateString()}</span><ArrowRight className="h-4 w-4"/></Link>)}</div> : <div className="flex items-center gap-4 border-y border-border py-7"><Library className="h-8 w-8 text-muted-foreground"/><div><p className="font-medium">A fresh start</p><p className="mt-1 text-sm text-muted-foreground">No saved work yet.</p></div></div>}
    </section>
  </div>;
}
