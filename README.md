# SyncSpace

A real-time collaborative document workspace — think Google Docs, built from scratch.

🔗 **Live Demo:** https://sync-space-gilt.vercel.app

## Features

- 🔐 User authentication (JWT-based login/register)
- 📄 Create, edit, and delete documents
- ⚡ Real-time collaborative editing (multiple users, same document, live sync)
- 👥 Document sharing with role-based access (editor/viewer)
- 🟢 Live presence — see who's currently viewing a document
- 💾 Auto-save

## Tech Stack

**Frontend:** React, Vite, React Router, Socket.io-client
**Backend:** Node.js, Express, Socket.io, JWT
**Database:** MongoDB (Mongoose)
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Architecture

- REST API for auth and document CRUD
- WebSocket (Socket.io) for real-time document sync and presence
- Protected routes on both frontend and backend
- Document-level access control (owner vs. collaborator permissions)

## Running Locally

1. Clone the repo
2. `cd client && npm install && npm run dev`
3. `cd server && npm install && npm run dev`
4. Set up `.env` files in both `client` and `server` (see `.env.example`)

## Author

Built by [Nithiya](https://github.com/Nithiya1912) |  [LinkedIn] (https://linkedin.com/in/nithiya-rajakumari-k-809701341)