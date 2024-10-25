import React from "react";
import style from "./DarkModeToggle.module.css";
export default function DarkModeToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <div className={style["toggle-parent"]}>
      <input
        type="checkbox"
        id={style["toggle_checkbox"]}
        checked={isDarkMode}
        onChange={function (e) {
          setIsDarkMode(e.target.checked);
        }}
      />

      <label htmlFor={style["toggle_checkbox"]}>
        <div id={style["star"]}></div>
        <div id={style["moon"]}></div>
      </label>
    </div>
  );
}
