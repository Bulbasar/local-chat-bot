"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { env } from "@/config/env";

interface Memory {
  id: string;
  content: string;
  type: string;
  importance: number;
  access_count: number;
  created_at?: string;
}

export default function CognitivePanel() {
  const [memory, setMemory] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);

  const sessionId =
    typeof window !== "undefined"
      ? localStorage.getItem("sessionId") || ""
      : "";

  const isFetching = useRef(false);

  async function loadMemory() {
    if (!sessionId || isFetching.current) return;

    isFetching.current = true;
    setLoading(true);

    try {
      const res = await fetch(`${env.apiUrl}/api/memory/${sessionId}`);

      if (!res.ok) throw new Error("Failed to fetch memory");

      const data = await res.json();

      setMemory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[CognitivePanel fetch error]", err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }

  useEffect(() => {
    loadMemory();

    const interval = setInterval(loadMemory, 5000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const identity = useMemo(
    () => memory.filter((m) => m.type === "identity"),
    [memory],
  );

  const episodic = useMemo(
    () => memory.filter((m) => m.type !== "identity"),
    [memory],
  );

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-sm font-semibold">Cognitive Control</h2>
        {loading && <p className="text-xs text-zinc-500">syncing...</p>}
      </div>

      {/* ================= IDENTITY ================= */}
      <section className="mb-6">
        <h3 className="text-xs text-blue-400 mb-2">Identity</h3>

        {identity.map((m, idx) => (
          <div
            key={`identity-${m.id}-${m.created_at ?? "0"}-${idx}`}
            className="text-xs p-2 mb-2 bg-blue-500/10"
          >
            {m.content}
          </div>
        ))}
      </section>

      {/* ================= MEMORY ================= */}
      <section>
        <h3 className="text-xs text-emerald-400 mb-2">Memory</h3>

        {episodic.slice(0, 12).map((m, idx) => (
          <div
            key={`episodic-${m.id}-${m.created_at ?? "0"}-${idx}`}
            className="text-xs p-3 mb-2 bg-zinc-900"
          >
            {m.content}
          </div>
        ))}
      </section>
    </div>
  );
}
