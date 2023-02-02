import cac from "cac";
import { createDevServer } from "./dev";

const cli = cac('island').version('0.0.1');

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  console.log("dev", root);
  /* 使用 Vite 暴露出的 createServer 函数去创建一个 server */
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});

cli.command('build [root]', 'build in production').action((root: string) => {
  console.log("build", root);
});

cli.parse();