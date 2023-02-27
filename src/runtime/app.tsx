import { matchRoutes } from "react-router-dom";
import { PageData } from "shared/types";
import { Layout } from "../theme-default/Layout";
import { routes } from "island:routes";
import { Route } from "node/plugin-routes/RouteService";
import siteData from "island:site-data";

export async function initPageData(routePath: string): Promise<PageData> {
  const matched = matchRoutes(routes, routePath);

  if (matched) {
    /* 获取 preload 函数获取编译后的 route component */
    const moduleInfo = await (matched[0].route as Route).preload();
    console.log(moduleInfo);
    return {
      pageType: "doc",
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath,
    };
  }
  return {
    pageType: "404",
    siteData,
    frontmatter: {},
    pagePath: routePath,
  };
}

export function App() {
  return <Layout />;
}
