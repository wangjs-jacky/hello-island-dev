import { createServer } from "vite";
import { pluginIndexHtml } from "./plugin-island/indexHtml";
import pluginReact from "@vitejs/plugin-react";
import { resolveConfig } from "./config";

export async function createDevServer(root: string) {
  /* 在 dev 模式的入口，需要去读取 config 配置文件 */
  const config = await resolveConfig(root, "serve", "development");

  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
  });
}
