import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import style from "./ForgetPasswordResetPass.module.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import * as Yup from "yup";

export default function ForgetPasswordResetPass() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigator = useNavigate();
  const [flagDirection, setFlagDirection] = useState(false);
  useEffect(() => {
    setFlagDirection(i18n.language === "ar");   
  }, [i18n.language]);

  useEffect(() => {
    if (location.state&&location.state.token) {
      setToken(location.state.token);
      setEmail(location.state.email);
    } else {
      navigator("/");
    }
  }, []);
  const resetPassword = async (newPassword) => {
    try {
      setResponseFlag(true);
      let { data } = await ApiManager.resetPassword(email, newPassword, token);
      if (data.code == 200) {
        setResMessage({
          flag: true,
          message: t("Password has been reset successfully"),
        });
        setTimeout(() => {
          navigator("/");
        }, 3000);
      }
    } catch (error) {
      let { data } = error.response;
      if (data.code == 400) {
        // otp has been sent before
        setResMessage({
          flag: false,
          message: t(
            "Please retake the previous steps because the session is off"
          ),
        });
        setResponseFlag(false);
      } else {
        setResMessage({
          flag: false,
          message: t("Something went wrong, please try again later"),
        });
        setResponseFlag(false);
      }
    }
  };

  const validationSchemaYup = Yup.object({
    password: Yup.string()
      .min(6, t("Password must contain at least 6 characters"))

      .required(t("Required")),
    confirmPassword: Yup.string()
      .required(t("Required"))
      .oneOf([Yup.ref("password"), null], t("Passwords must match")),
  });
  const myFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      resetPassword(values.password);
    },
    validationSchema: validationSchemaYup,
  });
  return (
    <section
      className={
        style.ForgetPasswordResetPass +
        " d-flex justify-content-center align-items-center"
      }
    >
      <div
        className={
          "container shadow rounded-4 border p-3 " + style["parentContainer"]
        }
      >
        <div className={style["heading"]}>
          {" "}
          <h2 className="text-center py-3">{t("Reset Password")}</h2>
          <p className="text-center">
            {t("Enter your new password to reset your password")}
          </p>
        </div>
        <form onSubmit={myFormik.handleSubmit} className="my-5" dir="ltr">
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
            {myFormik.errors.password && myFormik.touched.password && (
              <div className="alert alert-danger">
                {myFormik.errors.password}
              </div>
            )}
          </div>

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

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary "
              disabled={responseFlag}
            >
              {responseFlag ? (
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                t("Submit OTP")
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
          </div>
        </form>
      </div>
    </section>
  );
}
