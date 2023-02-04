import { build as viteBuild, InlineConfig } from "vite";
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from "./constants";
import type { RollupOutput } from "rollup";
import { join } from "path";
import fs from "fs-extra"; /* fs-extra 的包，当构建为 esm 模块时，需配置 tsconfig*/
import ora from "ora";

/* const dynamicImport = new Function('m', 'return import(m)'); */

export async function bundle(root: string) {
  const resolveViteConfig = (isServer = false): InlineConfig => ({
    mode: "production",
    root,
    build: {
      ssr: isServer,
      outDir: isServer ? ".temp" : "build",
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? "cjs" : "esm",
        },
      },
    },
  });

  try {
    /* const { default: ora } = await dynamicImport("ora"); */

    /* const spinner = ora();
    spinner.start("Building client + server bundles..."); */
    const [clientBundle, serverBundle] = await Promise.all([
      /* client build */
      viteBuild(resolveViteConfig()),
      /* server build */
      viteBuild(resolveViteConfig(true)),
    ]);
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {
    console.log(error);
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render(); // 将 renderToString 产出的 HTML 嵌入模板

  /* hybrite 注入客户端的 js 脚本 */
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>title</title>
      <meta name="description" content="xxx">
    </head>
    <body>
      <div id="root">${appHtml}</div>
      <script type="module" src="/${clientChunk?.fileName}"></script>
    </body>
  </html>`.trim();
  await fs.writeFile(join(root, "build", "index.html"), html);
  /* 删除临时文件 .temp（仅用于使用 renderToString 获取 html 文本） */
  await fs.remove(join(root, ".temp"));
}

export async function build(root = ".") {
  /* 1. bundle - client 端 + server 端 */
  const [clientBundle, serverBundle] = await bundle(root);
  /* 2. 使用编译后的 server-entry 模块导出的 render 函数 */
  const serverEntryPath = join(process.cwd(), root, ".temp", "ssr-entry.js");
  const { render } = await import(
    serverEntryPath
  ); /* 使用 require 导入 CJS 包*/
  /* 3. 服务端渲染, 产出 HTML */
  await renderPage(render as () => string, root, clientBundle);
}
