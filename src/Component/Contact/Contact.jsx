import React, { useEffect, useState } from "react";
import style from "./Contact.module.css";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import ApiManager from "../../Utilies/ApiManager";
import * as Yup from "yup";
import { motion } from "framer-motion";
import img from "../../assets/Images/Heading2/2.jpeg";
import Heading2 from "../Heading2/Heading2";

export default function Contact({ flagNotAloneCompounded }) {
  const { t, i18n } = useTranslation();
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const [flagDirection, setFlagDirection] = useState(i18n.language === "ar");

  useEffect(() => {
    setFlagDirection(i18n.language === "ar");
  }, [i18n.language]);

  // validation schema
  const validationSchemaYup = Yup.object().shape({
    name: Yup.string()
      .min(3, t("Must be 3 characters or more"))
      .required(t("Required")),

    email: Yup.string()
      .email(t("Invalid email address"))
      .required(t("Required")),

    phonNumber: Yup.string()
      .matches(
        /^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/,
        t("Phone number is not valid")
      )
      .required(t("Required")),

    message: Yup.string()
      .min(10, t("Must be 10 characters or more"))
      .required(t("Required")),
  });

  // send message to the server
  const sendMessage = async (values) => {
    let data = JSON.stringify({
      Name: values.name,
      Email: values.email,
      Phone: values.phonNumber,
      Message: values.message,
    });

    setResponseFlag(true);
    await ApiManager.contactUs(data)
      .then((response) => {
        console.log(response);
        let res = response.data;

        if (res.code && res.code == 200) {
          setResMessage({
            flag: true,
            message: t("message sent successfully"),
          });
        } else {
          setResMessage({
            flag: false,
            message: t("Something went wrong, please try again later"),
          });
        }

        setResponseFlag(false);
      })
      .catch((error) => {
        console.error("There was an error sending the message!", error);
        setResponseFlag(false);
        setResMessage({
          flag: false,
          message: t("Something went wrong, please try again later"),
        });
      });
  };

  const myFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phonNumber: "",
      message: "",
    },
    onSubmit: sendMessage,
    validationSchema: validationSchemaYup,
  });

  return (
    <section
      id="Contact"
      className={style.Contact}
      style={{
        marginTop: flagNotAloneCompounded ? "0px" : "160px",
      }}
    >
      <Heading2 img={img} headingText={t("Contact Us")} />
      <div className="container">
        <form
          onSubmit={myFormik.handleSubmit}
          className={
            "row  justify-content-between shadow my-3 pt-5 rounded-5 " +
            style.ParentContainer
          }
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-12 my-3"
          >
            <h3>{t("contact_title")}</h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: i18n.language === "ar" ? 100 : -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-md-6  d-flex flex-column justify-content-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="form-floating mb-3"
            >
              <input
                dir={flagDirection ? "rtl" : "ltr"}
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="name"
                onChange={myFormik.handleChange}
                value={myFormik.values.name}
              />
              <label
                htmlFor="name"
                style={{
                  right: flagDirection ? "auto" : "0",
                  left: flagDirection ? "0" : "auto",
                }}
              >
                {t("name")} <i className="fa-solid fa-user"></i>
              </label>
            </motion.div>

            {myFormik.errors.name && myFormik.touched.name && (
              <div className="alert alert-danger">{myFormik.errors.name}</div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="form-floating mb-3"
            >
              <input
                dir={flagDirection ? "rtl" : "ltr"}
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="name@example.com"
                onChange={myFormik.handleChange}
                value={myFormik.values.email}
              />
              <label
                htmlFor="email"
                style={{
                  right: flagDirection ? "auto" : "0",
                  left: flagDirection ? "0" : "auto",
                }}
              >
                {t("email")} <i className="fa-solid fa-envelope"></i>
              </label>
            </motion.div>

            {myFormik.errors.email && myFormik.touched.email && (
              <div className="alert alert-danger">{myFormik.errors.email}</div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.13 }}
              className="form-floating"
            >
              <input
                dir={flagDirection ? "rtl" : "ltr"}
                type="tel"
                className="form-control mb-3"
                id="phonNumber"
                name="phonNumber"
                placeholder="phoneNumber"
                onChange={myFormik.handleChange}
                value={myFormik.values.phonNumber}
              />
              <label
                htmlFor="phonNumber"
                style={{
                  right: flagDirection ? "auto" : "0",
                  left: flagDirection ? "0" : "auto",
                }}
              >
                {t("phoneNumber")} <i className="fa-solid fa-phone-volume"></i>
              </label>
            </motion.div>

            {myFormik.errors.phonNumber && myFormik.touched.phonNumber && (
              <div className="alert alert-danger">
                {myFormik.errors.phonNumber}
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: i18n.language === "ar" ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-md-6 "
          >
            <div className=" h-100 overflow-hidden d-flex flex-column ">
              <label htmlFor="message" className="form-label ">
                {t("message")} <i className="fa-solid fa-message"></i>
              </label>
              <textarea
                id="message"
                name="message"
                onChange={myFormik.handleChange}
                className="form-control flex-grow-1 mb-3"
                placeholder={t("contact_message_placeholder")}
                value={myFormik.values.message}
                style={{
                  minHeight: "100px",
                }}
              ></textarea>
              {myFormik.errors.message && myFormik.touched.message && (
                <div className="alert w-100  alert-danger">
                  {myFormik.errors.message}
                </div>
              )}
            </div>
          </motion.div>
          <div className="col-12 my-3 d-flex justify-content-center flex-column">
            <button type="submit" className="btn m-auto btn-primary">
              {
                <span>
                  {responseFlag ? (
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    t("contact_send")
                  )}
                </span>
              }
            </button>
            {resMessage != null ? (
              <div
                className={
                  "alert text-center mt-2 " +
                  (resMessage.flag ? "alert-success" : "alert-danger")
                }
              >
                {resMessage.message}
              </div>
            ) : (
              ""
            )}
          </div>
        </form>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={"row shadow " + style.info}
        ></motion.div>
      </div>
    </section>
  );
}
