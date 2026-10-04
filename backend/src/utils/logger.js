export function logEvent(event, fields = {}) {
  // Callers pass only non-sensitive metadata; never include URLs, headers or tokens.
  process.stdout.write(`${JSON.stringify({ timestamp: new Date().toISOString(), event, ...fields })}\n`);
}
