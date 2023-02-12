import { SiteConfig } from "../../shared/types";
import { Plugin, ViteDevServer } from "vite";
import { relative } from "node:path";

/* 虚拟模块:
  作用等价于 umi 中的运行时概念，因为在编译阶段通过 fs.readFile 是轻松获取到 config 配置的。
  但是运行时无法获取配置信息，需要使用虚拟模块临时缓存下内容。
 */
const SITE_DATA_ID = "island:site-data";

export function pluginConfig(config: SiteConfig): Plugin {
  let server: ViteDevServer = null;
  return {
    name: "island:config",
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        /* 当解析到这个虚拟模块后，加上 `\0` 后返回 */
        return "\0" + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === "\0" + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    /* 通过 configureServer 可以获取 server 实例 */
    configureServer(s) {
      server = s;
    },
    async handleHotUpdate(ctx) {
      /* 监听范围 */
      const customWatchedFiles = [config.configPath];
      /* 筛选是否为 config.ts 文件 */
      const isConfigFile = (id: string) => {
        return customWatchedFiles.some((file) => id.includes(file));
      };

      if (isConfigFile(ctx.file)) {
        console.log(
          `\n${relative(
            config.root,
            ctx.file
          )} changed, restarting server ......`
        );
        await server.restart();
      }
    },
  };
}
