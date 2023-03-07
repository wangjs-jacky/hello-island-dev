import { describe, expect, test } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rephypeStringify from "rehype-stringify";
import shiki from "shiki";
import { rehypePluginPreWrapper } from "../../node/plugin-mdx/rehypePlugins/preWrapper";
import { rehypePluginHighLight } from "../../node/plugin-mdx/rehypePlugins/pluginHignLight";
/* 注：vitest 不走 ts 构建，因此需要使用相对路径 */
import { remarkPluginToc } from "../../node/plugin-mdx/remarkPlugins/toc";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";

describe("Markdown compile cases", async () => {
  /* 初始化 processor
     使用可以操作 AST 的三个函数
  */
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rephypeStringify)
    .use(rehypePluginPreWrapper)
    .use(rehypePluginHighLight, {
      highlighter: await shiki.getHighlighter({ theme: "nord" }),
    });

  test("Compile title", () => {
    const mdContent = "# 123";
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot('"<h1>123</h1>"');
  });

  test("Compile code", () => {
    const mdContent = "I am using `Island.js`";
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(
      '"<p>I am using <code>Island.js</code></p>"'
    );
  });

  /* 
希望将：
  <pre><code class="language-js">console.log(123)</code></pre>
变为：
  <div class="language-js">
    <span class="lang">js</span>
    <pre><code class="language-js">console.log(123)</code></pre>
  </div>
*/

  test("Compile code block", () => {
    const mdContent = "```js\nconsole.log(123);\n```";
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-js\\"><span class=\\"lang\\">js</span><pre class=\\"shiki nord\\" style=\\"background-color: #2e3440ff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #B48EAD\\">123</span><span style=\\"color: #D8DEE9FF\\">)</span><span style=\\"color: #81A1C1\\">;</span></span>
      <span class=\\"line\\"></span></code></pre></div>"
    `);
  });

  test("Compile TOC", () => {
    const mdContent = `# h1

## h2 \`code\`
    
### h3 [link](https://islandjs.dev)
    
#### h4
    
##### h5
    `;
    const remarkProcessor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkPluginToc)
      .use(remarkStringify); /* 直接将 remark 转化为 html 文件*/

    const result = remarkProcessor.processSync(mdContent);
    expect(result.value.toString()).toMatchInlineSnapshot(`
      "# h1

      ## h2 \`code\`

      ### h3 [link](https://islandjs.dev)

      #### h4

      ##### h5

      export const toc = [
        {
          \\"id\\": \\"h2-code\\",
          \\"text\\": \\"h2 code\\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"h3-link\\",
          \\"text\\": \\"h3 link\\",
          \\"depth\\": 3
        },
        {
          \\"id\\": \\"h4\\",
          \\"text\\": \\"h4\\",
          \\"depth\\": 4
        }
      ]
      "
    `);
  });
});
