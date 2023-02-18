import { Plugin } from "unified";
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      // <pre><code>...</code></pre>
      /* 描述 pre 或者 code 都是 element ，并且 tagName 为实际的标签*/
      /* 1. 找到 pre 标签 */
      if (
        node.tagName === "pre" &&
        node.children[0]?.type === "element" &&
        node.children[0].tagName === "code" &&
        !node.data?.isVisited /* 避免节点的递归嵌套 */
      ) {
        /* 找到 pre 标签 */
        const codeNode = node.children[0];
        const codeClassName = codeNode.properties?.className?.toString() || "";
        /* codeClassName 为 language-xxx 结构，需要获取语言的 lang */
        const lang = codeClassName.split("-")[1];

        /* 2. clone Node 节点 */
        const clonedNode: Element = {
          type: "element",
          tagName: "pre",
          children: node.children,
          data: {
            isVisited: true,
          },
        };

        node.tagName = "div";
        node.properties = node.properties || {};
        node.properties.className = codeClassName;

        node.children = [
          {
            type: "element",
            tagName: "span",
            properties: {
              className: "lang",
            },
            children: [
              {
                type: "text",
                value: lang,
              },
            ],
          },
          clonedNode,
        ];
      }
    });
  };
};
