import React, { useContext, useEffect, useState } from "react";
import style from "./Contact.module.css";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import ApiManager from "../../Utilies/ApiManager";
import { useFormik } from "formik";
import Heading2 from "../../Component/Heading2/Heading2";
import img from "../../assets/Images/Heading2/1.jpeg";
import { motion } from "framer-motion";
import FloatingInput from "../../Component/Ui/FloatingInput/FloatingInput";
import { IsMobileContext } from "../../Context/isMobileContext";
export default function Contact({ flagNotAloneCompounded }) {
  const { t, i18n } = useTranslation();
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const [activeCard, setActiveCard] = useState(0);
  const [flagDirection, setFlagDirection] = useState(i18n.language === "ar");
  const { isMobile } = useContext(IsMobileContext);
  const contactInfo = [
    {
      icon: <i className="fa-solid fa-location-dot"></i>,
      title: "سنورس - الفيوم",
    },
    {
      icon: <i className="fa-solid fa-phone-volume"></i>,
      title: "01206070777",
    },
    {
      icon: <i className="fa-solid fa-envelope"></i>,
      title: "info@hrouf-academy.com",
    },
  ];
  useEffect(() => {
    setFlagDirection(i18n.language === "ar");
  }, [i18n.language]);
  useEffect(() => {
    if (isMobile) {
      const intervalId = setInterval(() => {
        setActiveCard((prevCard) => {
          let nextCard = prevCard === 2 ? 0 : prevCard + 1;
          return nextCard;
        });
      }, 5000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isMobile]);

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
  const contactInputs = [
    {
      inputType: "text",
      inputName: "name",
      inputTransition: "name",
      icon: "fa-user",
    },
    {
      inputType: "email",
      inputName: "email",
      inputTransition: "email",
      icon: "fa-envelope",
    },
    {
      inputType: "tel",
      inputName: "phonNumber",
      inputTransition: "phoneNumber",
      icon: "fa-phone",
    },
  ];

  return (
    <>
      {!flagNotAloneCompounded && (
        <Helmet>
          <meta name="Keywords" content={t("contact_keywords_for_meta")} />
          <meta
            name="description"
            content={t("contact_description_for_meta")}
          />
          <title>{t("contact_title_meta")}</title>
        </Helmet>
      )}
      <section
        id="Contact"
        className={style.Contact}
        style={{
          minHeight: `calc(100vh - ${parseInt(
            window.getComputedStyle(document.body).paddingTop,
            10
          )}px)`,
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
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="col-12 my-3"
            >
              <h3>{t("contact_title")}</h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: i18n.language === "ar" ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="col-md-6  d-flex flex-column px-1 justify-content-center"
            >
              {contactInputs.map((input, index) => (
                <FloatingInput
                  key={index}
                  idx={index}
                  {...input}
                  myFormik={myFormik}
                  flagDirection={flagDirection}
                  t={t}
                />
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: i18n.language === "ar" ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="col-md-6 "
            >
              <div
                className={
                  " h-100 overflow-hidden d-flex flex-column px-1 " +
                  style.message
                }
              >
                <label htmlFor="message" className="form-label ">
                  <i className="fa-solid fa-message"></i>
                  {t("message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  onChange={myFormik.handleChange}
                  className="form-control flex-grow-1 "
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
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={style.info}
        >
          <div className="container">
            <div className="row g-5">
              {isMobile && (
                <div className="col-12 d-flex justify-content-center align-items-center gap-3">
                  {[0, 1, 3].map((_, idx) => (
                    <div
                      onClick={() => setActiveCard(idx)}
                      className={`${style.cardIndex} ${
                        activeCard == idx ? style.active : ""
                      }`}
                    ></div>
                  ))}
                </div>
              )}
              {contactInfo.map((info, idx) => {
                let jsxElement = (
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={idx}
                    className={`col-md-4 `}
                  >
                    <div className={style.info_content + " h-100"}>
                      <div className={style["info_icon"]}>{info.icon}</div>
                      <p className="m-0 ms-2">{info.title}</p>
                    </div>
                  </motion.div>
                );
                if (isMobile) {
                  if (idx === activeCard) {
                    return jsxElement;
                  } else {
                    return null;
                  }
                } else return jsxElement;
              })}
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
