/* eslint-disable @typescript-eslint/no-unsafe-call */
/* 插件功能：解决 Md 文件变化，模块边界识别 */

import assert from "assert";
import { Plugin } from "vite";
import type { TransformResult } from "rollup";
export function pluginMdxHmr(): Plugin {
  let viteReactPlugin: Plugin;
  return {
    name: "vite-plugin-mdx-hmr",
    apply: "serve" /* 只作用于 dev 环境 */,
    /* vite 独有钩子：可以拿到完整配置，如官方内置的一些插件 */
    configResolved(config) {
      /* 找到 Vite 提供的官方插件：http://www.vitejs.net/plugins/
         @vitejs/plugin-react
      */
      viteReactPlugin = config.plugins.find(
        (plugin) => plugin.name === "vite:react-babel"
      );
    },
    /* 等价于 webpack 中的 loader 的作用 */
    async transform(code, id, opts) {
      if (/.mdx$/g.test(id)) {
        /* viteReactPlugin 为 @vitejs/plugin-react 插件实例 */
        assert(typeof viteReactPlugin.transform === "function");
        const result = (await viteReactPlugin.transform.call(
          this,
          code,
          id + "?.jsx",
          opts
        )) as TransformResult;

        /* 注入热更新代码，将模块边界划分在 mdx 文件边界 */
        if (
          typeof result === "object" &&
          !result.code?.includes("import.meta.hot.accept(")
        ) {
          result.code += "import.meta.hot.accept();";
        }
        return result;
      }
    },
  };
}
