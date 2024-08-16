import { Description, Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { classNames } from "../utils/funcs";

interface Props {
  label?: string;
  options: string[];
  desc?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SelectField = (props: Props) => {
  const { label, options, desc } = props;

  return (
    <div className="mt-4 w-full max-w-md">
      <Field>
        {label && (
          <Label className="text-sm/6 font-medium text-gray-900">{label}</Label>
        )}
        {desc && (
          <Description className="text-sm/6 text-gray-900">{desc}</Description>
        )}
        <div className="relative">
          <Select
            className={classNames(
              "block w-full rounded-lg border-2 bg-white/5 py-1.5 px-3 text-sm/6 text-gray-900",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
            )}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  );
};
