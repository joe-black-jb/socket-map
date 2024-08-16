import { PlaceDetailResponse } from "../types/types";
import api from "./axiosConfig";
import { googleMapApiKey } from "./config/config";

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
