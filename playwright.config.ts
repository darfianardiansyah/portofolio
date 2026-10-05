import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4173", screenshot: "only-on-failure", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome", launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } } },
    { name: "mobile", use: { ...devices["Pixel 7"], defaultBrowserType: "chromium", channel: "chrome", launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } } },
  ],
  webServer: { command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort", url: "http://127.0.0.1:4173", reuseExistingServer: !process.env.CI },
});
