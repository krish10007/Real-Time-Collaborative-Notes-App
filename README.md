Real-Time Collaborative Notes 📝

Google Docs–lite built with React, TypeScript, Yjs, WebSockets, and TailwindCSS. Create, edit, and collaborate on notes in real-time — with offline support.

🚀 Features

🔄 Real-time collaboration with Yjs + WebSockets

💾 Offline-first: notes are persisted locally with IndexedDB

🖥️ Modern UI built with React + TailwindCSS

📂 Create, rename, and delete notes from a simple dashboard

🌍 Multi-user sync across different browser tabs

⚡ Fast and lightweight (Vite-powered React app)

🖼️ Screenshots
Home Page

![alt text](<Screenshot 2025-09-25 234527.png>)

Editor

![alt text](<Screenshot 2025-09-25 234518.png>)

🛠️ Tech Stack

Frontend: React, TypeScript, Vite, TailwindCSS

Collaboration: Yjs, y-websocket

Persistence: IndexedDB

Server: Node.js with y-websocket server

📦 Installation & Setup

Clone the repo:

git clone https://github.com/your-username/real-time-collaborative-notes.git
cd real-time-collaborative-notes

Install dependencies:

pnpm install

Start the client (Vite dev server):

pnpm --filter client dev

Start the server (WebSocket server):

pnpm --filter server dev

Open the app at 👉 http://localhost:5173

🧑‍💻 Usage

Click New Note to create a note

Open the same note in another tab → start typing to see real-time sync

Notes are saved offline using IndexedDB and sync when back online

📂 Project Structure
├── client/ # React + Vite frontend
│ ├── src/
│ │ ├── pages/ # Landing page, Doc editor
│ │ ├── App.tsx # Router + layout
│ │ └── index.css
├── server/ # WebSocket server
│ └── server.js
├── package.json
└── README.md

🌟 Future Improvements

✅ Rich-text editor (bold, italics, headings)

✅ User cursors / presence indicators

✅ Authentication (Google / GitHub login)

✅ Deploy to Vercel + Render/Heroku for free hosting

👨‍💻 Author

Krish Jakhar

💼 Aspiring Software Engineer / Cloud Engineer

🎥 Documenting builds on YouTube
