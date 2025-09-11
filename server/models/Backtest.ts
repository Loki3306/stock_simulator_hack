import mongoose from "mongoose";
import { Schema, Types } from "mongoose";

export interface BacktestDoc {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  ownerId: Types.ObjectId;
  symbol: string;
  from: Date;
  to: Date;
  settings: any;
  status: "queued" | "running" | "completed" | "failed";
  createdAt: Date;
  result?: any;
}

const BacktestSchema = new Schema<BacktestDoc>({
  strategyId: { type: Schema.Types.ObjectId, required: true, index: true },
  ownerId: { type: Schema.Types.ObjectId, required: true, index: true },
  symbol: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  settings: Schema.Types.Mixed,
  status: {
    type: String,
    enum: ["queued", "running", "completed", "failed"],
    default: "queued",
    index: true,
  },
  createdAt: { type: Date, default: Date.now },
  result: Schema.Types.Mixed,
});

export const Backtest = (mongoose.models?.Backtest as mongoose.Model<BacktestDoc>) || mongoose.model<BacktestDoc>("Backtest", BacktestSchema);
