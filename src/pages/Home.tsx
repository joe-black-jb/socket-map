import { useState } from "react";
import { TabElement } from "../types/types";
import Map2 from "../components/Map2";
import { Tabs } from "../components/Tabs";
import SearchMap from "../components/SearchMap";

const tabs: TabElement[] = [
  {
    id: 1,
    code: "search",
    label: "探す",
    href: "",
  },
  {
    id: 2,
    code: "add",
    label: "追加する",
    href: "",
  },
];

const Home = () => {
  const [selectedTab, setSelectedTab] = useState<TabElement>(tabs[0]);
  const isSearchTab = selectedTab.code === "search";

  const handleClickTab = (
    e: React.MouseEvent<HTMLElement>,
    tab: TabElement
  ) => {
    e.preventDefault();
    setSelectedTab(tab);
  };

  return (
    <>
      {/* <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        handleClickTab={handleClickTab}
      /> */}
      {/* {isSearchTab ? <Map2 /> : <SearchMap />} */}
      <SearchMap />
    </>
  );
};

export default Home;
