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
  WifiOption,
} from "../types/types";
import api from "../api/axiosConfig";
import { Autocomplete } from "@react-google-maps/api";
import { MarkerWithInfoWindow } from "./MarkerWithInfoWindow";
import ControlPanel, { AutocompleteMode } from "./ControlPanel";
import { CustomMapControl } from "./CustomMapControl";
import {
  googleMapApiKey,
  googleMapId,
  googleMapSubId,
} from "../api/config/config";
import { ButtonArea } from "./ButtonArea";
import { Feature, Point } from "geojson";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";
import ConfirmModalWithInput from "./ConfirmModalWithInput";
import { getPlaceDetail } from "../api/apis";
import { Tabs } from "./Tabs";

let mapCenter: LatLng = { lat: 35.702429846362676, lng: 139.98543747505366 };

const wifiOptions: WifiOption[] = ["あり", "なし", "不明"];

const SearchMap = () => {
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
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [socketNum, setSocketNum] = useState<number>();
  const [wifi, setWifi] = useState<WifiOption>("なし");
  const [socket, setSocket] = useState<WifiOption>("なし");

  useEffect(() => {
    getPlaces();
  }, []);

  const getPlaces = () => {
    api
      .get("/places")
      .then((result) => {
        const places: Place[] = result?.data?.data;
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

  let isSetPlace = false;
  if (name && address) {
    isSetPlace = true;
  }

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
    const geo = e?.geometry;
    const selectedLat = geo?.location?.lat();
    const selectedLng = geo?.location?.lng();
    console.log(`=== handleSelectPlace ===`);
    console.log(`「${e?.name}」(ID: ${e?.place_id})`);
    console.log(`${selectedLat}, ${selectedLng}`);

    /*
    ケンタッキー（検索）
    35.70017230000001, 139.9863074

    handleClickMap（マップ上をクリック）
    35.700174213496275, 139.98629495501518

    GoogleMapアプリ
    35.700302962861265, 139.98626448046866

    詳細API > location
    35.7001723, 139.9863074

    place_id
    ・ChIJj_93a9x_GGARjyw_Q5afaok (詳細APIのレスポンス)
    
    */

    if (selectedLat && selectedLng) {
      setCenter({
        lat: selectedLat,
        lng: selectedLng,
      });
      setSearchedPlace(e);
    }
    if (e?.name) {
      setName(e.name);
    }
    if (e?.formatted_address) {
      setAddress(e.formatted_address);
    }
  };

  const handleClickMap = async (e: MapMouseEvent) => {
    console.log("handleClickMap: ", e);
    const { detail } = e;
    if (detail.placeId) {
      const fields = [
        "id",
        "displayName",
        "formatted_address",
        "types",
        "location",
      ];
      const result = await getPlaceDetail(detail.placeId, fields);
      console.log("API取得結果⭐️: ", result);
      const placeName = result?.displayName?.text;
      const address = result?.formattedAddress;
      if (placeName) {
        setName(placeName);
      }
      if (address) {
        setAddress(address);
      }
    }
  };

  const handleClickRegister = () => {
    setConfirmModalShow(true);
  };

  const handleClickCancel = () => {
    setModalShow(false);
    setConfirmModalShow(false);
    setName("");
    setAddress("");
    setSocketNum(undefined);
    setSocket("なし");
    setWifi("なし");
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e?.target?.value);
  };
  const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e?.target?.value);
  };
  const handleChangeSocketOptions = (socketOption: WifiOption) => {
    setSocket(socketOption);
  };
  const handleChangeSocketNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocketNum(Number(e?.target?.value));
  };
  const handleChangeWifi = (wifiOption: WifiOption) => {
    setWifi(wifiOption);
  };

  const handleRegister = () => {
    console.log("本処理");
  };

  return (
    <>
      {/* <Tabs /> */}
      <APIProvider apiKey={googleMapApiKey} language="ja">
        <Map
          mapId={googleMapSubId}
          style={{ width: "100%", height: "800px" }}
          defaultCenter={mapCenter}
          center={center}
          onDragstart={() => {
            setCenter(null);
          }}
          onClick={handleClickMap}
          defaultZoom={17}
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
      <ButtonArea
        onClick={handleClickRegister}
        disabled={!isSetPlace}
        label="登録"
      />
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
          desc="詳細情報"
          cancelLabel="キャンセル"
          proceedLabel="登録"
          onProceed={handleRegister}
          onCancel={handleClickCancel}
          open={confirmModalShow}
          setOpen={() => setModalShow}
          name={name}
          address={address}
          socketNum={socketNum}
          selectedSocketOption={socket}
          wifiOptions={wifiOptions}
          socketOptions={wifiOptions}
          selectedWifiOption={wifi}
          onChangeName={handleChangeName}
          onChangeAddress={handleChangeAddress}
          onChangeSocketNum={handleChangeSocketNum}
          onChangeSocket={handleChangeSocketOptions}
          onChangeWifi={handleChangeWifi}
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

export default SearchMap;
