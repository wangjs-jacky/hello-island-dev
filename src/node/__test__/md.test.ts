import { describe, expect, test } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rephypeStringify from "rehype-stringify";

describe("Markdown compile cases", () => {
  /* 初始化 processor
     使用可以操作 AST 的三个函数
  */
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rephypeStringify);

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
});
