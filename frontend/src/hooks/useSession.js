import { useEffect, useState } from "react";
import { newSessionId } from "../utils/uuid.js";

const KEY = "support_assistant_sessionId";

export function useSession() {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const existing = localStorage.getItem(KEY);
    if (existing) {
      setSessionId(existing);
      return;
    }
    const created = newSessionId();
    localStorage.setItem(KEY, created);
    setSessionId(created);
  }, []);

  const startNewChat = () => {
    const created = newSessionId();
    localStorage.setItem(KEY, created);
    setSessionId(created);
    return created;
  };

  const setSessionIdPersisted = (id) => {
    const v = String(id || "").trim();
    if (!v) return;
    localStorage.setItem(KEY, v);
    setSessionId(v);
  };

  return { sessionId, startNewChat, setSessionIdPersisted };
}