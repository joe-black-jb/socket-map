import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Place } from "../types/types";
import L, { LatLngExpression } from "leaflet";
import { useEffect } from "react";

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

  const getIcon = (): L.Icon => {
    return L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    });
  };

  return (
    <div className="fixed top-32 w-full">
      <MapContainer center={center} zoom={17} scrollWheelZoom={false}>
        <ChangeMapView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker
            icon={getIcon()}
            key={place.ID}
            position={[place.latitude, place.longitude]}
          >
            <Popup>
              <div className="font-bold mb-2">{place.name}</div>
              <div>{place.address}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
