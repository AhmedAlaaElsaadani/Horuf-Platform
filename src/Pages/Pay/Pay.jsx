import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import img from "../../assets/Images/Heading2/1.jpeg";
import Heading2 from "../../Component/Heading2/Heading2";
import Fawaterak from "../../Component/Fawaterak/Fawaterak";
import PayWithCode from "../../Component/PayWithCode/PayWithCode";

export default function Pay() {
  const { packageID } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    if (!packageID) navigate("/packages");
  }, [packageID]);

  const links = [
    {
      title: t("codePay"),
      to: `/pay/${packageID}`,
      active: `/pay/${packageID}`,
    },
    {
      title: t("payAnotherWay"),
      to: `/pay/${packageID}/fawaterk`,
      active: `/pay/${packageID}/fawaterk`,
    },
  ];
  return (
    <section
      id="payment"
      style={{
        minHeight: `calc(100vh - ${parseInt(
          window.getComputedStyle(document.body).paddingTop,
          10
        )}px)`,
      }}
    >
      <Heading2
        img={img}
        headingText={t("payment_title")}
        headingSubText={t("payment_subtitle")}
      />
      <div className="container my-5">
        <div className="row justify-content-center flex-column">
          <PayWithCode />
          <Fawaterak />
        </div>
      </div>
    </section>
  );
}
