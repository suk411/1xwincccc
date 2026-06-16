function getDailyKey(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
}

const dailyKey = getDailyKey();

export function withCacheBust(url: string): string {
  if (!url || !url.startsWith("http")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}cb=${dailyKey}`;
}
