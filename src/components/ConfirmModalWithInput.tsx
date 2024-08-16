import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import InputField from "./InputField";
import { Radio } from "./Radio";
import { WifiOption } from "../types/types";
import { SelectField } from "./SelectField";
import { useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import Select from "./Select";

interface Props {
  isOpen?: boolean;
  desc?: string;
  cancelLabel?: string;
  proceedLabel?: string;
  status?: string;
  open?: boolean;
  name?: string;
  address?: string;
  socketNum?: number;
  socketOptions: WifiOption[];
  selectedSocketOption: WifiOption;
  wifiOptions: WifiOption[];
  selectedWifiOption: WifiOption;
  setOpen: (value: boolean) => void;
  onCancel?: () => void;
  onProceed?: () => void;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSocketNum: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSocket: (option: WifiOption) => void;
  // onChangeWifi: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeWifi: (option: WifiOption) => void;
}

export default function ConfirmModalWithInput(props: Props) {
  const {
    isOpen,
    desc,
    cancelLabel,
    proceedLabel,
    status,
    open,
    name,
    address,
    socketNum,
    selectedSocketOption,
    socketOptions,
    wifiOptions,
    selectedWifiOption,
    setOpen,
    onCancel,
    onProceed,
    onChangeName,
    onChangeAddress,
    onChangeSocketNum,
    onChangeSocket,
    onChangeWifi,
  } = props;

  // const [withSocket, setWithSocket] = useState<boolean>(false);

  const withSocket = selectedSocketOption === "あり";

  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={() => setOpen(false)}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative h-[600px] overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start justify-center">
                    <div className="w-4/5 mt-3 text-center sm:mt-0 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {desc}
                      </DialogTitle>
                      <InputField
                        label="名称"
                        value={name || ""}
                        onChange={onChangeName}
                      />
                      <InputField
                        label="住所"
                        value={address || ""}
                        onChange={onChangeAddress}
                      />
                      <Select
                        label="コンセント"
                        options={socketOptions}
                        selected={selectedSocketOption}
                        onChange={onChangeSocket}
                      />
                      {withSocket && (
                        <InputField
                          label="コンセント数"
                          value={socketNum}
                          type="number"
                          min={0}
                          max={999}
                          onChange={onChangeSocketNum}
                        />
                      )}
                      {/* <SelectField
                        label="Wifi"
                        options={wifiOptions}
                        // selected={selectedWifiOption}
                        onChange={onChangeWifi}
                      /> */}
                      <Select
                        label="Wifi"
                        options={wifiOptions}
                        selected={selectedWifiOption}
                        onChange={onChangeWifi}
                      />
                    </div>
                  </div>
                </div>
                {/* <Link to={`company/${company?.ID?.toString()}/detail`}> */}
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:ml-3 sm:w-auto"
                    onClick={onCancel}
                    // onClick={goToDetail}
                  >
                    {cancelLabel || ""}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto"
                    onClick={onProceed}
                    // onClick={() => setOpen(false)}
                    data-autofocus
                  >
                    {proceedLabel || ""}
                  </button>
                </div>
                {/* </Link> */}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
