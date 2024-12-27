import React, { useContext, useEffect, useState } from "react";
import style from "./Profile.module.css";
import { useTranslation } from "react-i18next";
import { authContext } from "../../Context/authContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import Heading1 from "../../Component/Heading1/Heading1";
import { motion } from "framer-motion";
export default function Profile() {
  const { t, i18n } = useTranslation();
  const { setToken, token, user } = useContext(authContext);
  const location = useLocation();
  const [active, setActive] = useState("/profile");
  const [flagDirection, setFlagDirection] = useState(i18n.language === "ar");
  useEffect(() => {
    setFlagDirection(i18n.language === "ar");
  }, [i18n.language]);
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);
  const logOut = async () => {
    setToken(null);
    await ApiManager.logOut(token);
  };
  let profileLinks = [
    {
      link: t("nav_link_edit_profile"),
      active: "/profile",
      to: "/profile",
      clickFun: null,
    },
    {
      link: t("nav_link_edit_email"),
      active: "/profile/edit-email",
      to: "/profile/edit-email",
      clickFun: null,
    },
    ,
    {
      link: t("nav_link_edit_password"),
      active: "/profile/edit-password",
      to: "/profile/edit-password",
      clickFun: null,
    },
    {
      link: t("nav_link_my_courses"),
      active: "/profile/my-courses",
      to: "/profile/my-courses",
      clickFun: null,
    },
    {
      link: t("nav_link_logout"),
      active: "logout",
      to: "",
      clickFun: logOut,
    },
  ];
  return (
    <section
      id="profile"
      className={style.Profile + " d-flex  flex-column  "}
      style={{
        minHeight: `calc(100vh - ${parseInt(
          window.getComputedStyle(document.body).paddingTop,
          10
        )}px)`,
      }}
    >
      <Heading1
        headingText={t("profile_title")}
        flagChangeGraduationPlace={true}
      />
      <div className="container flex-grow-1 d-flex align-items-center">
        <div className="row g-3 w-100 my-5 ">
          <motion.div
            initial={{ opacity: 0, x: flagDirection ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-md-3  "
          >
            <ul
              className={
                style["profile-links"] +
                " shadow d-flex gap-3  justify-content-center   "
              }
            >
              {profileLinks.map((link, index) => (
                <motion.li
                  initial={{ opacity: 0, x: flagDirection ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  key={index}
                  className={link.active === active ? style["selected"] : ""}
                >
                  <Link to={link.to} onClick={link.clickFun}>
                    {link.link}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: flagDirection ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-md-9 d-flex align-items-center"
          >
            <Outlet context={{flagDirection}} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
