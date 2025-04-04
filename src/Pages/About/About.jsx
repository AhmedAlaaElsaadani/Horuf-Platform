import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import Heading1 from "../../Component/Heading1/Heading1";
import aboutAnimation from "../../assets/animations/teacher.json";
import { useTranslation } from "react-i18next";
import style from "./About.module.css";
import { NavLink, Outlet, useLocation } from "react-router-dom"; // Use NavLink instead of Link
import { motion } from "framer-motion";

export default function About() {
  const { t } = useTranslation();
  const [active, setActive] = useState("ourMission");
  const location = useLocation();
  const links = [
    {
      to: "./ourMission",
      text: t("about_links_1"),
      active: "ourMission",
      jsx: <i className="fa-solid fa-bullseye mx-2"></i>,
    },
    {
      to: "./ourVision",
      text: t("about_links_2"),
      active: "ourVision",
      jsx: <i className="fa-solid fa-eye mx-2"></i>,
    },
    {
      to: "./ourValues",
      text: t("about_links_3"),
      active: "ourValues",
      jsx: <i className="fa-solid fa-bars-staggered mx-2"></i>,
    },
  ];
  useEffect(() => {
    let activeFlag = false;
    links.forEach((link) =>
      active.includes(link.active) ? (activeFlag = true) : ""
    );
    if (activeFlag) setActive(location.pathname);
    else setActive("ourMission");
  }, [location.pathname]);

  return (
    <>
      <section
        id="About"
        className={`${style.About} overflow-hidden `}
        style={{
          minHeight: `calc(100vh - ${parseInt(
            window.getComputedStyle(document.body).paddingTop,
            10
          )}px)`,
        }}
      >
        <Heading1 headingText={t("About us")} />
        <div className={"container " + style["about-content"]}>
          <div className="row justify-content-center g-5 mt-2">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={"col-lg-4   " + style["text"]}
            >
              <h2>{t("about_title")}</h2>
              <p>{t("about_subtitle")}</p>
              <Lottie animationData={aboutAnimation} className="w-100 " />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={"col-lg-8 " + style["text-desc"]}
            >
              <p>{t("about_desc")}</p>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={style["miniNav"]}
              >
                {links.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.to}
                    className={
                      active.includes(link.active) ||
                      (index == 0 && active == "/About")
                        ? style.active
                        : ""
                    }
                  >
                    {link.jsx}
                    {link.text}
                  </NavLink>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Outlet />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
