import React, { useEffect, useState } from "react";
import style from "./Subjects.module.css";
import erorrImage from "../../assets/Images/Subjects/subject.jpeg";
import { useTranslation } from "react-i18next";
import ApiManager from "../../Utilies/ApiManager";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const { t, i18n } = useTranslation();
  const [levelID, setLevelID] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [directionFlag, setDirectionFlag] = useState(i18n.language === "ar");
  const Level = {
    level_6: 6,
    level_7: 7,
    level_8: 8,
    level_9: 9,
    level_10: 10,
    level_11: 11,
    level_12: 12,
  };
  const { setLinks, links } = useOutletContext(); // Receiving data from parent
  // get data from api
  const getData = async (levelID) => {
    setMessage("");
    setIsLoading(true);
    try {
      let { data } = await ApiManager.getSubjects(levelID);
      setSubjects(data);
      if (data.length === 0) {
        setMessage(t("No data available for subjects"));
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData(levelID);
  }, [levelID]);
  useEffect(() => {
    setDirectionFlag(i18n.language === "ar");
  }, [i18n.language]);
  return (
    <div className="row g-3 my-3 justify-content-center">
      <div className="col-12">
        <select
          className={"form-select form-control m-auto w-50 " + style.selector}
          aria-label="Default select example"
          onChange={(e) => setLevelID(e.target.value)}
        >
          {Object.entries(Level).map(([key, value]) => (
            <option key={key} value={value}>
              {t(key.replace("_", " "))}{" "}
              {/* Replace underscores with spaces for better readability */}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        [1, 2, 3].map((_, idx) => (
          <div
            key={idx}
            className="col-sm-12 col-lg-4  placeholder-glow col-md-6 "
          >
            <div
              className={
                "card position-relative w-100 placeholder " + style["card"]
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
                  transform: directionFlag ? " translate(0)" : " translate(0%)",
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
        ))
      ) : message ? (
        <div className="col-12 text-center bg-primary p-3 fs-3 lead rounded-4">
          {message}
        </div>
      ) : (
        subjects.map((subject, idx) => (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1 * idx > 2 ? 0.1 * idx : 0.1,
            }}
            key={idx}
            className="col-sm-12 col-lg-4 col-md-6"
          >
            <Link
              to={`/subjects/units/${subject.id}`}
              state={{
                links: [
                  ...links.slice(0, 1),
                  {
                    to: `/subjects/units/${subject.id}`,
                    text: subject.title,
                  },
                ],
              }}
            >
              <div className={"card position-relative " + style["card"]}>
                <img
                  src={subject.imageUrl ? subject.imageUrl : ""}
                  className="card-img-top"
                  alt="subject image "
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
                  <h5 className="card-title">{subject.title}</h5>
                </div>
              </div>
            </Link>
          </motion.div>
        ))
      )}
    </div>
  );
}
