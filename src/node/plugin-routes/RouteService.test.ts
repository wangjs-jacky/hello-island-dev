import { RouteService } from "./RouteService";
import { describe, expect, test } from "vitest";
import path from "path";

describe("RouteService", async () => {
  const testDir = path.join(__dirname, "fixtures");
  const routeService = new RouteService(testDir);
  /* 初始化 */
  await routeService.init();

  // eslint-disable-next-line @typescript-eslint/require-await
  test("conventional route by file structure", async () => {
    const routeMeta = routeService.getRouteMeta().map((item) => ({
      ...item,
      absolutePath: item.absolutePath.replace(testDir, "TEST_DIR"),
    }));
    expect(routeMeta).toMatchInlineSnapshot(`
      [
        {
          "absolutePath": "TEST_DIR/a.mdx",
          "routePath": "/a",
        },
        {
          "absolutePath": "TEST_DIR/guide/b.mdx",
          "routePath": "/guide/b",
        },
        {
          "absolutePath": "TEST_DIR/index.mdx",
          "routePath": "/",
        },
      ]
    `);
  });

  // eslint-disable-next-line @typescript-eslint/require-await
  test("generate routes code", async () => {
    expect(
      routeService.generateRoutesCode().replaceAll(testDir, "TEST_DIR")
    ).toMatchInlineSnapshot(
      `
      "
          import React from 'react';
          import loadable from '@loadable/component';
          /* 构造动态导入组件, 使用 Route + 数字的方式命名 */
          const Route0 = loadable(() => import('TEST_DIR/a.mdx'));
      const Route1 = loadable(() => import('TEST_DIR/guide/b.mdx'));
      const Route2 = loadable(() => import('TEST_DIR/index.mdx'));
          export const routes = [
          { path: '/a', element: React.createElement(Route0)},
          { path: '/guide/b', element: React.createElement(Route1)},
          { path: '/', element: React.createElement(Route2)}
          ];
          "
    `
    );
  });
});
