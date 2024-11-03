import React, { useContext, useEffect, useState } from "react";
import style from "./Projector.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";
import { useTranslation } from "react-i18next";
import IFrame from "../Ui/IFrame/IFrame";
import Spinner from "../Ui/Spinner/Spinner";
export default function Projector() {
  const { t } = useTranslation();
  const [lesson, setLesson] = useState(null);
  const { token } = useContext(authContext);
  const { lessonID } = useParams();
  const getLesson = async () => {
    try {
      let { data } = await ApiManager.getLessonDetails(token, lessonID);
      setLesson(data);
    } catch (error) {
      console.error(error);
    }
  };
  const navigator = useNavigate();
  useEffect(() => {
    console.log("Projector mounted with lessonID:", lessonID);
    if (lessonID) {
      setLesson(null);
      getLesson();
    } else {
      navigator("/");
    }
  }, [lessonID]);
  return !lesson ? (
    <Spinner />
  ) : (
    <div className={style.Projector + " container my-5"}>
      <div className="row ">
        <div className="col-12 mb-4">
          <h3>{lesson.title}</h3>
        </div>
        <div className={"col-md-3 shadow text-center " + style["lesson-lists"]}>
          <h4>{t("other lessons")}</h4>
          {lesson.relatedLessons.map((lessonElement, index) => (
            <Link
              key={index}
              to={`/subjects/lessons/${lessonElement.id}`}
              className={
                style["lesson-card"] + " d-flex gap-2 my-2 position-relative  overflow-hidden"
              }
            >
              <img
                src={lessonElement.imageUrl}
                alt={lessonElement.title}
                className={style["lesson-thumbnail"] }
              />
              <div>
                <h5>{lessonElement.title}</h5>
              </div>
              {lessonElement.id == lesson.id ? (
                <span className="bg-success-subtle position-absolute p-1 rounded rounded-3 m-3 start-0">
                  <i className="fa-solid fa-television fs-5 text-success"></i>
                </span>
              ) : (
                ""
              )}
            </Link>
          ))}
        </div>
        <IFrame videoUrl={lesson.link} />
      </div>
    </div>
  );
}
