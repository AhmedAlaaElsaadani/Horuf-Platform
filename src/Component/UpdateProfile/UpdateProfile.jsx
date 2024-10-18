import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authContext } from "../../Context/authContext";
import img from "../../assets/Images/undraw_profile_pic_ic5t.svg";
import ApiManager from "../../Utilies/ApiManager";
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
  const validationSchema = Yup.object().shape({
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
    level: Yup.number().required(t("Required")),
    gender: Yup.string().required(t("Required")),
    address: Yup.string().required(t("Required")),
  });
  const sendData = async (values) => {
    setResponseFlag(true);
    let user = JSON.stringify({
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      parentPhone: values.parentPhone,
      level: values.level,
      address: values.address,
      gender: values.gender == "M",
    });

    try {
      await ApiManager.updateProfile(user, token)
        .then((response) => {
          let res = response.data;
          if (res.code && res.code == 200) {
            setResMessage({
              flag: true,
              message: t("Profile updated successfully"),
            });
            setResponseFlag(false);
          } else {
            setResMessage({ flag: false, message: res.errors[0] });
            setResponseFlag(false);
          }
        })
        .catch((error) => {
          let { data } = error.response;
          if (data.code == 400) {
            setResMessage({ flag: false, message: data.errors[0] });
          } else
            setResMessage({
              flag: false,
              message: t("Something went wrong, please try again later"),
            });
          setResponseFlag(false);
        });
    } catch (error) {}
  };
  const myFormik = useFormik({
    initialValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phoneNumber,
      parentPhone: user?.parentPhone,
      address: user?.address,
      level: user?.level,
      gender: user?.gender ? "M" : "F",
    },
    validationSchema: validationSchema,
    onSubmit: sendData,
  });
  return (
    <div action="" className="UpdateProfile container rounded-3  shadow">
      <div className="row justify-content-center">
        <form onSubmit={myFormik.handleSubmit} className="col-md-8">
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
              <input
                dir={flagDirection ? "ltr" : "rtl"}
                type="text"
                className="form-control mb-4"
                id="address"
                name="address"
                placeholder={t("address")}
                onChange={myFormik.handleChange}
                value={myFormik.values.address}
              />
              <label
                style={{
                  left: flagDirection ? "auto" : "0",
                  right: flagDirection ? "0" : "auto",
                }}
                htmlFor="address"
              >
                {t("address")} <i className="fa-solid fa-location-dot"></i>
              </label>
            </div>
            {myFormik.errors.address && myFormik.touched.address && (
              <div className="alert alert-danger">
                {myFormik.errors.address}
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
                value={myFormik.values.level}
                name="level"
                id="level"
              >
                {Object.entries(Level).map(([key, value]) => (
                  <option key={key} value={value}>
                    {t(key.replace("_", " "))}
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
                t("Update Profile")
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
        </form>
        <form className="col-md-4 d-none">
          <div className="row align-items-center ">
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
              <button type="submit" className="btn btn-primary my-2">
                {responseFlag ? (
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  t("Update Profile")
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
      </div>
    </div>
  );
}
