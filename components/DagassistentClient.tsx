"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useFormPersistence } from "@/lib/hooks/useFormPersistence";
import { DAGASSISTENT_EXAMPLES } from "@/lib/tools-constants";
import {
  calculatePlanningTotal,
  timeToMinutes,
  type PlanningItem,
} from "@/lib/planning-types";
import { savePlan } from "@/lib/plans";
import { submitInquiry } from "@/lib/inquiries";
import { getProviderById } from "@/lib/providers";

interface ChatMessageWithTime {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

const INITIAL_MESSAGE: ChatMessageWithTime = {
  role: "assistant",
  content:
    "Hallo! Ik ben je AI dagassistent. Beschrijf jullie ideale teambuilding dag — groepsgrootte, locatie, budget — en ik stel een concreet dagplan samen.",
  createdAt: new Date().toISOString(),
};

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DagassistentClient() {
  const router = useRouter();
  const [groupSize, setGroupSize] = useState(20);
  const [messages, setMessages] = useState<ChatMessageWithTime[]>([
    INITIAL_MESSAGE,
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [planning, setPlanning] = useState<PlanningItem[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [inquiryMsg, setInquiryMsg] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"chat" | "timeline">("chat");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useFormPersistence(
    "dagout-dagassistent-input",
    { input, groupSize },
    (saved) => {
      setInput(saved.input);
      setGroupSize(saved.groupSize);
    }
  );

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessageWithTime = {
      role: "user",
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/dagassistent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          groupSize,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fout bij AI");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          createdAt: new Date().toISOString(),
        },
      ]);

      if (data.planning?.items?.length) {
        setPlanning(data.planning.items);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, er ging iets mis. Probeer het opnieuw of stel een eenvoudigere vraag.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  async function handleSavePlan() {
    if (planning.length === 0) return;
    setSaveMsg(null);

    try {
      const supabase = createBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/inloggen?redirect=/dagassistent");
        return;
      }

      const total = calculatePlanningTotal(planning, groupSize);

      await savePlan({
        name: `Dagplanning ${new Date().toLocaleDateString("nl-BE")}`,
        groupSize,
        items: planning,
        totalBudget: total,
        userId: user.id,
      });

      localStorage.removeItem("dagout-dagassistent-input");
      router.push("/planning");
    } catch {
      setSaveMsg("Opslaan mislukt. Controleer je Supabase-configuratie.");
    }
  }

  function clearChat() {
    setMessages([{ ...INITIAL_MESSAGE, createdAt: new Date().toISOString() }]);
    setPlanning([]);
    setSaveMsg(null);
    setInquiryMsg(null);
    setInput("");
  }

  async function handleSendInquiries() {
    if (planning.length === 0) return;
    setInquiryMsg(null);

    const providerIds = [
      ...new Set(planning.map((i) => i.provider_id).filter((id) => id !== "lunch")),
    ];

    try {
      await Promise.all(
        providerIds.map((id) => {
          const provider = getProviderById(id);
          if (!provider) return Promise.resolve();
          const planText = planning
            .filter((p) => p.provider_id === id)
            .map((p) => `${p.time} — ${p.name}`)
            .join("\n");

          return submitInquiry({
            providerSlug: provider.slug,
            providerName: provider.name,
            contactName: "Dagassistent gebruiker",
            companyName: "",
            email: "info@dagout.be",
            phone: "",
            groupSize,
            preferredDate: null,
            message: `Aanvraag via AI Dagassistent voor ${groupSize} personen:\n${planText}`,
          });
        })
      );

      setInquiryMsg(`Aanvragen verstuurd naar ${providerIds.length} aanbieder(s).`);
    } catch {
      setInquiryMsg("Aanvragen versturen mislukt.");
    }
  }

  const total = calculatePlanningTotal(planning, groupSize);
  const timelineStart = 8 * 60;
  const timelineEnd = 18 * 60;
  const timelineHeight = timelineEnd - timelineStart;

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col">
      {/* Header */}
      <div className="bg-[#0a2a1f] px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold sm:text-3xl">AI Dagassistent</h1>
          <p className="mt-1 text-white/70">
            Beschrijf jullie dag en ik stel alles samen
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm text-white/70">Groepsgrootte</span>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <input
                type="number"
                min={5}
                max={200}
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-14 border-0 bg-transparent text-center text-sm font-semibold text-white focus:outline-none"
              />
              <span className="text-sm text-white/70">personen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-white lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("chat")}
          className={`flex-1 py-3 text-sm font-semibold ${mobileTab === "chat" ? "border-b-2 border-[#1D9E75] text-[#1D9E75]" : "text-gray-500"}`}
        >
          Chat
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("timeline")}
          className={`flex-1 py-3 text-sm font-semibold ${mobileTab === "timeline" ? "border-b-2 border-[#1D9E75] text-[#1D9E75]" : "text-gray-500"}`}
        >
          Tijdlijn
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
        {/* Chat */}
        <div className={`flex flex-1 flex-col border-r border-gray-200 bg-white ${mobileTab === "chat" ? "flex" : "hidden lg:flex"}`}>
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-medium text-gray-700">Chatgeschiedenis</p>
            <button
              type="button"
              onClick={clearChat}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              Wis gesprek
            </button>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-gray-100 p-4">
            {DAGASSISTENT_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => sendMessage(example)}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-[#1D9E75] hover:text-[#1D9E75]"
              >
                {example}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1D9E75] text-xs font-bold text-white">
                    D
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1D9E75] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content.split("\n").map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-2" : ""}>
                      {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                    </p>
                  ))}
                  <p
                    className={`mt-2 text-[10px] ${
                      msg.role === "user" ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1D9E75] text-xs font-bold text-white">
                  D
                </div>
                <div className="rounded-2xl bg-gray-100 px-4 py-3">
                  <div className="ai-loader h-5 w-5" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Beschrijf jullie ideale teambuilding dag..."
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary rounded-xl bg-[#1D9E75] px-5 py-3 text-sm font-semibold text-white hover:bg-[#178a66] disabled:cursor-wait disabled:opacity-80"
              >
                {loading ? "..." : "Verstuur"}
              </button>
            </div>
          </form>
        </div>

        {/* Timeline */}
        <div className={`w-full bg-gray-50 p-6 lg:w-[380px] lg:shrink-0 ${mobileTab === "timeline" ? "block" : "hidden lg:block"}`}>
          <h2 className="text-lg font-semibold text-gray-900">Dagplanning</h2>
          <p className="text-sm text-gray-500">Live tijdlijn</p>

          {planning.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1D9E75]/10">
                <svg className="h-7 w-7 text-[#1D9E75]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-medium text-gray-700">
                Nog geen dagplanning
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Stel een vraag in de chat om je tijdlijn te vullen
              </p>
            </div>
          ) : (
            <>
              <div className="relative mt-6" style={{ height: `${timelineHeight}px` }}>
                {/* Hour markers */}
                {Array.from({ length: 11 }, (_, i) => {
                  const hour = 8 + i;
                  const top = ((hour * 60 - timelineStart) / timelineHeight) * 100;
                  return (
                    <div
                      key={hour}
                      className="absolute left-0 flex w-full items-center"
                      style={{ top: `${top}%` }}
                    >
                      <span className="w-10 shrink-0 text-xs text-gray-400">
                        {String(hour).padStart(2, "0")}:00
                      </span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  );
                })}

                {planning.map((item, i) => {
                  const startMin = timeToMinutes(item.time);
                  const top = ((startMin - timelineStart) / timelineHeight) * 100;
                  const height = Math.max((item.duration / timelineHeight) * 100, 4);
                  return (
                    <div
                      key={i}
                      className="absolute left-12 right-0 overflow-hidden rounded-lg border border-[#1D9E75]/30 bg-[#1D9E75]/10 p-2"
                      style={{ top: `${top}%`, height: `${height}%`, minHeight: "48px" }}
                    >
                      <p className="text-xs font-semibold text-[#1D9E75]">{item.time}</p>
                      <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {item.duration} min · €{item.price_per_person}/pers
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Totaal ({groupSize} pers.)</span>
                  <span className="text-xl font-bold text-[#1D9E75]">€{total.toFixed(2)}</span>
                </div>
              </div>

              {saveMsg && (
                <p className="mt-2 text-sm text-[#1D9E75]">{saveMsg}</p>
              )}
              {inquiryMsg && (
                <p className="mt-2 text-sm text-[#1D9E75]">{inquiryMsg}</p>
              )}

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={handleSavePlan}
                  className="w-full rounded-xl bg-[#1D9E75] py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
                >
                  Sla planning op
                </button>
                <button
                  type="button"
                  onClick={handleSendInquiries}
                  className="w-full rounded-xl bg-[#1D9E75] py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
                >
                  Stuur aanvragen naar alle aanbieders
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
