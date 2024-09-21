import React from "react";
import style from "./Heading1.module.css";
import img1 from "../../assets/Images/Heading1/Books.png";
import img2 from "../../assets/Images/Heading1/graduition.png";
import img3 from "../../assets/Images/Heading1/Mastarh.png";

export default function Heading1({ headingText }) {
  const images = [
    { id: 1, src: img1, alt: "Books" },
    { id: 3, src: img3, alt: "Masterh" },
    { id: 2, src: img2, alt: "Graduation" },
  ];
  return (
    <div
      className={
        style.Heading1 +
        " d-flex justify-content-center align-items-center position-relative"
      }
    >
      {images.map((image) => (
        <img key={image.id} src={image.src} alt={image.alt} loading="lazy" />
      ))}
      <h2>{headingText}</h2>
    </div>
  );
}
