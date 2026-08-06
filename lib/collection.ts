const STORAGE_KEY = "perfume-notes:collection";

export type CollectionStatus = "own" | "want";

export interface CollectionEntry {
  id: string;
  status: CollectionStatus;
}

function readAll(): CollectionEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CollectionEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: CollectionEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("perfume-notes:collection-changed"));
}

export function getCollection(): CollectionEntry[] {
  return readAll();
}

export function getStatus(id: string): CollectionStatus | null {
  return readAll().find((e) => e.id === id)?.status ?? null;
}

export function setStatus(id: string, status: CollectionStatus | null) {
  const entries = readAll().filter((e) => e.id !== id);
  if (status) entries.push({ id, status });
  writeAll(entries);
}
