/* react 渲染逻辑 */

import { createRoot } from "react-dom";
import { App } from "./app";

function renderInBrowser() {
  const containEl = document.getElementById("root");
  if (!containEl) {
    throw new Error("#root element not found");
  }
  createRoot(containEl).render(<App />);
}

renderInBrowser();
