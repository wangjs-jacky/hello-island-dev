import { build as viteBuild, InlineConfig } from "vite";
import {
  CLIENT_ENTRY_PATH,
  MASK_SPLITTER,
  SERVER_ENTRY_PATH,
} from "./constants";
import type { RollupOutput } from "rollup";
import { dirname, join } from "path";
import fs from "fs-extra"; /* fs-extra 的包，当构建为 esm 模块时，需配置 tsconfig*/
import ora from "ora";
import { SiteConfig } from "shared/types";
import { createVitePlugins } from "./createVitePlugins";
import { Route } from "./plugin-routes/RouteService";
import { RenderResult } from "../runtime/ssr-entry";
import path from "path";

/* const dynamicImport = new Function('m', 'return import(m)'); */

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (
    isServer = false
  ): Promise<InlineConfig> => ({
    mode: "production",
    root,
    plugins: await createVitePlugins(config, undefined, isServer),
    ssr: {
      /* 构建问题：bundle 的产物为 commonjs ,react-router-dom 是一个 ESM 包
        除了可以将 bundle 打包为 ESM（不要这样做），可以将 `react-router-dom` 完整打进产物中。
      */
      noExternal: ["react-router-dom", "lodash-es"],
    },
    build: {
      ssr: isServer,
      /* 主要是为了看编译后产物是否正确 */
      minify: false,
      outDir: isServer ? join(root, ".temp") : join(root, "build"),
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
      viteBuild(await resolveViteConfig(false)),
      /* server build */
      viteBuild(await resolveViteConfig(true)),
    ]);
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {
    console.log(error);
  }
}

async function buildIslands(
  root: string,
  islandPathToMap: Record<string, string>
) {
  // { Aside: 'xxx' }
  // 内容
  // import { Aside } from 'xxx'
  // window.ISLANDS = { Aside }
  // window.ISLAND_PROPS = JSON.parse(
  // document.getElementById('island-props').textContent
  // );
  const islandsInjectCode = `
    ${Object.entries(islandPathToMap)
      .map(
        ([islandName, islandPath]) =>
          `import { ${islandName} } from '${islandPath}'`
      )
      .join("")}
window.ISLANDS = { ${Object.keys(islandPathToMap).join(", ")} };
window.ISLAND_PROPS = JSON.parse(
  document.getElementById('island-props').textContent
);
  `;
  const injectId = "island:inject";
  /* 使用 rollup 对代码进行打包，并使用 plugins 插件 */
  return viteBuild({
    mode: "production",
    build: {
      outDir: path.join(root, ".temp"),
      rollupOptions: {
        input: injectId /* input 为啥不是一个路径？*/,
      },
      minify: false,
    },
    plugins: [
      {
        name: "island:inject",
        enforce: "post" /* enforce 的目的？*/,
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER);
            return this.resolve(originId, importer, {
              skipSelf: true /* skipSelf 的作用？ */,
            });
          }

          /* 不理解，可能等 vite 插件看完以后会有所了解吧 */
          if (id === injectId) {
            return id;
          }
        },
        load(id) {
          if (id === injectId) {
            return islandsInjectCode;
          }
        },
        generateBundle(_, bundle) {
          for (const name in bundle) {
            /* 将所有的静态资源删除 */
            if (bundle[name].type === "asset") {
              delete bundle[name];
            }
          }
        },
      },
    ],
  });
}

export async function renderPage(
  render: (url: string) => Promise<RenderResult>,
  routes: Route[],
  root: string,
  clientBundle: RollupOutput
) {
  console.log("Rendering page in server side...");
  /* hybrite 注入客户端的 js 脚本 */
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );

  return Promise.all(
    routes.map(async (route) => {
      const routePath = route.path;
      const {
        appHtml,
        islandToPathMap,
        islandProps = [],
      } = await render(routePath); // 将 renderToString 产出的 HTML 嵌入模板

      /* 注入1： 从客户端的入口文件中获取 css 等静态文件，并注入到 ssr 模板中 */
      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === "asset" && chunk.fileName.endsWith(".css")
      );
      /* 单独对标识为 __island 标识的组件进行打包 */
      const islandBunlde = await buildIslands(root, islandToPathMap);

      const islandsCode = (islandBunlde as RollupOutput).output[0].code;
      const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>title</title>
      <meta name="description" content="xxx">
      ${styleAssets
        .map((item) => `<link rel="stylesheet" href="/${item.fileName}">`)
        .join("\n")}
    </head>
    <body>
      <div id="root">${appHtml}</div>
      /* （水合过程：）注入 island 内部代码 */
      <script type="module">${islandsCode}</script>
      /* 全量客户端入口代码，后续待优化 */
      <script type="module" src="/${clientChunk?.fileName}"></script>
      /* 将 props 上的数据也绑定在 script 上面 */
      <script id="island-props">${JSON.stringify(islandProps)}</script>
    </body>
  </html>`.trim();
      /* 补上后缀 */
      const fileName = routePath.endsWith("/")
        ? `${routePath}index.html`
        : `${routePath}.html`;
      await fs.ensureDir(join(root, "build", dirname(fileName)));
      await fs.writeFile(join(root, "build", fileName), html);
      /* 删除临时文件 .temp（仅用于使用 renderToString 获取 html 文本） */
      await fs.remove(join(root, ".temp"));
    })
  );
}

export async function build(root = ".", config: SiteConfig) {
  /* 1. bundle - client 端 + server 端 */
  const [clientBundle] = await bundle(root, config);
  /* 2. 使用编译后的 server-entry 模块导出的 render 函数 */
  const serverEntryPath = join(root, ".temp", "ssr-entry.js");
  const { render, routes } = await import(
    serverEntryPath
  ); /* 使用 require 导入 CJS 包*/
  /* 3. 服务端渲染, 产出 HTML */
  try {
    await renderPage(
      render as (url: string) => Promise<RenderResult>,
      routes as Route[],
      root,
      clientBundle
    );
  } catch (e) {
    console.log("Render page error.\n", e);
  }
}
