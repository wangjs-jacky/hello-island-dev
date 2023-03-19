import { throttle } from "lodash-es";

const NAV_HEIGHT = 56;

let links: HTMLAnchorElement[] = [];

export function bindingAsideScroll() {
  const marker = document.getElementById("aside-marker");
  /* 获取 目录 容器 */
  const aside = document.getElementById("aside-container");

  /* 如果没有该容器，则直接返回 */
  if (!aside) {
    return;
  }

  /* 获取正文锚点的 href */
  const headers = Array.from(aside?.getElementsByTagName("a") || []).map(
    (item) => decodeURIComponent(item.hash)
  );

  /* 高亮目录 */
  const activate = (links: HTMLAnchorElement[], index: number) => {
    if (links[index]) {
      const id = links[index].getAttribute("href");
      /* 获取目录的 href */
      const tocIndex = headers.findIndex((item) => item === id);

      const currentLink = aside?.querySelector(`a[href="#${id.slice(1)}"]`);
      console.log("currentLink", currentLink, aside);

      if (currentLink) {
        marker.style.top = `${33 + tocIndex * 28}px`;
        marker.style.opacity = "1";
      }
    }
  };

  const setActiveLink = () => {
    /* links 数组中存放的是正文的 anchor */
    links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".island-doc .header-anchor")
      /* 向上搜索 tagName */
    ).filter((item) => item.parentElement?.tagName !== "H1");
    /* 这个条件记录下：scorllHeight 最大为：容器的高度 + scrollTop  */
    const isBottom =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight;

    /* 高亮最后一个锚点 */
    if (isBottom) {
      activate(links, links.length - 1);
      return;
    }

    /* 2. 遍历所有的 link */
    for (let i = 0; i < links.length; i++) {
      const currentAnchor = links[i];
      const nextAnchor = links[i + 1];
      const scrollTop = Math.ceil(window.scrollY);
      /* 计算 scrollTop */
      const currentAnchorTop =
        currentAnchor.parentElement.offsetTop - NAV_HEIGHT;
      // 高亮最后一个锚点
      if (!nextAnchor) {
        activate(links, i);
        break;
      }

      /* 高亮第一个锚点 */
      if ((i === 0 && scrollTop < currentAnchorTop) || scrollTop == 0) {
        activate(links, 0);
        break;
      }

      // 如果当前 scrollTop 在 i 和 i + 1 个锚点之间
      const nextAnchorTop = nextAnchor.parentElement.offsetTop - NAV_HEIGHT;
      if (scrollTop >= currentAnchorTop && scrollTop < nextAnchorTop) {
        activate(links, i);
        break;
      }
    }
  };

  const throttledSetActiveLink = throttle(setActiveLink, 100);

  /* 绑定操作 */
  window.addEventListener("scroll", throttledSetActiveLink);

  return () => {
    window.removeEventListener("scroll", throttledSetActiveLink);
  };
}

export function scrollToTarget(target: HTMLElement, isSmooth: boolean) {
  /*   const targetPadding = parseInt(
    window.getComputedStyle(target).paddingTop,
    10
  ); */

  /* 计算滚动距离 */
  /* const targetTop2 =
    window.scrollY +
    target.getBoundingClientRect().top +
    targetPadding -
    NAV_HEIGHT;
  console.log("targetTop", targetTop2); */

  /* offset 是距离相对父元素的距离，因为具有 relative 父元素的就是 nav 下面一个 div 因此直接移动 targetTop 即可 */
  const targetTop = target.offsetTop;

  window.scrollTo({
    left: 0,
    top: targetTop,
    behavior: isSmooth ? "smooth" : "auto",
  });
}
