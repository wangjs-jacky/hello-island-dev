import { Plugin } from "vite";
import { RouteService } from "./RouteService";
interface PluginOptions {
  root: string;
  isSSR: boolean;
}

export const CONVENTIONAL_ROUTE_ID = "island:routes";

export function pluginRoutes(options: PluginOptions): Plugin {
  const { isSSR } = options;
  const routeService = new RouteService(options.root);
  return {
    name: "island:routes",
    async configResolved(config) {
      /* 启动时初始化 */
      await routeService.init();
    },
    resolveId(id: string) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return "\0" + CONVENTIONAL_ROUTE_ID;
      }
    },
    load(id: string) {
      if (id === "\0" + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRoutesCode(isSSR || false);
      }
    },
  };
}
