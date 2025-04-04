import React, { useContext, useEffect, useState } from "react";
import Heading2 from "../../Component/Heading2/Heading2";
import img from "../../assets/Images/Heading2/1.jpeg";
import { useTranslation } from "react-i18next";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";
import style from "./MyPackages.module.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { linkApiImagesFix } from "../../Utilies/data";
import Spinner from "../../Component/Ui/Spinner/Spinner";

export default function MyPackages() {
  const { t } = useTranslation();
  const { token } = useContext(authContext);
  const [myPackages, setMyPackages] = useState(null);

  const getMyPackages = async () => {
    try {
      const { data } = await ApiManager.getMyPackages(token);
      if (data.success) {
        setMyPackages(data.data);
        console.log(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMyPackages();
  }, []);

  return (
    <section
      style={{
        minHeight: `calc(100vh - ${parseInt(
          window.getComputedStyle(document.body).paddingTop,
          10
        )}px)`,
      }}
    >
      <Heading2 img={img} headingText={t("myPackages")} />
      <div className="container my-3">
        <div className="row">
          {myPackages ? (
            myPackages.length !== 0 ? (
              myPackages.map((packageObject, idx) => (
                <PackageCard
                  key={idx}
                  packageObject={packageObject}
                  idx={idx}
                />
              ))
            ) : (
              <div className="text-center text-white p-3 rounded-5 bg-info">
                <h3 className="text-center">{t("you have no packages yet")}</h3>
              </div>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </section>
  );
}

const PackageCard = ({ packageObject, idx }) => {
  const { t } = useTranslation();
  /**{
    "subscriptionId": "b8cf6039-6b7c-469c-b3d2-782d8286e80e",
    "openTime": "2025-03-22T20:11:27.9362259",
    "closeTime": "2025-04-21T20:11:27.9362705",
    "method": 2,
    "isActive": true,
    "planId": "dbbf43c8-b128-49b7-98f2-29e2a704c80c",
    "planTitle": "الإنجليزية للثانوية العامة",
    "thumbnailUrl": "/static/plans-thumbnails/plan-dbbf43c8-b128-49b7-98f2-29e2a704c80c-VNBU.png"
}*/
  const hrefLink = `/Content/${packageObject.planId}`;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.1 * idx < 1 ? 0.1 * idx : 0.1,
      }}
      key={idx}
      className={"col-sm-12 col-lg-4 col-md-6 " + style["card-container"]}
    >
      <div className="card">
        <Link className={style["card-img"]} to={hrefLink}>
          <img
            src={
              packageObject.thumbnailUrl
                ? linkApiImagesFix + packageObject.thumbnailUrl
                : ""
            }
            className="card-img-top"
            alt={packageObject.title}
            loading="lazy"
            onError={(e) => {
              // e.target.src = errorImage;
              //log error
              console.log("error loading image", e.target.src);
            }}
          />
        </Link>
        <div className="my-2">
          <h5 className="card-title text-center">{packageObject.planTitle}</h5>
          <div className="d-flex flex-column align-items-center mt-2 px-2 w-100">
            <div className="my-2 border border-info rounded-5 p-2 fw-bolder">
              {t("closeDate")}:{" "}
              {new Date(packageObject.closeTime).toLocaleDateString()}
            </div>
            <Link className="btn btn-primary" to={hrefLink}>
              {t("watchTheCourse")}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
