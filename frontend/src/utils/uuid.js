export function newSessionId() {
  // Use crypto.randomUUID if available (modern browsers)
  if (crypto?.randomUUID) return crypto.randomUUID();
  // fallback
  return `sess_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}