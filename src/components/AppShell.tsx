import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Moon, Sun, Mail, NotebookPen, MessagesSquare, LayoutGrid, Library, Command, FlaskConical, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/workspace";
const nav = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/email", label: "Email", icon: Mail },
  { to: "/summarizer", label: "Notes", icon: NotebookPen },
  { to: "/chat", label: "Chat", icon: MessagesSquare },
  { to: "/library", label: "Library", icon: Library },
] as const;
export function AppShell({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const { demo, setDemo } = useWorkspace();
  useEffect(() => { setDark(localStorage.getItem("sa-theme") === "dark"); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-navy text-navy-foreground"><Command className="h-6 w-6" /></span><span className="font-display text-lg font-bold">SmartWork <span className="text-primary">AI</span><span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Your productivity workspace</span></span></Link>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border p-1" role="group" aria-label="AI mode">
            <Button size="sm" variant={demo ? "ghost" : "default"} onClick={() => setDemo(false)} aria-pressed={!demo}><Radio /> Live AI</Button>
            <Button size="sm" variant={demo ? "default" : "ghost"} onClick={() => setDemo(true)} aria-pressed={demo}><FlaskConical /> Demo</Button>
          </div>
          <Button variant="ghost" size="icon" title="Toggle dark mode" aria-label="Toggle dark mode" onClick={() => { const next = !dark; setDark(next); localStorage.setItem("sa-theme", next ? "dark" : "light"); }}>{dark ? <Sun /> : <Moon />}</Button>
        </div>
      </div>
      <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4" aria-label="Main navigation">{nav.map(({to,label,icon:Icon}) => <Button asChild key={to} variant="ghost" className="h-12 shrink-0 rounded-none border-b-2 border-transparent text-muted-foreground has-[[data-status=active]]:border-primary"><Link to={to} activeOptions={{exact:true}} className="data-[status=active]:border-primary data-[status=active]:text-primary"><Icon className="h-4 w-4" />{label}</Link></Button>)}</nav>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-border px-4 py-5 text-xs text-muted-foreground"><span>SmartWork AI Assistant</span><span>{demo ? "Demo mode · Offline examples" : "Live AI · Usage credits apply"} · Saved on this device</span></footer>
  </div>;
}
export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) { return <div className="mb-7 animate-rise"><h1 className="text-3xl font-bold">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{subtitle}</p></div>; }
