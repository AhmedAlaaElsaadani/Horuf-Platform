import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./NavbarTop.module.css";
import { useTranslation } from "react-i18next";
// import { HomeContentContext } from "../../../Context/homeContentContext";

const NavbarTop = () => {
  const navbarTopRef = useRef(null);
  const containerRef = useRef(null);
  // const { homeContent, isLoading } = useContext(HomeContentContext);
  const [banner, setBanner] = useState(null);
  const { t, i18n } = useTranslation();
  // useEffect(() => {
  //   setBanner(homeContent?.homeInfo?.welcomeMessage);
  // }, [homeContent?.homeInfo]);

  useEffect(() => {
    const updateNavbarTopAnimation = () => {
      if (!navbarTopRef.current || !containerRef.current) return;

      const navbarTop = navbarTopRef.current;
      const container = containerRef.current;

      const NavbarTopWidth = navbarTop.offsetWidth;
      const containerWidth = container.offsetWidth;

      const maxMarginRight = containerWidth + NavbarTopWidth;

      navbarTop.style.animation = `navbarTop ${
        maxMarginRight / 100
      }s linear infinite`;

      const styleSheet = document.styleSheets[0];
      const keyframes =
        i18n.language == "ar"
          ? `
        @keyframes navbarTop {
          0% {
            margin-right: ${maxMarginRight}px;
          }
          100% {
            margin-right: -${NavbarTopWidth}px;
          }
        }
      `
          : `
        @keyframes navbarTop {
          0% {
            margin-right: -${NavbarTopWidth}px;
          }
          100% {
            margin-right: ${maxMarginRight}px;
          }
        }
      `;

      const existingRules = Array.from(styleSheet.cssRules).filter(
        (rule) => rule.name === "NavbarTop"
      );
      existingRules.forEach((rule) => styleSheet.deleteRule(rule));

      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    };

    updateNavbarTopAnimation();
    window.addEventListener("resize", updateNavbarTopAnimation);

    return () => {
      window.removeEventListener("resize", updateNavbarTopAnimation);
    };
  }, [i18n.language]);

  return (
    <div className={style["navbarTop-container"]} ref={containerRef}>
      <div className={style["navbarTop"]} ref={navbarTopRef}>
        {/* {!isLoading ? ( */}
        <>{banner ? banner : t("Welcome in Hrouf Academy")}</>
        {/* ) : null} */}
      </div>
    </div>
  );
};

export default NavbarTop;
