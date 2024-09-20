import React from "react";

import style from "./Heading2.module.css";

export default function Heading2({ headingText,img }) {
  return (
    <div style={{ backgroundImage: `url(${img})` }} className={style.Heading2}>
      <div
        className={
          style["layer"] +
          " d-flex justify-content-center align-items-center w-100 "
        }
      >
        <h2>{headingText}</h2>
      </div>
    </div>
  );
}
