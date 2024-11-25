import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    preset: "deno-deploy",
    experimental: {
      websocket: true,
    },
  },
}).addRouter({
  name: "ws",
  type: "http",
  handler: "./src/lib/ws.ts",
  target: "server",
  base: "/ws",
});
