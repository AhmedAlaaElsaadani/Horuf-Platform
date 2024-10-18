import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import style from "./Content.module.css";
import { useTranslation } from "react-i18next";
import { authContext } from "../../Context/authContext";
import { motion } from "framer-motion";

export default function Content() {
  let { unitID } = useParams();
  const location = useLocation();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { links, setLinks } = useOutletContext(); // Receiving data from parent
  const { t } = useTranslation();
  const { token, isRegistered } = useContext(authContext);
  //join a lesson
  const joinLesson = async (lessonID) => {
    if (isRegistered) {
      try {
        let { data } = await ApiManager.joinLesson(token, lessonID);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // get data from api
  const getData = async (unitID) => {
    setMessage("");
    setIsLoading(true);
    try {
      let { data } = await ApiManager.getLessons(token, unitID);
      setLessons(data);
      console.log(data);

      if (data.length === 0) setMessage(t("No data available for lessons"));
      setIsLoading(false);
    } catch (error) {
      setMessage(t("Something went wrong, please try again later"));
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (location.state) {
      const { links } = location.state;
      setLinks([...links]);
    }
    getData(unitID);
  }, []);
  return (
    <div className="row g-3 my-3 justify-content-center">
      {isLoading ? (
        [...Array(6)].map((_, idx) => (
          <div key={idx} className="col-sm-12 placeholder-glow ">
            {" "}
            <div className={style["lesson"] + "  placeholder  w-100 my-3"}>
              <span className="mx-2 p-1">
                {idx < 10 ? "0" + (idx + 1) : idx + 1}
              </span>
            </div>
          </div>
        ))
      ) : message ? (
        <div className="col-12 text-center bg-primary p-3 fs-3 lead rounded-4">
          {message}
        </div>
      ) : (
        lessons.map((lesson, idx) => (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1 * idx > 2 ? 0.1 * idx : 0.1,
            }}
            key={idx}
            className={"col-sm-12 "}
            onClick={async () =>
              !lesson.isJoined && (await joinLesson(lesson.id))
            }
          >
            <Link to={`/subjects/lessons/${lesson.id}`}>
              <div className={style["lesson"] + " my-3"}>
                <span className="mx-2 p-1">
                  {idx < 10 ? "0" + (idx + 1) : idx + 1}
                </span>
                {lesson.title}
                {lesson.isJoined ? (
                  <span className="bg-success-subtle">
                    <i className="fa-solid fa-television fs-5 text-success"></i>
                  </span>
                ) : (
                  <span className=" bg-warning-subtle">
                    <i className="fa-solid fa-lock fs-5 text-warning"></i>
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))
      )}
    </div>
  );
}
