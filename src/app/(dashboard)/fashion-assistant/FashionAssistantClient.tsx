"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Sparkles, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssistantMessage } from "@/lib/fashion-assistant/assistant-types";
import { sendMessage } from "@/app/actions/chat";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface ScanSummary {
  bodyShape?: string;
  season?: string;
  style?: string;
  topSize?: string;
  bottomSize?: string;
  createdAt: string;
}

interface FashionAssistantClientProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
  };
  scanSummary: ScanSummary | null;
  initialMessages: AssistantMessage[];
}

const SUGGESTED_QUESTIONS = [
  { icon: "💼", text: "Outfit Interview" },
  { icon: "🎓", text: "Outfit Wisuda" },
  { icon: "❤️", text: "Outfit Kencan" },
  { icon: "🏖", text: "Outfit Liburan" },
  { icon: "👔", text: "Outfit Kantor" },
  { icon: "🛍", text: "Mix & Match Outfit Saya" },
  { icon: "🎨", text: "Warna yang Cocok Hari Ini" },
  { icon: "👞", text: "Sepatu yang Cocok" },
];

export function FashionAssistantClient({ user, scanSummary, initialMessages }: FashionAssistantClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages || []);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Provide the current history (including the one just sent? No, the action takes the history BEFORE the user message, or we can send all previous ones)
    const currentHistory = [...messages];

    const response = await sendMessage(text.trim(), currentHistory);

    if (response.success && response.message) {
      setMessages((prev) => [...prev, response.message!]);
    } else {
      // Handle error gracefully
      const errorMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Maaf, terjadi kesalahan: ${response.error || "Gagal merespons."}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSend(question);
  };

  const firstName = user.firstName || "Pengguna";

  // Helper to format basic markdown (**bold** and * bullets)
  const renderMessage = (text: string, role: string) => {
    return text.split('\n').map((line, i) => {
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      let processedLine = line;
      if (isBullet) {
        processedLine = processedLine.replace(/^\s*[\*-]\s+/, '• ');
      }

      // Split by bold (**text**)
      const parts = processedLine.split(/(\*\*.*?\*\*)/g);
      
      return (
        <div key={i} className={`${isBullet ? 'pl-4 -indent-4' : ''} min-h-[1.25rem] leading-relaxed`}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className={`font-semibold ${role === 'user' ? 'text-white' : 'text-gray-900'}`}>{part.slice(2, -2)}</strong>;
            }
            // Remove any remaining standalone asterisks
            return <span key={j}>{part.replace(/\*/g, '')}</span>;
          })}
        </div>
      );
    });
  };

  // EMPTY STATE
  if (!scanSummary) {
    return (
      <div className="max-w-4xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 animate-in fade-in-50 duration-500">
        <div className="flex flex-col items-center justify-center text-center mt-20 p-8 rounded-[var(--radius-card)] bg-white/60 backdrop-blur-xl border border-white shadow-xl shadow-[#EC4899]/5">
          <div className="w-20 h-20 bg-gradient-to-br from-[#EC4899] to-[#D946EF] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Halo {firstName} 👋</h1>
          <p className="text-gray-600 max-w-lg mb-8 leading-relaxed">
            Saya adalah <b>Fashion Assistant OutfitCheck AI</b>. Saya dapat membantu memilih outfit, warna pakaian, ukuran pakaian, hingga styling berdasarkan bentuk tubuh Anda.
            <br /><br />
            Namun saya melihat Anda belum memiliki hasil Body Scan. Silakan lakukan Body Scan terlebih dahulu agar saya dapat memberikan rekomendasi yang lebih akurat.
          </p>
          <Button 
            onClick={() => router.push("/body-scan")}
            className="rounded-full bg-[#EC4899] hover:bg-[#D946EF] text-white px-8 py-6 text-lg shadow-sm hover:shadow-sm transition-all"
          >
            Mulai Body Scan <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in-50 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0">
        
        {/* GREETING CARD */}
        <div className="flex-1 rounded-[var(--radius-card)] bg-white/70 backdrop-blur-xl border border-white p-6 shadow-sm shadow-gray-100/50 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#EC4899] to-[#D946EF] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Halo, {firstName} 👋</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Saya siap membantu memilih outfit terbaik berdasarkan hasil Body Scan Anda. Tanyakan apa saja seputar gaya Anda!
          </p>
        </div>

        {/* SCAN SUMMARY CARD */}
        <div className="w-full md:w-72 rounded-[var(--radius-card)] bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-24 h-24" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EC4899]" />
              Konteks Aktif
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
              <div>
                <span className="text-gray-400 block text-xs">Body Shape</span>
                <span className="font-semibold">{scanSummary.bodyShape || "-"}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Season</span>
                <span className="font-semibold">{scanSummary.season || "-"}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Atasan</span>
                <span className="font-semibold">{scanSummary.topSize || "-"}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Bawahan</span>
                <span className="font-semibold">{scanSummary.bottomSize || "-"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white/50 backdrop-blur-md rounded-[var(--radius-card)] border border-white shadow-sm relative">
        
        {messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto space-y-8">
              <div className="text-gray-400">
                <Bot className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">Mulai percakapan dengan memilih topik di bawah ini, atau ketik pertanyaan Anda.</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(q.text)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm hover:border-[#EC4899] hover:text-[#EC4899] hover:shadow-sm transition-all text-sm font-medium text-gray-700"
                  >
                    <span>{q.icon}</span>
                    <span>{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === "user" 
                    ? "bg-gray-100 text-gray-500" 
                    : "bg-gradient-to-br from-[#EC4899] to-[#D946EF] text-white"
                }`}>
                  {msg.role === "user" ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-5 py-3.5 rounded-[var(--radius-card)] text-[15px] ${
                    msg.role === "user"
                      ? "bg-[#1E1E2D] text-white rounded-tr-sm"
                      : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm"
                  }`}>
                    {renderMessage(msg.content, msg.role)}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {format(new Date(msg.timestamp), "HH:mm")}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4 flex-row">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EC4899] to-[#D946EF] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-[var(--radius-card)] rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#EC4899] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-[#EC4899] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-[#EC4899] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* INPUT AREA */}
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 shrink-0">
          <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya rekomendasi outfit, gaya, atau ukuran..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-[var(--radius-card)] focus:ring-[#EC4899] focus:border-[#EC4899] block p-3.5 pr-12 resize-none shadow-inner"
              rows={1}
              style={{ minHeight: "52px", maxHeight: "150px" }}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 rounded-[var(--radius-button)] bg-[#EC4899] text-white hover:bg-[#D946EF] disabled:opacity-50 disabled:hover:bg-[#EC4899] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">Tekan Enter untuk kirim, Shift+Enter untuk baris baru.</span>
          </div>
        </div>
      </div>
    </div>
  );
}


