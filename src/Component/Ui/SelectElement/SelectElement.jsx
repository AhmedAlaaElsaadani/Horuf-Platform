import React from "react";
import style from "./SelectElement.module.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
export default function SelectElement({
  options,
  translation,
  defaultValue,
  selectName,
  //formik props
  onChange,
  icon,
  error,
  touched,
  // when be more than one select in the same page
  idx = 0,
  // when you want to use search in select
  searchFlag = false,
}) {
  const { t } = useTranslation();
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: idx * 0.1 }}
        className={style.selectContainer + " mb-3"}
      >
        {icon && (
          <label htmlFor={selectName}>
            <i className={`fa-solid ${icon}`}></i>
          </label>
        )}
        <div className={style.selectBox}>
          <select
            id={selectName}
            name={selectName}
            defaultValue={defaultValue}
            onChange={onChange}
          >
            <option
              value=""
              // disabled
            >
              {t(translation)}
            </option>
            {options &&
              options.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {t(option.key)}
                </option>
              ))}
          </select>
        </div>
      </motion.div>
      {error && touched && (
        <div className="text-danger text-center">{error}</div>
      )}
    </>
  );
}
