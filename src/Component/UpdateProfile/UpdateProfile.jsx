import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authContext } from "../../Context/authContext";
import img from "../../assets/Images/uploadimage.png";
import ApiManager from "../../Utilies/ApiManager";
import FloatingInput from "../Ui/FloatingInput/FloatingInput";
import { useOutletContext } from "react-router-dom";
import { educationLevels, phoneRegax } from "../../Utilies/data";
import SelectElement from "../Ui/SelectElement/SelectElement";
import style from "./UpdateProfile.module.css";
export default function UpdateProfile() {
  const { t } = useTranslation();
  const { user, token } = useContext(authContext);
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const { flagDirection } = useOutletContext();
  const [loadingImageUpdate, setLoadingImageUpdate] = useState(false);
  const [profileImage, setProfileImage] = useState(
    user.image ? user.image : img
  );
  const validationSchema = Yup.object().shape({
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
      eduLevel: parseInt(values.level),
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
    } catch (error) { }
  };
  const myFormik = useFormik({
    initialValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phoneNumber,
      parentPhone: user?.parentPhone,
      address: user?.address,
      level: user?.level,
      gender: user?.gender == "male" ? "M" : "F",
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

  function validateImage(file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const sizeLimit = 5 * 1024 * 1024;
    if (!file) return false;
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: t("Invalid file type. Only JPEG, PNG, and GIF are allowed."),
      });
      return false;
    }
    if (file.size > sizeLimit) {
      Swal.fire({
        icon: "error",
        title: t("File size exceeds the 5MB limit."),
      });
      return false;
    }
    return true;
  }
  const uploadImage = async (file) => {
    if (validateImage(file)) {
      setLoadingImageUpdate(true);
      // Handle the file upload logic here
      const reader = new FileReader();

      try {
        const { data } = await ApiManager.updateImage(token, file);
        if (data?.code == 200) {
          reader.readAsDataURL(file);
          reader.onload = () => setProfileImage(reader.result);
          Swal.fire({
            icon: "success",
            title: t("Success"),
            text: t("Image changed successfully"),
            confirmButtonText: t("Ok"),
          });
          setLoadingImageUpdate(false);
        }
      } catch (error) {
        setLoadingImageUpdate(false);
        Swal.fire({
          icon: "error",
          text: t("Something went wrong, please try again later"),
        });
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    await uploadImage(file);
  };

  return (
    <div action="" className="UpdateProfile container rounded-3  shadow">
      <form
        onSubmit={myFormik.handleSubmit}
        className="row justify-content-center"
      >
        <div className="col-md-8">
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
            <div className="col-md-12">
              <SelectElement key={index + 5} idx={index} {...select} t={t}
                changeValue={
                  (value) =>
                    myFormik.setFieldValue(select.selectName, value)
                } />
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
                className={`my-3 ${resMessage.flag ? "text-success" : "text-danger"
                  }`}
              >
                {resMessage.message}
              </div>
            )}
          </div>
        </div>
        <div className={"col-md-4 " + style["profileImageContainer"]}>
          <div className="row align-items-center h-100">
            <div className="col-md-12">
              <div
                className={`${style.profileImage} mb-3 position-relative  overflow-hidden d-flex justify-content-center align-items-center`}
                style={{
                  backgroundImage: loadingImageUpdate
                    ? "none"
                    : `url(${profileImage})`,
                }}
              >
                {loadingImageUpdate ? (
                  <i className="fa-solid fa-spinner fa-spin fa-spin-plus fs-4 text-warning"></i>
                ) : (
                  <>
                    <div
                      className={
                        style["profileImageLayer"] +
                        " position-absolute top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center "
                      }
                    >
                      <i className="fa-solid fa-pen-to-square fs-3"></i>
                    </div>
                    <input
                      type="file"
                      style={{ opacity: "0", cursor: "pointer" }}
                      className="top-0 w-100 h-100 position-absolute end-0 start-0 bottom-0"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
