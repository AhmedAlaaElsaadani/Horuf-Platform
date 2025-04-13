import React, { useState, useRef, useEffect, useContext } from "react";
import { useFormik } from "formik";
import style from "./EmailConfirmOtp.module.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";

export default function EmailConfirmOtp() {
  const otpRefs = useRef([]);
  const [countdown, setCountdown] = useState(90);
  const [canResend, setCanResend] = useState(false);
  const [tokenLocal, setTokenLocal] = useState("");
  const { setToken } = useContext(authContext);
  const [responseFlag, setResponseFlag] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const { t } = useTranslation();
  const location = useLocation();
  const navigator = useNavigate();

  useEffect(() => {
    console.log("tokenLocal", location.state);
    if (location.state && location.state.token) {
      setTokenLocal(location.state.token);
      
    } else {
      navigator("/");
    }

    if (location.state.profileFlag) {
      // that for user who comming from profile page
      sendInitialOtp();
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
      await ApiManager.sendOtp(tokenLocal);
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
      let { data } = await ApiManager.otpConfirm(otp, tokenLocal);
      if (data.code == 200) {
        setResMessage({ flag: true, message: data.message });
        setToken(tokenLocal);
        setTimeout(() => {
          navigator("/");
        }, 2000);
      }
    } catch (error) {
      setResMessage({ flag: false, message: error.response.data.message });
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
        style.EmailConfirmOtp +
        " d-flex justify-content-center align-items-center"
      }
      style={{
        minHeight: `calc(100vh - ${parseInt(
          window.getComputedStyle(document.body).paddingTop,
          10
        )}px)`,
      }}
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
            {t("Please enter the OTP sent to your email address")}
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
