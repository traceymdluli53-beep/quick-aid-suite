import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Loader2, NotebookPen, RefreshCw, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { streamGenerate } from "@/lib/stream-generate";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — SmartAssist AI" },
      { name: "description", content: "Paste meeting notes to get key points, decisions, action items and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer — SmartAssist AI" },
      { property: "og:description", content: "Turn messy meeting notes into clear decisions and action items." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SummarizerPage,
});

const SAMPLE = `Team sync 14 Oct. Present: Thabo, Lerato, Sam, Priya.
Thabo: LMS migration is 70% done, need Sam to test quizzes module.
Agreed to move go-live from 1 Nov to 8 Nov because of exam week.
Lerato will email all facilitators about the new date by Friday.
Priya raised that the projector in Lab 3 is broken - IT to replace before next Monday.
Budget for new headsets approved (R12 000).`;

function SummarizerPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function run() {
    if (notes.trim().length < 20) return setError("Please paste a bit more of your meeting notes.");
    setError(""); setLoading(true); setOutput("");
    abortRef.current = new AbortController();
    try {
      await streamGenerate({ kind: "summary", notes }, setOutput, abortRef.current.signal);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="Meeting Notes Summarizer" subtitle="Paste raw notes or a transcript. Get the summary, decisions, action items and deadlines." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-rise space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Meeting notes</h2>
            <button className="text-sm font-medium text-primary hover:underline" onClick={() => setNotes(SAMPLE)}>Try a sample</button>
          </div>
          <Textarea rows={16} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your meeting notes here..." className="resize-y" />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={run} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <NotebookPen className="h-4 w-4" />}
              {loading ? "Summarizing..." : "Summarize"}
            </Button>
            <Button variant="ghost" onClick={() => { abortRef.current?.abort(); setNotes(""); setOutput(""); setError(""); }}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
            <span className="ml-auto text-xs text-muted-foreground">{notes.length.toLocaleString()} characters</span>
          </div>
        </div>
        <div className="animate-rise rounded-2xl border border-border bg-card p-6 shadow-card [animation-delay:100ms]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Summary</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={loading || !output} onClick={run}>
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
              <CopyButton text={output} />
            </div>
          </div>
          {error && <Alert variant="destructive" className="mb-3"><AlertDescription>{error}</AlertDescription></Alert>}
          {!output && loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Reading your notes...</div>
          ) : !output ? (
            <div className="py-20 text-center text-sm text-muted-foreground">Your structured summary will appear here.</div>
          ) : (
            <Markdown>{output}</Markdown>
          )}
        </div>
      </div>
    </div>
  );
}
