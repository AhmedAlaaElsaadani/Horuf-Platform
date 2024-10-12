import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import style from "./ForgetPasswordConfirmOtp.module.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";

export default function ForgetPasswordConfirmOtp() {
  const otpRefs = useRef([]);
  const [countdown, setCountdown] = useState(90);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState("");
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const { t } = useTranslation();
  const location = useLocation();
  const navigator = useNavigate();

  useEffect(() => {
    if (location.state&&location.state.email) {
        setEmail(location.state.email);
    } else {
      navigator("/");
    }
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendInitialOtp = async () => {
    try {
      await ApiManager.forgotPasswordSendOtpToEmail(email);
    } catch (error) {}
  };

  const resendOtp = async () => {
    setCanResend(false);
    setCountdown(90); // Reset the countdown
    await sendInitialOtp();
  };
  const confirmOtp = async (otp) => {
    try {
      setResponseFlag(true);
      let { data } = await ApiManager.confirmOtpForResetPassword(otp, email);
      if (data.code == 200) {
        setResMessage({ flag: true, message: t("OTP has been confirmed") });
        setTimeout(() => {
          navigator("/forget-password-reset", {
            state: { email: email, token: data.token },
          });
        }, 2000);
      }
    } catch (error) {
      let { data } = error.response;
      if (data.code == 400) {
        setResMessage({ flag: false, message: t("Invalid OTP") });
      } else {
        setResMessage({
          flag: false,
          message: t("Something went wrong, please try again later"),
        });
      }
      setResponseFlag(false);
    }
  };

  const myFormik = useFormik({
    initialValues: { otp: ["", "", "", "", "", ""] },
    onSubmit: (values) => {
      confirmOtp(values.otp.join(""));
    },
    validate: (values) => {
      const errors = {};
      if (values.otp.some((value) => value === "")) {
        errors.otp = t("OTP is required");
      }
      if (values.otp.some((value) => !/^[0-9]$/.test(value))) {
        errors.otp = t("Invalid OTP");
      }
      return errors;
    },
  });

  // handle change function for individual OTP input
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      // Allow only a single digit
      const otp = [...myFormik.values.otp];
      otp[index] = value;
      myFormik.setFieldValue("otp", otp);

      // Move to the next input field
      if (index < 5) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  // handle paste function
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    //create array with the first 6 Numbers of the pasted data and don't allow characters
    const pasteArray = pasteData
      .split("")
      .filter((char) => /^[0-9]$/.test(char));
    const otp = [...myFormik.values.otp];
    pasteArray.forEach((char, index) => {
      otp[index] = char;
    });
    myFormik.setFieldValue("otp", otp);
    // Focus the last input
    otpRefs.current[5].focus();
  };

  // handle backspace for navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (myFormik.values.otp[index] === "") {
        if (index > 0) {
          otpRefs.current[index - 1].focus();
        }
      } else {
        const otp = [...myFormik.values.otp];
        otp[index] = "";
        myFormik.setFieldValue("otp", otp);
      }
    }
  };
  return (
    <section
      className={
        style.ForgetPasswordConfirmOtp +
        " d-flex justify-content-center align-items-center"
      }
    >
      <div
        className={
          "container shadow rounded-4 border p-3 " + style["parentContainer"]
        }
      >
        <div className={style["heading"]}>
          {" "}
          <h2 className="text-center py-3">{t("Email Confirmation OTP")}</h2>
          <p className="text-center">
            {t(  "Enter your email to receive a verification code")}
          </p>
        </div>
        <form onSubmit={myFormik.handleSubmit} className="my-5" dir="ltr">
          <div
            className="mb-3 d-flex justify-content-center"
            onPaste={handlePaste}
          >
            {myFormik.values.otp.map((_, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                maxLength="1"
                className="form-control text-center mx-1"
                value={myFormik.values.otp[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          {myFormik.errors.otp && myFormik.touched.otp && (
            <div className=" alert alert-danger text-center">
              {myFormik.errors.otp}
            </div>
          )}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary "
              disabled={responseFlag}
            >
              {responseFlag ? (
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                t("Submit OTP")
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

            <div className="mt-3">
              {canResend ? (
                <button onClick={resendOtp} className="btn btn-secondary">
                  {t(" Resend OTP")}
                </button>
              ) : (
                <span>
                  {t("Please wait")} {countdown} {t("seconds to resend")}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
