import classNames from "classnames";
import React from "react";

interface Props {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = (props: Props) => {
  const { className, label, disabled, onClick } = props;
  const disabledClassName =
    "bg-gray-500 font-bold py-2 px-4 rounded border-2 border-gray-700";
  const defaultClassName =
    "hover:bg-gray-500 text-gray-700 font-bold py-2 px-4 rounded border-2 border-gray-700";
  const mergedClassName = disabled
    ? classNames(disabledClassName, className)
    : classNames(defaultClassName, className);
  return (
    <button
      className={mergedClassName}
      onClick={onClick}
      disabled={disabled || false}
    >
      {label}
    </button>
  );
};

export default Button;
