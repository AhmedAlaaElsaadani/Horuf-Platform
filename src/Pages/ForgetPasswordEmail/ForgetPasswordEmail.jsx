import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import style from "./ForgetPasswordEmail.module.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import * as Yup from "yup";
import FloatingInput from "../../Component/Ui/FloatingInput/FloatingInput";
import { motion } from "framer-motion";

export default function ForgetPasswordEmail() {
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const { t, i18n } = useTranslation();
  const navigator = useNavigate();
  const [flagDirection, setFlagDirection] = useState(false);
  useEffect(() => {
    setFlagDirection(i18n.language === "ar");
  }, [i18n.language]);

  const sendOtpUsingEmail = async (email) => {
    try {
      setResponseFlag(true);
      let { data } = await ApiManager.forgotPasswordSendOtpToEmail(email);
      if (data.code == 200) {
        setResMessage({
          flag: true,
          message: t("OTP has been sent successfully"),
        });
        setTimeout(() => {
          navigator("/forget-password-otp", {
            state: {
              email: email,
              message: t("OTP has been sent successfully"),
            },
          });
        }, 2000);
      }
    } catch (error) {
      let { data } = error.response;
      if (data.code == 400) {
        // otp has been sent before
        setResMessage({ flag: false, message: t("OTP has been sent before") });
        setResponseFlag(false);

        setTimeout(() => {
          navigator("/forget-password-otp", {
            state: {
              email: email,
              message: t("OTP has been sent before"),
            },
          });
        }, 2000);
      } else if (data.code == 401) {
        // invalid email
        setResMessage({ flag: false, message: t("Invalid email") });
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
    email: Yup.string()
      .email(t("Invalid email address"))
      .required(t("Required")),
  });
  const myFormik = useFormik({
    initialValues: { email: "" },
    onSubmit: (values) => {
      sendOtpUsingEmail(values.email);
    },
    validationSchema: validationSchemaYup,
  });
  const forgetInput = [
    {
      inputType: "email",
      inputName: "email",
      inputTransition: "email",
      icon: "fa-envelope",
    },
  ];
  return (
    <section
      className={
        style.ForgetPasswordEmail +
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={style["heading"]}
        >
          {" "}
          <h2 className="text-center py-3">{t("Reset Password")}</h2>
          <p className="text-center">
            {t("Enter your email to receive a verification code")}
          </p>
        </motion.div>
        <form onSubmit={myFormik.handleSubmit} className="my-5" dir="ltr">
          {forgetInput.map((input, index) => (
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
            initial={{ opacity: 0,x:100 }}
            animate={{ opacity: 1,x:0 }}
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
