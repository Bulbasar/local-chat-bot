"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { streamMessage } from "@/lib/api";
import { Message } from "@/types/chat";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const sessionId =
    typeof window !== "undefined"
      ? (() => {
          let id = localStorage.getItem("sessionId");

          if (!id) {
            id = uuidv4();
            localStorage.setItem("sessionId", id);
          }

          return id;
        })()
      : "";

  async function send(content: string) {
    if (!content.trim()) return;

    // cancel previous stream if still running
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setLoading(true);

    // add user + empty assistant bubble (ChatGPT style)
    setMessages((prev) => [
      ...prev,
      { role: "user", content },
      { role: "assistant", content: "" },
    ]);

    let assistantText = "";

    try {
      await streamMessage(content, sessionId, (token) => {
        assistantText += token;

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: assistantText,
          };
          return copy;
        });
      });
    } catch (err: any) {
      setError(err?.message || "Streaming failed");

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "⚠️ Error generating response.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    messages,
    send,
    loading,
    error,
  };
}
