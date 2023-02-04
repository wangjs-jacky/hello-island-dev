import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/node/cli.ts"],
  bundle: true,
  splitting: true,
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true /* tsup 的牛逼之处，支持 .d.ts 文件生成*/,
  shims: true /* 引入 ployfill：可以让 ESM 模块使用 __dirname 或者 __filename 等只在 node 环境下存在的变量*/,
});
