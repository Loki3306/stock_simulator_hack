import "dotenv/config";
import { createServer } from "./server/index";

const app = createServer();
const port = process.env.PORT || 3000;

console.log(`Starting server on port ${port}...`);

const server = app.listen(port, () => {
  console.log(`🚀 Dev Server running on port ${port}`);
  console.log(`📡 Available endpoints:`);
  console.log(`   - http://localhost:${port}/api/ping`);
  console.log(`   - http://localhost:${port}/api/backtests/run-strategy-test`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

process.on("SIGTERM", () => {
  console.log("Shutting down server...");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => process.exit(0));
});