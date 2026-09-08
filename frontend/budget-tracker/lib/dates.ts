function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayISODate(): string {
  return toISODate(new Date());
}

export function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: toISODate(start), end: toISODate(end) };
}

export function getCurrentMonthLabel(): string {
  return new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
}

/** Returns the current month as an `<input type="month">` value, e.g. "2026-09". */
export function getCurrentMonthValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Converts an ISO date ("YYYY-MM-DD") to a month value ("YYYY-MM"). */
export function toMonthValue(dateValue: string): string {
  return dateValue.slice(0, 7);
}

/** Given a month value ("YYYY-MM"), returns the ISO start/end dates of that month. */
export function getMonthRange(monthValue: string): { start: string; end: string } {
  const [year, month] = monthValue.split("-").map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return { start: toISODate(start), end: toISODate(end) };
}

export function formatDate(dateValue: string): string {
  const [year, month, day] = dateValue.split("-").map(Number);
  if (!year || !month || !day) return dateValue;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
