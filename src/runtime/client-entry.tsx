/* react 渲染逻辑 */
import { createRoot } from "react-dom/client";
import { App } from "./app";
/* 测试 */
import siteData from "island:site-data";
/* 接入路由 */
import { BrowserRouter } from "react-router-dom";

function renderInBrowser() {
  const containEl = document.getElementById("root");
  if (!containEl) {
    throw new Error("#root element not found");
  }
  console.log("虚拟模块测试:", siteData);
  createRoot(containEl).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

renderInBrowser();
