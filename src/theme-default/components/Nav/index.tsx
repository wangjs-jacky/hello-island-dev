import { usePageData } from "@runtime";
import React from "react";
import styles from "./index.module.scss";
import { NavItemWithLink } from "shared/types";
import { SwitchAppearance } from "../SwitchAppearance";

export function MenuItem({ item }: { item: NavItemWithLink }) {
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
    <header className="fixed left-0 top-0 " w="full" z="10">
      <div
        flex="~"
        items="center"
        justify="between"
        /* 注: 此处 divider-bottom 是自定义规则 */
        className={`h-14 divider-bottom ${styles.nav}`}
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
          <div flex="~">
            {nav.map((item) => {
              return <MenuItem item={item} key={item.text} />;
            })}
          </div>

          {/* 白天/夜间模式切换 */}
          <div before="menu-item-before" flex="~">
            <SwitchAppearance />
          </div>

          {/* 相关链接
              before 属性：添加伪元素
          */}
          <div className={styles["social-link-icon"]} before="menu-item-before">
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
