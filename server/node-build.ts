import path from "path";
import { createServer as createApp } from "./index";
import * as express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const app = createApp();
const server = http.createServer(app as any);
const io = new SocketIOServer(server, {
  cors: { origin: process.env.ALLOWED_ORIGIN || "*" },
});
import { setIO } from "./ws";
setIO(io);

io.on("connection", (socket) => {
  socket.on("joinJob", (jobId: string) => {
    socket.join(jobId);
  });
});

const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
(app as any).use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
(app as any).get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
