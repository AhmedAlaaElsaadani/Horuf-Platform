import React from "react";
import style from "./FloatingInput.module.css";
import { motion } from "framer-motion";

export default function FloatingInput({
  inputType,
  inputName,
  inputTransition,
  myFormik,
  flagDirection,
  t,
  idx,
  icon,
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
        className={"form-floating " + style.floating}
      >
        <input
          dir={flagDirection ? "ltr" : "rtl"}
          type={inputType} //
          className={"form-control mt-1 mb-3 " + style.floatingInput}
          id={inputName}
          name={inputName}
          placeholder={t(inputTransition)}
          onChange={myFormik.handleChange}
          value={myFormik.values[inputName]}
        />
        <label
          className={style["FloatingLabel"]}
          htmlFor={inputName}
          style={{
            left: flagDirection ? "auto" : "0px",
            right: flagDirection ? "0px" : "auto",
          }}
        >
          {t(inputTransition)} <i className={`fa-solid ${icon}`}></i>
        </label>
      </motion.div>

      {myFormik.errors[inputName] && myFormik.touched[inputName] && (
        <div className="alert alert-danger">{myFormik.errors[inputName]}</div>
      )}
    </>
  );
}
