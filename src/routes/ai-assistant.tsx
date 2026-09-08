import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import { queryAiEngine } from "@/services/aiEngine";
import { queryGeminiServerFn } from "@/services/aiServer";
import { Sparkles, Send, Bot, User, Copy, Trash2, Check, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/ai-assistant")({
  component: AIAssistantPage,
});

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  sourceTag?: string;
  isError?: boolean;
  timestamp: string;
}

const SUGGESTIONS = [
  "What were our total sales this year?",
  "Which products generated the most revenue?",
  "Which customers purchased the most?",
  "How much is currently outstanding?",
  "How much receivables are overdue?",
  "Which products are low in stock?",
  "What is our on-time delivery rate?",
  "Which month had the highest sales?",
  "How many orders were cancelled?",
];

function AIAssistantPage() {
  const { dataset, dateRange } = useDataset();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am your PulseOps Sales & Operations Intelligence Assistant. Ask me anything about your sales performance, inventory status, receivables, customer rankings, or logistics performance.",
      sourceTag: "PulseOps Data Engine",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Smooth internal scroll to bottom of chat without page jumping
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || !dataset || loading) return;

    setInput("");

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 1. Run deterministic query engine locally over dataset
      const localResult = queryAiEngine(q, dataset, dateRange);

      // 2. Call secure server function queryGeminiServerFn (which holds process.env.GEMINI_API_KEY)
      let aiText = localResult.directAnswer;
      let sourceTag = "PulseOps Data Engine";

      if (localResult.isSupported) {
        try {
          const res = await queryGeminiServerFn({
            data: {
              question: q,
              structuredFacts: localResult.structuredFacts,
              isSupported: localResult.isSupported,
              fallbackAnswer: localResult.directAnswer,
            },
          });
          if (res?.answer) aiText = res.answer;
          if (res?.source) sourceTag = res.source;
        } catch {
          // Fallback to local engine text on network failure
          aiText = localResult.directAnswer;
          sourceTag = "PulseOps Data Engine";
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiText,
        sourceTag,
        isError: !localResult.isSupported,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "I encountered an issue processing that query over the dataset.",
          sourceTag: "System Error",
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-5 h-full flex flex-col min-h-0 overflow-hidden">
      {/* Outer Bento Container taking 100% available space */}
      <div className="bento-card flex-1 flex flex-col min-h-0 overflow-hidden p-4 sm:p-6 md:p-8 border-border/80 shadow-md">
        {/* Header (Fixed at top inside container) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/50 shrink-0 gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" /> AI Business Assistant
              </h1>
              <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Gemini 2.0 + Data Engine
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Strictly dataset-backed executive intelligence powered by Gemini 2.0 & PulseOps Data Engine
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setMessages([
                {
                  id: "welcome",
                  sender: "ai",
                  text: "Hello! I am your PulseOps Sales & Operations Intelligence Assistant. Ask me anything about your sales performance, inventory status, receivables, customer rankings, or logistics performance.",
                  sourceTag: "PulseOps Data Engine",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ])
            }
            className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground gap-2 rounded-2xl border-border/60 hover:bg-muted shrink-0 self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" /> Clear Chat
          </Button>
        </div>

        {/* Messages Internal Scroll Area with custom sleek scrollbar */}
        <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto py-5 pr-1 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 sm:gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl shrink-0 shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground font-bold text-xs"
                    : "bg-primary/10 border border-primary/20 text-primary"
                }`}
              >
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`group relative max-w-[88%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-xs"
                    : msg.isError
                    ? "bg-destructive/10 border border-destructive/30 text-destructive rounded-tl-xs"
                    : "bg-muted/40 border border-border/70 rounded-tl-xs text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Footer metadata */}
                <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] opacity-75 font-mono gap-3">
                  <span>{msg.timestamp}</span>
                  {msg.sourceTag && (
                    <span className="flex items-center gap-1 font-sans font-medium text-primary">
                      <ShieldCheck className="h-3.5 w-3.5" /> {msg.sourceTag}
                    </span>
                  )}
                </div>

                {/* Copy button */}
                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                  title="Copy response"
                >
                  {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shrink-0">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="bg-muted/40 border border-border/70 rounded-3xl rounded-tl-xs p-4 sm:p-5 text-xs sm:text-sm text-muted-foreground flex items-center gap-2.5 shadow-2xs">
                <span className="animate-pulse font-medium">Analyzing PulseOps dataset records & running data verification...</span>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Bottom Area: Prompt Suggestions & Input Bar */}
        <div className="shrink-0 pt-4 border-t border-border/50 space-y-3 bg-card/50">
          {/* Prompt Suggestions (Clean Wrap Pills without nested scrollbars) */}
          {messages.length < 5 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                <span>Suggested dataset questions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-full border border-border/70 bg-card hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all text-left shadow-2xs"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fixed Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder='Ask anything about sales, orders, receivables, stock, or delivery performance...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="h-12 text-xs sm:text-sm rounded-full border-border/70 bg-muted/20 px-5 shadow-xs focus-visible:ring-primary focus-visible:ring-2"
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm gap-2 shadow-xs shrink-0"
            >
              <span>Send</span>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
