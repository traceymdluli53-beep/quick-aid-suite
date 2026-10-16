import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UIMessage } from "ai";
import { toast } from "sonner";

export type ContentKind = "email" | "summary" | "chat";
export type SavedItem = { id: string; kind: ContentKind; title: string; content: string; fields: Record<string, string>; messages?: UIMessage[]; updatedAt: string };
type Workspace = { items: SavedItem[]; demo: boolean; ready: boolean; setDemo: (v: boolean) => void; save: (item: Omit<SavedItem, "id" | "updatedAt"> & { id?: string }) => string | undefined; remove: (id: string) => void };
const Context = createContext<Workspace | null>(null);
export const textOf = (m: UIMessage) => m.parts.map(p => p.type === "text" ? p.text : "").join("");
export const transcript = (messages: UIMessage[]) => messages.map(m => `${m.role === "user" ? "You" : "SmartWork"}: ${textOf(m)}`).join("\n\n");

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [demo, setDemoState] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("sw-library") || "[]");
      if (Array.isArray(stored)) setItems(stored.filter(i => i && typeof i.id === "string" && typeof i.content === "string" && i.fields));
      setDemoState(localStorage.getItem("sw-demo") === "true");
    } catch { toast.error("Saved content could not be read from this browser."); }
    setReady(true);
  }, []);
  function persist(next: SavedItem[]) {
    try { localStorage.setItem("sw-library", JSON.stringify(next)); setItems(next); return true; }
    catch { toast.error("Browser storage is full or unavailable. Export your content before clearing space."); return false; }
  }
  function save(item: Omit<SavedItem, "id" | "updatedAt"> & { id?: string }) {
    const id = item.id || crypto.randomUUID();
    const saved = { ...item, id, updatedAt: new Date().toISOString() };
    if (!persist([saved, ...items.filter(i => i.id !== id)])) return;
    toast.success("Saved to your library"); return id;
  }
  function setDemo(v: boolean) {
    try { localStorage.setItem("sw-demo", String(v)); setDemoState(v); }
    catch { toast.error("Mode preference could not be saved."); }
  }
  return <Context.Provider value={{ items, demo, ready, setDemo, save, remove: id => { if (persist(items.filter(i => i.id !== id))) toast.success("Deleted from library"); } }}>{children}</Context.Provider>;
}
export function useWorkspace() { const value = useContext(Context); if (!value) throw new Error("Workspace provider missing"); return value; }

export function useDraft<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { const stored = localStorage.getItem(key); if (stored) setValue(JSON.parse(stored)); } catch { /* Keep empty draft. */ }
    setLoaded(true);
  }, [key]);
  useEffect(() => { if (loaded) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Library saves report storage failures. */ } } }, [key, loaded, value]);
  return [value, setValue, loaded] as const;
}
export function exportText(title: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = `${title.replace(/[^a-z0-9 -]/gi, "").slice(0, 70) || "smartwork"}.txt`; a.click(); URL.revokeObjectURL(url);
}
export const itemPath = (kind: ContentKind) => kind === "email" ? "/email" : kind === "summary" ? "/summarizer" : "/chat";