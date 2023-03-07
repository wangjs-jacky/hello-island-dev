declare module "island:site-data" {
  import type { UserConfig } from "shared/types";
  const siteData: UserConfig;
  export default siteData;
}

declare module "island:routes" {
  import { RouteObject } from "react-router-dom";
  const routes: RouteObject[];
  export { routes };
}

declare module "*.module.scss" {
  /* module css文件本质上就是 key-value 结构的对象 */
  const classes: { [key: string]: string };
  export default classes;
}
