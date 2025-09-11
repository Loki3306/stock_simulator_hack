import mongoose, { Schema, Types } from "mongoose";

export interface StrategyDoc {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  title: string;
  description?: string;
  nodes: any;
  edges: any;
  version: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  privacy: "private" | "public" | "marketplace";
}

const StrategySchema = new Schema<StrategyDoc>({
  ownerId: { type: Schema.Types.ObjectId, required: true, index: true },
  title: { type: String, required: true },
  description: String,
  nodes: Schema.Types.Mixed,
  edges: Schema.Types.Mixed,
  version: { type: Number, default: 1 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  privacy: {
    type: String,
    enum: ["private", "public", "marketplace"],
    default: "private",
  },
});

StrategySchema.index({ title: "text", tags: 1 });

export const Strategy = mongoose.models.Strategy || mongoose.model<StrategyDoc>("Strategy", StrategySchema);
