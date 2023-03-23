import { Content } from "@runtime";
import { usePageData } from "@runtime";
/* 注：tsconfig 会从 theme-default/components/Nav 中导入，但是是错误的。 */
import Nav from "../components/Nav";
import "uno.css";
import "../styles/base.css";
import "../styles/vars.css";
import "../styles/doc.css";

/* 正文区 */
import DocLayout from "./DocLayout";
/* 侧边栏 */
import HomeLayout from "./HomeLayout";

export const Layout = () => {
  const pageData = usePageData();
  /* 获取 pageType */
  const { pageType } = pageData;

  const getContent = () => {
    if (pageType === "home") {
      return <HomeLayout />;
    } else if (pageType === "doc") {
      return <DocLayout />;
    } else {
      return <div>404 页面</div>;
    }
  };

  return (
    <div>
      <Nav />
      <section style={{ paddingTop: "var(--island-nav-height)" }}>
        {getContent()}
      </section>
    </div>
  );
};
