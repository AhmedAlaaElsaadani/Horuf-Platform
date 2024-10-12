import React from "react";
import style from "./Comments.module.css";

export default function Comments() {
  const comments = [
    {
      id: 1,
      firstName: "أحمد",
      lastName: "محمود",
      text: "شرح رائع! شكرا أستاذ",
      accountId: "57abbf76-ff27-437b-bc74-9a626c58329e",
      time: "2024-10-05T22:46:15.7182806",
      replies: [
        {
          id: 5,
          firstName: "Master Admin",
          lastName: "المدير العام",
          text: "على الرحب والسعة!",
          accountId: "d96a99cb-3f35-4737-8c3a-27dc2cb655b3",
          time: "2024-10-05T22:46:15.7182806",
          replies: [],
        },
        {
          id: 6,
          firstName: "أحمد",
          lastName: "محمود",
          text: "الرد الثاني",
          accountId: "57abbf76-ff27-437b-bc74-9a626c58329e",
          time: "2024-10-05T22:46:15.7182806",
          replies: [],
        },
      ],
    },
  ];
  return (
    <div className={style["comments"]}>
      {comments.map((comment) => (
        <div key={comment.id} className={style["comment"]}>
          <div
            className={
              "d-flex align-items-center px-1 " + style["comment-header"]
            }
          >
            <div
              className="rounded-circle bg-white d-flex justify-content-center  align-items-center mx-2"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="rounded-circle text-primary fs-4 fa-solid fa-user" />
            </div>

            <p className="lead p-0 m-0">
              {comment.firstName + " " + comment.lastName}
            </p>
          </div>
          <div className={style["comment-body"]}>
            <p>{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
