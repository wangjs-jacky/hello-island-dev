import React from "react";
import { SidebarGroup, SidebarItem } from "shared/types";
import { Link } from "../Link";
import styles from "./index.module.scss";

interface SidebarProps {
  sidebarData: SidebarGroup[];
  pathname: string;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { sidebarData, pathname } = props;

  const renderGroupItem = (item: SidebarItem) => {
    /* 是否处于激活状态 */
    const active = item.link === pathname;
    return (
      <div m="l-5">
        <div
          p="1"
          block="~"
          text="sm"
          font="medium"
          /* 如果是激活状态的话，使用主题色，否则使用 text 浅色 */
          className={`${active ? "text-brand" : "text-text-2"}`}
        >
          <Link href={item.link}>{item.text}</Link>
        </div>
      </div>
    );
  };

  const renderGroup = (item: SidebarGroup) => {
    return (
      <section key={item.text} block="~" not-first="divider-top mt-4">
        <div flex="~" justify="between" items="center">
          <h2 m="t-3 b-2" text="1rem text-1" font="bold">
            {item.text}
          </h2>
        </div>
        <div m="b-1">
          {item.items?.map((item) => (
            <div key={item.link}>{renderGroupItem(item)}</div>
          ))}
        </div>
      </section>
    );
  };
  return (
    <aside className={styles.sidebar}>
      <nav>
        {sidebarData.map((item) => {
          return renderGroup(item);
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
