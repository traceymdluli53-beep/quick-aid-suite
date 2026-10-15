import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Moon, Sun, Mail, NotebookPen, MessagesSquare, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/email", label: "Email", icon: Mail },
  { to: "/summarizer", label: "Notes", icon: NotebookPen },
  { to: "/chat", label: "Chat", icon: MessagesSquare },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(localStorage.getItem("sa-theme") === "dark");
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background bg-hero bg-no-repeat">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">S</span>
            <span className="hidden sm:inline">SmartAssist AI</span>
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: true }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={() => {
                const next = !dark;
                setDark(next);
                localStorage.setItem("sa-theme", next ? "dark" : "light");
              }}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">{children}</main>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 animate-rise">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
