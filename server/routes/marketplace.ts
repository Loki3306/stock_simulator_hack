import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { Strategy } from "../models/Strategy";
import { MarketplaceItem } from "../models/MarketplaceItem";

export const marketplaceRouter = Router();

marketplaceRouter.get("/", async (_req, res) => {
  const items = await MarketplaceItem.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(items);
});

marketplaceRouter.post(
  "/publish",
  authenticate as any,
  async (req: any, res) => {
    const { strategyId, price = 0, title, tags = [] } = req.body;
    const s = await Strategy.findById(strategyId);
    if (!s) return res.status(404).json({ error: "Strategy not found" });
    if (String(s.ownerId) !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });
    const item = await MarketplaceItem.findOneAndUpdate(
      { strategyId },
      {
        authorId: req.user.id,
        title: title || s.title,
        price,
        tags,
        isPublished: true,
      },
      { new: true, upsert: true },
    );
    s.privacy = "marketplace";
    await s.save();
    res.json(item);
  },
);

marketplaceRouter.post(
  "/import/:id",
  authenticate as any,
  async (req: any, res) => {
    const item = await MarketplaceItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    const s = await Strategy.findById(item.strategyId);
    if (!s) return res.status(404).json({ error: "Source strategy missing" });
    const copy = await Strategy.create({
      ownerId: req.user.id,
      title: `${s.title} (Imported)`,
      description: s.description,
      nodes: s.nodes,
      edges: s.edges,
      tags: s.tags,
      privacy: "private",
    });
    res.status(201).json(copy);
  },
);
