import { Input } from "@headlessui/react";
import { Station } from "../types/types";
import Header from "./Header";
import Header2 from "./Header2";

interface Props {
  value: string;
  suggestions: Station[];
  onClear: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onClickSuggestion: (suggestion: Station) => void;
}

export const SearchInput = (props: Props) => {
  const { value, suggestions, onClear, onChange, onClick, onClickSuggestion } =
    props;

  return (
    // <div className={`absolute w-full ${suggestions.length > 0 && "z-30"}`}>
    <div className={`absolute mt-4 w-full h-10 z-50 top-0`}>
      <div className="flex justify-center">
        <div className="relative w-2/3 md:w-96 h-10 z-50">
          {/* <Header /> */}
          <Header2 />
          <Input
            className={`relative w-full h-12 justify-self-center pl-14 py-2 autofill:shadow-[inset_0_0_0px_1000px_white] focus:outline-none focus:bg-white ${
              suggestions.length === 0
                ? "shadow-lg rounded-full"
                : "rounded-t-2xl"
            }`}
            placeholder="Search here"
            onChange={onChange}
            value={value}
          />
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-10 rounded-full hover:bg-gray-200 p-1 absolute size-8 top-2 right-2 items-center cursor-pointer text-gray-500"
            onClick={onClick}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg> */}

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
        </div>
      </div>
      {suggestions.length > 0 && (
        <div
          className={`mx-auto w-2/3 md:w-96 h-96 overflow-auto mt-2 rounded-b-2xl ${
            suggestions.length > 0 && "z-50"
          }`}
        >
          <div className="rounded-b-xl">
            {suggestions?.map((suggestion, index) => (
              <div key={suggestion.ID} className="rounded-lg">
                <button
                  className={`bg-white text-left shadow-lg w-full pl-14 py-4 hover:bg-gray-100 border-t ${
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
    </div>
  );
};
