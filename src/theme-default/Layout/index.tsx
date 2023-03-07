import { Content } from "@runtime";
import { usePageData } from "@runtime";
/* 注：tsconfig 会从 theme-default/components/Nav 中导入，但是是错误的。 */
import Nav from "../components/Nav";
import "uno.css";
import "../styles/base.css";
import "../styles/vars.css";

export const Layout = () => {
  const pageData = usePageData();
  /* 获取 pageType */
  const { pageType } = pageData;

  const getContent = () => {
    if (pageType === "home") {
      return <div> Home 页面</div>;
    } else if (pageType === "doc") {
      return (
        <div>
          <Content></Content>
        </div>
      );
    } else {
      return <div>404 页面</div>;
    }
  };

  return (
    <div>
      <Nav />
      {/* {getContent()} */}
    </div>
  );
};
