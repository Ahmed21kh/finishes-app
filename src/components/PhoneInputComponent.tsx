/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import PhoneInput, { PhoneInputProps } from "react-phone-input-2";
import ar from "react-phone-input-2/lang/ar.json";
import { AppContext } from "../context/AppContext";

export interface PhoneInputPropsComp extends Partial<PhoneInputProps> {
  field: any;
  errors?: any;
  reset?: any;
  [key: string]: any;
}

export const PhoneInputComponent: React.FC<PhoneInputPropsComp> = ({
  field,
  errors = {},
  reset,
  ...props
}) => {
  const { themeMode } = useContext(AppContext);
  const isDark = themeMode === "dark";
  const hasError = Boolean(errors?.phoneNumber);

  return (
    <div className="w-full relative" dir="ltr">
      <PhoneInput
        containerClass="!w-full"
        inputStyle={{ textAlign: "right", direction: "ltr" }}
        inputClass={`!w-full !h-10 !text-sm !font-cairo !rounded-xl !transition-all !duration-200 ${
          hasError
            ? "!border-red-500 focus:!border-red-500 !ring-1 !ring-red-500"
            : isDark
            ? "!border-neutral-700 !bg-[#141414] !text-white hover:!border-neutral-500 focus:!border-blue-500"
            : "!border-gray-300 !bg-white !text-gray-900 hover:!border-blue-400 focus:!border-blue-500"
        }`}
        searchClass={`!w-full ${
          isDark ? "!bg-[#1a1a1a] !text-white !border-neutral-700" : ""
        }`}
        dropdownClass={`!text-center !rounded-xl !shadow-lg ${
          isDark
            ? "!bg-[#1a1a1a] !text-white !border-neutral-700"
            : "!bg-white !text-gray-900 !border-gray-200"
        }`}
        buttonClass={`!rounded-l-xl ${
          isDark
            ? "!border-neutral-700 !bg-[#1a1a1a] hover:!bg-[#262626]"
            : "!border-gray-300 !bg-gray-50 hover:!bg-gray-100"
        }`}
        localization={ar}
        autocompleteSearch
        enableSearch
        enableAreaCodes={true}
        country={"eg"}
        value={field.value}
        onChange={field.onChange}
        {...reset}
        {...props}
      />
    </div>
  );
};

export default PhoneInputComponent;
