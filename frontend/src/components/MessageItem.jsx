import { formatTs } from "../utils/time.js";

export default function MessageItem({ role, content, createdAt }) {
  const isUser = role === "user";

  return (
    <div className={`msg ${isUser ? "msg-user" : "msg-assistant"}`}>
      <div className="bubble">
        <div className="role">{isUser ? "You" : "Assistant"}</div>
        <div className="content">{content}</div>
        <div className="ts">{formatTs(createdAt)}</div>
      </div>
    </div>
  );
}