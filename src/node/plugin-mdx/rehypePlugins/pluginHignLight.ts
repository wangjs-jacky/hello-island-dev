import { visit } from "unist-util-visit";
import shiki from "shiki";
import type { Plugin } from "unified";
import type { Text, Root } from "hast";
import { fromHtml } from "hast-util-from-html";

interface Options {
  /* 支持接受 高亮 参数 */
  highlighter: shiki.Highlighter;
}

export const rehypePluginHighLight: Plugin<[Options], Root> = ({
  highlighter,
}) => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "pre" &&
        node.children[0]?.type === "element" &&
        node.children[0].tagName === "code"
      ) {
        /* 获取 node element */
        const codeNode = node.children[0];
        /* 获取 code string */
        const codeContent = (codeNode.children[0] as Text).value;
        /* 获取 code 类名 */
        const codeClassName = codeNode.properties?.className?.toString() || "";
        const lang = codeClassName.split("-")[1];
        if (!lang) {
          return;
        }
        /* 使用 hightligher 将 code 转化为 html */
        const highlightedCode = highlighter.codeToHtml(codeContent, { lang });
        /* 并将 html 转化为 AST 树 */
        const fragmentAst = fromHtml(highlightedCode, { fragment: true });
        /* 并修改原有 AST 树 */
        parent.children.splice(index, 1, ...fragmentAst.children);
      }
    });
  };
};
