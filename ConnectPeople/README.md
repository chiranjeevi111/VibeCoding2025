# TeaTalk Connect (MVP)

This workspace contains a simple mobile-first web application (client + server) called TeaTalk Connect. It is a minimal MVP that allows users to create discussion topics by category, join tables, and chat in real-time using WebSockets.

Location: `ConnectPeople/`

## What's included
- `client/` — React (Vite) client with Tailwind via CDN for quick prototyping.
- `server/` — Express server with SQLite (Sequelize) and Socket.IO for real-time chat.

## Quick setup

Server (from `ConnectPeople/server`):

```powershell
cd D:/VibeCoding2025/ConnectPeople/server
npm install
npm run dev   # or `npm start` to run once
```

Client (from `ConnectPeople/client`):

```powershell
cd D:/VibeCoding2025/ConnectPeople/client
npm install
npm run start
```

Open `http://localhost:5173` (Vite default) to view the client. Server runs on `http://localhost:4000`.

## Notes / Future features
- Add authentication and persistent profiles (image upload storage).
- Add moderation and reporting for safety.
- Add AI coach (suggesting conversation starters) — can be an API that suggests prompts based on topic tags.
- Improve matching algorithm and add pagination.
