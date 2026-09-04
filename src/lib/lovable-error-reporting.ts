// No-op: Lovable error reporting removed
export function reportLovableError(_error: unknown, _context: Record<string, unknown> = {}) {
  console.error("[Error]", _error, _context);
}
