import React from "react";
import style from "./Projector.module.css";
import { Link } from "react-router-dom";
import Comments from "../Comments/Comments";
export default function Projector() {
  let lessons = [
    {
      link: "https://youtu.be/A6_y0HuwSQw?si=cdIrvpUEUjWoun5G",
      lastMinute: null,
      id: 1,
      title: "العالم قبل الإسلام",
      description: "وصف مختصر للدرس الأول",
      thumbnailUrl: "https://img.youtube.com/vi/A6_y0HuwSQw/sddefault.jpg",
      subjectName: "اللغة العربية",
      chapterName: "الوحدة الأولى: السيرة النبوية",
    },
    {
      link: "https://youtu.be/A6_y0HuwSQw?si=cdIrvpUEUjWoun5G",
      lastMinute: null,
      id: 1,
      title: "العالم قبل الإسلام",
      description: "وصف مختصر للدرس الأول",
      thumbnailUrl: "https://img.youtube.com/vi/A6_y0HuwSQw/sddefault.jpg",
      subjectName: "اللغة العربية",
      chapterName: "الوحدة الأولى: السيرة النبوية",
    },
    {
      link: "https://youtu.be/A6_y0HuwSQw?si=cdIrvpUEUjWoun5G",
      lastMinute: null,
      id: 1,
      title: "العالم قبل الإسلام",
      description: "وصف مختصر للدرس الأول",
      thumbnailUrl: "https://img.youtube.com/vi/A6_y0HuwSQw/sddefault.jpg",
      subjectName: "اللغة العربية",
      chapterName: "الوحدة الأولى: السيرة النبوية",
    },
    {
      link: "https://youtu.be/A6_y0HuwSQw?si=cdIrvpUEUjWoun5G",
      lastMinute: null,
      id: 1,
      title: "العالم قبل الإسلام",
      description: "وصف مختصر للدرس الأول",
      thumbnailUrl: "https://img.youtube.com/vi/A6_y0HuwSQw/sddefault.jpg",
      subjectName: "اللغة العربية",
      chapterName: "الوحدة الأولى: السيرة النبوية",
    },
    {
      link: "https://youtu.be/A6_y0HuwSQw?si=cdIrvpUEUjWoun5G",
      lastMinute: null,
      id: 1,
      title: "العالم قبل الإسلام",
      description: "وصف مختصر للدرس الأول",
      thumbnailUrl: "https://img.youtube.com/vi/A6_y0HuwSQw/sddefault.jpg",
      subjectName: "اللغة العربية",
      chapterName: "الوحدة الأولى: السيرة النبوية",
    },
  ];

  return (
    <div className={style.Projector + " container my-5"}>
      <div className="row align-items-stretch">
        {" "}
        <div className={"col-md-3 shadow " + style["lesson-lists"]}>
          {lessons.map((lesson, index) => (
            <Link
              key={index}
              to={`/subjects/lessons/${lesson.id}`}
              className={style["lesson-card"] + " d-flex gap-2 my-2"}
            >
              <img
                src={lesson.thumbnailUrl}
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
          className={"col-md-9 " + style["video-container"]}
          style={{ height: "50vh" }}
        >
          <iframe
            src="https://www.youtube.com/embed/Ad44riH5CgI?si=1PFXU-FQuj5pPJiZ"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <p>{lessons[0].title}</p>
          <div className={style["comments"]}>
            <div className="d-flex justify-content-between">
              <h5>مناقشة الدرس</h5>
              <button className="btn btn-primary">أضف تعليق</button>
            </div>
            <div>
              <Comments />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
