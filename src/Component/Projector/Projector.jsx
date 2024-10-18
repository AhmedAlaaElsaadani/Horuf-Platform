import React, { useContext, useEffect, useState } from "react";
import style from "./Projector.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Comments from "../Comments/Comments";
import ApiManager from "../../Utilies/ApiManager";
import { authContext } from "../../Context/authContext";
import { useTranslation } from "react-i18next";
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
    if (lessonID) {
      // alert("Lesson ID: " + lessonID);
      getLesson();
    } else navigator("/");
  }, []);
  if (!lesson)
    return (
      <div className="vh-100 w-100 d-flex justify-content-center align-items-center ">
        <i className="fa-solid fa-spinner fa-spin fs-1 text-primary fa-spin-reverse"></i>
      </div>
    );
  else
    return (
      <div className={style.Projector + " container my-5"}>
        <div className="row ">
          <div className="col-12 mb-4">
            <h3>{lesson.title}</h3>
          </div>
          <div
            className={"col-md-3 shadow text-center " + style["lesson-lists"]}
          >
            <h4>{t("other lessons")}</h4>
            {lesson.relatedLessons.map((lesson, index) => (
              <Link
                key={index}
                to={`/subjects/lessons/${lesson.id}`}
                className={style["lesson-card"] + " d-flex gap-2 my-2"}
              >
                <img
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  className={style["lesson-thumbnail"] + " w-100 "}
                />
                <div>
                  <h5>{lesson.title}</h5>
                </div>
              </Link>
            ))}
          </div>
          <div
            className={"col-md-9 " + style["videoWrapper"]}
          >
            <iframe
              src={convertToEmbedUrl(lesson.link)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
            ></iframe>

            {/* <div className={style["comments"]}>
              <div className="d-flex justify-content-between">
                <h5>مناقشة الدرس</h5>
                <button className="btn btn-primary">أضف تعليق</button>
              </div>
              <div>
                <Comments />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
}
/// Helper Functions ///
function convertToEmbedUrl(url) {
  const urlObj = new URL(url);
  const videoId =
    urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
  const params = urlObj.search;

  const embedUrl = `https://www.youtube.com/embed/${videoId}${params}`;

  return embedUrl;
}
