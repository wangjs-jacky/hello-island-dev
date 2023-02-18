import { createServer } from "vite";
import { resolveConfig } from "./config";
import { PACKAGE_ROOT } from "./constants";
import { createVitePlugins } from "./createVitePlugins";

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  /* 在 dev 模式的入口，需要去读取 config 配置文件 */
  const siteConfig = await resolveConfig(root, "serve", "development");

  return createServer({
    root: PACKAGE_ROOT,
    plugins: createVitePlugins(siteConfig, restartServer),
  });
}
