import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    setText("");
    await onSend(v);
  };

  return (
    <form className="input-bar" onSubmit={submit}>
      <input
        className="input"
        value={text}
        placeholder="Ask a question from the product docs..."
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
      />
      <button className="btn" type="submit" disabled={disabled || !text.trim()}>
        Send
      </button>
    </form>
  );
}