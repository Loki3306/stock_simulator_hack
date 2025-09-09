import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npm run dev",
    port: 8080,
    timeout: 120000,
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:8080",
    headless: true,
  },
});
