import { SiteConfig } from "shared/types";
import { Plugin } from "vite";
import { join, relative } from "node:path";
import { PACKAGE_ROOT, RUNTIME_PATH } from "node/constants";
import path from "path";
import fs from "fs-extra";
import sirv from "sirv";

/* 虚拟模块:
  作用等价于 umi 中的运行时概念，因为在编译阶段通过 fs.readFile 是轻松获取到 config 配置的。
  但是运行时无法获取配置信息，需要使用虚拟模块临时缓存下内容。
 */
const SITE_DATA_ID = "island:site-data";

export function pluginConfig(
  config: SiteConfig,
  restartServer?: () => Promise<void>
): Plugin {
  return {
    name: "island:config",
    // 新增插件钩子
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            "@runtime": join(RUNTIME_PATH, "index.ts"),
          },
        },
      };
    },
    configureServer(server) {
      const publicDir = path.join(config.root, "public");
      if (fs.pathExistsSync(publicDir)) {
        server.middlewares.use(sirv(publicDir));
      }
    },
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

        /* 重启 Dev Server：对原先的 server 进行销毁后，重读配置 */
        await restartServer();
      }
    },
  };
}
