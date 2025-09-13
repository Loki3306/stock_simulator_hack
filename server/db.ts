import mongoose from "mongoose";

export async function connectDB(uri?: string) {
  const mongo =
    uri || process.env.MONGO_URI || "mongodb://localhost:27017/algotrader";
  
  if (mongoose.connection.readyState === 1) return mongoose;
  
  // Connection options for MongoDB Atlas
  const options = {
    dbName: process.env.MONGO_DB || "algotrader",
    retryWrites: true,
    w: "majority" as const,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };
  
  try {
    console.log("🔌 Attempting to connect to MongoDB...");
    await mongoose.connect(mongo, options);
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return mongoose;
  } catch (error) {
    console.error("❌ MongoDB Atlas connection failed:", error.message);
    
    // If Atlas fails, try local MongoDB as fallback
    if (mongo.includes("mongodb+srv://") || mongo.includes("mongodb.net")) {
      console.log("🔄 Trying local MongoDB fallback...");
      try {
        const localUri = "mongodb://localhost:27017/algotrader";
        await mongoose.connect(localUri, {
          dbName: process.env.MONGO_DB || "algotrader",
        });
        console.log("✅ Connected to local MongoDB");
        return mongoose;
      } catch (localError) {
        console.error("❌ Local MongoDB also failed:", localError.message);
        console.log("\n💡 To fix this:");
        console.log("1. Install MongoDB locally: https://www.mongodb.com/try/download/community");
        console.log("2. Or fix Atlas connection issues (check network access, credentials)");
        console.log("3. App will continue with limited functionality");
        throw error; // Throw original Atlas error
      }
    } else {
      throw error;
    }
  }
}
