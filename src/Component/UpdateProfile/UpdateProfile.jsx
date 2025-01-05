import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authContext } from "../../Context/authContext";
import img from "../../assets/Images/undraw_profile_pic_ic5t.svg";
import ApiManager from "../../Utilies/ApiManager";
import FloatingInput from "../Ui/FloatingInput/FloatingInput";
import FloatingSelect from "../Ui/FloatingSelect/FloatingSelect";
import { useOutletContext } from "react-router-dom";
export default function UpdateProfile() {
  const { t } = useTranslation();
  const { user, token } = useContext(authContext);
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const { flagDirection } = useOutletContext();

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
  const updateInputs = [
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
      icon: "fa-phone-volume",
    },
    {
      inputType: "tel",
      inputName: "parentPhone",
      inputTransition: "parentPhone",
      icon: "fa-phone-volume",
    },
    {
      inputType: "text",
      inputName: "address",
      inputTransition: "address",
      icon: "fa-location-dot",
    },
  ];
  const updateSelect = [
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
    <div action="" className="UpdateProfile container rounded-3  shadow">
      <div className="row justify-content-center">
        <form onSubmit={myFormik.handleSubmit} className="col-md-8">
          {updateInputs.map((input, index) => (
            <div key={index} className="col-md-12">
              <FloatingInput
                idx={index}
                {...input}
                myFormik={myFormik}
                flagDirection={flagDirection}
                t={t}
              />
            </div>
          ))}
          {updateSelect.map((select, index) => (
            <div key={index} className="col-md-12">
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
