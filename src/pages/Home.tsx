import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Button from "../components/Button";
import Map from "../components/Map";
import { LatLng, MarkerData, Place, TabElement } from "../types/types";
import Map2 from "../components/Map2";
import { Tabs } from "../components/Tabs";

const Home = () => {
  // console.log("home markers: ", markers);

  return (
    <>
      {/* <Tabs /> */}
      <Map2 />
    </>
  );
};

export default Home;
