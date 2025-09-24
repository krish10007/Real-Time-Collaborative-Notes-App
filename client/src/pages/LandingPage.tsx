import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteNote, loadIndex, newId, NoteMeta } from "../lib/notes";

export default function LandingPage() {
  const [notes, setNotes] = useState<NoteMeta[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    setNotes(loadIndex());
  }, []);

  const createNote = () => {
    const id = newId();
    nav(`/doc/${id}`);
  };

  const onDelete = (id: string) => {
    deleteNote(id);
    setNotes(loadIndex());
  };

  const onRename = (n: NoteMeta) => {
    const next = prompt("Rename note", n.title || "Untitled") ?? n.title;
    // title will actually be updated from Doc page when you type,
    // but allow quick manual rename here too:
    const updated = { ...n, title: next, updatedAt: Date.now() };
    const idx = loadIndex().filter(Boolean);
    localStorage.setItem(
      "notes:index:v1",
      JSON.stringify(
        idx
          .map((m) => (m.id === n.id ? updated : m))
          .sort((a, b) => b.updatedAt - a.updatedAt)
      )
    );
    setNotes(loadIndex());
  };

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Real-Time Collaborative Notes</h1>
      <p className="text-gray-600 mb-6">
        Google Docs-lite with React, WebSockets, and Yjs. Offline-first.
      </p>

      <div className="flex gap-3 mb-8">
        <button
          onClick={createNote}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          New Note
        </button>
        <Link
          to="/doc/test"
          className="px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Open Demo
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-3">Your Notes</h2>
      {notes.length === 0 ? (
        <p className="text-gray-500">No notes yet. Create one!</p>
      ) : (
        <ul className="divide-y">
          {notes.map((n) => (
            <li key={n.id} className="py-3 flex items-center justify-between">
              <Link to={`/doc/${n.id}`} className="flex-1">
                <div className="font-medium">{n.title || "Untitled"}</div>
                <div className="text-sm text-gray-500">
                  Last edited {new Date(n.updatedAt).toLocaleString()}
                </div>
              </Link>
              <div className="ml-4 flex gap-2">
                <button
                  className="px-3 py-1 border rounded"
                  onClick={() => onRename(n)}
                >
                  Rename
                </button>
                <button
                  className="px-3 py-1 border rounded text-red-600"
                  onClick={() => onDelete(n.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
