import pluginMdx from "@mdx-js/rollup";
import remarkPluginGFM from "remark-gfm";
import rehypePluginAutolinkHeadings from "rehype-autolink-headings";
import rehypePluginSlug from "rehype-slug";
import { Plugin } from "rollup";
import remarkPluginFrontmatter from "remark-frontmatter";
import remarkPluginMDXFrontMatter from "remark-mdx-frontmatter";
import { rehypePluginPreWrapper } from "./rehypePlugins/preWrapper";
import { rehypePluginHighLight } from "./rehypePlugins/pluginHignLight";
import shiki from "shiki";
import { remarkPluginToc } from "./remarkPlugins/toc";

/* markdown 解析可以单独封装一个插件 */

export async function pluginMdxRollup(): Promise<Plugin> {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginFrontmatter,
      [
        remarkPluginMDXFrontMatter,
        {
          name: "frontmatter",
        },
      ],
      /* 和 remarkPluginMDXFrontMatter 一样，将 toc 暴露为一个变量 */
      remarkPluginToc,
    ],
    rehypePlugins: [
      /* 详见：https://www.npmjs.com/package/rehype-slug */
      rehypePluginSlug,
      [
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: "header-anchor",
          },
          content: {
            type: "text",
            value: "#",
          },
        },
      ],
      rehypePluginPreWrapper,
      [
        rehypePluginHighLight,
        { highlighter: await shiki.getHighlighter({ theme: "nord" }) },
      ],
    ],
  });
}
