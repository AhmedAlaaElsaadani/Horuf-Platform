import React, { useContext, useEffect, useState } from "react";
import style from "./Register.module.css";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";

export default function Register() {
  const { t, i18n } = useTranslation();
  const [flagDirection, setFlagDirection] = useState(i18n.language === "ar");
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const { setToken, setIsRegistered } = useContext(authContext);
  let navigator = useNavigate();
  const Level = {
    level_6: 6,
    level_7: 7,
    level_8: 8,
    level_9: 9,
    level_10: 10,
    level_11: 11,
    level_12: 12,
  };
  useEffect(() => {
    setFlagDirection(i18n.language === "ar");
  }, [i18n.language]);

  const validationSchemaYup = Yup.object().shape({
    firstName: Yup.string().required(t("Required")),
    lastName: Yup.string().required(t("Required")),
    phone: Yup.string()
      .matches(/^(00965|\+965|965)?[5691][0-9]{7}$/, t("Invalid phone number"))
      .required(t("Required")),
    parentPhone: Yup.string()
      .matches(/^(00965|\+965|965)?[5691][0-9]{7}$/, t("Invalid phone number"))
      .required(t("Required"))
      .notOneOf(
        [Yup.ref("phone")],
        t("Phone number and parent phone must be different")
      ),
    email: Yup.string()
      .email(t("Invalid email address"))
      .required(t("Required")),
    password: Yup.string()
      .min(6, t("Password must contain at least 6 characters"))

      .required(t("Required")),
    confirmPassword: Yup.string()
      .required(t("Required"))
      .oneOf([Yup.ref("password"), null], t("Passwords must match")),
    address: Yup.string().required(t("Required")),
    birthday: Yup.date()
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
        t("You must be at least 10 years old")
      )
      .required(t("Required")),
    level: Yup.number().required(t("Required")),
    gender: Yup.string().required(t("Required")),
  });

  // send message to the server
  const registerToWebsite = async (values) => {
    let data = JSON.stringify({
      ...values,
      gender: "M" == values.gender,
    });

    setResponseFlag(true);
    await ApiManager.register(data)
      .then((response) => {
        let res = response.data;

        if (res.code == 200 && res.token) {
          setResMessage({
            flag: true,
            message: t("You need to verify your email"),
          });
          setTimeout(() => {
            setToken(res.token);
            setIsRegistered(true);
            navigator("/EmailConfirmOtp", { state: { token: res.token } });
          }, 1000);
        } else {
          setResMessage({
            flag: false,
            message: t("Something went wrong, please try again later"),
          });
        }

        setResponseFlag(false);
      })
      .catch((error) => {
        setResponseFlag(false);
        let res = error.response.data;

        if (res.code && res.code == 400) {
          setResMessage({
            flag: false,
            message: res.errors[0],
          });
        } else {
          setResMessage({
            flag: false,
            message: t("Something went wrong, please try again later"),
          });
        }
      });
  };

  const myFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      parentPhone: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      birthday: "",
      gender: "M",
      level: 6,
    },
    onSubmit: registerToWebsite,
    validationSchema: validationSchemaYup,
  });

  return (
    <section
      className={style.Register + " d-flex align-items-center "}
      id="Register"
      style={{
        minHeight: `calc(100vh - ${parseInt(
          window.getComputedStyle(document.body).paddingTop,
          10
        )}px)`,
      }}
    >
      <form onSubmit={myFormik.handleSubmit} className="container">
        <div className="row">
          <div className={style["heading"] + " my-5"}>
            <h2>
              {t("User_Register")} <span>{t("Register")}</span>
            </h2>
            <p>{t("Register_desc")}</p>
          </div>

          <div className="col-md-6">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="text"
                className="form-control mb-4 "
                id="firstName"
                name="firstName"
                placeholder={t("firstName")}
                onChange={myFormik.handleChange}
                value={myFormik.values.firstName}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="firstName"
              >
                {t("firstName")} <i className="fa-solid fa-user"></i>
              </label>
            </div>
            {myFormik.errors.firstName && myFormik.touched.firstName && (
              <div className="alert alert-danger">
                {myFormik.errors.firstName}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="text"
                className="form-control mb-4"
                id="lastName"
                name="lastName"
                placeholder={t("lastName")}
                onChange={myFormik.handleChange}
                value={myFormik.values.lastName}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="lastName"
              >
                {t("lastName")} <i className="fa-solid fa-user"></i>
              </label>
            </div>
            {myFormik.errors.lastName && myFormik.touched.lastName && (
              <div className="alert alert-danger">
                {myFormik.errors.lastName}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="tel"
                className="form-control mb-4"
                id="phone"
                name="phone"
                placeholder={t("phoneNumber")}
                onChange={myFormik.handleChange}
                value={myFormik.values.phone}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="phone"
              >
                {t("phoneNumber")} <i className="fa-solid fa-phone-volume"></i>
              </label>
            </div>
            {myFormik.errors.phone && myFormik.touched.phone && (
              <div className="alert alert-danger">{myFormik.errors.phone}</div>
            )}
          </div>

          <div className="col-md-6">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="tel"
                className="form-control mb-4"
                id="parentPhone"
                name="parentPhone"
                placeholder={t("parentPhone")}
                onChange={myFormik.handleChange}
                value={myFormik.values.parentPhone}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="parentPhone"
              >
                {t("parentPhone")} <i className="fa-solid fa-phone-volume"></i>
              </label>
            </div>
            {myFormik.errors.parentPhone && myFormik.touched.parentPhone && (
              <div className="alert alert-danger">
                {myFormik.errors.parentPhone}
              </div>
            )}
          </div>
          <div className="col-md-12">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="email"
                className="form-control mb-4"
                id="email"
                name="email"
                placeholder={t("email")}
                onChange={myFormik.handleChange}
                value={myFormik.values.email}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="email"
              >
                {t("email")} <i className="fa-solid fa-envelope"></i>
              </label>
            </div>
            {myFormik.errors.email && myFormik.touched.email && (
              <div className="alert alert-danger">{myFormik.errors.email}</div>
            )}
          </div>
          <div className="col-md-12">
            <div className={"form-floating"}>
              <select
                className={"form-select mb-4 "}
                aria-label="Default select example"
                dir={flagDirection ? "ltr" : "rtl"}
                onChange={myFormik.handleChange}
                value={myFormik.values.level}
                name="level"
                id="level"
              >
                {Object.entries(Level).map(([key, value]) => (
                  <option key={key} value={value}>
                    {t(key.replace("_", " "))}{" "}
                    {/* Replace underscores with spaces for better readability */}
                  </option>
                ))}
              </select>
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="level"
              >
                {t("level")} <i className="fa-solid fa-user-graduate"></i>
              </label>
            </div>
            {myFormik.errors.level && myFormik.touched.level && (
              <div className="alert alert-danger">{myFormik.errors.level}</div>
            )}
          </div>
          <div className="col-md-12">
            <div className="form-floating">
              <select
                id="gender"
                name="gender"
                className="form-select mb-4"
                dir={flagDirection ? "ltr" : "rtl"}
                onChange={myFormik.handleChange}
                value={myFormik.values.gender}
              >
                <option value="M" label={t("Male")} />
                <option value="F" label={t("Female")} />
              </select>
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="gender"
              >
                {t("Gender")} <i className="fa-solid fa-user"></i>
              </label>
            </div>
            {myFormik.errors.gender && myFormik.touched.gender && (
              <div className="alert alert-danger">{myFormik.errors.gender}</div>
            )}
          </div>

          <div className="col-md-6">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="date"
                className="form-control mb-4"
                id="birthday"
                name="birthday"
                placeholder={t("birthday")}
                onChange={myFormik.handleChange}
                value={myFormik.values.birthday}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="birthday"
              >
                {t("birthday")} <i className="fa-solid fa-calendar-days"></i>
              </label>
            </div>
            {myFormik.errors.birthday && myFormik.touched.birthday && (
              <div className="alert alert-danger">
                {myFormik.errors.birthday}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="text"
                className="form-control mb-4"
                id="address"
                name="address"
                placeholder={t("address")}
                onChange={myFormik.handleChange}
                value={myFormik.values.address}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="address"
              >
                {t("address")} <i className="fa-solid fa-location-dot"></i>
              </label>
            </div>
            {myFormik.errors.address && myFormik.touched.address && (
              <div className="alert alert-danger">
                {myFormik.errors.address}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="password"
                className="form-control mb-4"
                id="password"
                name="password"
                placeholder={t("password")}
                onChange={myFormik.handleChange}
                value={myFormik.values.password}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="password"
              >
                {t("password")} <i className="fa-solid fa-lock"></i>
              </label>
            </div>
            {myFormik.errors.password && myFormik.touched.password && (
              <div className="alert alert-danger">
                {myFormik.errors.password}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="password"
                className="form-control mb-4"
                id="confirmPassword"
                name="confirmPassword"
                placeholder={t("confirmPassword")}
                onChange={myFormik.handleChange}
                value={myFormik.values.confirmPassword}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="confirmPassword"
              >
                {t("confirmPassword")} <i className="fa-solid fa-lock"></i>
              </label>
            </div>
            {myFormik.errors.confirmPassword &&
              myFormik.touched.confirmPassword && (
                <div className="alert alert-danger">
                  {myFormik.errors.confirmPassword}
                </div>
              )}
          </div>

          <div className="col-12">
            <button
              type="submit"
              disabled={responseFlag}
              className="btn btn-primary"
            >
              {responseFlag ? (
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                t("Register_btn")
              )}
            </button>

            {resMessage && (
              <div
                className={`my-3 ${
                  resMessage.flag ? "text-success" : "text-danger"
                }`}
              >
                {resMessage.message}
              </div>
            )}

            <p className="my-3">
              {t("have_account")}
              <Link to={"/Login"}> {t("login_now")} </Link>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
}
