import { usePageData } from "@runtime";
import HomeFeature from "../../components/HomeFeature";
import HomeHero from "../../components/HomeHero";

const HomeLayout: React.FC = () => {
  const { frontmatter } = usePageData();
  return (
    <div>
      <HomeHero hero={frontmatter.hero} />
      <HomeFeature features={frontmatter.features} />
    </div>
  );
};

export { HomeLayout };
