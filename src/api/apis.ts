import { Place, PlaceDetailResponse, Station } from "../types/types";
import api from "./axiosConfig";
import { googleMapApiKey } from "./config/config";

export const getPlaces = async (): Promise<Place[]> => {
  const res = await api.get(
    `https://ld1joy777f.execute-api.ap-northeast-1.amazonaws.com/places`
  );
  return res.data;
};

export const getPlaceDetail = async (
  placeId: string,
  fields: string[]
): Promise<PlaceDetailResponse | undefined> => {
  const fieldsStr = fields.join(",");
  const res = await api.get(
    `https://places.googleapis.com/v1/places/${placeId}?fields=${fieldsStr}&key=${googleMapApiKey}&languageCode=ja`
  );
  if (res.data) {
    return res.data;
  }
  return undefined;
};

export const searchPlace = async (placeStr: string): Promise<Station[]> => {
  // const url = `https://nominatim.openstreetmap.org/search?q=${placeStr}`;
  const url = `/search?q=${placeStr}`;
  const res = await api.get(url);
  console.log("API検索結果: ", res);
  return res.data;
};

export const getStations = async (): Promise<Station[]> => {
  const url = `https://ld1joy777f.execute-api.ap-northeast-1.amazonaws.com/stations`;
  const res = await api.get(url);
  return res.data;
};
