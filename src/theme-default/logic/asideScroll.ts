/* 设置 active Link */

const activate = (links: HTMLAnchorElement[], index: number) => {
  if (links[index]) {
    const id = links[index].getAttribute("href");
  }
};

export function bindingAsideScroll() {
  const markder = document.getElementById("aside-marker");
  /* 获取 目录 容器 */
  const aside = document.getElementById("aside-container");

  /* 如果没有该容器，则直接返回 */
  if (!aside) {
    return;
  }

  const headers = Array.from(aside?.getElementsByTagName("a") || []).map(
    (item) => decodeURIComponent(item.hash)
  );

  const setActiveLink = () => {
    console.log("123");
  };

  /* 绑定操作 */
  window.addEventListener("scroll", setActiveLink);

  return () => {
    window.removeEventListener("scroll", setActiveLink);
  };
}
