import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react") || id.includes("react-dom")) return "vendor-react";
          if (id.includes("motion") || id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("@stripe") || id.includes("@supabase")) {
            return "vendor-services";
          }
          if (id.includes("embla-carousel")) return "vendor-carousel";
          if (id.includes("pdf-lib")) return "vendor-pdf";
          return undefined;
        },
      },
    },
  },
});
