import React, { useContext, useEffect, useState } from "react";
import style from "./Login.module.css";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";

export default function Login() {
  const { t, i18n } = useTranslation();
  const [flagDirection, setFlagDirection] = useState(i18n.language === "ar");
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const { setToken } = useContext(authContext);
  let navigator = useNavigate();

  useEffect(() => {
    setFlagDirection(i18n.language === "ar");
  }, [i18n.language]);

  const validationSchemaYup = Yup.object().shape({
    // validation for email or phone
    emailOrPhone: Yup.string()
      .test(
        "emailOrPhone",
        t("Please provide a valid email or phone number"),
        function (value) {
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
          const phoneRegex = /^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      )
      .required(t("Required")),
    password: Yup.string()
      .min(6, t("Password must contain at least 6 characters"))
      .required(t("Required")),
  });

  // send message to the server
  const loginToWebsite = async (values) => {
    let data = JSON.stringify({
      emailOrPhone: values.emailOrPhone,
      password: values.password,
      remember: true,
    });

    setResponseFlag(true);
    await ApiManager.login(data)
      .then((response) => {
        let res = response.data;
        console.log(res);

        if (!res.code && res.token) {
          if (res.isVerified) {
            setResMessage({ flag: true, message: t("Login successfully") });

            setTimeout(() => {
              setToken(res.token);
              navigator("/");
            }, 1000);
          } else {
            setResMessage({
              flag: false,
              message: t("You need to verify your email"),
            });
            setTimeout(() => {
              setToken(res.token);
              navigator("/EmailConfirmOtp", { state: { token: res.token } });
            }, 2000);
          }
        } else {
          setResMessage({
            flag: false,
            message: t("Something went wrong, please try again later"),
          });
        }

        setResponseFlag(false);
      })
      .catch((error) => {
        console.error("There was an error sending the message!", error);
        setResponseFlag(false);
        let res = error.response.data;
        if (res.code && res.code == 400) {
          setResMessage({
            flag: false,
            message: t("Invalid email or password"),
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
      emailOrPhone: "",
      password: "",
    },
    onSubmit: loginToWebsite,
    validationSchema: validationSchemaYup,
  });

  return (
    <section className={style.Login + " d-flex align-items-center "} id="Login">
      <form
        onSubmit={myFormik.handleSubmit} // Changed from submitForm to handleSubmit
        className="container d-flex flex-column"
      >
        <div className={style["heading"] + " my-5"}>
          <h2>
            {t("User")} <span>{t("Login")}</span>
          </h2>
          <p>{t("Login_desc")}</p>
        </div>

        <div className={style["inputContainer"] + " mb-3"}>
          <div className={"form-floating"}>
            <input
              dir={flagDirection ? "ltr" : "rtl"}
              type="text" //
              className="form-control mb-3"
              id="emailOrPhone"
              name="emailOrPhone"
              placeholder="name@example.com"
              onChange={myFormik.handleChange}
              onBlur={myFormik.handleBlur}
              value={myFormik.values.emailOrPhone}
            />
            <label
              htmlFor="emailOrPhone"
              style={{
                left: flagDirection ? "auto" : "0",
                right: flagDirection ? "0" : "auto",
              }}
            >
              {t("emailOrPhone")} <i className="fa-solid fa-envelope"></i>
            </label>
          </div>

          {myFormik.errors.emailOrPhone && myFormik.touched.emailOrPhone && (
            <div className="alert alert-danger">
              {myFormik.errors.emailOrPhone}
            </div>
          )}
        </div>

        <div className={style["inputContainer"] + " mb-5"}>
          <div className={"form-floating"}>
            <input
              dir={flagDirection ? "ltr" : "rtl"}
              type="password"
              className="form-control mb-3 "
              id="password"
              name="password"
              placeholder="Password"
              onChange={myFormik.handleChange}
              onBlur={myFormik.handleBlur}
              value={myFormik.values.password}
            />
            <label
              htmlFor="password"
              style={{
                left: flagDirection ? "auto" : "0",
                right: flagDirection ? "0" : "auto",
              }}
            >
              {t("password")} <i className="fa-solid fa-lock"></i>{" "}
            </label>
          </div>

          {myFormik.errors.password && myFormik.touched.password && (
            <div className="alert alert-danger">{myFormik.errors.password}</div>
          )}
        </div>

        <button type="submit" disabled={responseFlag} className="btn object-fit-contain btn-primary">
          <span>
            {responseFlag ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              t("Login_btn")
            )}
          </span>
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
          {t("donot_have_account")}
          <Link to={"/Register"}> {t("create_account")} </Link>
        </p>
        <Link className="lead" to={"/forget-password-email"}>
          {t("Login_forget_password")}
        </Link>
      </form>
    </section>
  );
}
