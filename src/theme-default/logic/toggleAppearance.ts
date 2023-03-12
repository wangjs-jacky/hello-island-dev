const APPEARANCE_KEY = "appearance";

/* 给 html 标签添加 类名
HTML 整体结构
  html
    - body
     - div id="root"
*/
const classList = document.documentElement.classList;

const setClassList = (isDark = false) => {
  if (isDark) {
    classList.add("dark");
  } else {
    classList.remove("dark");
  }
};

const updateAppearance = () => {
  const userPreference = localStorage.getItem(APPEARANCE_KEY);
  setClassList(userPreference === "dark");
};

if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
  updateAppearance();
  /* 当存在多个 tab 页标签时, 可以监听 storage 事件 */
  window.addEventListener("storage", () => updateAppearance());
}

export function toggle() {
  if (classList.contains("dark")) {
    setClassList(false);
    /* 本地状态存储 */
    localStorage.setItem(APPEARANCE_KEY, "light");
  } else {
    setClassList(true);
    /* 本地状态存储 */
    localStorage.setItem(APPEARANCE_KEY, "dark");
  }
}
