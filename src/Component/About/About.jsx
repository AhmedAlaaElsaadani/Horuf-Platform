import Lottie from "lottie-react";
import React from "react";
import Heading1 from "../Heading1/Heading1";
import aboutAnimation from "../../assets/animations/teacher.json";
import { useTranslation } from "react-i18next";
import style from "./About.module.css";
import { NavLink, Outlet } from "react-router-dom";  // Use NavLink instead of Link

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="About" className={style.About}>
      <Heading1 headingText={t("About us")} />
      <div className={"container " + style["about-content"]}>
        <div className="row justify-content-center g-5 mt-2">
          <div className={"col-lg-4   " + style["text"]}>
            <h1>{t("home_title")}</h1>
            <p>{t("about_subtitle")}</p>
            <Lottie
              animationData={aboutAnimation}
              className="w-100 "
              style={{ width: "25px" }}
            />
          </div>
          <div className={"col-lg-8 " + style["text-desc"]}>
            <p>{t("about_desc")}</p>
            <div className={style["miniNav"]}>
              <NavLink
                to="ourMission"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                مهمتنا
              </NavLink>
              <NavLink
                to="ourVision"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                رؤيتنا
              </NavLink>
              <NavLink
                to="ourValues"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                قيمنا
              </NavLink>
            </div>
          <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}
