import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authContext } from "../../Context/authContext";
import ApiManager from "../../Utilies/ApiManager";
import FloatingInput from "../Ui/FloatingInput/FloatingInput";
import { useOutletContext } from "react-router-dom";

export default function UpdatePassword() {
  const { t } = useTranslation();
  const { user, token } = useContext(authContext);
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const {flagDirection} = useOutletContext();

  const validationSchema = Yup.object({
    prevPassword: Yup.string()
      .min(6, t("Password must contain at least 6 characters"))
      .required(t("Required")),

    password: Yup.string()
      .min(6, t("Password must contain at least 6 characters"))
      .required(t("Required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("Passwords must match"))
      .required(t("Required")),
  });
  const updateYourPassword = async (values) => {
    setResponseFlag(true);
    try {
      let { data } = await ApiManager.updatePassword(
        {
          current: values.prevPassword,
          new: values.password,
        },
        token
      );
      if (data.code === 200) {
        setResMessage({
          flag: true,
          message: t("Password updated successfully"),
        });
      } else {
        setResMessage({
          flag: false,
          message: t("Something went wrong, please try again later"),
        });
      }
    } catch (error) {
      setResMessage({
        flag: false,
        message: t("Something went wrong, please try again later"),
      });
    }
    setResponseFlag(false);
  };

  const myFormik = useFormik({
    initialValues: {
      prevPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: updateYourPassword,
  });
  const updateInputs = [
    {
      inputType: "password",
      inputName: "prevPassword",
      inputTransition: "prevPassword",
      icon: "fa-lock",
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
  return (
    <form
      action=""
      onSubmit={myFormik.handleSubmit}
      className="UpdatePassword container rounded-3  shadow"
    >
      <div className="row">
        {updateInputs.map((input, index) => (
          <div className="col-md-12" key={index}>
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
        <div className="col-md-12 align-items-center flex-column d-flex">
          <button
            type="submit"
            className="btn btn-primary my-2"
            onClick={myFormik.handleSubmit}
          >
            {responseFlag ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              t("Update Password")
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
      </div>
    </form>
  );
}
