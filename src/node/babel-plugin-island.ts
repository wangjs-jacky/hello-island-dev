import { declare } from "@babel/helper-plugin-utils";

import type { Visitor } from "@babel/traverse";
import type { PluginPass } from "@babel/core";

import { types as t } from "@babel/core";
import { MASK_SPLITTER } from "./constants";
import { normalizePath } from "vite";

export default declare((api) => {
  /* babel 版本大于 7 */
  api.assertVersion(7);
  const visitor: Visitor<PluginPass> = {
    /* 访问 JSX 开始标签 */
    JSXOpeningElement(path, state) {
      const name = path.node.name;

      /* 获取 大写的组件名称 */
      const bindingName = (name as { name: string }).name;

      /* 通过作用域，获取组件的引入位置 */
      const binding = path.scope.getBinding(bindingName);

      if (binding?.path.parent.type === "ImportDeclaration") {
        /* 获取当前元素的父元素为 import 语句 */
        const source = binding.path.parent.source;
        /* 获取 props */
        const attributes = (path.container as t.JSXElement).openingElement
          .attributes;

        for (let i = 0; i < attributes.length; i++) {
          const name = (attributes[i] as t.JSXAttribute).name;
          if (name?.name === "__island") {
            (attributes[i] as t.JSXAttribute).value = t.stringLiteral(
              `${source.value}${MASK_SPLITTER}${normalizePath(
                state.filename || ""
              )}`
            );
          }
        }
      }
    },
  };

  return {
    name: "transform-jsx-island",
    visitor,
  };
});
