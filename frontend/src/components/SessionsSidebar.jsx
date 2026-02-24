import { formatTs } from "../utils/time.js";

export default function SessionsSidebar({
  sessions,
  activeSessionId,
  onSelect,
  onNewChat
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div>
          <div className="sidebar-title">Chats</div>
          <div className="sidebar-subtitle">Click to open old chat</div>
        </div>

        <button className="btn btn-small" onClick={onNewChat}>
          New
        </button>
      </div>

      <div className="session-list">
        {sessions.length === 0 ? (
          <div className="empty">No previous sessions yet.</div>
        ) : (
          sessions.map((s) => {
            const isActive = s.sessionId === activeSessionId;
            return (
              <button
                key={s.sessionId}
                className={`session-item ${isActive ? "active" : ""}`}
                onClick={() => onSelect(s.sessionId)}
                title={s.sessionId}
              >
                <div className="session-item-top">
                  <span className="session-item-id">
                    {s.sessionId.slice(0, 10)}...
                  </span>
                  <span className="session-item-time">
                    {formatTs(s.lastUpdated)}
                  </span>
                </div>
                <div className="session-item-sub">
                  Updated: {formatTs(s.lastUpdated)}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}