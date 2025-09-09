import mongoose, { Schema, Types } from "mongoose";

export interface MarketplaceItemDoc {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  authorId: Types.ObjectId;
  title: string;
  price: number;
  rating: number;
  tags: string[];
  createdAt: Date;
  salesCount: number;
  isPublished: boolean;
}

const MarketplaceItemSchema = new Schema<MarketplaceItemDoc>({
  strategyId: { type: Schema.Types.ObjectId, required: true, index: true },
  authorId: { type: Schema.Types.ObjectId, required: true, index: true },
  title: { type: String, required: true },
  price: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  salesCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false, index: true },
});

export const MarketplaceItem =
  mongoose.models.MarketplaceItem ||
  mongoose.model<MarketplaceItemDoc>("MarketplaceItem", MarketplaceItemSchema);
