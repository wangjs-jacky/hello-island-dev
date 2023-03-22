import { renderToString } from "react-dom/server";
import { App, initPageData } from "./app";
import { StaticRouter } from "react-router-dom/server";
import { PageDataContext } from "./PageDataContext";

export interface RenderResult {
  appHtml: string;
  propsData: unknown[];
  islandToPathMap: Record<string, string>;
}

export async function render(pagePath: string) {
  const pageData = await initPageData(pagePath);
  const { clearIslandData, data } = await import("./jsx-runtime");
  clearIslandData();
  const { islandProps, islandToPathMap } = data;
  const appHtml = renderToString(
    <PageDataContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </PageDataContext.Provider>
  );

  return {
    appHtml,
    islandProps,
    islandToPathMap,
  };
}

/* 导出路由数据 */
export { routes } from "island:routes";
