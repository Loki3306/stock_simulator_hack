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
  googleId?: string;
}

const RefreshTokenSchema = new Schema<RefreshTokenEntry>({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  ip: String,
});

const UserSchema = new Schema<UserDoc>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String },
  name: { type: String, required: true },
  role: { type: String, enum: ["user", "author", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  settings: {
    reduceMotion: { type: Boolean, default: false },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
  },
  refreshTokens: { type: [RefreshTokenSchema], default: [] },
  googleId: { type: String, unique: true, sparse: true },
});

export const User = (mongoose.models?.User as mongoose.Model<UserDoc>) || mongoose.model<UserDoc>("User", UserSchema);
