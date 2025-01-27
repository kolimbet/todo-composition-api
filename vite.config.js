import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    publicDir: "public", // files from here will be copied to outDir
    outDir: "dist",
    chunkSizeWarningLimit: 600,
  },
});
