const SESSION_KEY = "session_id";

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const sessionId = getSessionId();

export function withCacheBust(url: string): string {
  if (!url || !url.startsWith("http")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}cb=${sessionId}`;
}
