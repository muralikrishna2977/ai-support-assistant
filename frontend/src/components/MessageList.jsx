import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem.jsx";

export default function MessageList({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <MessageItem
          key={m.id}
          role={m.role}
          content={m.content}
          createdAt={m.createdAt || m.created_at}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}