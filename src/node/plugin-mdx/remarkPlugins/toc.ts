import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { Root } from "mdast";
import Slugger from "github-slugger";
import { parse } from "acorn";
/* mdast-util-mdxjs-esm 该库太高级，目前只使用其中的 ts 类型定义 */
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface ChildNode {
  type: "link" | "text" | "inlineCode";
  value: string;
  children?: ChildNode[];
}

// 写法详见：https://www.npmjs.com/package/github-slugger
const slugger = new Slugger();

export const remarkPluginToc: Plugin<[], Root> = () => {
  return (tree) => {
    const toc: TocItem[] = [];
    visit(tree, "heading", (node) => {
      if (!node.depth || !node.children) {
        return;
      }

      /* h2 ~ h4 */
      if (node.depth > 1 && node.depth < 5) {
        const originText = (node.children as ChildNode[])
          .map((child) => {
            switch (child.type) {
              // 如果是 link 类型的话，需要进行 map 遍历
              case "link":
                return child.children?.map((c) => c.value).join("") || "";
              default:
                return child.value;
            }
          })
          .join("");
        /* 使用 github-slugger 对锚点进行唯一化*/
        const id = slugger.slug(originText);
        toc.push({
          id,
          text: originText,
          depth: node.depth,
        });
      }
    });

    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)}`;

    /* 将 insertCode 转化为 ast 树插入到当前树的机构中 */
    tree.children.push({
      type: "mdxjsEsm",
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: "module",
        }) as unknown,
      },
    } as MdxjsEsm);
  };
};
