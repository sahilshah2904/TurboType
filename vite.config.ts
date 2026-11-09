import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import { createHash } from "node:crypto";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_SUPABASE_URL: url, VITE_SUPABASE_PUBLISHABLE_KEY: key } = env;
  if (
    Object.keys(env).some(
      (name) =>
        name.startsWith("VITE_SUPABASE_") &&
        name !== "VITE_SUPABASE_URL" &&
        name !== "VITE_SUPABASE_PUBLISHABLE_KEY",
    )
  )
    throw new Error(
      "Only public Supabase settings may use the VITE_SUPABASE_ prefix.",
    );
  if (
    (url || key) &&
    (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url ?? "") ||
      !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key ?? ""))
  )
    throw new Error(
      "Set a hosted Supabase URL and a modern publishable key, or leave both unset.",
    );
  const backend = url ? new URL(url).origin : "";
  return {
    base: "/TurboType/",
    server: { port: 5173, strictPort: true },
    preview: { port: 4173, strictPort: true },
    build: { target: "es2022" },
    plugins: [
      {
        name: "turbotype-content-policy",
        apply: "build",
        transformIndexHtml: {
          order: "post",
          handler(html) {
            const bootScript = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1];
            if (!bootScript)
              throw new Error("TurboType boot script is missing");
            const hash = createHash("sha256")
              .update(bootScript.replace(/\r\n/g, "\n"))
              .digest("base64");
            const policy = `default-src 'none'; script-src 'self' 'sha256-${hash}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' data: blob:; connect-src 'self' ${backend}; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'`;
            return html.replace(
              "<head>",
              `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
            );
          },
        },
      },
    ],
    test: { include: ["src/**/*.test.ts"], environment: "node" },
  };
});
