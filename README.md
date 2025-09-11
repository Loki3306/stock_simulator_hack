# Stock Simulator Hack — Run Instructions

Short guide to run this project locally (dev and production), environment variables you must set, and quick troubleshooting steps.

## Quick overview
- Client: Vite React app (dev port 8080).
- Server: Express + Socket.IO (default port 3000). Server entry: `server/node-build.ts` (dev) and built file `dist/server/node-build.mjs` (production).
- Database: MongoDB (default `mongodb://localhost:27017/algotrader`).

## Prerequisites
- Node.js 18+ (Node 20/22 recommended)
- pnpm (recommended) or npm
- MongoDB running locally or a reachable MongoDB URI

## Install dependencies
Open PowerShell in the repo root and run:

```powershell
pnpm install
```

If you only have npm available:

```powershell
npm install
```

## Environment variables
Create a `.env` in the repo root (there is already a `.env` but you may need to add secrets). Minimal example:

```env
# public keys
VITE_PUBLIC_BUILDER_KEY=dev
PING_MESSAGE="ping pong"

# DB
MONGO_URI="mongodb://localhost:27017/algotrader"
MONGO_DB=algotrader

# CORS / server
ALLOWED_ORIGIN="http://localhost:8080"
PORT=3000

# Auth (set strong dev secrets for local testing)
JWT_ACCESS_SECRET=dev_access_secret
JWT_REFRESH_SECRET=dev_refresh_secret
COOKIE_DOMAIN=localhost
```

Set any values you need before starting the server.

## Run (development)
Start the client (dev Vite server):

```powershell
pnpm run dev
# opens client at http://localhost:8080
```

Start the server in a separate terminal (recommended: use `tsx` which is included in devDependencies):

```powershell
# quick dev server (no build):
pnpm exec tsx server/node-build.ts
```

Notes:
- If you see `Server running on port XXXX` and the terminal appears idle, that is expected: the server is listening and awaits incoming requests/sockets. It is not "stuck" unless you observe errors or missing endpoints.
- If the server prints nothing after that line but you can't reach endpoints, check MongoDB connectivity and logs (see Troubleshooting).

## Run (production-like)
Build both client and server then start the built server:

```powershell
pnpm run build
pnpm run start
```

This builds the SPA to `dist/spa` and the server bundle to `dist/server/node-build.mjs` and then starts Node with that build.

## Health checks
- Server health: `GET http://localhost:3000/health`
- Demo ping: `GET http://localhost:3000/api/ping`

## Troubleshooting
1) Server appears "stuck" after "Running on port":
   - That usually means the server is listening and waiting for requests (normal). Open the browser and request `/health` to confirm.
   - If requests hang, check MongoDB is reachable. If the DB connect promise never resolves, the server may be waiting on DB operations.
   - Tail logs or start the server directly to see errors:

```powershell
# start server and stream logs
pnpm exec tsx server/node-build.ts
# then in another terminal test the health endpoint
curl http://localhost:3000/health
```

2) Mongoose ESM import errors (e.g. "does not provide an export named 'models'")
   - Cause: mixing named imports and default import from `mongoose` in ESM can cause runtime errors depending on loader/resolution.
   - Quick fix (safe, manual): open each model under `server/models/*.ts` and ensure imports follow this pattern:

```ts
import mongoose from "mongoose";
import { Schema, Types } from "mongoose";

// define schema ...
export const User = mongoose.models?.User || mongoose.model("User", UserSchema);
```

   - In short: do not `import { models } from 'mongoose'`. Use the default `mongoose` and reference `mongoose.models`/`mongoose.model`.

3) Missing built server file when running `pnpm run start`:
   - If `dist/server/node-build.mjs` doesn't exist, run `pnpm run build` first.

4) Auth errors (not logged in, JWT failures):
   - Make sure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are provided in `.env` for dev testing.

## Optional convenience: run client + server together
You can run client and server in separate terminals. If you'd like a single command to run both, a common approach is adding `concurrently` and a `dev:all` script to `package.json`:

```json
"scripts": {
  "dev": "vite",
  "dev:server": "pnpm exec tsx server/node-build.ts",
  "dev:all": "concurrently \"pnpm run dev\" \"pnpm run dev:server\""
}
```

(If you want, I can add this `dev:all` script and `concurrently` to your `package.json`.)

## Quick checklist before you run
- [ ] Install deps: `pnpm install`
- [ ] Start MongoDB or set `MONGO_URI`
- [ ] Add JWT secrets to `.env`
- [ ] Run client: `pnpm run dev`
- [ ] Run server: `pnpm exec tsx server/node-build.ts`

## If you want me to fix things for you
I can:
- Normalize all mongoose imports in `server/models/*` (quick and low-risk).
- Add a `dev:server` / `dev:all` script and add `concurrently` to `devDependencies` so one command starts client+server.
- Add a small script file `server/dev-server.ts` that loads `.env` and runs the server with tsx and better logs.

Tell me which of the above you'd like me to apply and I will implement it and verify the server starts and responds to `/health`.

---
Generated on 2025-09-11
