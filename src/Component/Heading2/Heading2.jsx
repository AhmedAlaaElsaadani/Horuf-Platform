import React, { useEffect } from "react";
import style from "./Heading2.module.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Heading2({
  headingText,
  img,
  flagLinks = false,
  links,
  setLinks,
}) {
  return (
    <div style={{ backgroundImage: `url(${img})` }} className={style.Heading2}>
      <div
        className={
          style["layer"] +
          " d-flex justify-content-center align-items-center w-100  "
        }
      >
        {flagLinks ? (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={style["links"] }
          >
            {links.map((link, index) => (
              <React.Fragment key={index}>
                <Link
                  onClick={() => setLinks(links.slice(0, index + 1))}
                  to={link.to}
                >
                  {link.text} 
                </Link>
                {index < links.length - 1 && <span>||</span>}{" "}
                {/* Add separator except after the last link */}
              </React.Fragment>
            ))}
          </motion.div>
        ) : (
          <motion.h2
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {headingText}
          </motion.h2>
        )}
      </div>
    </div>
  );
}
