import ReactMarkdown from "react-markdown";

interface Props {
  role: string;
  content: string;
}

export default function MessageBubble({ role, content }: Props) {
  return (
    <div
      className={`
        px-4 py-3 rounded-2xl text-sm leading-relaxed
        shadow-sm border
        whitespace-pre-wrap
        ${
          role === "user"
            ? "bg-blue-600 text-white border-blue-500 ml-auto"
            : "bg-zinc-900 text-zinc-100 border-zinc-800"
        }
      `}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          code: ({ children }) => (
            <code className="bg-black/40 px-1 py-0.5 rounded text-xs">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
