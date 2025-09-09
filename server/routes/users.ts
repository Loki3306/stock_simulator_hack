import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { User } from "../models/User";

export const usersRouter = Router();

usersRouter.get("/me", authenticate as any, async (req: any, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({ id: user._id, email: user.email, name: user.name, role: user.role, settings: user.settings });
});

usersRouter.put("/me/settings", authenticate as any, async (req: any, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  user.settings = { ...user.settings, ...req.body };
  await user.save();
  res.json({ settings: user.settings });
});
