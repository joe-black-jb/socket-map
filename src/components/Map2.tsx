import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  InfoWindow,
  Map,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useRef, useState } from "react";
import { LatLng, MarkerData, Place } from "../types/types";
import api from "../api/axiosConfig";
import { Autocomplete } from "@react-google-maps/api";
import { MarkerWithInfoWindow } from "./MarkerWithInfoWindow";
import ControlPanel, { AutocompleteMode } from "./ControlPanel";
import { CustomMapControl } from "./CustomMapControl";
import { googleMapApiKey, googleMapId } from "../api/config/config";
import { ButtonArea } from "./ButtonArea";

let mapCenter: LatLng = { lat: 35.702429846362676, lng: 139.98543747505366 };

const Map2 = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [center, setCenter] = useState<LatLng | null>(mapCenter);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [activePlace, setActivePlace] = useState<LatLng | null>(null);

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

  const handleSelectPlace = (e: google.maps.places.PlaceResult | null) => {
    const geo = e?.geometry;
    const selectedLat = geo?.location?.lat();
    const selectedLng = geo?.location?.lng();
    if (selectedLat && selectedLng) {
      setCenter({
        lat: selectedLat,
        lng: selectedLng,
      });
    }
  };

  const handleClickMap = (e: MapMouseEvent) => {
    console.log("handleClickMap: ", e);
    const { detail } = e;
    if (detail) {
      const lat = detail.latLng?.lat;
      const lng = detail.latLng?.lng;

      if (lat && lng) {
        // lat, lng から場所の名前を検索
        const latLng = { lat, lng };
        console.log("latLng: ", latLng);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0]
          ) {
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
    }
  };

  return (
    <>
      <APIProvider apiKey={googleMapApiKey}>
        <Map
          mapId={googleMapId}
          style={{ width: "100%", height: "800px" }}
          defaultCenter={mapCenter}
          center={center}
          onDragstart={() => {
            setCenter(null);
          }}
          onClick={handleClickMap}
          defaultZoom={15}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          {places.map((place) => (
            <MarkerWithInfoWindow key={place.ID} place={place} />
          ))}
        </Map>

        <CustomMapControl
          controlPosition={ControlPosition.TOP}
          selectedAutocompleteMode={selectedAutocompleteMode}
          // onPlaceSelect={setSelectedPlace}
          onPlaceSelect={handleSelectPlace}
        />
      </APIProvider>
      <ButtonArea />
    </>
  );
};

export default Map2;
