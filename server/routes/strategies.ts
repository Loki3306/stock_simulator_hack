import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { Strategy } from "../models/Strategy";

export const strategiesRouter = Router();

strategiesRouter.get("/", authenticate as any, async (req: any, res) => {
  const { owner, tag, marketplace } = req.query as any;
  const filter: any = {};
  if (owner) filter.ownerId = owner;
  if (tag) filter.tags = tag;
  if (marketplace) filter.privacy = "marketplace";
  const items = await Strategy.find(filter).sort({ updatedAt: -1 }).limit(100);
  res.json(items);
});

strategiesRouter.post("/", authenticate as any, async (req: any, res) => {
  const { title, description, nodes, edges, tags, privacy } = req.body;
  const s = await Strategy.create({ ownerId: req.user.id, title, description, nodes, edges, tags, privacy });
  res.status(201).json(s);
});

strategiesRouter.get("/:id", authenticate as any, async (req: any, res) => {
  const s = await Strategy.findById(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  if (String(s.ownerId) !== req.user.id && s.privacy === "private") return res.status(403).json({ error: "Forbidden" });
  res.json(s);
});

strategiesRouter.put("/:id", authenticate as any, async (req: any, res) => {
  const s = await Strategy.findById(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  if (String(s.ownerId) !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  const { title, description, nodes, edges, tags, privacy } = req.body;
  s.set({ title, description, nodes, edges, tags, privacy, updatedAt: new Date(), version: (s.version || 1) + 1 });
  await s.save();
  res.json(s);
});

strategiesRouter.delete("/:id", authenticate as any, async (req: any, res) => {
  const s = await Strategy.findById(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  if (String(s.ownerId) !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  await s.deleteOne();
  res.json({ success: true });
});
