import { SiteConfig } from "shared/types";
import { pluginConfig } from "./plugin-island/config";
import { pluginIndexHtml } from "./plugin-island/indexHtml";
import { pluginRoutes } from "./plugin-routes";
import pluginReact from "@vitejs/plugin-react";
import { createPluginMdx } from "./plugin-mdx";
import pluginUnocss from "unocss/vite";
import unocssOptions from "./unocssOptions";

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR?: boolean
) {
  return [
    pluginUnocss(unocssOptions),
    /* dev插件：中间件重定向到首页 */
    pluginIndexHtml(),
    /* React 插件 */
    pluginReact(),
    /* 处理配置插件 */
    pluginConfig(config, restartServer),
    pluginRoutes({ root: config.root, isSSR }),
    await createPluginMdx(),
  ];
}
