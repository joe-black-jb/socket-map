import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { BoundsParams, FilterLabel, Place, Station } from "../types/types";
import L, { LatLngBounds, LatLngExpression, LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";
import { siCoffeescript, siMcdonalds, siStarbucks } from "simple-icons";
import { renderToStaticMarkup } from "react-dom/server";
import {
  getPlaces,
  getPlacesWithinBounds,
  getStations,
  searchPlace,
} from "../api/apis";
import { debounce } from "lodash";
import { SearchInput } from "./SearchInput";
import { Filter } from "./Filter";

// Mapの中心を動的に変更するためのコンポーネント
const ChangeMapView = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

// 東京駅
const defaultCenter: LatLngExpression = [35.68159350438924, 139.767199901854];

const boundsAreaNum = Number(process.env.BOUNDS_AREA_NUM) || 0.01;

const zoom = Number(process.env.REACT_APP_ZOOM) || 17;

export const FreeMap = () => {
  const [center, setCenter] = useState<LatLngExpression>(defaultCenter);
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [placeStr, setPlaceStr] = useState<string>("");
  const [bounds, setBounds] = useState<number[]>([]);
  const [wifiFilter, setWifiFilter] = useState<boolean>(false);
  const [socketFilter, setSocketFilter] = useState<boolean>(false);

  useEffect(() => {
    getCurrentLocation();
    fetchPlaces("places.json");
    fetchStations("stations.json");
  }, []);

  // 駅名検索による center 変更時に周辺の places を読み込む
  useEffect(() => {
    // places-bounds
    setSurroundPlaces();
  }, [center]);

  useEffect(() => {
    setSurroundPlaces();
  }, [places]);

  useEffect(() => {
    filterWifiPlaces();
  }, [wifiFilter]);

  useEffect(() => {
    filterSocketPlaces();
  }, [socketFilter]);

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(userLocation);
        const lat = userLocation.lat;
        const lng = userLocation.lng;
        const boundsParams: BoundsParams = {
          lat_min: lat - boundsAreaNum,
          lat_max: lat + boundsAreaNum,
          lng_min: lng - boundsAreaNum,
          lng_max: lng + boundsAreaNum,
        };

        const placesWithinBounds = await getPlacesWithinBounds(boundsParams);
        if (placesWithinBounds.length) {
          setFilteredPlaces(placesWithinBounds);
        }
      });
    }
  };

  const setSurroundPlaces = () => {
    const c = center as LatLngTuple;
    const lat = c[0];
    const lng = c[1];

    if (lat && lng) {
      const bounds = L.latLngBounds(
        [lat - boundsAreaNum, lng - boundsAreaNum],
        [lat + boundsAreaNum, lng + boundsAreaNum]
      );
      updateVisibleMarkers(bounds);
    }
  };

  const fetchPlaces = async (key?: string) => {
    const places = await getPlaces(key);
    setPlaces(places);
  };

  // 地図の表示範囲内にある places をフィルタリング
  const updateVisibleMarkers = (bounds: LatLngBounds) => {
    const visiblePlaces = places.filter((place) =>
      bounds.contains([place.latitude, place.longitude])
    );
    let wifiPlaces: Place[] = [];
    if (wifiFilter) {
      wifiPlaces = visiblePlaces.filter((place) => place.wifi === 1);
    }
    let socketPlaces: Place[] = [];
    if (socketFilter) {
      if (wifiFilter) {
        // socket + wifi => wifi からさらに絞る
        socketPlaces = wifiPlaces.filter((place) => place.socket === 1);
      } else {
        // socket => socket のみ絞る
        socketPlaces = visiblePlaces.filter((place) => place.socket === 1);
      }
    }
    // update state
    if (wifiFilter && !socketFilter) {
      setFilteredPlaces(wifiPlaces);
      return;
    }
    if (!wifiFilter && socketFilter) {
      setFilteredPlaces(socketPlaces);
      return;
    }
    if (wifiFilter && socketFilter) {
      setFilteredPlaces(socketPlaces);
      return;
    }
    setFilteredPlaces(visiblePlaces);
  };

  // 地図の移動やズームが完了したときに範囲を取得する
  const MapMoveListener = () => {
    const map = useMap();
    useMapEvent("moveend", () => {
      const bounds = map.getBounds(); // 現在の表示範囲を取得
      updateVisibleMarkers(bounds); // 表示範囲内のマーカーを更新
      const latMin = bounds.getSouthWest().lat;
      const lngMin = bounds.getSouthWest().lng;
      const latMax = bounds.getNorthEast().lat;
      const lngMax = bounds.getNorthEast().lng;

      setBounds([latMin, latMax, lngMin, lngMax]);
    });
    return null;
  };

  // Wi-Fiフィルターの ON/OFF による絞り込み
  const filterWifiPlaces = async () => {
    if (wifiFilter) {
      if (socketFilter && bounds.length) {
        const boundsParams: BoundsParams = {
          lat_min: bounds[0],
          lat_max: bounds[1],
          lng_min: bounds[2],
          lng_max: bounds[3],
        };
        const boundsPlaces = await getPlacesWithinBounds(boundsParams);
        if (boundsPlaces.length) {
          const bothSocketAndWifiPlaces = boundsPlaces.filter((place) => {
            if (place.socket === 1 && place.wifi === 1) {
              return true;
            }
            return false;
          });
          setFilteredPlaces(bothSocketAndWifiPlaces);
          return;
        }
      }
      const wifiPlaces = filteredPlaces.filter((place) => place.wifi === 1);
      setFilteredPlaces(wifiPlaces);
    } else {
      // wifi: ON => OFF の場合
      if (bounds.length) {
        const boundsParams: BoundsParams = {
          lat_min: bounds[0],
          lat_max: bounds[1],
          lng_min: bounds[2],
          lng_max: bounds[3],
        };
        const boundsPlaces = await getPlacesWithinBounds(boundsParams);

        if (socketFilter) {
          /*
            wifi フィルターなし && socket フィルターあり
            => socket がある (1) の場所に絞る (wifi はあってもなくても OK)
          */
          if (boundsPlaces.length) {
            const socketWithoutWifiPlaces = boundsPlaces.filter((place) => {
              if (place.socket === 1) {
                return true;
              }
              return false;
            });
            setFilteredPlaces(socketWithoutWifiPlaces);
          }
        } else {
          /*
            wifi フィルターなし && socket フィルターなし
            => エリア内の場所全てをセット
          */
          if (boundsPlaces.length) {
            setFilteredPlaces(boundsPlaces);
          }
        }
      }
    }
  };
  // コンセントフィルターの ON/OFF による絞り込み
  const filterSocketPlaces = async () => {
    if (socketFilter) {
      if (wifiFilter && bounds.length) {
        const boundsParams: BoundsParams = {
          lat_min: bounds[0],
          lat_max: bounds[1],
          lng_min: bounds[2],
          lng_max: bounds[3],
        };
        const boundsPlaces = await getPlacesWithinBounds(boundsParams);
        if (boundsPlaces.length) {
          console.log("socket あり && wifi あり");
          const bothSocketAndWifiPlaces = boundsPlaces.filter((place) => {
            if (place.socket === 1 && place.wifi === 1) {
              return true;
            }
            return false;
          });
          setFilteredPlaces(bothSocketAndWifiPlaces);
          return;
        }
      }
      const socketPlaces = filteredPlaces.filter((place) => place.socket === 1);
      setFilteredPlaces(socketPlaces);
    } else {
      // socket: ON => OFF の場合
      if (bounds.length) {
        const boundsParams: BoundsParams = {
          lat_min: bounds[0],
          lat_max: bounds[1],
          lng_min: bounds[2],
          lng_max: bounds[3],
        };
        const boundsPlaces = await getPlacesWithinBounds(boundsParams);
        if (wifiFilter) {
          /*
            wifi フィルターあり && socket フィルターなし
            => wifi がある (1) の場所に絞る (socket はあってもなくても OK)
          */
          if (boundsPlaces.length) {
            const socketWithoutWifiPlaces = boundsPlaces.filter((place) => {
              if (place.wifi === 1) {
                return true;
              }
              return false;
            });
            setFilteredPlaces(socketWithoutWifiPlaces);
          }
        } else {
          /*
            wifi フィルターなし && socket フィルターなし
            => エリア内の場所全てをセット
          */
          if (boundsPlaces.length) {
            setFilteredPlaces(boundsPlaces);
          }
        }
      }
    }
  };

  const MapEventListener = () => {
    return (
      <>
        <MapMoveListener />
      </>
    );
  };

  const fetchStations = async (key?: string) => {
    const stations = await getStations(key);
    setStations(stations);
  };

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e?.target?.value;
    setPlaceStr(input);
    filterStations(input);
  };

  const filterStations = debounce((input: string) => {
    const filtered = stations.filter(
      (station) => station.name.indexOf(input) !== -1 // 部分一致でフィルタリング
    );
    setFilteredStations(filtered);
  }, 1000);

  const onClear = () => {
    setPlaceStr("");
    setFilteredStations([]);
  };

  const onClickSearch = async () => {
    // 完全一致 or 末尾の駅をとった文字列 が stations になければ検索
    // center を変更する and 候補にない駅は登録する
    // 駅の登録は末尾に「駅」をつけて検索 & 緯度、経度を登録
    const res = await searchPlace(placeStr);
  };

  const onClickSuggestion = (suggestion: Station) => {
    setPlaceStr(suggestion.name);
    setFilteredStations([]);
    setCenter([suggestion.latitude, suggestion.longitude]);
  };

  const getIcon = (shopName: string): L.Icon | L.DivIcon => {
    if (shopName.indexOf("マクドナルド") > -1) {
      const mcdonaldsIconHtml = renderToStaticMarkup(
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#FFC72C"
        >
          <path d={siMcdonalds.path} />
        </svg>
      );
      return new L.DivIcon({
        html: mcdonaldsIconHtml,
        iconSize: [35, 35],
        iconAnchor: [15, 0],
        className: "mcdonalds-marker-icon",
      });
    } else if (shopName.indexOf("スターバックス") > -1) {
      const starbucksIconHtml = renderToStaticMarkup(
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#00704a"
        >
          <path d={siStarbucks.path} />
        </svg>
      );
      return new L.DivIcon({
        html: starbucksIconHtml,
        iconSize: [35, 35],
        iconAnchor: [15, 0],
        className: "starbucks-marker-icon",
      });
    } else if (
      shopName.indexOf("コーヒー") > -1 ||
      shopName.indexOf("珈琲") > -1 ||
      shopName.indexOf("カフェ") > -1
    ) {
      const coffeeIconHtml = renderToStaticMarkup(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d={siCoffeescript.path} />
        </svg>
      );
      return new L.DivIcon({
        // html: siCoffeescript.svg,
        html: coffeeIconHtml,
        iconSize: [35, 35],
        iconAnchor: [15, 0],
        className: "coffee-marker-icon",
      });
    }
    return L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    });
  };

  const handleClickFilter = (label: FilterLabel) => {
    if (label === "Wi-Fi") {
      setWifiFilter(!wifiFilter);
    } else if (label === "コンセント") {
      setSocketFilter(!socketFilter);
    }
  };

  return (
    <div className="h-full relative flex justify-center">
      <SearchInput
        value={placeStr}
        suggestions={filteredStations}
        onChange={onValueChange}
        onClear={onClear}
        onClick={onClickSearch}
        onClickSuggestion={onClickSuggestion}
      />
      <div className="flex justify-center w-80 absolute h-20 z-40 top-0">
        <Filter
          isClicked={wifiFilter}
          label="Wi-Fi"
          onClick={handleClickFilter}
        />
        <Filter
          isClicked={socketFilter}
          label={"コンセント"}
          onClick={handleClickFilter}
        />
      </div>
      <div className="fixed top-0 h-full w-full">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          zoomControl={false}
          whenReady={setSurroundPlaces}
        >
          <ZoomControl position="bottomright" />
          <ChangeMapView center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredPlaces.map((place) => (
            <Marker
              icon={getIcon(place.name)}
              // icon={getIcon()}
              key={place.id}
              position={[place.latitude, place.longitude]}
            >
              <Popup>
                <div className="font-bold mb-2">{place.name}</div>
                <div>{place.address}</div>
                <div className="flex mt-2">
                  {place.wifi === 1 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
                      />
                    </svg>
                  )}
                  {place.socket === 1 && (
                    <div className="ml-1 pt-[2px]">
                      {/* https://icons.getbootstrap.jp/ */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6 0a.5.5 0 0 1 .5.5V3h3V.5a.5.5 0 0 1 1 0V3h1a.5.5 0 0 1 .5.5v3A3.5 3.5 0 0 1 8.5 10c-.002.434-.01.845-.04 1.22-.041.514-.126 1.003-.317 1.424a2.083 2.083 0 0 1-.97 1.028C6.725 13.9 6.169 14 5.5 14c-.998 0-1.61.33-1.974.718A1.922 1.922 0 0 0 3 16H2c0-.616.232-1.367.797-1.968C3.374 13.42 4.261 13 5.5 13c.581 0 .962-.088 1.218-.219.241-.123.4-.3.514-.55.121-.266.193-.621.23-1.09.027-.34.035-.718.037-1.141A3.5 3.5 0 0 1 4 6.5v-3a.5.5 0 0 1 .5-.5h1V.5A.5.5 0 0 1 6 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          <MapEventListener />
        </MapContainer>
      </div>
    </div>
  );
};
