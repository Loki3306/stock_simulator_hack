import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { handleDemo } from "./routes/demo";
import { connectDB } from "./db";
import { authRouter } from "./routes/auth";
import { googleAuthRouter } from "./routes/googleAuth";
import { usersRouter } from "./routes/users";
import { strategiesRouter } from "./routes/strategies";
import { marketplaceRouter } from "./routes/marketplace";
import { backtestsRouter } from "./routes/backtests";

export function createServer() {
  const app = express();

  // Security
  app.use(helmet({ crossOriginResourcePolicy: false }));
  const origin = process.env.ALLOWED_ORIGIN || "*";
  app.use(cors({ origin, credentials: true }));

  // Parsers
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Health
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Connect DB
  connectDB().catch((e) => console.error("DB connection error", e));

  // Rate limiters
  const authLimiter = rateLimit({ windowMs: 60_000, limit: 20 });

  // Demo + API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  app.use("/api/auth", authLimiter, authRouter);
  app.use("/api/auth", googleAuthRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/strategies", strategiesRouter);
  app.use("/api/backtests", backtestsRouter);
  app.use("/api/marketplace", marketplaceRouter);

  return app;
}
