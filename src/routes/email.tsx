import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Loader2, RefreshCw, Sparkle, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { streamGenerate } from "@/lib/stream-generate";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — SmartAssist AI" },
      { name: "description", content: "Generate professional emails from a topic, recipient and key points in your chosen tone." },
      { property: "og:title", content: "Smart Email Generator — SmartAssist AI" },
      { property: "og:description", content: "Professional emails in seconds, in the tone you need." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Concise"];

function EmailPage() {
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function generate(variation = false) {
    if (!topic.trim()) return setError("Please add a topic for your email.");
    setError("");
    setLoading(true);
    setOutput("");
    abortRef.current = new AbortController();
    try {
      await streamGenerate({ kind: "email", topic, recipient, points, tone, variation: variation ? "1" : "" }, setOutput, abortRef.current.signal);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    abortRef.current?.abort();
    setTopic(""); setRecipient(""); setPoints(""); setOutput(""); setError("");
  }

  return (
    <div>
      <PageHeader title="Smart Email Generator" subtitle="Describe what you need and get a ready-to-send email. Edit it freely afterwards." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="animate-rise space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card"
          onSubmit={(e) => { e.preventDefault(); generate(); }}
        >
          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Request to reschedule Friday's workshop" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Dr. Naidoo, Head of Department" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea id="points" rows={5} value={points} onChange={(e) => setPoints(e.target.value)} placeholder={"- Venue unavailable\n- Suggest Tuesday 10:00\n- Apologise for short notice"} />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTone(t)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all active:scale-95 ${tone === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkle className="h-4 w-4" />}
              {loading ? "Writing..." : "Generate email"}
            </Button>
            <Button type="button" variant="ghost" onClick={clearAll}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          </div>
        </form>

        <div className="animate-rise flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card [animation-delay:100ms]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Your email</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={loading || !output} onClick={() => generate(true)}>
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
              <CopyButton text={output} />
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-3"><AlertDescription>{error}</AlertDescription></Alert>
          )}
          {!output && loading ? (
            <div className="flex flex-1 items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Drafting your email...
            </div>
          ) : !output ? (
            <div className="flex flex-1 items-center justify-center py-16 text-center text-sm text-muted-foreground">
              Your generated email will appear here.
            </div>
          ) : (
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              readOnly={loading}
              className="min-h-[360px] flex-1 resize-y font-sans leading-relaxed"
              aria-label="Generated email (editable)"
            />
          )}
        </div>
      </div>
    </div>
  );
}
