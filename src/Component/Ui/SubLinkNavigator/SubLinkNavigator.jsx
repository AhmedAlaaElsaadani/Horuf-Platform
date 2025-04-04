import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import style from "./SubLinkNavigator.module.css";

export default function SubLinkNavigator({ options }) {
  const [active, setActive] = useState("");
  const location = useLocation();
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);
  return (
    <div
      className={`${style.SubLink} d-flex justify-content-center  mb-5 align-items-center  `}
    >
      {options.map((link, index) => (
        <div key={index} className={`${style.subLinkItem}`}>
          <Link
            to={link.to}
            className={`${active === link.active ? style.active : ""}`}
          >
            {link.title}{" "}
          </Link>
        </div>
      ))}
    </div>
  );
}
