export type MoodEntry = {
  date: string; // YYYY-MM-DD
  value: number; // 1..5
  note?: string; // <= 200
};

export type StoredData = {
  entries: MoodEntry[];
  version: number;
};

const STORAGE_KEY = "mood-logs-v1";

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function loadData(): StoredData {
  if (typeof window === "undefined") return { entries: [], version: 1 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [], version: 1 };
    const parsed = JSON.parse(raw) as StoredData;
    if (!parsed.entries) return { entries: [], version: 1 };
    return parsed;
  } catch {
    return { entries: [], version: 1 };
  }
}

export function saveData(data: StoredData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getTodayEntry(data: StoredData, date = todayKey()) {
  return data.entries.find((e) => e.date === date);
}

export function upsertToday(data: StoredData, entry: MoodEntry): StoredData {
  const idx = data.entries.findIndex((e) => e.date === entry.date);
  if (idx >= 0) {
    const copy = [...data.entries];
    copy[idx] = entry;
    return { ...data, entries: copy };
  }
  return { ...data, entries: [entry, ...data.entries].slice(0, 60) };
}
