import { usePageData } from "@runtime";
import React from "react";
import styles from "./index.module.scss";
import { NavItemWithLink } from "shared/types";

export function MenuItem(item: NavItemWithLink) {
  return (
    <div className="text-sm font-medium mx-3">
      <a href={item.link} className={styles.link}>
        {item.text}
      </a>
    </div>
  );
}

function Nav() {
  const { siteData } = usePageData();
  console.log("siteData", siteData);
  const nav = siteData?.themeConfig?.nav || [];
  return (
    <header className="relative" w="full">
      <div
        flex="~"
        items="center"
        justify="between"
        /* 注: 此处 divider-bottom 是自定义规则 */
        className="px-8 h-14 divider-bottom"
      >
        <div>
          <a
            href="/"
            className="w-full h-full text-1rem font-semibold flex items-center"
            hover="opacity-60"
          >
            Island.js
          </a>
        </div>
        <div flex="~">
          {nav.map((item) => {
            return <MenuItem {...item} key={item.text} />;
          })}
          <div>{/* 主题切换 */}</div>

          {/* 相关链接 */}
          <div className={styles["social-link-icon"]}>
            <a href="/">
              <div className="i-carbon-logo-github w-5 h-5"></div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Nav;
