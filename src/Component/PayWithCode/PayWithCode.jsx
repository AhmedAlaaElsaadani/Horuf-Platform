import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import FloatingInput from "../Ui/FloatingInput/FloatingInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import ApiManager from "../../Utilies/ApiManager";
import { useContext } from "react";
import Swal from "sweetalert2";
import { authContext } from "../../Context/authContext";
import style from "./PayWithCode.module.css";
export default function PayWithCode() {
  const { packageID } = useParams();
  const { t } = useTranslation();
  const { token } = useContext(authContext);
  const navigate = useNavigate();

  const codeInput = {
    inputType: "text",
    inputName: "packageCode",
    inputTransition: "packageCode",
    icon: "fa-money-check",
  };
  const validationSchemaYup = Yup.object().shape({
    packageCode: Yup.string()
      .matches(/^[0-9]*$/, t("paymentError.code must be number"))
      .required(t("Required")),
  });
  const activeSubscription = async (values) => {
    try {
      const { data } = await ApiManager.subscribeWithCode(
        token,
        packageID,
        values.packageCode
      );
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: t("Success"),
          text: t("You have successfully subscribed to this package"),
          showConfirmButton: false,
        });
        navigate("/MyPackages");
      }
    } catch (error) {
      const errorCode = error.response.data.code;
      let message = "";
      switch (errorCode) {
        case 404:
          message = t(
            "paymentError.you already have a valid subscription for this plan"
          );
          break;
        case 400:
          message = t("paymentError.coupon not found");

          break;
        case 429:
          message = t(
            "paymentError.you have reached the maximum number of attempts try again after 1 hour"
          );

          break;
        default:
          message = t("Something went wrong. Please try again.");
          break;
      }
      Swal.fire({
        icon: "error",
        title: t("Error!"),
        text: message,
        showConfirmButton: false,
      });
    }
  };
  const myFormik = useFormik({
    initialValues: {
      packageCode: "",
    },
    onSubmit: activeSubscription,
    validationSchema: validationSchemaYup,
  });

  return (
    <>
      <form
        onSubmit={myFormik.handleSubmit}
        className={"col-md-12  " + style.payWithCode}
      >
        <h2 className="text-center my-2 text-dark p-2 rounded-2 border-bottom border-primary border-2 ">
          {t("codePay")}
        </h2>
        <div className="w-75 my-3">
          <FloatingInput {...codeInput} idx={0} myFormik={myFormik} />
        </div>
        <div className={style.btnContainerForHover}>
          <motion.button
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
            }}
            type="submit"
            className={`btn  ${
              myFormik.values.packageCode.length < 14 ? "disabled" : "btn-info"
            }`}
            // when the code isn't 14 characters long
            disabled={myFormik.values.packageCode.length < 14}
          >
            {t("activeSubscription")}
          </motion.button>
          <p className="text-danger text-center mt-2">
            {t("paymentError.code must be 14 characters")}
          </p>
        </div>
      </form>
      <div className={style.bottomBorder}></div>
    </>
  );
}
