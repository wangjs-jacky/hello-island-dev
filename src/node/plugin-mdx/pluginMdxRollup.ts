import pluginMdx from "@mdx-js/rollup";
import remarkPluginGFM from "remark-gfm";
import rehypePluginAutolinkHeadings from "rehype-autolink-headings";
import rehypePluginSlug from "rehype-slug";
import { Plugin } from "vite";
import remarkPluginFrontmatter from "remark-frontmatter";
import remarkPluginMDXFrontMatter from "remark-mdx-frontmatter";
import { rehypePluginPreWrapper } from "./rehypePlugins/preWrapper";
import { rehypePluginHighLight } from "./rehypePlugins/pluginHignLight";
import shiki from "shiki";

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
    ],
    rehypePlugins: [
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
