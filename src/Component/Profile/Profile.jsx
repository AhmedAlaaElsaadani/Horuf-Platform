import React, { useContext, useEffect, useState } from "react";
import style from "./Profile.module.css";
import { useTranslation } from "react-i18next";
import { authContext } from "../../Context/authContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import Heading1 from "../Heading1/Heading1";
export default function Profile() {
  
  const { t ,i18n} = useTranslation();
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
    <section id="profile" className={style.Profile + " d-flex  flex-column  "}>
      <Heading1
        headingText={t("profile_title")}
        flagChangeGraduationPlace={true}
      />
      <div className="container flex-grow-1 d-flex align-items-center">
        <div className="row g-3 w-100 my-5 ">
          <div className="col-md-3  ">
            <div
              className={
                style["profile-links"] + " shadow d-flex flex-md-column gap-3 flex-sm-wrap  "
              }
            >
              <Link
                className={active == "/profile" ? style["selected"] : ""}
                to="/profile"
              >
                {t("nav_link_edit_profile")}
              </Link>
              {
                // !user?.isVerified
                user && true && (
                  <Link
                    className={
                      "position-relative " +
                      (active == "/profile/edit-email" ? style["selected"] : "")
                    }
                    to="/profile/edit-email"
                  >
                    {t("nav_link_edit_email")}
                    <span className={`position-absolute  top-50 translate-middle-y p-2 bg-danger border border-light rounded-circle ${flagDirection?"end-100":"start-100"}`}>
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </Link>
                )
              }{" "}
              {profileLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  onClick={link.clickFun}
                  className={link.active === active ? style["selected"] : ""}
                >
                  {link.link}
                </Link>
              ))}
            </div>
          </div>
          <div className="col-md-9 d-flex align-items-center">
            <Outlet flagDirection={flagDirection} />
          </div>
        </div>
      </div>
    </section>
  );
}
