import { createServer } from "vite";
import { pluginIndexHtml } from "./plugin-island/indexHtml";
import pluginReact from "@vitejs/plugin-react";
import { resolveConfig } from "./config";
import { pluginConfig } from "./plugin-island/config";

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  /* 在 dev 模式的入口，需要去读取 config 配置文件 */
  const siteConfig = await resolveConfig(root, "serve", "development");

  return createServer({
    root,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(siteConfig, restartServer),
    ],
  });
}
