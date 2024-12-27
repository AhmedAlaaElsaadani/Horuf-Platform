import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "./WhatsappComponent.css";
import { motion } from "framer-motion";
const WhatsappComponent = () => {
  const { t, i18n } = useTranslation();
  const [flagDirection, setFlagDirection] = useState(i18n.language == "en");

  useEffect(() => {
    setFlagDirection(i18n.language == "en");
  }, [i18n.language]);

  return (
    <>
      <Helmet></Helmet>
      <a
        // href="https://wa.me/message/T4HZAXRBWHYTP1?src=qr"
        target="_blank"
        className={` position-fixed   d-flex WhatsappSocial  justify-content-center align-items-center mb-3 bottom-0  ${
          flagDirection ? " me-3 end-0  " : " ms-3 start-0 "
        }`}
      >
        <div
          className={`text-white mb-5 WhatsappText shadow rounded-5 text-center rounded-3 p-2  
            ${flagDirection ? "me-2" : "ms-2"}`}
          style={{
            right: flagDirection ? "100%" : "auto",
            left: flagDirection ? "auto" : "100%",
          }}
        >
          <p className="m-0">{t("Whatsapp icon message")}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="WhatsappIcon rounded-circle shadow d-flex justify-content-center text-white"
        >
          <i className="fa-brands fa-2x m-2 fa-whatsapp"></i>
        </motion.div>
      </a>
    </>
  );
};

export default WhatsappComponent;
