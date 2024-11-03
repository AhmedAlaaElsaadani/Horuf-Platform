import React from "react";

export default function Spinner({ sectionFlag =true }) {
  //sectionFlag is a flag to determine the spinner location
  return (
    <div
      className="w-100 p-5 d-flex "
      style={{
        backgroundColor: "var(--bg-color)",
        minHeight: sectionFlag
          ? `calc(100vh - ${parseInt(
              window.getComputedStyle(document.body).paddingTop,
              10
            )}px)`
          : "auto",
      }}
    >
      <i className="fa-solid fa-spinner fa-spin fa-spin-plus m-auto fs-1 text-primary"></i>
    </div>
  );
}
