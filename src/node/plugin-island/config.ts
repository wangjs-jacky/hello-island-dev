import { SiteConfig } from "../../shared/types";
import { Plugin } from "vite";

/* 虚拟模块:
  作用等价于 umi 中的运行时概念，因为在编译阶段通过 fs.readFile 是轻松获取到 config 配置的。
  但是运行时无法获取配置信息，需要使用虚拟模块临时缓存下内容。
 */
const SITE_DATA_ID = "island:site-data";

export function pluginConfig(config: SiteConfig): Plugin {
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
  };
}
