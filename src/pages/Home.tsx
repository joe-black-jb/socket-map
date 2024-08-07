import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Button from "../components/Button";
import Map from "../components/Map";
import { LatLng, MarkerData, Place } from "../types/types";

const Home = () => {
  // console.log("home markers: ", markers);

  return (
    <>
      <Map />
    </>
  );
};

export default Home;
