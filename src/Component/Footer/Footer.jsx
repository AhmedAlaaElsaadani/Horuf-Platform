import React from "react";
import footerImg from "../../assets/Images/footer.webp";
import style from "./Footer.module.css";
import whiteLogo from "../../assets/Images/whiteLogo.png";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      className={style["footer-container"] + " mt-5"}
      style={{
        backgroundImage: `url(${footerImg})`,
      }}
    >
      <div className={style["layer"]}>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="imageContainer"
        >
          <img src={whiteLogo} alt="logo" className="m-auto" />
        </motion.div>
        <div className="heading">
          <h2>{t("Footer Heading")}</h2>
        </div>
        <div className={style["line"]}></div>

        <div className="row justify-content-between w-100 ">
          <motion.p
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={"mb-0 " + style["copy"]}
          >
            {t("Footer Copy")}
            <span className={style["comp-name"]}>{t("Footer comp")}</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            dir="rtl"
            className=" mb-1 text-center m-auto"
            style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)" }}
          >
            {t("Footer IzI1")}
            <a
            className={style["comp-name"]}
              href="https://www.izitechs.com"
            >
              IzI Techs
            </a>
            {t("Footer IzI2")}
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
