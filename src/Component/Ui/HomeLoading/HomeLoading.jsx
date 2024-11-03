import React from "react";
import img from "../../../assets/Images/logo.png";
export default function HomeLoading() {
  return (
    <div
      className="position-fixed top-0 start-0 bottom-0 end-0 w-100 d-flex justify-content-center align-items-center "
      style={{
        backgroundColor: "var(--bg-color)",
        zIndex: "10000000",
      }}
    >
      <img
        src={img}
        alt="logo "
        className="fa-beat-fade"
        style={{
          width: "100px",
          height: "100px",
        }}
      />
    </div>
  );
}
