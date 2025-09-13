import "dotenv/config";
import { connectDB } from "./db";
import { User } from "./models/User";
import { Strategy } from "./models/Strategy";

async function setupDatabase() {
  console.log("🚀 AlgoTrader Pro - MongoDB Setup");
  console.log("===================================\n");
  
  try {
    // Connect to database
    await connectDB();
    
    // Create a test user
    console.log("👤 Creating demo user...");
    const demoUser = await User.findOneAndUpdate(
      { email: "demo@algotrader.com" },
      {
        email: "demo@algotrader.com",
        name: "Demo User",
        role: "user",
        passwordHash: "$2b$10$dummy.hash.for.demo.user.only", // Dummy hash
        settings: {
          reduceMotion: false,
          theme: "dark"
        }
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Demo user created: ${demoUser.name} (${demoUser.email})`);
    
    // Create a demo strategy
    console.log("\n🎯 Creating demo strategy...");
    const demoStrategy = await Strategy.findOneAndUpdate(
      { title: "Demo SMA Crossover" },
      {
        ownerId: demoUser._id,
        title: "Demo SMA Crossover",
        description: "A simple moving average crossover strategy for demonstration",
        nodes: [
          {
            id: "stock-1",
            type: "stock",
            position: { x: 100, y: 100 },
            data: { symbol: "AAPL", quantity: 100 }
          },
          {
            id: "sma-20",
            type: "technicalIndicator",
            position: { x: 300, y: 50 },
            data: { indicator: "SMA", period: 20 }
          },
          {
            id: "sma-50", 
            type: "technicalIndicator",
            position: { x: 300, y: 150 },
            data: { indicator: "SMA", period: 50 }
          }
        ],
        edges: [
          { id: "e1", source: "stock-1", target: "sma-20" },
          { id: "e2", source: "stock-1", target: "sma-50" }
        ],
        tags: ["demo", "sma", "crossover", "beginner"],
        privacy: "public",
        version: 1
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Demo strategy created: ${demoStrategy.title}`);
    
    // Database stats
    console.log("\n📊 Database Statistics:");
    const userCount = await User.countDocuments();
    const strategyCount = await Strategy.countDocuments();
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🎯 Strategies: ${strategyCount}`);
    
    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n🔗 Next Steps:");
    console.log("   1. Start your server: npm run dev");
    console.log("   2. Visit: http://localhost:8081");
    console.log("   3. Create an account or use demo@algotrader.com");
    console.log("   4. Start building strategies!");
    
    // Atlas connection troubleshooting
    if (process.env.MONGO_URI?.includes("localhost")) {
      console.log("\n⚠️  MongoDB Atlas Connection Issue Detected");
      console.log("==========================================");
      console.log("Your app is using local MongoDB. To fix Atlas connection:");
      console.log("1. Check your MongoDB Atlas cluster is running");
      console.log("2. Verify IP whitelist (0.0.0.0/0 for development)");
      console.log("3. Confirm username/password are correct");
      console.log("4. Try connecting with MongoDB Compass first");
      console.log("5. Update Node.js to latest LTS if TLS errors persist");
      console.log("\nFor now, local MongoDB will work fine for development!");
    }
    
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setupDatabase();