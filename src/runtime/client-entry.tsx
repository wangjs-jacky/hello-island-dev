/* react 渲染逻辑 */
import { createRoot } from "react-dom/client";
import { App, initPageData } from "./app";
/* 接入路由 */
import { BrowserRouter } from "react-router-dom";
import { PageDataContext } from "./PageDataContext";

async function renderInBrowser() {
  const containEl = document.getElementById("root");
  if (!containEl) {
    throw new Error("#root element not found");
  }
  // 初始化 PageData, 传入路由地址
  const pageData = await initPageData(location.pathname);
  createRoot(containEl).render(
    <PageDataContext.Provider value={pageData}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PageDataContext.Provider>
  );
}

void renderInBrowser();
