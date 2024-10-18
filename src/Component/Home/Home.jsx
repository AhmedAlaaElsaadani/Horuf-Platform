import Lottie from "lottie-react";
import React, { useContext } from "react";
import homeAnimation from "../../assets/animations/Home.json";
import style from "./Home.module.css";
import { HashLink } from "react-router-hash-link";
import { useTranslation } from "react-i18next";
import { authContext } from "../../Context/authContext";
import { motion } from "framer-motion";
import Contact from "../Contact/Contact";
export default function Home() {
  const { t, i18n } = useTranslation();
  const { isRegistered } = useContext(authContext);
  return (
    <>
      <section id="Home" className={style.Home}>
        <div className={"container  " + style["home-content"]}>
          <div className="row justify-content-center g-4 ">
            <motion.div
              initial={{ opacity: 0, x: i18n.language === "ar" ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={"col-lg-5   " + style["text"]}
            >
              <h1>{t("home_title")}</h1>
              <p>{t("home_subtitle")}</p>
              <p>{t("home_desc")}</p>
              <div className={style["links"]}>
                {!isRegistered && (
                  <HashLink to={"/register"}> {t("home_links_1")}</HashLink>
                )}
                <HashLink to="/About"> {t("home_links_2")}</HashLink>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: i18n.language === "ar" ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="col-lg-6  "
            >
              <Lottie animationData={homeAnimation} className="w-100 " />
            </motion.div>
          </div>
        </div>
      </section>
      <Contact flagNotAloneCompounded={true} />
    </>
  );
}
