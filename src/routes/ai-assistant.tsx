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

function FormattedMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        const parseBold = (str: string) => {
          const parts = str.split(/(\*\*.*?\*\*)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
              return (
                <strong key={pIdx} className="font-bold text-foreground font-semibold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });
        };

        const numMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)/);
        if (numMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-0.5 my-0.5">
              <span className="font-bold text-primary shrink-0">{numMatch[1]}.</span>
              <div>{parseBold(numMatch[2]!)}</div>
            </div>
          );
        }

        const bulletMatch = trimmed.match(/^[\-\*]\s+(.*)/);
        if (bulletMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1.5 my-0.5">
              <span className="text-primary font-bold shrink-0">•</span>
              <div>{parseBold(bulletMatch[1]!)}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{parseBold(line)}</p>;
      })}
    </div>
  );
}

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

    // Prepare chat history payload for contextual follow-up resolution
    const chatHistoryPayload = messages
      .filter((m) => m.id !== "welcome" && m.text)
      .slice(-10)
      .map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 1. Run deterministic query engine locally over dataset with history context
      const localResult = queryAiEngine(q, dataset, dateRange, chatHistoryPayload);

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
              chatHistory: chatHistoryPayload,
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
    <div className="w-full max-w-6xl mx-auto px-2.5 sm:px-4 py-2 sm:py-3.5 h-full flex flex-col min-h-0 overflow-hidden">
      {/* Outer Bento Container taking 100% available space */}
      <div className="bento-card flex-1 flex flex-col min-h-0 overflow-hidden p-3.5 sm:p-5 md:p-6 border-border/80 shadow-sm">
        {/* Header (Fixed at top inside container) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/50 shrink-0 gap-2.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" /> AI Business Assistant
              </h1>
              <Badge variant="outline" className="text-[11px] font-mono border-primary/30 text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Gemini 3.5 + Data Engine
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
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
            className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5 rounded-xl border-border/60 hover:bg-muted shrink-0 self-start sm:self-auto px-3"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear Chat
          </Button>
        </div>

        {/* Messages Internal Scroll Area with custom sleek scrollbar */}
        <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto py-3 pr-1 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl shrink-0 shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground font-bold text-xs"
                    : "bg-primary/10 border border-primary/20 text-primary"
                }`}
              >
                {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              <div
                className={`group relative max-w-[84%] sm:max-w-[72%] md:max-w-[65%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-xs"
                    : msg.isError
                    ? "bg-destructive/10 border border-destructive/30 text-destructive rounded-tl-xs"
                    : "bg-muted/40 border border-border/70 rounded-tl-xs text-foreground"
                }`}
              >
                <FormattedMarkdown text={msg.text} />

                {/* Footer metadata bar with copy icon at bottom-right */}
                <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between text-[10px] sm:text-[11px] font-mono gap-2.5">
                  <div className="flex items-center gap-1.5 opacity-75">
                    <span>{msg.timestamp}</span>
                    {msg.sourceTag && (
                      <span className="flex items-center gap-1 font-sans font-medium text-primary">
                        <ShieldCheck className="h-3 w-3" /> {msg.sourceTag}
                      </span>
                    )}
                  </div>

                  {/* Copy icon button in footer bar */}
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                      msg.sender === "user"
                        ? "hover:bg-white/20 text-primary-foreground/80 hover:text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
                <Bot className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <div className="bg-muted/40 border border-border/70 rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs text-muted-foreground flex items-center gap-2 shadow-2xs">
                <span className="animate-pulse font-medium">Analyzing PulseOps dataset records & running data verification...</span>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Bottom Area: Prompt Suggestions & Input Bar */}
        <div className="shrink-0 pt-3 border-t border-border/50 space-y-2.5 bg-card/50">
          {/* Prompt Suggestions (Clean Wrap Pills without nested scrollbars) */}
          {messages.length < 5 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <HelpCircle className="h-3 w-3 text-primary" />
                <span>Suggested dataset questions:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-full border border-border/70 bg-card hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all text-left shadow-2xs"
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
              className="h-10 sm:h-10 text-xs rounded-full border-border/70 bg-muted/20 px-4 shadow-xs focus-visible:ring-primary focus-visible:ring-2"
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              className="h-10 sm:h-10 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 shadow-xs shrink-0"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
