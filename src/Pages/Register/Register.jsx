import React, { useContext, useEffect, useState } from "react";
import style from "./Register.module.css";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";
import FloatingInput from "../../Component/Ui/FloatingInput/FloatingInput";
import PhoneInput from "../../Component/Ui/PhoneInput/PhoneInput";
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
    name: Yup.string().required(t("Required")),
    gender: Yup.boolean().required(t("Required")),
    phone1: Yup.string()
      .required(t("Required")),
    phone2: Yup.string()
      .notOneOf(
        [Yup.ref("phone1")],
        t("Phone number and second phone number must be different")
      ),
    eduSchoolLevel: Yup.number().required(t("Required")),
    email: Yup.string()
      .email(t("Invalid email address"))
      .required(t("Required")),
    password: Yup.string()
      .min(6, t("Password must contain at least 6 characters"))
      .required(t("Required")),
    confirmPassword: Yup.string()
      .required(t("Required"))
      .oneOf([Yup.ref("password"), null], t("Passwords must match")),
  });

  // send message to the server
  const registerToWebsite = async (values) => {
    let data = JSON.stringify({
      name: values.name,
      gender: values.gender,
      phone1: values.phone1,
      phone2: values.phone2,
      eduSchoolLevel: parseInt(values.eduSchoolLevel),
      email: values.email,
      password: values.password,
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
      name: "",
      gender: true, // true for male, false for female
      phone1: "",
      phone2: "",
      eduSchoolLevel: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: registerToWebsite,
    validationSchema: validationSchemaYup,
  });
  const registerInputs = [
    {
      inputType: "text",
      inputName: "name",
      inputTransition: "name",
      icon: "fa-user",
    },
  ];

  const registerPhoneInputs = [
    {
      inputName: "phone1",
      inputTransition: "phoneNumber",
      icon: "fa-phone",
    },
    {
      inputName: "phone2",
      inputTransition: "secondPhoneNumber",
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
      selectName: "eduSchoolLevel",
      translation: "level",
      onChange: myFormik.handleChange,
      selectValue: myFormik.values.eduSchoolLevel,
      icon: "fa-user-graduate",
      error: myFormik.errors.eduSchoolLevel,
      touched: myFormik.touched.eduSchoolLevel,
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
          value: true,
        },
        {
          key: "Female",
          value: false,
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
            <div className="col-md-12">
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
          {registerPhoneInputs.map((phoneInput, index) => (
            <div key={`phone-${index}`} className="col-md-6">
              <PhoneInput
                idx={index + registerInputs.length}
                {...phoneInput}
                myFormik={myFormik}
                initialValue={myFormik.values[phoneInput.inputName]}
                initialCountry="+965"
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
            <div className="col-md-6">
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
