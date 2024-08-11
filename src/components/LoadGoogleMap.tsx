import { useGoogleMap } from "@react-google-maps/api";
import React, { useState, useRef, useCallback } from "react";

const containerStyle = {
  width: "100%",
  height: "800px",
};

const mapCenter = { lat: 35.702429846362676, lng: 139.98543747505366 };

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

export const MapWithAutocomplete = () => {
  // const mapRef = useRef(null);

  // const [autocomplete, setAutocomplete] =
  //   useState<google.maps.places.Autocomplete | null>(null);

  // const { map } = useGoogleMap(mapRef);

  // const onLoad = useCallback(
  //   (autocompleteInstance: google.maps.places.Autocomplete) => {
  //     setAutocomplete(autocompleteInstance);
  //   },
  //   []
  // );

  // const onPlaceChanged = () => {
  //   if (autocomplete) {
  //     const place = autocomplete.getPlace();
  //     if (place.geometry && place.geometry.location) {
  //       const location = place.geometry.location;
  //       map?.panTo({ lat: location.lat(), lng: location.lng() });
  //     }
  //   }
  // };

  // return (
  //   <div style={{ position: "relative" }}>
  //     <input
  //       type="text"
  //       placeholder="Search location"
  //       ref={(input) => {
  //         if (input && !autocomplete) {
  //           const autocompleteInstance = new google.maps.places.Autocomplete(
  //             input
  //           );
  //           autocompleteInstance.bindTo("bounds", map);
  //           autocompleteInstance.setFields([
  //             "address_component",
  //             "geometry",
  //             "icon",
  //             "name",
  //           ]);
  //           onLoad(autocompleteInstance);
  //         }
  //       }}
  //       style={{
  //         boxSizing: "border-box",
  //         border: "1px solid transparent",
  //         width: "240px",
  //         height: "40px",
  //         padding: "0 12px",
  //         borderRadius: "3px",
  //         boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  //         fontSize: "14px",
  //         position: "absolute",
  //         left: "50%",
  //         marginLeft: "-120px",
  //         top: "10px",
  //         zIndex: 5,
  //       }}
  //     />

  //     <div ref={mapRef} style={containerStyle} />
  //   </div>
  // );
  return <div>LoadGoogleMap</div>;
};
