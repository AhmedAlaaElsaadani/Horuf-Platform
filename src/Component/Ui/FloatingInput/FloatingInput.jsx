import { useTranslation } from "react-i18next";
import style from "./FloatingInput.module.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingInput({
  inputType,
  inputName,
  inputTransition,
  myFormik,
  idx,
  icon,
  disabled,
  animationFlag = true,
}) {
  const { t, i18n } = useTranslation();
  const [flagDirection, setFlagDirection] = useState(i18n.language === "en");
  const [showPassword, setShowPassword] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);


  useEffect(() => {
    setFlagDirection(i18n.language === "en");
  }, [i18n.language]);

  // Trigger shake animation when error appears
  useEffect(() => {
    if (myFormik.errors[inputName] && myFormik.touched[inputName]) {
      setShouldShake(true);
      // Reset shake after animation completes
      const timer = setTimeout(() => setShouldShake(false), 600);
      return () => clearTimeout(timer);
    }
  }, [myFormik.errors[inputName], myFormik.touched[inputName], inputName]);

  // Shake animation variants
  const shakeVariants = {
    shake: {
      x: [-10, 10, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    normal: {
      x: 0
    }
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{
          opacity: 1,
          y: 0,
          ...(shouldShake ? shakeVariants.shake : shakeVariants.normal)
        }}
        transition={{
          duration: animationFlag ? 0.5 : 0,
          delay: animationFlag ? 0.4 + idx * 0.1 : 0,
        }}
        className={"form-floating " + style.floating}
        style={{ maxHeight: "65px", position: "relative" }}
      >
        <input
          dir={flagDirection ? "ltr" : "rtl"}
          type={showPassword ? "text" : inputType}
          className={"form-control mt-1 mb-3 " + style.floatingInput}
          id={inputName}
          name={inputName}
          placeholder={t(inputTransition)}
          onChange={myFormik.handleChange}
          value={myFormik.values[inputName]}
          disabled={disabled}
          readOnly={disabled}
        />
        <label
          className={style["FloatingLabel"]}
          htmlFor={inputName}
          style={{
            left: !flagDirection ? "auto" : "0px",
            right: !flagDirection ? "0px" : "auto",
          }}
        >
          <i className={`fa-solid ${icon}`}></i>
          {t(inputTransition)}
        </label>

        {inputType === "password" && (
          <i
            className={`fa-solid ${style.passwordIcon} ${showPassword ? "fa-eye" : "fa-eye-slash"
              } `}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: flagDirection ? "10px" : "auto",
              left: flagDirection ? "auto" : "10px",
              top: "50%",
              transform: "translateY(-1%)",
              cursor: "pointer",
              fontSize: "20px",
            }}
          ></i>
        )}
      </motion.div>

      {myFormik.errors[inputName] && myFormik.touched[inputName] && (
        <div className="px-3 text-danger text-center">
          {myFormik.errors[inputName]}
        </div>
      )}
    </>
  );
}
