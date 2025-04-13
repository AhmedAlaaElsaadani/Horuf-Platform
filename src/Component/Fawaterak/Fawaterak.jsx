import React, { useContext, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";
import Swal from "sweetalert2";

const Fawaterak = () => {
  const { packageID } = useParams();
  const { t } = useTranslation();
  const { token } = useContext(authContext);
  const [startPaying, setStartPaying] = useState(true);
  const scriptLoadedRef = useRef(false);

  // Load the Fawaterak plugin script
  useEffect(() => {
    // Prevent multiple script loads
    if (scriptLoadedRef.current) return;

    const script = document.createElement("script");
    script.src =
      "https://app.fawaterk.com/fawaterkPlugin/fawaterkPlugin.min.js";
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
    };
    script.onerror = () => {
      console.error("Failed to load Fawaterak script");
      Swal.fire({
        icon: "error",
        title: t("Error!"),
        text: t("Failed to load payment gateway"),
        showConfirmButton: false,
      });
    };

    document.body.appendChild(script);

    // Cleanup script on unmount
    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [t]);

  const handlePayment = async () => {
    try {
      const { data } = await ApiManager.subscribeWithPayment(token, packageID);
      if (data.success) {
        // Set global config for Fawaterak
        setStartPaying(false);
        window.pluginConfig = {
          envType: data.data.envType,
          hashKey: data.data.hashKey,
          style: {
            listing: "horizontal",
          },
          version: "0",
          requestBody: {
            ...data.data.requestBody,
            redirectionUrls: {
              successUrl: `${window.origin}/payments`,
              failUrl: `${window.origin}/payments`,
              pendingUrl: `${window.origin}/payments`,
            },
          },
          targetDivId: "fawaterkDivId",
        };

        // Trigger checkout
        if (window.fawaterkCheckout) {
          window.fawaterkCheckout(window.pluginConfig);
        } else {
          throw new Error("Fawaterak checkout function not available");
        }
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      let message = t("Something went wrong. Please try again.");
      Swal.fire({
        icon: "error",
        title: t("Error!"),
        text: message,
        showConfirmButton: false,
      });
    }
  };
  const paymentMethods = [
    {
      paymentId: 2,
      nameEn: "Visa-Mastercard",
      nameAr: "فيزا -ماستر كارد",
      redirect: "true",
      logo: "https://staging.fawaterk.com/clients/payment_options/MC_VI_MEpng",
    },
    {
      paymentId: 3,
      nameEn: "Fawry",
      nameAr: "فوري",
      redirect: "false",
      logo: "https://staging.fawaterk.com/clients/payment_options/fawrypng",
    },
    {
      paymentId: 4,
      nameEn: "MobileWallets",
      nameAr: "المحافظ الالكترونية",
      redirect: "false",
      logo: "https://staging.fawaterk.com/clients/payment_options/pay5.png",
    },
  ];

  return (
    <div className="d-flex flex-column align-items-center">
      <h2 className="text-center my-2 text-dark p-2 rounded-2 border-bottom border-primary border-2">
        {t("payAnotherWay")}
      </h2>
      <div className="row w-100 mt-3">
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            className="col-md-4 col-sm-4  d-flex justify-content-center"
          >
            <img src={method.logo} alt={method.nameEn} />
          </div>
        ))}
      </div>
      {startPaying && (
        <div className="m">
          <button
            className="btn btn-outline-info my-5 rounded-circle"
            style={{
              width: "100px",
              height: "100px",
              fontSize: "17px",
            }}
            onClick={handlePayment}
          >
            {t("pay")}
          </button>
        </div>
      )}
      <div id="fawaterkDivId"></div>
    </div>
  );
};

export default Fawaterak;
