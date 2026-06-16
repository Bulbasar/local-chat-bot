export async function streamMessage(
  message: string,
  sessionId: string,
  onToken: (token: string) => void,
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!res.body) throw new Error("No stream response");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");

    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const data = line.replace("data: ", "").trim();

      if (data === "[DONE]") return;

      try {
        const json = JSON.parse(data);

        if (json.token) {
          onToken(json.token);
        }
      } catch (err) {
        // ignore invalid JSON chunks
      }
    }
  }
}
