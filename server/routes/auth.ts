import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { authenticate } from "../middleware/auth";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function signAccessToken(user: { id: string; role: string }) {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET || "dev_access_secret", {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  });
}

function signRefreshToken(user: { id: string; role: string }) {
  return jwt.sign(
    user,
    process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    },
  );
}

function setRefreshCookie(res: any, token: string) {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    domain: process.env.COOKIE_DOMAIN || "localhost",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
}

authRouter.use(cookieParser());

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password, name } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email already in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });
  const access = signAccessToken({ id: String(user._id), role: user.role });
  const refresh = signRefreshToken({ id: String(user._id), role: user.role });
  user.refreshTokens.push({
    token: refresh,
    createdAt: new Date(),
    ip: req.ip,
  });
  await user.save();
  setRefreshCookie(res, refresh);
  res.json({
    accessToken: access,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      settings: user.settings,
    },
  });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const access = signAccessToken({ id: String(user._id), role: user.role });
  const refresh = signRefreshToken({ id: String(user._id), role: user.role });
  user.refreshTokens.push({
    token: refresh,
    createdAt: new Date(),
    ip: req.ip,
  });
  await user.save();
  setRefreshCookie(res, refresh);
  res.json({
    accessToken: access,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      settings: user.settings,
    },
  });
});

authRouter.post("/refresh", async (req, res) => {
  const token = req.cookies?.["refresh_token"];
  if (!token) return res.status(401).json({ error: "Missing refresh token" });
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
    ) as any;
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: "Invalid refresh token" });
    const exists = user.refreshTokens.find((t) => t.token === token);
    if (!exists)
      return res.status(401).json({ error: "Refresh token revoked" });
    // rotate
    const newRefresh = signRefreshToken({
      id: String(user._id),
      role: user.role,
    });
    exists.token = newRefresh;
    exists.createdAt = new Date();
    await user.save();
    setRefreshCookie(res, newRefresh);
    const access = signAccessToken({ id: String(user._id), role: user.role });
    res.json({ accessToken: access });
  } catch (e) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

authRouter.post("/logout", authenticate, async (req: any, res) => {
  const token = req.cookies?.["refresh_token"];
  const user = await User.findById(req.user.id);
  if (user && token) {
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
    await user.save();
  }
  res.clearCookie("refresh_token", { path: "/api/auth" });
  res.json({ success: true });
});

authRouter.get("/user", authenticate, async (req: any, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    settings: user.settings,
  });
});
