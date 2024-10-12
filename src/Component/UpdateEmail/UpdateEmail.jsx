import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authContext } from "../../Context/authContext";
import { useNavigate } from "react-router-dom";

export default function UpdateEmail({ flagDirection }) {
  const { t } = useTranslation();
  const { user, token } = useContext(authContext);
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const navigator = useNavigate();

  useEffect(() => {
    // if user is verified redirect to profile page
    if (user && user.isVerified) {
      //   navigator("/profile");
    }
  }, []);

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
      console.log(values);
    },
  });
  return (
    <form action="" onSubmit={myFormik.handleSubmit} className="UpdateEmail container rounded-3 shadow">
      <div className="row ">
        <div className="col-md-12">
          <div className={"form-floating"}>
            <input
              dir={flagDirection ? "ltr" : "rtl"}
              type="email"
              className="form-control mb-4"
              id="email"
              name="email"
              placeholder={t("email")}
              onChange={myFormik.handleChange}
              value={myFormik.values.email}
            />
            <label
              style={{
                left: flagDirection ? "auto" : "0",
                right: flagDirection ? "0" : "auto",
              }}
              htmlFor="email"
            >
              {t("email")} <i className="fa-solid fa-envelope"></i>
            </label>
          </div>
          {myFormik.errors.email && myFormik.touched.email && (
            <div className="alert alert-danger">{myFormik.errors.email}</div>
          )}
        </div>
        <div className="col-md-12 justify-content-center d-flex">
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
      </div>
    </form>
  );
}
