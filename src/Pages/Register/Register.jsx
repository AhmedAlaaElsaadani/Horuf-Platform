import React, { useContext, useEffect, useState } from "react";
import style from "./Register.module.css";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";
import FloatingInput from "../../Component/Ui/FloatingInput/FloatingInput";
import FloatingSelect from "../../Component/Ui/FloatingSelect/FloatingSelect";
import { motion } from "framer-motion";

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
  const registerInputs = [
    {
      inputType: "text",
      inputName: "firstName",
      inputTransition: "firstName",
      icon: "fa-user",
    },
    {
      inputType: "text",
      inputName: "lastName",
      inputTransition: "lastName",
      icon: "fa-user",
    },
    {
      inputType: "tel",
      inputName: "phone",
      inputTransition: "phoneNumber",
      icon: "fa-phone",
    },
    {
      inputType: "tel",
      inputName: "parentPhone",
      inputTransition: "parentPhone",
      icon: "fa-phone",
    },
  ];
  const registerInputEmail = {
    inputType: "email",
    inputName: "email",
    inputTransition: "email",
    icon: "fa-envelope",
  };
  const registerInputs2 = [
    {
      inputType: "text",
      inputName: "address",
      inputTransition: "address",
      icon: "fa-map-marker",
    },
    {
      inputType: "date",
      inputName: "birthday",
      inputTransition: "birthday",
      icon: "fa-calendar",
    },
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
  const registerSelect = [
    {
      selectName: "level",
      selectTransition: "level",
      icon: "fa-user-graduate",
      options: [
        {
          key: "level 6",
          value: 6,
        },
        {
          key: "level 7",
          value: 7,
        },
        {
          key: "level 8",
          value: 8,
        },
        {
          key: "level 9",
          value: 9,
        },
        {
          key: "level 10",
          value: 10,
        },
        {
          key: "level 11",
          value: 11,
        },
        {
          key: "level 12",
          value: 12,
        },
      ],
    },
    {
      selectName: "gender",
      selectTransition: "Gender",
      icon: "fa-user",
      options: [
        {
          key: "Male",
          value: "M",
        },
        {
          key: "Female",
          value: "F",
        },
      ],
    },
  ];

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className={style["heading"] + " my-5"}
          >
            <h2>
              {t("User_Register")} <span>{t("Register")}</span>
            </h2>
            <p>{t("Register_desc")}</p>
          </motion.div>
          {registerInputs.map((input, index) => (
            <div className="col-md-6">
              <FloatingInput
                key={index}
                idx={index}
                {...input}
                myFormik={myFormik}
                flagDirection={flagDirection}
                t={t}
              />
            </div>
          ))}

          <div className="col-md-12">
            {
              <FloatingInput
                key={0}
                idx={0}
                {...registerInputEmail}
                myFormik={myFormik}
                flagDirection={flagDirection}
                t={t}
              />
            }
          </div>
          {registerSelect.map((select, index) => (
            <div className="col-md-12">
              <FloatingSelect
                key={index}
                idx={index}
                {...select}
                myFormik={myFormik}
                flagDirection={flagDirection}
                t={t}
              />
            </div>
          ))}
          {registerInputs2.map((input, index) => (
            <div className="col-md-6">
              <FloatingInput
                key={index}
                idx={index}
                {...input}
                myFormik={myFormik}
                flagDirection={flagDirection}
                t={t}
              />
            </div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="col-12"
          >
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
          </motion.div>
        </div>
      </form>
    </section>
  );
}
