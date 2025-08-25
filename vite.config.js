import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // 👈 مهم! برای اینکه asset ها همیشه از root لود بشن
});
