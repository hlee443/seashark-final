import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5269", // Your backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/myHub": {
        target: "http://localhost:5269", // Your backend server URL
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying
      },
    },
  },
});
