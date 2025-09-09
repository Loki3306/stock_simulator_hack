import mongoose from "mongoose";

export async function connectDB(uri?: string) {
  const mongo =
    uri || process.env.MONGO_URI || "mongodb://localhost:27017/algotrader";
  if (mongoose.connection.readyState === 1) return mongoose;
  await mongoose.connect(mongo, {
    dbName: process.env.MONGO_DB || "algotrader",
  });
  return mongoose;
}
