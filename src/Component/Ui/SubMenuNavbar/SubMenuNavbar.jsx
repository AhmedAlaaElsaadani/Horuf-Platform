import React, { useContext, useRef, useState } from "react";
import { authContext } from "../../../Context/authContext";
import { useTranslation } from "react-i18next";
import style from "./SubMenuNavbar.module.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import ApiManager from "../../../Utilies/ApiManager";

export default function SubMenuNavbar() {
  const { isRegistered, setToken, token, user } = useContext(authContext);
  const { t } = useTranslation();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const containerRef = useRef();
  const [profileLinks, setProfileLinks] = useState([
    {
      icon: <i className="fa-regular fa-lg fa-circle-user"></i>,
      to: "/profile",
      text: "nav_link_edit_profile",
    },
    {
      icon: <i className="fa-solid fa-envelope"></i>,
      to: "/profile/edit-email",
      text: "nav_link_edit_email",
    },
    {
      icon: <i className="fa-solid fa-lg fa-lock"></i>,
      to: "/profile/edit-password",
      text: "nav_link_edit_password",
    },
    {
      icon: <i className="fa-solid fa-lg fa-chalkboard-user"></i>,
      to: "/myPackages",
      text: "nav_link_my_packages",
    },
    {
      icon: <i className="fa-solid fa-lg fa-money-check"></i>,
      to: "/profile/payments",
      text: "nav_link_payments",
    },
  ]);
  const linksLoginRegister = [
    {
      text: "nav_link_Login",
      to: "/Login",
      icon: <i className="fa-solid fa-lg fa-door-open"></i>,
    },
    {
      text: "nav_link_Register",
      to: "/Register",
      icon: <i className="fa-solid fa-lg fa-user"></i>,
    },
  ];

  // logout function
  const logOut = async () => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("You will be logged out."),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, log me out!"),
      cancelButtonText: t("Cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setToken(null);
          await ApiManager.logOut(token);
          Swal.fire({
            title: t("Logged out!"),
            text: t("You have been successfully logged out."),
            icon: "success",
            confirmButtonText: t("Ok"),
          });
        } catch (error) {
          console.error("Logout failed:", error);
          Swal.fire(
            t("Error!"),
            t("Something went wrong. Please try again."),
            "error"
          );
        }
      }
    });
    setShowSubMenu(!showSubMenu);
  };

  useEffect(() => {
    if (user && token && user.roles && profileLinks.length == 5) {
      if (!user.roles.includes("Admin")) {
        setProfileLinks([
          ...profileLinks,
          {
            icon: <i className="fa-solid fa-chalkboard-user"></i>,
            to: `https://dashboard.hrouf-academy.com/accounts/admin-login?token=${token}`,
            text: "Dashboard",
          },
        ]);
      }
    }
  }, [user, token]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSubMenu &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      )
        setShowSubMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  return (
    <li className="position-relative " ref={containerRef}>
      <button
        className={`${style.myaccount}`}
        onClick={() => setShowSubMenu(!showSubMenu)}
      >
        {isRegistered ? (
          <>
            {t("myAccount")} <i className="fa-solid  mx-2 fa-user"></i>
          </>
        ) : (
          <>
            {t("nav_link_Register")}{" "}
            <i className="fa-solid  mx-2 fa-door-open"></i>
          </>
        )}
      </button>
      {showSubMenu &&
        (isRegistered ? (
          <div className={`${style.subMenuDropdown}`}>
            {profileLinks.map((item, idx) => (
              <div
                onClick={() => setShowSubMenu(!showSubMenu)}
                className={`${style.subMenuItem}`}
                key={idx}
              >
                <Link to={item.to}  target={idx == 5 ? "_blank" : ''}>
                  {item.icon}
                  <span className={`${style.subMenuItemText}`}>
                    {t(item.text)}{" "}
                  </span>
                </Link>
              </div>
            ))}
            <div className={style.logout} onClick={logOut}>
              {" "}
              {t("nav_link_logout")}{" "}
            </div>
          </div>
        ) : (
          <div className={`${style.subMenuDropdown}`}>
            {linksLoginRegister.map((linkItem, idx) => (
              <div
                onClick={() => setShowSubMenu(!showSubMenu)}
                className={`${style.subMenuItem}`}
                key={idx}
              >
                <Link to={linkItem.to}>
                  {linkItem.icon}
                  <span className={`${style.subMenuItemText}`}>
                    {t(linkItem.text)}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        ))}
    </li>
  );
}
