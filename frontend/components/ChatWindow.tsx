import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "@/types/chat";

interface Props {
  messages: Message[];
}

export default function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-5">
      {messages.map((msg, i) => (
        <div
          key={`${msg.role}-${i}`}
          className={`flex w-full ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="max-w-[80%]">
            <MessageBubble role={msg.role} content={msg.content} />
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
