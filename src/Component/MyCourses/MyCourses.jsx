import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../../Context/authContext";
import { useTranslation } from "react-i18next";
import style from "./MyCourses.module.css";
import { Link, useOutletContext } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import { motion } from "framer-motion";
export default function MyCourses() {
  const { token } = useContext(authContext);
  const { t, i18n } = useTranslation();
  const [directionFlag, setDirectionFlag] = useState(i18n.language === "ar");
  const [lessons, setLessons] = useState(null);
  const erorrImage = "https://via.placeholder.com/150";

  useEffect(() => {
    setDirectionFlag(i18n.language === "ar");
  }, [i18n.language]);
  const getData = async () => {
    try {
      let { data } = await ApiManager.getMyLessons(token);
      setLessons(data);
    } catch (error) {
      setLessons([]);
    }
  };
  const flagDirection = useOutletContext();

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div
        dir={flagDirection?"ltr":"rtl"}
        className={"container overflow-y-auto " + style["my-courses"]}
      >
        <div className="row g-3">
          <div className="col-12 text-center my-3">
            <h3>{t("myCourses-heading")}</h3>
          </div>
          {!lessons ? (
            [1, 2, 3].map((_, idx) => {
              return (
                <div
                  key={idx}
                  className="col-sm-12 col-lg-4  placeholder-glow col-md-6 "
                >
                  <div
                    className={
                      "card position-relative w-100 placeholder " +
                      style["card"]
                    }
                    style={{
                      borderRadius: "0.9375rem",
                      height: "300px",
                      width: "100%",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div
                      className="card-img-top"
                      alt="subject image "
                      style={{
                        filter: "blur(10px)",
                        height: "300px",
                        backgroundColor: "#3482ba",
                      }}
                    />
                    <div
                      className={
                        "card-body position-absolute " + style["card-heading"]
                      }
                      style={{
                        transform: directionFlag
                          ? " translate(0)"
                          : " translate(0%)",
                        borderRadius: directionFlag
                          ? "0.9375rem 0rem 0rem 0.9375rem"
                          : "0rem 0.9375rem 0.9375rem 0rem",
                        right: directionFlag ? "0" : "auto",
                        left: directionFlag ? "auto" : "0",
                      }}
                    >
                      <h5 className="card-title">{t("Loading...")}</h5>
                    </div>
                  </div>
                </div>
              );
            })
          ) : lessons.length == 0 ? (
            <div className="col-12 text-center my-3 rounded-3 bg-warning">
              <p className="fw-bolder fs-2 m-0">{t("no-lessons")}</p>
            </div>
          ) : (
            lessons?.map((lesson, idx) => {
              return (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * idx > 2 ? 0.1 * idx : 0.1,
                  }}
                  key={idx}
                  className="col-sm-12 col-lg-4 col-md-6"
                >
                  <Link to={`/subjects/lessons/${lesson.id}`} >
                    <div className={"card position-relative " + style["card"]}>
                      <img
                        src={lesson.thumbnailUrl ? lesson.thumbnailUrl : ""}
                        className="card-img-top"
                        alt="lesson image "
                        onError={(e) => (e.target.src = erorrImage)}
                        loading="lazy"
                      />
                      <div
                        className={
                          "card-body position-absolute " + style["card-heading"]
                        }
                        style={{
                          transform: directionFlag
                            ? " translate(300%)"
                            : " translate(-300%)",
                          borderRadius: directionFlag
                            ? "0.9375rem 0rem 0rem 0.9375rem"
                            : "0rem 0.9375rem 0.9375rem 0rem",
                          right: directionFlag ? "0" : "auto",
                          left: directionFlag ? "auto" : "0",
                        }}
                      >
                        <h5 className="card-title">{lesson.title}</h5>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
/**
 *
 */
