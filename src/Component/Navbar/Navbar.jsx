import React, { useContext, useEffect, useState } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Images/logo.png";
import { HashLink } from "react-router-hash-link";
import { useTranslation } from "react-i18next";
import style from "./Navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import i18n from "../../i18n";
import { authContext } from "../../Context/authContext";
import ApiManager from "../../Utilies/ApiManager";
import { motion } from "framer-motion";
// import whiteLogo from "../../assets/Images/Logo.png";

const Navbar = () => {
  const [navbarCollapse, setNavbarCollapse] = useState();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [active, setActive] = useState("Home");
  const { t } = useTranslation();
  let { isRegistered, setToken, token, user } = useContext(authContext);
  const links = [
    {
      link: t("nav_link_Home"),
      active: "Home",
      to: "./#Home",
    },
    {
      link: t("nav_link_About"),
      active: "About",
      to: "About#About",
    },
    {
      link: t("nav_link_Subjects"),
      active: "Subjects",
      to: "subjects#subjects",
    },
    {
      link: t("nav_link_Contact"),
      active: "Contact",
      to: "Contact#Contact",
    },
  ];
  const linksLoginRegister = [
    {
      link: t("nav_link_Login"),
      active: "Login",
      to: "/Login",
    },
    {
      link: t("nav_link_Register"),
      active: "Register",
      to: "/Register",
    },
  ];
  // logout function
  const logOut = async () => {
    setToken(null);
    await ApiManager.logOut(token);
  };
  let profileLinks = [
    {
      link: t("nav_link_edit_password"),
      active: "edit-password",
      to: "/profile/edit-password",
      clickFun: null,
    },
    {
      link: t("nav_link_my_courses"),
      active: "my-courses",
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

  const hideNavbar = () => {
    navbarCollapse.hide();
  };

  const toggleThemeMode = () => {
    document.querySelector("body").classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    let flagDirection = i18n.language == "en";

    flagDirection ? i18n.changeLanguage("ar") : i18n.changeLanguage("en");
    if (flagDirection) {
      document.body.style.direction = "rtl";
      document.title = "منصة حروف التعليمبة";
    } else {
      document.body.style.direction = "ltr";
      document.title = "Harouf Education Platform";
    }
  };
  // this to part to get the prefers-color-scheme from device
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (mediaQuery.matches) {
      setIsDarkMode(mediaQuery.matches);
    }

    const handleChange = (e) => {
      if (e.matches) {
        toggleThemeMode();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    // Manually collapse the navbar when a link is clicked
    setNavbarCollapse(
      new bootstrap.Collapse(
        document.getElementById("navbarSupportedContent"),
        {
          toggle: false,
        }
      )
    );
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const options = {
      threshold: 0.01,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, options);

    if (sections.length > 0) {
      sections.forEach((section) => {
        observer.observe(section);
      });
    }

    return () => {
      if (sections.length > 0) {
        sections.forEach((section) => {
          observer.unobserve(section);
        });
      }
    };
  }, [location.pathname]);

  return (
    <>
      <nav
        id="navBarMain"
        className={
          "navbar lead navbar-expand-lg  fixed-top pt-0 shadow flex-column " +
          style["navbar"]
        }
        data-bs-theme={isDarkMode ? "dark" : "light"}
      >
        <div className={"w-100 " + style["navbarTop"]}>
          <div className="container p-3 d-flex justify-content-between align-items-center">
            <motion.p
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="m-0 "
            >
              مرحبا بك فى اكادمية حروف <span>اكتشف المزيد ! </span>
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="navbar-nav  "
            >
              {isRegistered ? (
                <li
                  className={"nav-item position-relative  " + style["profile"]}
                >
                  <div
                    className={
                      "nav-link rounded rounded-circle position-relative  d-grid shadow " +
                      style["icon"]
                    }
                  >
                    <i className="fa-solid fa-user m-auto  "></i>

                    {user && !user?.isVerified && (
                      <span
                        className="position-absolute end-0 top-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{}}
                      >
                        <span className="visually-hidden">New alerts</span>
                      </span>
                    )}
                  </div>
                  <ul className="navbar-nav p-0 z-3 position-absolute  rounded-3">
                    <li className="nav-item  position-relative">
                      <Link
                        className={
                          "nav-link " +
                          (active == "profile" ? style["selected"] : "")
                        }
                        to="/profile"
                      >
                        {t("nav_link_edit_profile")}
                      </Link>
                    </li>

                    <li className="nav-item  position-relative">
                      <Link
                        className={
                          "nav-link " +
                          (active == "edit-email" ? style["selected"] : "")
                        }
                        to="/profile/edit-email"
                      >
                        {user && !user?.isVerified
                          ? t("nav_link_verify_email")
                          : t("nav_link_edit_email")}
                        {user && !user?.isVerified && (
                          <span className="position-absolute end-0 top-50 translate-middle-y p-1 mx-1 bg-danger border border-light rounded-circle">
                            <span className="visually-hidden">New alerts</span>
                          </span>
                        )}
                      </Link>
                    </li>
                    {profileLinks.map((link, idx) => (
                      <li key={idx} className="nav-item  position-relative">
                        <Link
                          className={
                            "nav-link " +
                            (link.active == active ? style["selected"] : "")
                          }
                          to={link.to}
                          onClick={link.clickFun}
                        >
                          {link.link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                linksLoginRegister.map((link, idx) => (
                  <li key={idx} className="nav-item ">
                    <HashLink
                      className={
                        "nav-link " +
                        (link.active == active ? style["selected"] : "")
                      }
                      to={link.to}
                    >
                      {link.link}
                    </HashLink>
                  </li>
                ))
              )}
            </motion.ul>
          </div>
        </div>
        <div className="container d-flex justify-content-between  ">
        
          <HashLink
            className="navbar-brand  py-3 rounded-3 overflow-hidden"
            to="/"
          >
            <motion.img
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              src={logo}
              style={{ width: "75px" }}
              alt="logo website "
            />
          </HashLink>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => {
              navbarCollapse.toggle();
            }}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={"collapse navbar-collapse  " + style["list-links"]}
            id="navbarSupportedContent"
          >
            <div />
            <ul className="navbar-nav gap-3 ">
              {links.map((link, idx) => (
                <motion.li
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  key={idx}
                  className="nav-item "
                >
                  <Link
                    className={
                      "nav-link " +
                      (link.active == active ? style["selected"] : "")
                    }
                    to={link.to}
                    onClick={hideNavbar}
                  >
                    {link.link}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.ul
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="navbar-nav  d-flex justify-content-center align-items-center"
            >
              <li>
                <DarkModeToggle isDark={isDarkMode} toggle={toggleThemeMode} />
              </li>
              <li>
                <button
                  className="btn btn-outline-primary"
                  // onClick={toggleLanguage}
                >
                  {/* {t("nav_lang")} */}
                  الكويت
                  <i className="fa-solid fa-globe mx-2"></i>
                </button>
              </li>
            </motion.ul>
          </div>


        </div>
      </nav>
    </>
  );
};

export default Navbar;
