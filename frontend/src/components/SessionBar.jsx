export default function SessionBar({ sessionId, onNewChat }) {
  return (
    <div className="session-bar">
      <div className="session-left">
        <div className="title">AI Support Assistant</div>
        <div className="session-id">Session: {sessionId || "..."}</div>
      </div>

      <button className="btn" onClick={onNewChat} disabled={!sessionId}>
        New Chat
      </button>
    </div>
  );
}