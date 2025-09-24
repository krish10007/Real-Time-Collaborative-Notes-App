// client/src/lib/notes.ts
export type NoteMeta = {
  id: string;
  title: string;
  updatedAt: number; // epoch ms
};

const KEY = "notes:index:v1";

export function loadIndex(): NoteMeta[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as NoteMeta[]) : [];
  } catch {
    return [];
  }
}

export function saveIndex(list: NoteMeta[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function upsertNoteMeta(meta: NoteMeta) {
  const list = loadIndex();
  const i = list.findIndex((n) => n.id === meta.id);
  if (i >= 0) list[i] = meta;
  else list.push(meta);
  // sort newest first
  list.sort((a, b) => b.updatedAt - a.updatedAt);
  saveIndex(list);
}

export function deleteNote(id: string) {
  const list = loadIndex().filter((n) => n.id !== id);
  saveIndex(list);
}

// simple id generator
export function newId(len = 8) {
  return Math.random().toString(36).slice(2, 2 + len);
}
