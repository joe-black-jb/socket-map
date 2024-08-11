import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  InfoWindow,
  Map,
  MapMouseEvent,
  Pin,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useRef, useState } from "react";
import {
  LatLng,
  MarkerData,
  NewPlace,
  Place,
  ResultModalStatus,
} from "../types/types";
import api from "../api/axiosConfig";
import { Autocomplete } from "@react-google-maps/api";
import { MarkerWithInfoWindow } from "./MarkerWithInfoWindow";
import ControlPanel, { AutocompleteMode } from "./ControlPanel";
import { CustomMapControl } from "./CustomMapControl";
import { googleMapApiKey, googleMapId } from "../api/config/config";
import { ButtonArea } from "./ButtonArea";
import { Feature, Point } from "geojson";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";
import ConfirmModalWithInput from "./ConfirmModalWithInput";

let mapCenter: LatLng = { lat: 35.702429846362676, lng: 139.98543747505366 };

const Map2 = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [searchedPlace, setSearchedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [center, setCenter] = useState<LatLng | null>(mapCenter);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [activePlace, setActivePlace] = useState<NewPlace | null>(null);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<ResultModalStatus>("OK");
  const [confirmModalShow, setConfirmModalShow] = useState<boolean>(false);

  useEffect(() => {
    getPlaces();
  }, []);

  const getPlaces = () => {
    api
      .get("/places")
      .then((result) => {
        const places: Place[] = result?.data?.data;
        console.log("places: ", places);
        setPlaces(places);
        const markerArray: MarkerData[] = [];
        if (places.length) {
          places.forEach((place) => {
            const markerData: MarkerData = {
              id: place.ID,
              lat: place.latitude,
              lng: place.longitude,
            };
            markerArray.push(markerData);
          });
          setMarkers(markerArray);
        }
      })
      .catch((e) => {
        console.log("エラー: ", e);
      });
  };

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      console.log(autocompleteRef.current.getPlace());
      const place = autocompleteRef.current.getPlace();
      const location = place?.geometry?.location;
      if (location) {
        const newMapCenter: LatLng = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setCenter(newMapCenter);
      }
    }
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const autocompleteModes: Array<AutocompleteMode> = [
    { id: "classic", label: "Google Autocomplete Widget" },
    { id: "custom", label: "Custom Build" },
    { id: "custom-hybrid", label: "Custom w/ Select Widget" },
  ];

  const [selectedAutocompleteMode, setSelectedAutocompleteMode] =
    useState<AutocompleteMode>(autocompleteModes[0]);

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const handleSelectPlace = (e: google.maps.places.PlaceResult | null) => {
    console.log("検索結果: ", e);

    const geo = e?.geometry;
    const selectedLat = geo?.location?.lat();
    const selectedLng = geo?.location?.lng();
    if (selectedLat && selectedLng) {
      console.log("セットします❗️");

      setCenter({
        lat: selectedLat,
        lng: selectedLng,
      });
      setSearchedPlace(e);
    }
  };

  const handleClickMap = (e: MapMouseEvent) => {
    console.log("handleClickMap: ", e);
    const { detail } = e;
    if (detail) {
      const lat = detail.latLng?.lat;
      const lng = detail.latLng?.lng;

      if (lat && lng) {
        // lat, lng から場所の名前を検索
        const latLng = { lat, lng };
        console.log("latLng: ", latLng);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0]
          ) {
            // setPlaceName(results[0].formatted_address);
            console.log("検索できました: ", results);
            // setState
            // const newPlace: NewPlace = {

            // }
            // setActivePlace(latLng);

            const placeId = results[0]?.place_id;
          } else {
            console.log("検索できませんでした");

            // setPlaceName('Unknown location');
          }
        });
      }
    }
  };

  const handleClickRegister = () => {
    console.log("登録ボタンをクリック");

    // setModalShow(true);
    setConfirmModalShow(true);
  };

  const handleClickCancel = () => {
    setModalShow(false);
    setConfirmModalShow(false);
  };

  return (
    <>
      <APIProvider apiKey={googleMapApiKey} language="ja">
        <Map
          mapId={googleMapId}
          style={{ width: "100%", height: "800px" }}
          defaultCenter={mapCenter}
          center={center}
          onDragstart={() => {
            setCenter(null);
          }}
          onClick={handleClickMap}
          defaultZoom={15}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          {places.map((place) => (
            <MarkerWithInfoWindow key={place.ID} place={place} />
          ))}
          {searchedPlace &&
            searchedPlace.geometry?.location?.lat() &&
            searchedPlace.geometry?.location?.lng() && (
              <>
                <AdvancedMarker
                  key={searchedPlace.place_id}
                  position={{
                    lat: searchedPlace.geometry?.location?.lat(),
                    lng: searchedPlace.geometry?.location?.lng(),
                  }}
                >
                  {/* <Pin
                    background={"#0f9d58"}
                    borderColor={"#006425"}
                    glyphColor={"#60d98f"}
                  /> */}
                  <InfoWindow
                    key={searchedPlace.place_id}
                    position={{
                      lat: searchedPlace.geometry?.location?.lat(),
                      lng: searchedPlace.geometry?.location?.lng(),
                    }}
                    ariaLabel={searchedPlace.formatted_address}
                    headerContent={
                      <h3 className="font-bold">{searchedPlace.name}</h3>
                    }
                  >
                    {/* <div>{searchedPlace.name}</div> */}
                    <div>{searchedPlace.formatted_address}</div>
                  </InfoWindow>
                </AdvancedMarker>
              </>
            )}
        </Map>

        <CustomMapControl
          controlPosition={ControlPosition.TOP}
          selectedAutocompleteMode={selectedAutocompleteMode}
          // onPlaceSelect={setSelectedPlace}
          onPlaceSelect={handleSelectPlace}
        />
      </APIProvider>
      <ButtonArea onClick={handleClickRegister} />
      {confirmModalShow && (
        // <ConfirmModal
        //   desc="地点を登録します。よろしいですか？"
        //   cancelLabel="キャンセル"
        //   proceedLabel="OK"
        //   onProceed={handleClickRegister}
        //   onCancel={handleClickCancel}
        //   open={confirmModalShow}
        //   setOpen={() => setModalShow}
        // />
        <ConfirmModalWithInput
          desc="地点を登録します。よろしいですか？"
          cancelLabel="キャンセル"
          proceedLabel="OK"
          onProceed={handleClickRegister}
          onCancel={handleClickCancel}
          open={confirmModalShow}
          setOpen={() => setModalShow}
        />
      )}
      {modalShow && (
        <Modal
          isOpen={true}
          open={modalShow}
          dialogTitle="登録成功"
          dialogText="新しいスポットの登録に成功しました"
          onProceed={() => {
            console.log("onProceed");
          }}
          setOpen={() => {
            console.log("setOpen");
          }}
          status={modalStatus}
        />
      )}
    </>
  );
};

export default Map2;
