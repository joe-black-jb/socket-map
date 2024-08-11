import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Button from "../components/Button";
import Map from "../components/Map";
import { LatLng, MarkerData, Place } from "../types/types";
import Map2 from "../components/Map2";

const Home = () => {
  // console.log("home markers: ", markers);

  return (
    <>
      <Map2 />
    </>
  );
};

export default Home;
