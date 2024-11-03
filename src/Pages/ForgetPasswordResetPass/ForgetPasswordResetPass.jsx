import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import style from "./ForgetPasswordResetPass.module.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import * as Yup from "yup";
import FloatingInput from "../../Component/Ui/FloatingInput/FloatingInput";
import { motion } from "framer-motion";

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
    if (location.state && location.state.token) {
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
  const forgetPasswordResetPassInputs = [
    {
      inputType: "password",
      inputName: "password",
      inputTransition: "password",
      icon: "fa-lock",
    },
    {
      inputType: "password",
      inputName: "confirmPassword",
      inputTransition: "confirmPassword",
      icon: "fa-lock",
    },
  ];
  return (
    <section
      className={
        style.ForgetPasswordResetPass +
        " d-flex justify-content-center align-items-center"
      }
      style={{
        minHeight: `calc(100vh - ${parseInt(
          window.getComputedStyle(document.body).paddingTop,
          10
        )}px)`,
      }}
    >
      <div
        className={
          "container shadow rounded-4 border p-3 " + style["parentContainer"]
        }
      >
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={style["heading"]}
        >
          {" "}
          <h2 className="text-center py-3">{t("Reset Password")}</h2>
          <p className="text-center">
            {t("Enter your new password to reset your password")}
          </p>
        </motion.div>
        <form onSubmit={myFormik.handleSubmit} className="my-5" dir="ltr">
          {forgetPasswordResetPassInputs.map((input, index) => (
            <FloatingInput
              key={index}
              idx={index}
              {...input}
              myFormik={myFormik}
              flagDirection={flagDirection}
              t={t}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
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
          </motion.div>
        </form>
      </div>
    </section>
  );
}
