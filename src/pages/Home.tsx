import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Button from "../components/Button";
import Map from "../components/Map";
import { LatLng, MarkerData, Place, TabElement } from "../types/types";
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
  console.log("isSearchTab: ", isSearchTab);

  const handleClickTab = (
    e: React.MouseEvent<HTMLElement>,
    tab: TabElement
  ) => {
    e.preventDefault();
    console.log("クリックしました e: ", e);
    console.log("e.target: ", e?.target);
    console.log("tab: ", tab);
    setSelectedTab(tab);
  };

  // 両方読み込んでおいて表示、非表示のみ変えればいいかも

  return (
    <>
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        handleClickTab={handleClickTab}
      />
      {isSearchTab ? <Map2 /> : <SearchMap />}
      {/* <Map2 /> */}
    </>
  );
};

export default Home;
