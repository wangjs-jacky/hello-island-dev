module.exports = {
  env: {
    browser: "true",
    node: "true",
  },
  parserOptions: {
    project: ["./tsconfig.json"], // 告诉 eslint：tsconfig 在哪
  },
  extends: [
    "eslint:recommended",
    /* 
      包含：parser: "@typescript-eslint/parser"
          plugins: ["@typescript-eslint"], （扩展 ts 的规则）
    */
    "plugin:@typescript-eslint/recommended",
    /* 
      需安装：eslint-config-prettier，prettier
      plugins: ["prettier"], 扩展 prettier 规则。
      extends: ["prettier"], 只是扩展 prettier 的规则
      rules: {
        "prettier/prettier": "error", // 需要在 rule 中开启 prettier 规则
        "arrow-body-style": "off", // 冲突-1，由 eslint-config-prettier 覆盖
        "prefer-arrow-callback": "off" // 冲突-1，由 eslint-config-prettier 覆盖
      }
    */
    // tsconfig.json 里 Type Checking 的推荐规则
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": "warn" /* 默认为 error */,
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-misused-promises": "off",
  },
};
