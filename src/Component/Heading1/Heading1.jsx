import React from "react";
import style from "./Heading1.module.css";
import img1 from "../../assets/Images/Heading1/Books.png";
import img2 from "../../assets/Images/Heading1/graduition.png";
import img3 from "../../assets/Images/Heading1/Mastarh.png";
import { motion } from "framer-motion";

export default function Heading1({
  headingText,
  flagChangeGraduationPlace = false,
}) {
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
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={image.id}
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className={`${
            flagChangeGraduationPlace && image.id === 3
              ? style["specialPositionForSomePages"]
              : ""
          }`}
        />
      ))}
      <motion.h2
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {headingText}
      </motion.h2>
    </div>
  );
}
