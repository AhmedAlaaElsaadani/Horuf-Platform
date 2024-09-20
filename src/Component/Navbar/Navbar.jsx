import React, { useEffect, useState } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useLocation } from "react-router-dom";

import logo from "../../assets/Images/logo.png";
import { HashLink } from "react-router-hash-link";
import { useTranslation } from "react-i18next";
import style from "./Navbar.module.css";
// import whiteLogo from "../../assets/Images/Logo.png";

const Navbar = () => {
  const [navbarCollapse, setNavbarCollapse] = useState();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [active, setActive] = useState("Home");
  const { t } = useTranslation();
  const links = [
    {
      link: t("nav_link_Home"),
      active: "Home",
      to: "#Home",
    },
    {
      link: t("nav_link_About"),
      active: "About",
      to: "About#About",
    },
    {
      link: t("nav_link_Subjects"),
      active: "subjects",
      to: "subjects#subjects",
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

  const toggleThemeMode = () => {
    document.querySelector("body").classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
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
        className={"navbar lead navbar-expand-lg  fixed-top pt-1 shadow "+style["navbar"]}
        data-bs-theme={isDarkMode ? "dark" : "light"}
      >
        <div className="container d-flex justify-content-between ">
          <HashLink className="navbar-brand  py-3 px-2 rounded-3" to="/">
            <img src={logo} style={{ width: "75px" }} alt="logo website " />
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
                <li key={idx} className="nav-item ">
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
                </li>
              ))}
            </ul>
            <ul className="navbar-nav gap-3">
              <li>
                <button
                  type="button"
                  className={
                    isDarkMode
                      ? "btn btn-outline-light"
                      : "btn btn-outline-dark "
                  }
                  name="dark mode button"
                  id="darkmode"
                  onClick={toggleThemeMode}
                >
                  {isDarkMode ? (
                    <i className="fa-regular fa-moon"></i>
                  ) : (
                    <i className="fa-solid fa-circle-half-stroke"></i>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
