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
import { Place, Station } from "../types/types";
import L, { LatLngBounds, LatLngExpression, LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";
import { Icon } from "semantic-ui-react";
import { siCoffeescript, siMcdonalds, siStarbucks } from "simple-icons";
import { renderToStaticMarkup } from "react-dom/server";
import { getPlaces, getStations, searchPlace } from "../api/apis";
import { debounce } from "lodash";
import { SearchInput } from "./SearchInput";

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
  const [previousCenter, setPreviousCenter] =
    useState<LatLngExpression>(defaultCenter);
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [placeStr, setPlaceStr] = useState<string>("");

  useEffect(() => {
    getCurrentLocation();
    fetchPlaces("places.json");
    fetchStations("stations.json");
  }, []);

  // 駅名検索による center 変更時に周辺の places を読み込む
  useEffect(() => {
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
  }, [center]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(userLocation);
        setPreviousCenter(userLocation);
      });
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
    setFilteredPlaces(visiblePlaces);
  };

  // 地図の移動やズームが完了したときに範囲を取得する
  const MapMoveListener = () => {
    const map = useMap();
    useMapEvent("moveend", () => {
      const bounds = map.getBounds(); // 現在の表示範囲を取得
      updateVisibleMarkers(bounds); // 表示範囲内のマーカーを更新
    });
    return null;
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
    console.log("res⭐️: ", res);
  };

  const onClickSuggestion = (suggestion: Station) => {
    // console.log("suggestion: ", suggestion);

    setPlaceStr(suggestion.name);
    setFilteredStations([]);
    setCenter([suggestion.latitude, suggestion.longitude]);

    // // マップを少し動かしてから moveend イベントを発火させる
    // const map = useMap();
    // map.panTo([suggestion.latitude, suggestion.longitude]);
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
      <div className="fixed top-0 h-full w-full">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          zoomControl={false}
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
                  {place.socket === 1 && <Icon name="plug" size="large" />}
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
