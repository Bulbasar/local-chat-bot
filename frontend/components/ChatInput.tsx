"use client";

import { useState } from "react";

interface Props {
  onSend: (msg: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSend(value);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 bg-transparent outline-none px-3 py-2 text-sm"
        placeholder="Message..."
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm"
      >
        Send
      </button>
    </form>
  );
}
