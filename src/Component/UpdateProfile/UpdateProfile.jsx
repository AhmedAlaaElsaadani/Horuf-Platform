import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authContext } from "../../Context/authContext";
import img from "../../assets/Images/undraw_profile_pic_ic5t.svg";
export default function UpdateProfile({ flagDirection }) {
  const { t } = useTranslation();
  const { user, token } = useContext(authContext);
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const Level = {
    level_6: 6,
    level_7: 7,
    level_8: 8,
    level_9: 9,
    level_10: 10,
    level_11: 11,
    level_12: 12,
  };
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
  const myFormik = useFormik({
    initialValues: {
      prevPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <form
      action=""
      onSubmit={myFormik.handleSubmit}
      className="UpdateProfile container rounded-3  shadow"
    >
      <div className="row">
        <div className="col-md-8">
          <div className="col-md-12">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="text"
                className="form-control mb-4 "
                id="firstName"
                name="firstName"
                placeholder={t("firstName")}
                onChange={myFormik.handleChange}
                onBlur={myFormik.handleBlur}
                value={myFormik.values.firstName}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="firstName"
              >
                {t("firstName")} <i className="fa-solid fa-user"></i>
              </label>
            </div>
            {myFormik.errors.firstName && myFormik.touched.firstName && (
              <div className="alert alert-danger">
                {myFormik.errors.firstName}
              </div>
            )}
          </div>

          <div className="col-md-12">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="text"
                className="form-control mb-4"
                id="lastName"
                name="lastName"
                placeholder={t("lastName")}
                onChange={myFormik.handleChange}
                onBlur={myFormik.handleBlur}
                value={myFormik.values.lastName}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="lastName"
              >
                {t("lastName")} <i className="fa-solid fa-user"></i>
              </label>
            </div>
            {myFormik.errors.lastName && myFormik.touched.lastName && (
              <div className="alert alert-danger">
                {myFormik.errors.lastName}
              </div>
            )}
          </div>

          <div className="col-md-12">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="tel"
                className="form-control mb-4"
                id="phone"
                name="phone"
                placeholder={t("phoneNumber")}
                onChange={myFormik.handleChange}
                onBlur={myFormik.handleBlur}
                value={myFormik.values.phone}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="phone"
              >
                {t("phoneNumber")} <i className="fa-solid fa-phone-volume"></i>
              </label>
            </div>
            {myFormik.errors.phone && myFormik.touched.phone && (
              <div className="alert alert-danger">{myFormik.errors.phone}</div>
            )}
          </div>

          <div className="col-md-12">
            <div className={"form-floating"}>
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="tel"
                className="form-control mb-4"
                id="parentPhone"
                name="parentPhone"
                placeholder={t("parentPhone")}
                onChange={myFormik.handleChange}
                onBlur={myFormik.handleBlur}
                value={myFormik.values.parentPhone}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="parentPhone"
              >
                {t("parentPhone")} <i className="fa-solid fa-phone-volume"></i>
              </label>
            </div>
            {myFormik.errors.parentPhone && myFormik.touched.parentPhone && (
              <div className="alert alert-danger">
                {myFormik.errors.parentPhone}
              </div>
            )}
          </div>
          <div className="col-md-12">
            <div className={"form-floating"}>
              <select
                className={"form-select mb-4 "}
                aria-label="Default select example"
                dir={flagDirection ? "ltr" : "rtl"}
                onChange={myFormik.handleChange}
                onBlur={myFormik.handleBlur}
                value={myFormik.values.level}
                name="level"
                id="level"
              >
                {Object.entries(Level).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key.replace("_", " ")}{" "}
                    {/* Replace underscores with spaces for better readability */}
                  </option>
                ))}
              </select>
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="level"
              >
                {t("level")} <i className="fa-solid fa-user-graduate"></i>
              </label>
            </div>
            {myFormik.errors.level && myFormik.touched.level && (
              <div className="alert alert-danger">{myFormik.errors.level}</div>
            )}
          </div>

          <div className="col-md-12">
            <div className="form-floating">
              <select
                id="gender"
                name="gender"
                className="form-select mb-4"
                dir={flagDirection ? "ltr" : "rtl"}
                onChange={myFormik.handleChange}
                onBlur={myFormik.handleBlur}
                value={myFormik.values.gender}
              >
                <option value="M" label={t("Male")} />
                <option value="F" label={t("Female")} />
              </select>
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="gender"
              >
                {t("Gender")} <i className="fa-solid fa-user"></i>
              </label>
            </div>
            {myFormik.errors.gender && myFormik.touched.gender && (
              <div className="alert alert-danger">{myFormik.errors.gender}</div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="row align-items-center h-100">
            <div className="col-md-12">
              <div className="containerImg bg-white rounded-2 ">
                <img
                  src={img}
                  alt="profile Image"
                  className="w-100 p-1 h-100 object-fit-cover"
                />
              </div>
              {/* upload image */}
              <div className="form-group mt-3">
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  accept="image/*"
                />
              </div>
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
        </div>
      </div>
    </form>
  );
}
