import React, { useEffect, useRef, useState } from "react";
import style from "./PhoneInput.module.css";
import { motion } from "framer-motion";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import ar from "intl-tel-input/i18n/ar"; // arabic
import en from "intl-tel-input/i18n/en"; // english
import { useTranslation } from "react-i18next";

export default function PhoneInput({
  inputName,
  inputTransition,
  myFormik,
  idx,
  icon,
  initialCountry,
  initialValue,
  disabled = false,
}) {
  const { t, i18n } = useTranslation();
  const [flagDirection, setFlagDirection] = useState(i18n.language === "ar");
  const [countryCode, setCountryCode] = useState(null); // Default to Egypt
  useEffect(() => {
    setFlagDirection(i18n.language === "ar");
  }, [i18n.language]);
  const [inputValue, setInputValue] = useState(
    initialValue ? initialValue : ""
  );
  const inputRef = useRef();
  useEffect(() => {
    if (!countryCode) {

      const tmpInput = document.createElement("input");
      const tmpInstance = intlTelInput(tmpInput, {
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        nationalMode: false,
      });
      tmpInput.value = initialCountry || "+965";
      tmpInstance.setNumber(tmpInput.value);
      // Default to Kuwait if no initial country is provided
      setCountryCode(tmpInstance.getSelectedCountryData().iso2);

      tmpInstance.destroy();
      tmpInput.remove();

    }

  }, [])

  useEffect(() => {
    if (countryCode) {
      const input = inputRef.current;
      const iti = intlTelInput(input, {
        i18n: flagDirection ? ar : en,
        initialCountry: countryCode,
        // Only allow Gulf countries and Egypt
        onlyCountries: ["kw", "sa", "ae", "qa", "bh", "om", "eg"],
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });

      // Define the change event handler
      const handleInputChange = (e) => {
        // take the phone number with the code from iti
        const phoneNumber = `+${iti.getSelectedCountryData().dialCode} ${input.value
          }`;
        // take the country code from iti
        const countryCode = iti.getSelectedCountryData().iso2;
        console.log("Selected country code:", countryCode);
        myFormik.setFieldValue("countryId", countryCode);
        // set the value of the input
        setInputValue(e.target.value);
        // set the value of the formik field with the phone number
        myFormik.setFieldValue(inputName, phoneNumber);
      };

      // Attach the event listener
      input.addEventListener("change", handleInputChange);

      // Cleanup
      return () => {
        input.removeEventListener("change", handleInputChange);
        iti.destroy();
      };
    }
  }, [flagDirection, inputName, countryCode]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
        className={
          style.phoneInputContainer + " mt-1 mb-3  justify-content-start"
        }
        dir={flagDirection ? "rtl" : "ltr"}
        style={{ maxHeight: "65px" }}
      >
        <label
          htmlFor={inputName}
          style={{
            marginRight: "0 10px",
          }}
        >
          <i className={`fa-solid  ${icon}`}></i>
        </label>
        <input
          type="tel"
          className={`form-control  `}
          id={inputName}
          name={inputName}
          defaultValue={inputValue}
          placeholder={t(inputTransition)}
          ref={inputRef}
          disabled={disabled}
        />
      </motion.div>

      {myFormik.errors[inputName] && myFormik.touched[inputName] && (
        <div className="px-3 text-danger text-center">
          {myFormik.errors[inputName]}
        </div>
      )}
    </>
  );
}
