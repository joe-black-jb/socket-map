export interface ModalStatus {
  status: string;
  isOpen: boolean;
  goTo?: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  ID: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
  businessHours: string;
  tel: string;
  url: string;
  memo: string;
  socketNum: number;
  wifi: number;
  smoke: number;
}

export interface NewPlace {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface MarkerData extends LatLng {
  id: number;
}

export type AutocompleteMode = { id: string; label: string };

export interface TabElement {
  id: number;
  code: string;
  label: string;
  href?: string;
}

export type ResultModalStatus = "OK" | "NG";

export type WifiOption = "あり" | "なし" | "不明";

export interface DisplayName {
  languageCode: string;
  text: string;
}
export interface PlaceDetailResponse {
  displayName: DisplayName;
  formattedAddress: string;
  id: string;
}
