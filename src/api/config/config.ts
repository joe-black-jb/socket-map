export const config = {
  dev: {
    apiBaseUrl: "http://localhost:8080",
  },
  prod: {
    apiBaseUrl: "",
  },
};

export const googleMapApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
export const googleMapId = process.env.REACT_APP_GOOGLE_MAPS_ID || "";
