import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Button from "../components/Button";
import Map from "../components/Map";
import { Place } from "../types/types";

const Home = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  useEffect(() => {
    getPlaces();
  }, []);
  const getPlaces = () => {
    api
      .get("/places")
      .then((result) => {
        const places = result.data;
        console.log("places: ", places);
        // setPlaces(places);
      })
      .catch((e) => {
        console.log("エラー: ", e);
      });
  };

  return (
    <>
      <Map />
    </>
  );
};

export default Home;
