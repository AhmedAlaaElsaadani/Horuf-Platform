import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authContext } from "../../Context/authContext";
import { Link, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import FloatingInput from "../Ui/FloatingInput/FloatingInput";

export default function UpdateEmail({ flagDirection }) {
  const { t } = useTranslation();
  const { user, token } = useContext(authContext);
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const navigator = useNavigate();

  const sendEmail = async (email) => {
    setResponseFlag(true);
    try {
      let { data } = await ApiManager.updateEmail(email, token);
      if (data.code === 200) {
        setResMessage({
          flag: true,
          message: t("You need to verify your email"),
        });
        setTimeout(() => {
          navigator("/EmailConfirmOtp", { state: { token: token } });
        }, 2000);
      } else {
        setResMessage({ flag: false, message: data.errors[0] });
      }
    } catch (error) {
      let { data } = error.response;
      if (data.code == 400) {
        setResMessage({ flag: false, message: data.errors[0] });
      } else
        setResMessage({
          flag: false,
          message: t("Something went wrong, please try again later"),
        });
    }
    setResponseFlag(false);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("Invalid email address"))
      .required(t("Required")),
  });
  const myFormik = useFormik({
    initialValues: {
      email: user ? user.email : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      sendEmail(values.email);
    },
  });
  const updateInputs = [
    {
      inputType: "email",
      inputName: "email",
      inputTransition: "email",
      icon: "fa-envelope",
    },
  ];
  return (
    <form
      action=""
      onSubmit={myFormik.handleSubmit}
      className="UpdateEmail container rounded-3 shadow"
    >
      <div className="row ">
        <div className="col-md-12">
          {updateInputs.map((input, index) => (
            <FloatingInput
              key={index}
              idx={index}
              {...input}
              myFormik={myFormik}
              flagDirection={flagDirection}
              t={t}
            />
          ))}
        </div>
        <div className="col-md-12 flex-column align-items-center d-flex">
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
              t("Update Email")
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
        {user && !user?.isVerified && (
          <p className="text-center text-danger">
            {t("You need to verify your email it ")}
            <Link
              to="/EmailConfirmOtp"
              state={{ token: token }}
              onClick={async () => {
                await ApiManager.sendOtp(token);
              }}
            >
              {t("Verify Email Now")}
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
