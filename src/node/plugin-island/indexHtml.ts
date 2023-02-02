import { readFile } from "fs/promises";
import { Plugin } from "vite";
import { DEFAULT_HTML_PATH } from "../constants";

export function pluginIndexHtml(): Plugin {
  return {
    name: "island:index-html",// name 的取名思考？
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, "utf-8");

          /* 将 html 返回给 server */
          try {
            res.statusCode = 200;
            res.setHeader('Content-Type', "text/html");
            res.end(html);
          } catch (e) {
            return next(e);

          }
        })
      }
    }
  }
}