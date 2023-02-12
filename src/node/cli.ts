import cac from "cac";
import { resolve } from "path";
import { resolveConfig } from "./config";
import { build } from "./build";
/* import { createDevServer } from "./dev"; */

const cli = cac("island").version("0.0.1");

cli.command("dev [root]", "start dev server").action(async (root: string) => {
  console.log("dev", root);
  const createServer = async () => {
    /* dev 单独打一个异步 chunk 包，这里使用 dev 构建产物 dev.js */
    const { createDevServer } = await import("./dev.js");
    const server = await createDevServer(root, async () => {
      /* 重启逻辑 */
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
});

cli
  .command("build [root]", "build in production")
  .action(async (root: string) => {
    try {
      /* 转化为绝对路径 */
      root = resolve(root);
      const config = await resolveConfig(root, "build", "production");
      await build(root, config);
    } catch (error) {
      console.log("error", error);
    }
  });

cli.parse();
