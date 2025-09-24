// client/src/pages/Doc.tsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { Awareness } from "y-protocols/awareness";
import { upsertNoteMeta } from "../lib/notes";

export default function Doc() {
  const { id } = useParams();
  const room = id || "default";

  // UI state
  const [text, setText] = useState("");
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [users, setUsers] = useState<{ name: string; color: string }[]>([]);

  // Yjs refs (so we can use them in handlers)
  const ydocRef = useRef<Y.Doc | null>(null);
  const ytextRef = useRef<Y.Text | null>(null);

  // watch online/offline for the banner
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // Yjs setup: IndexedDB + WebSocket + textarea binding + awareness (presence info)
  useEffect(() => {
    const ydoc = new Y.Doc();

    // persist this doc locally (offline-first)
    const persistence = new IndexeddbPersistence(`notes:${room}`, ydoc);
    persistence.once("synced", () => {
      // console.log("loaded from IndexedDB");
    });

    const provider = new WebsocketProvider(
      import.meta.env.VITE_WS_URL ?? "ws://localhost:1234",
      room,
      ydoc
    );

    // debug logs to help diagnose connection issues
    try {
      provider.on("status", (e: any) => {
        // prints connected / disconnected status to Vite terminal
        // eslint-disable-next-line no-console
        console.log("y-websocket status:", e.status);
      });
      provider.on("connection-close", (ev: any) => {
        // eslint-disable-next-line no-console
        console.log("y-websocket connection closed:", ev);
      });
      provider.on("connection-error", (ev: any) => {
        // eslint-disable-next-line no-console
        console.error("y-websocket connection error:", ev);
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("error attaching provider listeners", err);
    }

    const ytext = ydoc.getText("note");

    // whenever shared text changes, update textarea value

    const applyToState = () => {
      const value = ytext.toString();
      setText(value);

      // derive a friendly title from first line (or Untitled)
      const firstLine = value.split("\n")[0]?.trim() || "Untitled";
      upsertNoteMeta({
        id: room,
        title: firstLine.slice(0, 60),
        updatedAt: Date.now(),
      });
    };
    ytext.observe(applyToState);
    applyToState(); // initial paint

    // stash refs for handlers
    ydocRef.current = ydoc;
    ytextRef.current = ytext;

    // --- NEW: awareness (presence info)
    const awareness: Awareness = provider.awareness;

    // set my local state (user presence)
    awareness.setLocalStateField("user", {
      name: "User-" + Math.floor(Math.random() * 1000),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });

    // listen for awareness updates (who’s online)
    const onAwarenessChange = () => {
      const states = Array.from(awareness.getStates().values());
      setUsers(states.map((s: any) => s.user));
    };
    awareness.on("change", onAwarenessChange);
    onAwarenessChange();

    // cleanup
    return () => {
      ytext.unobserve(applyToState);
      provider.destroy();
      ydoc.destroy();
      awareness.off("change", onAwarenessChange);
    };
  }, [room]);

  // textarea -> Y.Text
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const yt = ytextRef.current;
    if (!yt) return;
    const len = yt.length ?? 0;
    yt.delete(0, len);
    yt.insert(0, e.target.value);
  };

  return (
    <div className="container-page">
      {!online && (
        <div className="mb-3 inline-block rounded bg-yellow-100 px-3 py-2 text-yellow-900">
          Offline — changes will sync when you reconnect
        </div>
      )}

      <h1 className="mb-4 text-xl font-bold">Doc: {room}</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {users.map((u, i) => (
          <span
            key={i}
            className="px-2 py-1 rounded text-white"
            style={{ backgroundColor: u.color }}
          >
            {u.name}
          </span>
        ))}
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        className="w-full min-h-[60vh] border rounded-lg p-4 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Start typing..."
        spellCheck={false}
      />
    </div>
  );
}
