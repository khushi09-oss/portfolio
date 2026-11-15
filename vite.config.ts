import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readdirSync, readFileSync } from "node:fs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const directory = new URL("./.private-previews/", import.meta.url);
  const manifest = new URL("manifest.json", directory);
  const privateCheckout =
    existsSync(manifest) &&
    JSON.parse(readFileSync(manifest, "utf8")).enabled === true;
  const setting =
    process.env.VITE_ENABLE_PRIVATE_PREVIEWS ??
    env.VITE_ENABLE_PRIVATE_PREVIEWS;
  const enabled = setting === undefined ? privateCheckout : setting === "true";
  const projects =
    enabled && existsSync(directory)
      ? readdirSync(directory, { withFileTypes: true })
          .filter(
            (entry) =>
              entry.isDirectory() &&
              /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name) &&
              existsSync(new URL(`${entry.name}/index.html`, directory)),
          )
          .map((entry) => entry.name)
      : [];
  if (enabled && projects.length === 0)
    throw new Error(
      "Private previews are enabled but their local files are missing.",
    );
  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_PRIVATE_PROJECT_PREVIEWS": JSON.stringify(
        projects.join(","),
      ),
    },
    test: { include: ["src/**/*.test.ts"] },
    build: { chunkSizeWarningLimit: 650 },
  };
});
