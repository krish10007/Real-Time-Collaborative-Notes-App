import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteNote, loadIndex, newId } from "../lib/notes";

// local type mirror to avoid runtime import of a TS-only export
type NoteMeta = {
  id: string;
  title: string;
  updatedAt: number;
};

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Real-Time Collaborative Notes
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Google Docs-lite with React, WebSockets, and Yjs. Offline-first.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={createNote}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                New Note
              </button>
              <Link
                to="/doc/test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
              >
                Open Demo
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Your Notes
            </h2>

            {notes.length === 0 ? (
              <div className="text-gray-500">No notes yet. Create one!</div>
            ) : (
              <ul className="grid grid-cols-1 gap-4">
                {notes.map((n) => (
                  <li
                    key={n.id}
                    className="p-4 rounded-lg border hover:shadow-sm flex items-start justify-between bg-white"
                  >
                    <Link to={`/doc/${n.id}`} className="flex-1">
                      <div className="font-medium text-lg text-gray-900">
                        {n.title || "Untitled"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Last edited {new Date(n.updatedAt).toLocaleString()}
                      </div>
                    </Link>

                    <div className="ml-4 flex gap-2">
                      <button
                        className="px-3 py-1 border rounded text-sm bg-gray-50 hover:bg-gray-100"
                        onClick={() => onRename(n)}
                      >
                        Rename
                      </button>
                      <button
                        className="px-3 py-1 border rounded text-sm text-red-600 bg-gray-50 hover:bg-gray-100"
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
        </div>
      </div>
    </div>
  );
}
