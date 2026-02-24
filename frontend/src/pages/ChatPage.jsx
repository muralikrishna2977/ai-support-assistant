import { useEffect, useState } from "react";
import SessionsSidebar from "../components/SessionsSidebar.jsx";
import MessageList from "../components/MessageList.jsx";
import ChatInput from "../components/ChatInput.jsx";
import { useSession } from "../hooks/useSession.js";
import { useChat } from "../hooks/useChat.js";
import { apiGet } from "../api/client.js";

export default function ChatPage() {
  const { sessionId, startNewChat, setSessionIdPersisted } = useSession();
  const { messages, loading, sendMessage, clearLocal } = useChat(sessionId);

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      const data = await apiGet("/api/sessions");
      setSessions(data.sessions || []);
    } catch (e) {
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when session changes (new chat or selecting old), refresh sessions list
  useEffect(() => {
    if (!sessionId) return;
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleNewChat = () => {
    startNewChat();
    clearLocal();
  };

  const handleSelectSession = (id) => {
    setSessionIdPersisted(id);
    // useChat will auto-load conversation for that session
  };

  const handleSend = async (text) => {
    await sendMessage(text);
    // update sidebar timestamps
    fetchSessions();
  };

  return (
    <div className="layout">
      <SessionsSidebar
        sessions={sessions}
        activeSessionId={sessionId}
        onSelect={handleSelectSession}
        onNewChat={handleNewChat}
      />

      <div className="main">
        <div className="topbar">
          <div className="topbar-title">AI Support Assistant</div>
          <div className="topbar-sub">
            Session: <span className="mono">{sessionId || "..."}</span>
            {sessionsLoading ? " (updating list...)" : ""}
          </div>
        </div>

        <div className="chat-card">
          <MessageList messages={messages} />

          {loading && <div className="loading">Assistant is thinking...</div>}

          <ChatInput onSend={handleSend} disabled={!sessionId || loading} />
        </div>
      </div>
    </div>
  );
}