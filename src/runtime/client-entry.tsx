/* react 渲染逻辑 */
import { createRoot, hydrateRoot } from "react-dom/client";
import { App, initPageData } from "./app";
/* 接入路由 */
import { BrowserRouter } from "react-router-dom";
import { PageDataContext } from "./PageDataContext";
import type { ComponentType } from "react";

declare global {
  interface Window {
    ISLANDS: Record<string, ComponentType<unknown>>;
    ISLAND_PROPS: unknown[];
  }
}

async function renderInBrowser() {
  const containEl = document.getElementById("root");
  if (!containEl) {
    throw new Error("#root element not found");
  }

  /* 如果是 Dev 环境 */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (import.meta.env.DEV) {
    // 初始化 PageData, 传入路由地址
    const pageData = await initPageData(location.pathname);
    createRoot(containEl).render(
      <PageDataContext.Provider value={pageData}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PageDataContext.Provider>
    );
  } else {
    /* 生产环境下，使用 Partial Hydration  */
    /* 1. 获取通过 jsx_runtime 函数去包裹的一层 <div __island="Aside:0"> */
    const islands = document.querySelectorAll("[__island]");
    if (islands.length === 0) {
      return;
    }

    /* 遍历所有标识为 island 的 dom 元素 */
    for (const island of islands) {
      // 2. 获取 id 为对应的组件名称， index 为当前第 i 个 island 组件
      const [id, index] = island.getAttribute("__island").split(":");
      console.log("id", id);

      const Element = window.ISLANDS[id];

      /* island: 是需要被水合的 dom 元素
         <Element /> 从 props 中取出需要被导入的数据，注入到 <Aside /> 组件中。
      */
      hydrateRoot(island, <Element {...window.ISLAND_PROPS[index]} />);
    }
  }
}

void renderInBrowser();
