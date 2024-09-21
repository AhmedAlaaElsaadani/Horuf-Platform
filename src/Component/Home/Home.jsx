import Lottie from "lottie-react";
import React from "react";
import homeAnimation from "../../assets/animations/Home.json";
import style from "./Home.module.css";
import { HashLink } from "react-router-hash-link";
import { useTranslation } from "react-i18next";
export default function Home() {
  const { t } = useTranslation();
  
  return (
    <section id="Home" className={style.Home}>
      <div className={"container  " + style["home-content"]}>
        <div className="row justify-content-center g-4 ">
          <div className={"col-lg-5   " + style["text"]}>
            <h1>{t("home_title")}</h1>
            <p>{t("home_subtitle")}</p>
            <p>{t("home_desc")}</p>
            <div className={style["links"]}>
              <HashLink to={"/accounts/login"}> {t("home_links_1")}</HashLink>
              <HashLink to="/About"> {t("home_links_2")}</HashLink>
            </div>
          </div>
          <div className="col-lg-6  ">
            <Lottie
              animationData={homeAnimation}
              className="w-100 "
              style={{ width: "25px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
