import mongoose from "mongoose";
import { Schema, Types } from "mongoose";

export interface RefreshTokenEntry {
  token: string;
  createdAt: Date;
  ip?: string;
}

export interface UserDoc {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: "user" | "author" | "admin";
  createdAt: Date;
  settings: {
    reduceMotion: boolean;
    theme: "dark" | "light";
  };
  refreshTokens: RefreshTokenEntry[];
}

const RefreshTokenSchema = new Schema<RefreshTokenEntry>({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  ip: String,
});

const UserSchema = new Schema<UserDoc>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["user", "author", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  settings: {
    reduceMotion: { type: Boolean, default: false },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
  },
  refreshTokens: { type: [RefreshTokenSchema], default: [] },
});

export const User = (mongoose as any).models?.User || mongoose.model<UserDoc>("User", UserSchema);
