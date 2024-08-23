import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  InfoWindow,
  InfoWindowF,
  Libraries,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { LatLng, MarkerData, Place } from "../types/types";
import InfoWindowDetail from "./InfoWindowDetail";
import api from "../api/axiosConfig";

// Define map container style
const containerStyle = {
  width: "100%",
  // height: "400px",
  height: "800px",
  // height: "100%",
  // posit: "relative",
  // "padding-top": "100px",
};

const googleMapApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
// console.log("key: ", googleMapApiKey);

// interface Props {
//   markers: MarkerData[];
//   places: Place[];
// }

const libraries: Libraries = ["places"];

export default function Map() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  useEffect(() => {
    getPlaces();
  }, []);
  const getPlaces = () => {
    api
      .get("/places")
      .then((result) => {
        const places: Place[] = result?.data?.data;
        console.log("places: ", places);
        setPlaces(places);
        const markerArray: MarkerData[] = [];
        if (places.length) {
          places.forEach((place) => {
            const markerData: MarkerData = {
              id: place.id,
              lat: place.latitude,
              lng: place.longitude,
            };
            markerArray.push(markerData);
          });
          setMarkers(markerArray);
        }
      })
      .catch((e) => {
        console.log("エラー: ", e);
      });
  };
  // const { markers, places } = props;
  console.log("markers: ", markers);

  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [activePlace, setActivePlace] = useState<LatLng | null>(null);

  /*
  e
    : 
    35.70107504987384
    f
    : 
    139.98581438173127

  */
  // let mapCenter = { lat: 40.765132, lng: -74.098356 };
  // 船橋駅
  let mapCenter: LatLng = { lat: 35.702429846362676, lng: 139.98543747505366 };
  // 東京駅
  // let mapCenter: LatLng = { lat: 35.68123620000001, lng: 139.7671248 };
  // let mapCenter: LatLng = { lat: 36.708298, lng: 136.9319984 };

  const [center, setCenter] = useState<LatLng>(mapCenter);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      console.log(autocompleteRef.current.getPlace());
      const place = autocompleteRef.current.getPlace();
      const location = place?.geometry?.location;
      if (location) {
        const newMapCenter: LatLng = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setCenter(newMapCenter);
      }
    }
  };

  const handleClickMarker = (markerId: string) => {
    setActiveMarkerId(markerId);
  };

  const handleCloseInfoWindow = () => {
    setActiveMarkerId(null);
  };

  const handleClickMap = (e: google.maps.MapMouseEvent) => {
    console.log("handleClickMap: ", e);
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const latLng = { lat, lng };
      console.log("latLng: ", latLng);

      // lat, lng から場所の名前を検索
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          // setPlaceName(results[0].formatted_address);
          console.log("検索できました: ", results);
          // setState
          setActivePlace(latLng);
        } else {
          console.log("検索できませんでした");

          // setPlaceName('Unknown location');
        }
      });
    }

    // places にクリックした場所がなければ「この場所を登録する」を表示する
  };

  console.log("activeMarkerId: ", activeMarkerId);

  return (
    <LoadScript googleMapsApiKey={googleMapApiKey} libraries={libraries}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onClick={handleClickMap}
        options={{
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Additional map components like markers can be added here */}
        <Autocomplete
          onPlaceChanged={onPlaceChanged}
          onLoad={onLoad}
          className="text-center pt-4"
        >
          <input
            type="text"
            placeholder="Search here"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              // width: `240px`,
              width: `80%`,
              height: `40px`,
              padding: `0 12px`,
              // margin: `40px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "relative",
              // left: "50%",
              // left: "20%",
              // top: "-50px",
              // marginLeft: "-120px",
            }}
          />
          {/* <input
              type="text"
              placeholder="Search here"
              className="z-10 absolute bg-red-300 -top-10 overflow-visible"
            /> */}
        </Autocomplete>
        {places?.map((place) => (
          <Marker
            key={place?.id?.toString()}
            onClick={() => handleClickMarker(place?.id)}
            position={{ lat: place.latitude, lng: place.longitude }}
          >
            {activeMarkerId === place.id && (
              <InfoWindow
                key={place?.id?.toString()}
                onCloseClick={handleCloseInfoWindow}
                position={{ lat: place.latitude, lng: place.longitude }}
              >
                <InfoWindowDetail place={place} />
              </InfoWindow>
            )}
          </Marker>
        ))}
        {!activeMarkerId && activePlace && (
          <InfoWindow
            key={activePlace.lat}
            // onCloseClick={handleCloseInfoWindow}
            position={activePlace}
          >
            {/* <InfoWindowDetail place={place} /> */}
          </InfoWindow>
        )}
        {/* <Marker position={mapCenter} /> */}
      </GoogleMap>
    </LoadScript>
  );
}
