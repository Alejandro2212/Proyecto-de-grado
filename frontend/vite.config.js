import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Sistema Inteligente de Reservas Horizonte",
        short_name: "Horizonte",
        description:
          "Sistema inteligente para la gestión de reservas de áreas comunes.",

        theme_color: "#0f172a",
        background_color: "#ffffff",

        display: "standalone",

        start_url: "/",

        scope: "/",

        orientation: "portrait",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],

  define: {
    global: "window",
  },

  optimizeDeps: {
    include: ["sockjs-client", "@stomp/stompjs"],
  },
});