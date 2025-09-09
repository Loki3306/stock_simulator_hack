import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { Backtest } from "../models/Backtest";
import EventEmitter from "events";
import { getIO } from "../ws";

export const backtestsRouter = Router();

const bus = new EventEmitter();

function simulateRun(jobId: string) {
  let progress = 0;
  const tick = () => {
    progress += Math.ceil(Math.random() * 12);
    if (progress > 100) progress = 100;
    const payload = { jobId, progress, status: progress >= 100 ? "completed" : "running" };
    bus.emit("progress:" + jobId, payload);
    try {
      const io = getIO?.();
      if (io) io.to(jobId).emit("progress", payload);
    } catch {}
    if (progress < 100) setTimeout(tick, 500);
  };
  setTimeout(tick, 300);
}

backtestsRouter.post("/", authenticate as any, async (req: any, res) => {
  const { strategyId, symbol = "SPY", from, to, settings } = req.body;
  const bt = await Backtest.create({ strategyId, ownerId: req.user.id, symbol, from: from ? new Date(from) : new Date(Date.now() - 1000*60*60*24*365), to: to ? new Date(to) : new Date(), settings, status: "queued" });
  simulateRun(String(bt._id));
  res.json({ jobId: bt._id });
});

backtestsRouter.get("/:jobId", authenticate as any, async (req: any, res) => {
  const bt = await Backtest.findById(req.params.jobId);
  if (!bt) return res.status(404).json({ error: "Not found" });
  if (String(bt.ownerId) !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  res.json(bt);
});

backtestsRouter.get("/history/list", authenticate as any, async (req: any, res) => {
  const list = await Backtest.find({ ownerId: req.user.id }).sort({ createdAt: -1 }).limit(50);
  res.json(list);
});

// SSE fallback for job progress (dev)
backtestsRouter.get("/stream/:jobId", authenticate as any, async (req: any, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const { jobId } = req.params;
  const onProgress = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    if (data.status === "completed") {
      // save a mocked result
      Backtest.findByIdAndUpdate(jobId, {
        status: "completed",
        result: {
          kpis: { totalReturn: 23.4, annualReturn: 12.3, sharpe: 1.45, maxDrawdown: -8.7, winRate: 62 },
          equityCurve: Array.from({ length: 100 }, (_, i) => ({ ts: Date.now() - (100 - i) * 86400000, value: 10000 + i * 45 + Math.random()*200 })),
          trades: Array.from({ length: 50 }, (_, i) => ({ id: i+1, ts: Date.now() - (50 - i) * 86400000, type: i % 2 ? "BUY" : "SELL", qty: 10, price: 100 + i, pnl: (Math.random()-0.5)*100 })),
          safetyFlags: ["Low correlation risk", "Moderate volatility"],
        },
      }).exec();
      res.end();
      bus.removeListener("progress:" + jobId, onProgress);
    }
  };
  bus.on("progress:" + jobId, onProgress);
  req.on("close", () => bus.removeListener("progress:" + jobId, onProgress));
});
