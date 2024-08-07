import React from "react";
import { Place } from "../types/types";

interface Props {
  place: Place;
}
const InfoWindowDetail = (props: Props) => {
  const { place } = props;
  return <div>{place.name}</div>;
};

export default InfoWindowDetail;
