export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error("API Error:", err);

  const status = err.statusCode || 500;
  const message =
    err.expose === true
      ? err.message
      : status === 500
      ? "Internal server error"
      : err.message;

  res.status(status).json({ error: message });
}