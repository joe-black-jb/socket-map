import { Input } from "@headlessui/react";
import { FilterLabel, Station } from "../types/types";
import Header from "./Header";
import Header2 from "./Header2";
import { Icon } from "semantic-ui-react";

interface Props {
  isClicked: boolean;
  label: FilterLabel;
  onClick: (label: FilterLabel) => void;
}

export const Filter = (props: Props) => {
  const { isClicked, label, onClick } = props;

  return (
    <div key={label}>
      <button
        onClick={() => onClick(label)}
        className={`flex justify-center mt-[65px] ml-6 h-8 z-40 top-0 rounded-t-2xl rounded-b-2xl transition duration-100 ${
          isClicked ? "bg-green-200" : "bg-white"
        }`}
      >
        <div className="pl-3 pt-[6px] pb-2">
          {label === "Wi-Fi" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
              />
            </svg>
          )}
          {label === "コンセント" && (
            <div className="pt-[2px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6 0a.5.5 0 0 1 .5.5V3h3V.5a.5.5 0 0 1 1 0V3h1a.5.5 0 0 1 .5.5v3A3.5 3.5 0 0 1 8.5 10c-.002.434-.01.845-.04 1.22-.041.514-.126 1.003-.317 1.424a2.083 2.083 0 0 1-.97 1.028C6.725 13.9 6.169 14 5.5 14c-.998 0-1.61.33-1.974.718A1.922 1.922 0 0 0 3 16H2c0-.616.232-1.367.797-1.968C3.374 13.42 4.261 13 5.5 13c.581 0 .962-.088 1.218-.219.241-.123.4-.3.514-.55.121-.266.193-.621.23-1.09.027-.34.035-.718.037-1.141A3.5 3.5 0 0 1 4 6.5v-3a.5.5 0 0 1 .5-.5h1V.5A.5.5 0 0 1 6 0z" />
              </svg>
            </div>
          )}
        </div>
        <div></div>
        <div
          className={`w-full text-center align-text-bottom pl-2 pr-4 pt-[6px] pb-1 text-sm text-gray-600`}
        >
          {label}
        </div>
      </button>
    </div>
  );
};
