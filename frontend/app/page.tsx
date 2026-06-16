"use client";

import Sidebar from "@/components/Sidebar";
import ChatInput from "@/components/ChatInput";
import ChatWindow from "@/components/ChatWindow";
import CognitivePanel from "@/components/CognitivePanel";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const { messages, send, loading } = useChat();

  return (
    <main className="h-screen w-full flex bg-zinc-950 text-white overflow-hidden">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* CENTER */}
      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-3xl flex flex-col">
          {/* HEADER (ChatGPT-style spacing buffer) */}
          <div className="h-14 flex items-center px-6 border-b border-zinc-900 text-xs text-zinc-500">
            Local AI Chat
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth">
            <ChatWindow messages={messages} />
          </div>

          {/* INPUT (ChatGPT sticky feel) */}
          <div className="p-4 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur">
            <ChatInput onSend={send} />

            {loading && (
              <div className="mt-2 text-xs text-zinc-500 animate-pulse">
                thinking...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden xl:block w-80 border-l border-zinc-900 bg-zinc-950/60 backdrop-blur">
        <CognitivePanel />
      </div>
    </main>
  );
}
