import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authContext } from "../../Context/authContext";
import ApiManager from "../../Utilies/ApiManager";

export default function UpdatePassword({ flagDirection }) {
  const { t } = useTranslation();
  const { user, token } = useContext(authContext);
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);

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
  return (
    <form
      action=""
      onSubmit={myFormik.handleSubmit}
      className="UpdatePassword container rounded-3  shadow"
    >
      <div className="row">
        <div className="col-md-12">
          <div className={"form-floating"}>
            <input
              dir={flagDirection ? "ltr" : "rtl"}
              type="password"
              className="form-control mb-4"
              id="prevPassword"
              name="prevPassword"
              placeholder={t("prevPassword")}
              onChange={myFormik.handleChange}
              value={myFormik.values.prevPassword}
            />
            <label
              style={{
                left: flagDirection ? "auto" : "0",
                right: flagDirection ? "0" : "auto",
              }}
              htmlFor="prevPassword"
            >
              {t("prevPassword")} <i className="fa-solid fa-lock"></i>
            </label>
          </div>
          {myFormik.errors.prevPassword && myFormik.touched.prevPassword && (
            <div className="alert alert-danger">
              {myFormik.errors.prevPassword}
            </div>
          )}
        </div>
        <div className="col-md-12">
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
            <div className="alert alert-danger">{myFormik.errors.password}</div>
          )}
        </div>

        <div className="col-md-12">
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
