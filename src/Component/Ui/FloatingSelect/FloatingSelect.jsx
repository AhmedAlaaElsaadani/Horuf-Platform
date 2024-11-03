import { motion } from "framer-motion";
import React from "react";
import style from "./FloatingSelect.module.css";

export default function FloatingSelect({
  selectName,
  selectTransition,
  icon,
  options = [
    {
      key: "level 6",
      value: 6,
    },
    {
      key: "level 7",
      value: 7,
    },
    {
      key: "level 8",
      value: 8,
    },
    {
      key: "level 9",
      value: 9,
    },
    {
      key: "level 10",
      value: 10,
    },
    {
      key: "level 11",
      value: 11,
    },
    {
      key: "level 12",
      value: 12,
    },
  ],
  myFormik,
  t,
  flagDirection,
  idx,
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
        className={"form-floating " + style.floating}
      >
        <select
          id={selectName}
          name={selectName}
          className={"form-select mt-4 " + style.floatingSelect}
          dir={flagDirection ? "ltr" : "rtl"}
          onChange={myFormik.handleChange}
          value={myFormik.values[selectName]}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {t(option.key)}
            </option>
          ))}
        </select>
        <label
          style={{
            left: flagDirection ? "auto" : "0",
            right: flagDirection ? "0" : "auto",
          }}
          htmlFor={selectName}
          className={style["floatingLabel"]}
        >
          {t(selectTransition)} <i className={`fa-solid ${icon}`}></i>
        </label>
      </motion.div>
      {myFormik.errors[selectName] && myFormik.touched[selectName] && (
        <div className="alert alert-danger">{myFormik.errors[selectName]}</div>
      )}
    </>
  );
}
