import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api/client.js";

export function useChat(sessionId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // load conversation whenever sessionId changes
  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await apiGet(`/api/conversations/${sessionId}`);
        if (cancelled) return;
        setMessages(data.messages || []);
      } catch (e) {
        // If session doesn't exist yet, backend returns empty list (we didn't implement 404),
        // but even if it errors, just start with empty.
        if (!cancelled) setMessages([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const sendMessage = async (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed || !sessionId) return;

    // optimistic UI user message
    const tempUser = {
      id: `temp_user_${Date.now()}`,
      sessionId,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempUser]);
    setLoading(true);

    try {
      const data = await apiPost("/api/chat", { sessionId, message: trimmed });

      const assistantMsg = {
        id: `temp_asst_${Date.now() + 1}`,
        sessionId,
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMsg]);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const clearLocal = () => setMessages([]);

  return { messages, loading, sendMessage, clearLocal };
}