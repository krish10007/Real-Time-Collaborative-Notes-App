// client/src/pages/Doc.tsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";

export default function Doc() {
  const { id } = useParams();
  const room = id || "default";

  // UI state
  const [text, setText] = useState("");
  const [online, setOnline] = useState<boolean>(navigator.onLine);

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

  // Yjs setup: IndexedDB + WebSocket + textarea binding
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

    const ytext = ydoc.getText("note");

    // whenever shared text changes, update textarea value
    const applyToState = () => setText(ytext.toString());
    ytext.observe(applyToState);
    applyToState(); // initial paint

    // stash refs for handlers
    ydocRef.current = ydoc;
    ytextRef.current = ytext;

    // cleanup
    return () => {
      ytext.unobserve(applyToState);
      provider.destroy();
      ydoc.destroy();
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
    <div className="p-6">
      {!online && (
        <div className="mb-3 inline-block rounded bg-yellow-100 px-3 py-2 text-yellow-900">
          Offline — changes will sync when you reconnect
        </div>
      )}

      <h1 className="mb-4 text-xl font-bold">Doc: {room}</h1>

      <textarea
        value={text}
        onChange={handleChange}
        className="w-full h-[70vh] border rounded p-2"
        placeholder="Start typing..."
        spellCheck={false}
      />
    </div>
  );
}
