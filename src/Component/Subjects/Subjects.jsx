import React, { useEffect, useState } from "react";
import style from "./Subjects.module.css";
import erorrImage from "../../assets/Images/Subjects/subject.jpeg";
import { useTranslation } from "react-i18next";
import img from "../../assets/Images/Heading2/1.jpeg";
import ApiManager from "../../Utilies/ApiManager";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import SelectElement from "../Ui/SelectElement/SelectElement";
import Heading2 from "../Heading2/Heading2";
export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const { t, i18n } = useTranslation();
  const [levelID, setLevelID] = useState(6);
  const [subjectID, setSubjectID] = useState(1);
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
  const levelOptions = [
    {
      key: "level 6",
      value: 6,
    },
    {
      key: "level 7",
      value: 7,
    },
    {
      key: "level 8",
      value: 8,
    },
    {
      key: "level 9",
      value: 9,
    },
    {
      key: "level 10",
      value: 10,
    },
    {
      key: "level 11",
      value: 11,
    },
    {
      key: "level 12",
      value: 12,
    },
  ];
  // get data from api
  const getSubject = async () => {
    setMessage("");
    setIsLoading(true);
    try {
      let { data } = await ApiManager.getSubjects();
      setSubjects(
        data.data.map((subject) => ({
          value: subject.id,
          key: subject.title,
        }))
      );
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
    getSubject();
  }, []);
  useEffect(() => {
    //get Date
  }, [subjectID, levelID]);

  useEffect(() => {
    setDirectionFlag(i18n.language === "ar");
  }, [i18n.language]);
  const selectElements = [
    {
      selectName: "subjects",
      options: subjects,
      translation: "subjects",
      selectValue: subjectID,
      onChange: (e) => setSubjectID(e.target.value),
      changeValue: (value) => setSubjectID(value),
      icon: "fa-book",
    },
    {
      selectName: "level",
      options: levelOptions,
      translation: "level",
      selectValue: levelID,
      onChange: (e) => setLevelID(e.target.value),
      changeValue: (value) => setLevelID(value),
      icon: "fa-school",
    },
  ];
  return (
    <section
      id="Subjects"
      className={style.subjects}
      style={{
        minHeight: `calc(100vh - ${parseInt(
          window.getComputedStyle(document.body).paddingTop,
          10
        )}px)`,
      }}
    >
      <Heading2 img={img} headingText={t("Packages")} />
      <div className="container ">
        <div className="row g-3 my-3 justify-content-center">
          {selectElements.map((selectElement, idx) => (
            <div className="col-md-6">
              <SelectElement
                key={idx}
                {...selectElement}
                idx={idx}
                icon={selectElement.icon}
              />
            </div>
          ))}
          {isLoading ? (
            [1, 2, 3].map((_, idx) => (
              <SubjectLoadingCard
                key={idx}
                idx={idx}
                directionFlag={directionFlag}
                t={t}
              />
            ))
          ) : message ? (
            <div className="col-12 text-center bg-primary p-3 fs-3 lead rounded-4">
              {message}
            </div>
          ) : (
            subjects.map((subject, idx) => (
              <PackageCard
                key={idx}
                subject={subject}
                directionFlag={directionFlag}
                idx={idx}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
const PackageCard = ({ subject, directionFlag, idx }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.1 * idx < 1 ? 0.1 * idx : 0.1,
      }}
      key={idx}
      className="col-sm-12 col-lg-4 col-md-6"
    >
      <Link to={`/subjects/units/${subject.id}`}>
        <div className={"card position-relative " + style["card"]}>
          <img
            src={subject.imageUrl ? subject.imageUrl : ""}
            className="card-img-top"
            alt="subject image "
            onError={(e) => (e.target.src = erorrImage)}
            loading="lazy"
          />
          <div
            className={"card-body position-absolute " + style["card-heading"]}
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
            <h5 className="card-title">{"fdmgpkjsfd"}</h5>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const SubjectLoadingCard = ({ idx, directionFlag, t }) => {
  return (
    <div key={idx} className="col-sm-12 col-lg-4  placeholder-glow col-md-6 ">
      <div
        className={"card position-relative w-100 placeholder " + style["card"]}
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
          className={"card-body position-absolute " + style["card-heading"]}
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
  );
};
