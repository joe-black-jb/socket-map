import React from "react";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";

import { PlaceAutocompleteClassic } from "./AutoCompleteClassic";
import { AutocompleteCustom } from "./AutoCompleteCustom";
import { AutocompleteMode } from "../types/types";

type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  selectedAutocompleteMode: AutocompleteMode;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const CustomMapControl = ({
  controlPosition,
  selectedAutocompleteMode,
  onPlaceSelect,
}: CustomAutocompleteControlProps) => {
  const { id } = selectedAutocompleteMode;

  return (
    <MapControl position={controlPosition}>
      <div className="autocomplete-control">
        {id === "classic" && (
          <PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
        )}

        {id === "custom" && (
          <AutocompleteCustom onPlaceSelect={onPlaceSelect} />
        )}

        {/* {id === "custom-hybrid" && (
          <AutocompleteCustomHybrid onPlaceSelect={onPlaceSelect} />
        )} */}
      </div>
    </MapControl>
  );
};
