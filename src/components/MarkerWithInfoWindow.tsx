import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { LatLng, Place } from "../types/types";

interface Props {
  place: Place;
}

export const MarkerWithInfoWindow = (props: Props) => {
  const { place } = props;
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  const position = {
    lat: place.latitude,
    lng: place.longitude,
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      />

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          {place.name}
        </InfoWindow>
      )}
    </>
  );
};
