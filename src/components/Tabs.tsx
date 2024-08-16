import { useState } from "react";
import { TabElement } from "../types/types";
import { Tab } from "./Tab";
import Map2 from "./Map2";
import SearchMap from "./SearchMap";

interface Props {
  tabs: TabElement[];
  selectedTab: TabElement;
  handleClickTab: (e: React.MouseEvent<HTMLElement>, tab: TabElement) => void;
}

// const tabs: TabElement[] = [
//   {
//     id: 1,
//     code: "search",
//     label: "探す",
//     href: "",
//   },
//   {
//     id: 2,
//     code: "add",
//     label: "追加する",
//     href: "",
//   },
// ];

export const Tabs = (props: Props) => {
  const { tabs, selectedTab, handleClickTab } = props;

  // const [selectedTab, setSelectedTab] = useState<TabElement>(tabs[0]);
  // const isSearchTab = selectedTab.code === "search";

  // const handleClickTab = (
  //   e: React.MouseEvent<HTMLElement>,
  //   tab: TabElement
  // ) => {
  //   e.preventDefault();
  //   console.log("クリックしました e: ", e);
  //   console.log("e.target: ", e?.target);
  //   console.log("tab: ", tab);
  //   setSelectedTab(tab);
  // };

  const isSelected = (tab: TabElement): boolean => {
    return selectedTab.id === tab.id;
  };

  return (
    <>
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {tabs.map((tab) => (
          <Tab
            isSelected={isSelected(tab)}
            key={tab.id}
            tab={tab}
            onClick={handleClickTab}
          />
        ))}
      </ul>
      {/* <div>{isSearchTab ? <Map2 /> : <SearchMap />}</div> */}
    </>
  );
};
