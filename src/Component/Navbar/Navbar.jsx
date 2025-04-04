import React, { useContext, useEffect, useRef, useState } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Images/logo.png";
import { HashLink } from "react-router-hash-link";
import { useTranslation } from "react-i18next";
import style from "./Navbar.module.css";
import DarkModeToggle from "../Ui/DarkModeToggle/DarkModeToggle";
import { motion } from "framer-motion";
import { isThemeModeContext } from "../../Context/isThemeModeContext";
import { IsMobileContext } from "../../Context/isMobileContext";
import SubMenuNavbar from "../Ui/SubMenuNavbar/SubMenuNavbar";
import NavbarTop from "../NavbarTop/NavbarTop";
// import whiteLogo from "../../assets/Images/Logo.png";

const Navbar = () => {
  const [navbarCollapse, setNavbarCollapse] = useState();
  const location = useLocation();
  const [active, setActive] = useState("Home");
  const { t } = useTranslation();
  const navBar = useRef(null);
  const { isDarkMode, setIsDarkMode } = useContext(isThemeModeContext);
  const { isMobile } = useContext(IsMobileContext);

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
      link: t("nav_link_Packages"),
      active: "Packages",
      to: "Packages#Packages",
    },
    {
      link: t("nav_link_Contact"),
      active: "Contact",
      to: "Contact#Contact",
    },
  ];

  const hideNavbar = () => {
    navbarCollapse.hide();
  };

  // const toggleLanguage = () => {
  //   let flagDirection = i18n.language == "en";

  //   flagDirection ? i18n.changeLanguage("ar") : i18n.changeLanguage("en");
  //   if (flagDirection) {
  //     document.body.style.direction = "rtl";
  //     document.title = "منصة حروف التعليمبة";
  //   } else {
  //     document.body.style.direction = "ltr";
  //     document.title = "Harouf Education Platform";
  //   }
  // };
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
    // Add padding to the body to prevent the content from being hidden behind the navbar when the page is scrolled
    if (!isMobile) {
      document.body.style.paddingTop = navBar.current.clientHeight + "px";
    } else {
      document.body.style.paddingTop = "0px";
    }
    return () => {
      document.body.style.paddingTop = "0px";
    };
  }, []);
  useEffect(() => {
    const options = { threshold: 0.1 };
    let observer;

    const createObserver = () => {
      const sections = document.querySelectorAll("section");
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      }, options);

      sections.forEach((section) => observer.observe(section));
    };

    // Initial setup
    createObserver();

    // MutationObserver to detect newly loaded sections
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          if (observer) observer.disconnect(); // Disconnect previous observer
          createObserver(); // Recreate observer with new sections
        }
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer && observer.disconnect();
      mutationObserver.disconnect();
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
        ref={navBar}
      >
        <NavbarTop />
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
              <SubMenuNavbar />
              <li>
                <DarkModeToggle
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                />
              </li>
            </motion.ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
