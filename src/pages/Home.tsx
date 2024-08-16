import { useEffect, useState } from "react";
import { MarkerData, Place, Station, TabElement } from "../types/types";
import Map2 from "../components/Map2";
import { Tabs } from "../components/Tabs";
import SearchMap from "../components/SearchMap";
import { FreeMap } from "../components/FreeMap";
import api from "../api/axiosConfig";
import { SearchInput } from "../components/SearchInput";
import { getPlaces, getStations, searchPlace } from "../api/apis";
import { LatLngExpression } from "leaflet";

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

// 東京駅
const defaultCenter: LatLngExpression = [35.68159350438924, 139.767199901854];

const Home = () => {
  const [center, setCenter] = useState<LatLngExpression>(defaultCenter);
  const [places, setPlaces] = useState<Place[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabElement>(tabs[0]);
  const [placeStr, setPlaceStr] = useState<string>("");

  const isSearchTab = selectedTab.code === "search";

  useEffect(() => {
    fetchPlaces();
    fetchStations();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(userLocation);
      });
    }
  };

  const handleClickTab = (
    e: React.MouseEvent<HTMLElement>,
    tab: TabElement
  ) => {
    e.preventDefault();
    setSelectedTab(tab);
  };

  const fetchPlaces = async () => {
    const places = await getPlaces();
    setPlaces(places);
  };

  const fetchStations = async () => {
    const stations = await getStations();
    setStations(stations);
  };

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e?.target?.value;
    setPlaceStr(input);
    const filtered = stations.filter(
      (station) => station.name.indexOf(input) !== -1 // 部分一致でフィルタリング
    );
    setFilteredStations(filtered);
  };

  const onClear = () => {
    setPlaceStr("");
    setFilteredStations([]);
  };

  const onClickSearch = async () => {
    // 完全一致 or 末尾の駅をとった文字列 が stations になければ検索
    // center を変更する and 候補にない駅は登録する
    // 駅の登録は末尾に「駅」をつけて検索 & 緯度、経度を登録
    const res = await searchPlace(placeStr);
    console.log("res⭐️: ", res);
  };

  const onClickSuggestion = (suggestion: Station) => {
    console.log("suggestion: ", suggestion);

    setPlaceStr(suggestion.name);
    setFilteredStations([]);
    setCenter([suggestion.latitude, suggestion.longitude]);
  };

  // console.log("center: ", center);

  return (
    <>
      {/* <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        handleClickTab={handleClickTab}
      /> */}
      {/* {isSearchTab ? <Map2 /> : <SearchMap />} */}
      {/* <SearchMap /> */}
      <SearchInput
        value={placeStr}
        suggestions={filteredStations}
        onChange={onValueChange}
        onClear={onClear}
        onClick={onClickSearch}
        onClickSuggestion={onClickSuggestion}
      />
      <FreeMap center={center} places={places} />
    </>
  );
};

export default Home;
