import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
export interface AuthUser {
  id: string;
  role: "user" | "author" | "admin";
}

export function authenticate(
  req: Request & { user?: AuthUser },
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ error: "Missing Authorization header" });
  const token = header.replace("Bearer ", "");
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "dev_access_secret",
    ) as AuthUser & { iat: number; exp: number };
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function authorize(...roles: AuthUser["role"][]) {
  return (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (roles.length && !roles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
