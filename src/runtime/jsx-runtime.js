// @ts-nocheck
import * as jsxRuntime from "react/jsx-runtime";

const originJsx = jsxRuntime.jsx;
const originJsxs = jsxRuntime.jsxs;

export const data = {
  islandProps: [],
  islandToPathMap: {},
};

const internalJsx = (jsx, type, props, ...args) => {
  if (props && props.__island) {
    /* 把之前 babel 注入的参数，收集到 islandProps */
    data.islandProps.push(props);
    /* 当前的组件名称 */
    const id = type.name;
    /* 将组件名称和 props 对应起来 */
    data["islandToPathMap"][id] = props.__island;

    delete props.__island;

    /* 在 island 组件最外层再包一层组件 */
    return jsx("div", {
      __island: `${id}:${data.islandProps.length - 1}`,
      children: jsx(type, props, ...args),
    });
  }
  /* 非 island 组件，正常返回 */
  return jsx(type, props, ...args);
};

export const jsx = (...args) => internalJsx(originJsx, ...args);

export const jsxs = (...args) => internalJsx(originJsxs, ...args);

export const Fragment = jsxRuntime.Fragment;

export const clearIslandData = () => {
  data.islandProps = [];
  data.islandToPathMap = {};
};
