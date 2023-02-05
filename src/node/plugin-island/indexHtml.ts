import { readFile } from "fs/promises";
import { Plugin } from "vite";
import { CLIENT_ENTRY_PATH, DEFAULT_HTML_PATH } from "../constants";

export function pluginIndexHtml(): Plugin {
  return {
    name: "island:index-html", // name 的取名思考？
    transformIndexHtml(html) {
      /* 自动注入：<script type="module" src="/src/runtime/client-entry.tsx"></script> */
      /* 官方说明：https://cn.vitejs.dev/guide/api-plugin.html#vite-specific-hooks
        可以return:
           1. html 字符串
           2. 一个包含 { html, tags }的对象 
      */
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`,
            },
            injectTo: "body",
          },
        ],
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, "utf-8");
          /* 将 html 返回给 server */
          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    },
  };
}
