# AI-Powered Support Assistant

A full-stack AI Support Assistant built with:

- **Frontend:** React (Vite)
- **Backend:** Node.js (Express)
- **Database:** SQLite
- **LLM:** OpenAI
- **Strict Document-Based Answering**

The assistant answers user questions **only using content from `docs.json`**.

If information is not found in the documentation, it responds:

> **"Sorry, I don’t have information about that."**

---

# Project Structure


ai-support-assistant/
│
├── docs.json
├── .env.example
├── README.md
├── screenshots/
│ ├── chat.png
│ ├── fallback.png
│ └── old-sessions.png
│
├── backend/
└── frontend/


---

# Setup Instructions

## Configure Documentation

Edit the file:


docs.json


Example:

```json
[
  {
    "title": "Reset Password",
    "content": "Users can reset their password by going to Settings > Security > Reset Password."
  }
]





Backend Setup

Navigate to backend:

cd backend
npm install

Create a .env file inside backend/:

PORT=8080
CORS_ORIGIN=http://localhost:5173

OPENAI_API_KEY=YOUR_OPENAI_KEY
OPENAI_MODEL=gpt-4.1-mini

Start backend:

npm run dev

Health check:

GET http://localhost:8080/health

Response:

{ "ok": true }





Frontend Setup

Open a second terminal:

cd frontend
npm install
npm run dev

Open browser:

http://localhost:5173





API Documentation
POST /api/chat

Request:

{
  "sessionId": "abc123",
  "message": "How can I reset my password?"
}

Response:

{
  "reply": "Users can reset their password by going to Settings > Security > Reset Password.",
  "tokensUsed": 123
}

If question is not in documentation:

{
  "reply": "Sorry, I don’t have information about that.",
  "tokensUsed": 0
}

GET /api/conversations/:sessionId

Returns all messages in chronological order.

Response:

{
  "sessionId": "abc123",
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "Hi",
      "createdAt": "2026-02-24 17:20:00"
    }
  ]
}

GET /api/sessions

Returns list of sessions.

{
  "sessions": [
    {
      "sessionId": "abc123",
      "createdAt": "2026-02-24 17:20:00",
      "lastUpdated": "2026-02-24 17:25:00"
    }
  ]
}





Database Schema (SQLite)
sessions
Column	Type
id	TEXT (PK)
created_at	DATETIME
updated_at	DATETIME

messages
Column	Type
id	INTEGER (PK, autoincrement)
session_id	TEXT (FK to sessions.id)
role	TEXT ("user"/"assistant")
content	TEXT
created_at	DATETIME





Document-Based Answering (Strict Enforcement)

The assistant:

Loads documentation from docs.json

Selects relevant documents (top 3)

Includes last 5 user + assistant message pairs from SQLite

Forces model to output:

SOURCE: <Document Title>

Backend validates the source title

If validation fails → returns fallback

This guarantees no hallucination outside documentation.






Rate Limiting

30 requests per minute per IP

Returns clean JSON error if exceeded






Assumptions

Sessions are created on first /api/chat call

Session ID is stored in browser localStorage

Documentation is static JSON (docs.json)

LLM must cite document title to be accepted






Features Implemented

Session-based conversation

SQLite persistence

Strict documentation-only answers

Sidebar session switching (extra UI enhancement)

Error handling

Rate limiting

Clean API responses

Secure environment variable handling






Author

Murali Krishna Bandaru