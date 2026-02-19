import { useContext } from "react";
import PhoneInput, { PhoneInputProps } from "react-phone-input-2";
import ar from 'react-phone-input-2/lang/ar.json';
import { AppContext } from "../context/AppContext";

interface PhoneInputPropsComp extends PhoneInputProps {
    field:any;
    errors:any;
    [key: string]: any;
}
const PhoneInputComponent = ({field , errors , reset}:PhoneInputPropsComp) => {
    const {themeMode , primaryColor } = useContext(AppContext);
  return (
    <PhoneInput
      containerClass=" w-full "
      inputStyle={{ textAlign:'right' }}
      inputClass={` !w-full !pr-[48px] ${errors.phoneNumber && '!border-[#dc4446]'} ${themeMode == 'dark' && `!border-[#424242] !bg-[#141414] hover:!border-[${primaryColor}]`} !rounded-md !h-[40px]`}
      searchClass={`${themeMode == 'dark' && '!border-[#424242] !bg-[#141414] '} !w-full`}
      dropdownClass={`!text-center ${themeMode == 'dark' && '!border-[#424242] !bg-[#141414] '}`}
      localization={ar}
      autocompleteSearch
      enableSearch
      enableAreaCodes={true}
      country={"eg"}
      value={field.value}
      onChange={field.onChange}
      buttonClass={`${themeMode == 'dark' && '!border-[#424242] !bg-[#141414] hover:!bg-[#141414]'}`}
      {...reset}
          // inputProps={{...field}}
      />
  )
}

export default PhoneInputComponent