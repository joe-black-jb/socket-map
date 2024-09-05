import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Place } from "../types/types";
import L, { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { Icon } from "semantic-ui-react";
import { siSimpleicons } from "simple-icons";
import { siCoffeescript, siMcdonalds, siStarbucks } from "simple-icons";
import { renderToStaticMarkup } from "react-dom/server";

interface Props {
  center: LatLngExpression;
  places: Place[];
}

// Mapの中心を動的に変更するためのコンポーネント
const ChangeMapView = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

export const FreeMap = (props: Props) => {
  const { center, places } = props;

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
        iconSize: [30, 30],
        iconAnchor: [15, 0],
        className: "mcdonalds-marker-icon",
      });
    } else if (shopName.indexOf("スターバックス") > -1) {
      return new L.DivIcon({
        html: siStarbucks.svg,
        iconSize: [30, 30],
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
        iconSize: [30, 30],
        iconAnchor: [15, 0],
        className: "coffee-marker-icon",
      });
    }
    return L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    });
  };

  return (
    <div className="fixed top-0 h-full w-full">
      <MapContainer
        center={center}
        zoom={17}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <ChangeMapView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
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
      </MapContainer>
    </div>
  );
};
