import React, { useContext, useRef, useState } from "react";
import style from "./PackageDetails.module.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";
import Spinner from "../Ui/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function PackageDetails({ packageId, closeModal }) {
  const { t } = useTranslation();
  const [packageDetails, setPackageDetails] = useState(null);
  const { token, isRegistered } = useContext(authContext);
  const containerElement = useRef();
  const navigate = useNavigate();
  const getPackageDetails = async () => {
    // get package details from api
    try {
      const { data } = await ApiManager.getPackageDetails(packageId, token);
      if (data.success) {
        setPackageDetails(data.data);
        setRealPrice(data.data.price);
      }
    } catch (error) {}
  };
  useEffect(() => {
    // get package details from api
    getPackageDetails();
    // close modal when click on any place
    const handleClickOutside = (event) => {
      if (
        containerElement.current &&
        !containerElement.current.contains(event.target)
      ) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const subscribe = async (packageDetailsId) => {
    if (isRegistered) {
      navigate("/pay/" + packageDetailsId);
    } else {
      Swal.fire({
        title: t("you must login first"),
        icon: "warning",
        confirmButtonText: t("OK"),
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };
  //  {
  //   units: [
  //     {
  //       id: 24,
  //       title: "الإنجليزية للثانوية العامة",
  //       description: "وصف الإنجليزية للثانوية العامة",
  //       videos: [
  //         {
  //           id: 6,
  //           title: "خطة العمل",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 7,
  //           title: "الدرس الأول",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 8,
  //           title: "الدرس الثاني",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 9,
  //           title: "الدرس الثالث",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 10,
  //           title: "الدرس الرابع",
  //           description: null,
  //           videoUrl: null,
  //         },
  //       ],
  //     },
  //     {
  //       id: 24,
  //       title: "الإنجليزية للثانوية العامة",
  //       description: "وصف الإنجليزية للثانوية العامة",
  //       videos: [
  //         {
  //           id: 6,
  //           title: "خطة العمل",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 7,
  //           title: "الدرس الأول",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 8,
  //           title: "الدرس الثاني",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 9,
  //           title: "الدرس الثالث",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 10,
  //           title: "الدرس الرابع",
  //           description: null,
  //           videoUrl: null,
  //         },
  //       ],
  //     },
  //     {
  //       id: 24,
  //       title: "الإنجليزية للثانوية العامة",
  //       description: "وصف الإنجليزية للثانوية العامة",
  //       videos: [
  //         {
  //           id: 6,
  //           title: "خطة العمل",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 7,
  //           title: "الدرس الأول",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 8,
  //           title: "الدرس الثاني",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 9,
  //           title: "الدرس الثالث",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 10,
  //           title: "الدرس الرابع",
  //           description: null,
  //           videoUrl: null,
  //         },
  //       ],
  //     },
  //     {
  //       id: 24,
  //       title: "الإنجليزية للثانوية العامة",
  //       description: "وصف الإنجليزية للثانوية العامة",
  //       videos: [
  //         {
  //           id: 6,
  //           title: "خطة العمل",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 7,
  //           title: "الدرس الأول",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 8,
  //           title: "الدرس الثاني",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 9,
  //           title: "الدرس الثالث",
  //           description: null,
  //           videoUrl: null,
  //         },
  //         {
  //           id: 10,
  //           title: "الدرس الرابع",
  //           description: null,
  //           videoUrl: null,
  //         },
  //       ],
  //     },
  //   ],
  //   id: "28974f84-b535-4af8-bbe6-f27558c0f87e",
  //   title: "الباقة البلاتينية في اللغة الإنجليزية",
  //   teacherName: "إبراهيم عادل",
  //   price: 600,
  //   thumbnailUrl:
  //     "/static/plans-thumbnails/plan-28974f84-b535-4af8-bbe6-f27558c0f87e-DPFW.png",
  //   subject: "اللغة الإنجليزية",
  //   level: "Secondary3",
  //   subscriptionsCount: 0,
  //   lessonsCount: 0,
  // };
  return (
    <div className={style.packageDetails}>
      {packageDetails ? (
        <div className="container d-flex justify-content-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={"row " + style["package-container"]}
            ref={containerElement}
          >
            <div className="col-md-12">
              <button
                className="btn btn-danger rounded-circle  fs-bolder"
                onClick={closeModal}
              >
                X
              </button>
            </div>
            <h2>{packageDetails.title}</h2>
            <div className={"col-md-7  " + style["textContainer"]}>
              {/* <p>{packageDetails.description}</p> */}
              <div>
                <div>
                  <h3 className="text-dark fw-bolder">{t("units")}</h3>
                  <div className="accordion" id="unitAccordion">
                    {packageDetails.units.map((unit, idx) => (
                      <div className="accordion-item border-0" key={idx}>
                        <div className={`${style.unit} `}>
                          <h3 className="accordion-header">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#unit${idx}`}
                              aria-expanded="true"
                              aria-controls={`unit${idx}`}
                            >
                              <span>{idx + 1}:</span> {unit.title}
                            </button>
                          </h3>
                        </div>
                        <div
                          id={`unit${idx}`}
                          className="accordion-collapse collapse"
                          data-bs-parent="#unitAccordion"
                        >
                          <div className="accordion-body">
                            {unit.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className={`d-flex justify-content-between align-items-center ${style.teacher}`}
                  >
                    <span>
                      {t("teacher")}: {packageDetails.teacherName}
                    </span>
                    <span>{packageDetails.level}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 d-flex justify-content-start flex-column ">
              <div className={style["imageWrapper"]}>
                <img
                  src={packageDetails.thumbnailUrl}
                  alt={packageDetails.title}
                />
                <span>{packageDetails.price} EGP</span>
              </div>
              <div className="d-flex justify-content-center gap-3 align-items-center mt-2 px-4">
                {packageDetails.isSubscribed ? (
                  <Link
                    className="btn btn-outline-primary w-100"
                    to={"/content/" + packageDetails.id}
                  >
                    {t("watchTheCourse")}
                  </Link>
                ) : (
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => subscribe(packageDetails.id)}
                  >
                    {t("subscribe")}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <Spinner sectionFlag={false} />
      )}
    </div>
  );
}
