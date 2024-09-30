import { Input } from "@headlessui/react";
import { FilterLabel, Station } from "../types/types";
import Header2 from "./Header2";
import { Filter } from "./Filter";

interface Props {
  value: string;
  suggestions: Station[];
  wifiFilter: boolean;
  socketFilter: boolean;
  handleClickFilter: (label: FilterLabel) => void;
  onClear: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onClickSuggestion: (suggestion: Station) => void;
}

export const SearchInput2 = (props: Props) => {
  const {
    value,
    suggestions,
    wifiFilter,
    socketFilter,
    handleClickFilter,
    onClear,
    onChange,
    onClickSuggestion,
  } = props;

  return (
    // <div className={`absolute w-full ${suggestions.length > 0 && "z-30"}`}>
    <div className={`absolute mt-4 w-full h-10 z-[1000] top-0`}>
      <div className="relative w-80 sm:w-96 h-10 z-50 mx-auto">
        <Input
          className={`w-full h-12 justify-self-center pl-8 pr-10 py-2 autofill:shadow-[inset_0_0_0px_1000px_white] focus:outline-none focus:bg-white ${
            suggestions.length === 0
              ? "shadow-lg rounded-full"
              : "rounded-t-2xl"
          }`}
          placeholder="駅名で検索"
          onChange={onChange}
          value={value}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          // className="absolute size-6 pt-1 h-10 top-0 left-40 items-center cursor-pointer text-gray-500"
          className="rounded-full hover:bg-gray-200 p-1 absolute size-8 top-2 right-2 items-center cursor-pointer text-gray-500"
          onClick={onClear}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
        {suggestions.length > 0 && (
          <div
            className={
              "mx-auto w-2/3 md:w-96  max-h-96 overflow-auto rounded-b-2xl"
            }
          >
            <div className="rounded-b-xl">
              {suggestions?.map((suggestion, index) => (
                <div key={suggestion.id} className="rounded-lg">
                  <button
                    // Header2: あり => pl-14, なし => pl-8
                    className={`bg-white text-left shadow-lg w-full pl-8 py-4 hover:bg-gray-100 border-t ${
                      index === suggestions.length - 1 && "rounded-b-2xl"
                    }`}
                    onClick={() => onClickSuggestion(suggestion)}
                  >
                    {suggestion.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Filter */}
        {suggestions?.length === 0 && (
          <div className="flex justify-center w-80 sm:w-96 absolute top-0 h-0">
            <Filter
              isClicked={wifiFilter}
              label="Wi-Fi"
              onClick={handleClickFilter}
            />
            <Filter
              isClicked={socketFilter}
              label={"コンセント"}
              onClick={handleClickFilter}
            />
          </div>
        )}
      </div>
    </div>
  );
};
