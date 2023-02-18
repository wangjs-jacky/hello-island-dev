import { describe, expect, test } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rephypeStringify from "rehype-stringify";
import { rehypePluginPreWrapper } from "../../node/plugin-mdx/rehypePlugins/preWrapper";

describe("Markdown compile cases", () => {
  /* 初始化 processor
     使用可以操作 AST 的三个函数
  */
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rephypeStringify)
    .use(rehypePluginPreWrapper);

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
  test("Compile multi-code", () => {
    const mdContent = '```js\n console.log("123") \n ```';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-js\\"><span class=\\"lang\\">js</span><pre><code class=\\"language-js\\"> console.log(\\"123\\") 
      </code></pre></div>"
    `);
  });
});
