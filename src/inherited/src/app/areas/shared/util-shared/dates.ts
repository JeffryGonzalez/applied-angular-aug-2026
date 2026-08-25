export function daysSince(isoDate: string, today = new Date()) {
  const then = new Date(isoDate);
  const ms = today.getTime() - then.getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
