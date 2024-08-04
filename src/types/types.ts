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
  name: string;
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
