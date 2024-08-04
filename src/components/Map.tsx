import React, { useRef, useState } from "react";
import { Autocomplete, GoogleMap, LoadScript } from "@react-google-maps/api";
import { LatLng } from "../types/types";

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
console.log("key: ", googleMapApiKey);

export default function Map() {
  // let mapCenter = { lat: 40.765132, lng: -74.098356 };
  // 東京駅
  let mapCenter = { lat: 35.68123620000001, lng: 139.7671248 };
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

  return (
    <LoadScript googleMapsApiKey={googleMapApiKey} libraries={["places"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
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
      </GoogleMap>
    </LoadScript>
  );
}
