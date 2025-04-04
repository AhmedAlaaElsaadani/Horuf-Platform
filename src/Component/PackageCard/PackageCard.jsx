import { useTranslation } from "react-i18next";
import style from "./PackageCard.module.css";
import { motion } from "framer-motion";
import { linkApiImagesFix } from "../../Utilies/data";

const PackageCard = ({ packageObject, idx, setPackageId }) => {
  const { t } = useTranslation();
  /**
     * {
        id: "28974f84-b535-4af8-bbe6-f27558c0f87e",
        title: "الباقة البلاتينية في اللغة الإنجليزية",
        teacherName: "إبراهيم عادل",
        price: 600,
        thumbnailUrl:
          "/static/plans-thumbnails/plan-28974f84-b535-4af8-bbe6-f27558c0f87e-DPFW.png",
        subject: "اللغة الإنجليزية",
        level: "Secondary3",
        subscriptionsCount: 1,
        lessonsCount: 5,
      }
     */
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
        <div
          onClick={() => setPackageId(packageObject.id)}
          className={style["card-img"]}
        >
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
          <span>{t("Renew monthly")}</span>
        </div>
        <div className="my-2">
          <h5 className="card-title text-center">{packageObject.subject}</h5>
          <p className="card-text px-3 fs-6 text-center">
            {packageObject.title}
          </p>
          <div
            className={
              "d-flex justify-content-between align-items-center " +
              style["teacher"]
            }
          >
            <span>{packageObject.teacherName}</span>
            <span>{packageObject.level}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2 px-2">
            <button
              className="btn btn-primary"
              onClick={() => setPackageId(packageObject.id)}
            >
              {t("moreDetails")}
            </button>
            <span className="border border-primary px-2 py-1 rounded-3 text-primary">
              {packageObject.price}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
