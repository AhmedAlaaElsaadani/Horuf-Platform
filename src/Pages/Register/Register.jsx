import React, { useContext, useEffect, useState } from "react";
import style from "./Register.module.css";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";
import FloatingInput from "../../Component/Ui/FloatingInput/FloatingInput";
import { motion } from "framer-motion";
import SelectElement from "../../Component/Ui/SelectElement/SelectElement";
import { educationLevels, phoneRegax } from "../../Utilies/data";

export default function Register() {
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
    firstName: Yup.string().required(t("Required")),
    lastName: Yup.string().required(t("Required")),
    phone: Yup.string()
      .matches(phoneRegax, t("Phone number is not valid"))
      .required(t("Required")),
    parentPhone: Yup.string()
      .matches(phoneRegax, t("Phone number is not valid"))
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
    birthday: Yup.date().required(t("Required")),
    level: Yup.number().required(t("Required")),
    gender: Yup.string().required(t("Required")),
  });

  // send message to the server
  const registerToWebsite = async (values) => {
    let data = JSON.stringify({
      ...values,
      gender: "M" == values.gender,
      EduSchoolLevel: parseInt(values.level),
    });

    setResponseFlag(true);
    await ApiManager.register(data)
      .then((response) => {
        let res = response.data;
        console.log(res);

        if (res.code == 200) {
          setResMessage({
            flag: true,
            message: t("You need to verify your email"),
          });

          setTimeout(() => {
            setToken(res.token);
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
      level: "",
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
      translation: "level",
      onChange: myFormik.handleChange,
      selectValue: myFormik.values.level,
      icon: "fa-user-graduate",
      error: myFormik.errors.level,
      touched: myFormik.touched.level,
      options: educationLevels,
    },
    {
      selectName: "gender",
      translation: "Gender",
      onChange: myFormik.handleChange,
      selectValue: myFormik.values.gender,
      error: myFormik.errors.gender,
      touched: myFormik.touched.gender,
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
              <SelectElement key={index + 5} idx={index} {...select}
                changeValue={
                  (value) =>
                    myFormik.setFieldValue(select.selectName, value)
                } t={t} />
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
                className={`my-3 ${resMessage.flag ? "text-success" : "text-danger"
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
