import React from "react";
import { Feature } from "shared/types";

const HomeFeature: React.FC<{ features: Feature[] }> = ({ features }) => {
  return (
    <div w="max-1152px auto" flex="~ wrap" justify="between" p="x-16">
      {features.map((feature) => {
        const { icon, title, details } = feature;
        return (
          <div key={title} border="rounded-md" p="r-4 b-4" w="1/3">
            {/* bg-soft 为自定义颜色 */}
            <article
              bg="bg-soft"
              border="~ bg-soft solid rounded-xl"
              p="6"
              h="full"
            >
              <div
                bg="gray-light-4 dark:bg-white"
                border="rounded-md"
                w="12"
                h="12"
                text="3xl"
                flex="center" /* 自定义规则： flex-center */
              >
                {icon}
              </div>
              <h2 font="bold">{title}</h2>
              <p text="sm text-2" font="medium leading-6" p="t-2">
                {details}
              </p>
            </article>
          </div>
        );
      })}
    </div>
  );
};

export default HomeFeature;
