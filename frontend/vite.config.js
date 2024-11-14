// vite.config.js
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Allows you to use "@" as an alias for the "./src" folder
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Optional: Increase warning limit for chunk size
  },
});

