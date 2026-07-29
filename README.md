# Pollify Frontend

React + Vite + Tailwind CSS frontend for Pollify, wired to the Sequelize/MySQL backend.

## Setup

```
npm install
```

Copy `.env.example` to `.env` and point `VITE_API_URL` at your running backend
(defaults to `http://localhost:5000/api`, which matches the backend's default PORT).

## Run

```
npm run dev
```

Opens at http://localhost:5173 by default. Make sure the backend server is running first
(`npm start` in the backend folder) or every page will show empty/loading states.

## Build

```
npm run build
```

Outputs static files to `dist/` - deploy that folder to Vercel, Netlify, or any static host.
