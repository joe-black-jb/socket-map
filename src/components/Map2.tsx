import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  InfoWindow,
  Map,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useRef, useState } from "react";
import { LatLng, MarkerData, Place } from "../types/types";
import api from "../api/axiosConfig";
import { Autocomplete } from "@react-google-maps/api";
import { MarkerWithInfoWindow } from "./MarkerWithInfoWindow";
import ControlPanel, { AutocompleteMode } from "./ControlPanel";
import { CustomMapControl } from "./CustomMapControl";

const googleMapApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
const googleMapId = process.env.REACT_APP_GOOGLE_MAPS_ID || "";
console.log("googleMapId: ", googleMapId);

let mapCenter: LatLng = { lat: 35.702429846362676, lng: 139.98543747505366 };

const Map2 = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [center, setCenter] = useState<LatLng>(mapCenter);

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
              id: place.ID,
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

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const autocompleteModes: Array<AutocompleteMode> = [
    { id: "classic", label: "Google Autocomplete Widget" },
    { id: "custom", label: "Custom Build" },
    { id: "custom-hybrid", label: "Custom w/ Select Widget" },
  ];

  const [selectedAutocompleteMode, setSelectedAutocompleteMode] =
    useState<AutocompleteMode>(autocompleteModes[0]);

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  return (
    <APIProvider apiKey={googleMapApiKey}>
      <Map
        mapId={googleMapId}
        style={{ width: "100%", height: "800px" }}
        defaultCenter={mapCenter}
        defaultZoom={15}
        gestureHandling={"greedy"}
        // disableDefaultUI={true}
      >
        {places.map((place) => (
          <MarkerWithInfoWindow key={place.ID} place={place} />
        ))}
      </Map>

      <CustomMapControl
        controlPosition={ControlPosition.TOP}
        selectedAutocompleteMode={selectedAutocompleteMode}
        onPlaceSelect={setSelectedPlace}
      />
    </APIProvider>
  );
};

export default Map2;
