import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./Comments.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import FloatingInput from "../Ui/FloatingInput/FloatingInput";
import Spinner from "../Ui/Spinner/Spinner";
import ApiManager from "../../Utilies/ApiManager";
import { IsMobileContext } from "../../Context/isMobileContext";
export default function Comments({ lessonId, t, flagDirection, token, user }) {
  const [comments, setComments] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [flagDisplayComment, setFlagDisplayComment] = useState(false);
  const { isMobile } = useContext(IsMobileContext);
  const formComment = useRef(null);
  const [commentParentId, setCommentParentId] = useState(null);

  const getComments = async () => {
    try {
      setComments(null);
      let { data } = await ApiManager.getLessonComments(token, lessonId);
      setComments(data);
    } catch (error) {
      setComments([]);
    }
  };
  useEffect(() => {
    getComments();
  }, []);

  const addComment = async (values) => {
    setButtonLoading(true);
    await ApiManager.addComment(token, lessonId, values.Comment)
      .then(async (response) => {
        console.log(response);
        if (response.status === 200) {
          await getComments();
        }
        setButtonLoading(false);
        myFormik.resetForm();
      })
      .catch((error) => {
        console.error(error);
        setButtonLoading(false);
      });
  };

  const replyComment = async (values) => {
    setButtonLoading(true);
    await ApiManager.replyComment(
      token,
      lessonId,
      commentParentId,
      values.Comment
    )
      .then(async (response) => {
        console.log(response);
        if (response.status === 200) {
          await getComments();
        }
        setCommentParentId(null);
        setButtonLoading(false);
        myFormik.resetForm();
      })
      .catch((error) => {
        console.error(error);
        setCommentParentId(null);
        setButtonLoading(false);
      });
  };

  const deleteComment = async (commentId) => {
    window.confirm(t("Are you sure you want to delete this comment?")) &&
      (await ApiManager.deleteComment(token, commentId)
        .then(async (response) => {
          console.log(response);
          if (response.status === 200) {
            await getComments();
          }
        })
        .catch((error) => {
          console.error(error);
        }));
  };
  const submitForm = (values) => {
    if (commentParentId) {
      replyComment(values);
    } else {
      addComment(values);
    }
  };
  const myFormik = useFormik({
    initialValues: {
      lessonId: lessonId,
      Comment: "",
    },
    onSubmit: submitForm,
    validationSchema: Yup.object({
      Comment: Yup.string().required(t("Required")),
    }),
  });

  return (
    <div className={style["comments"]}>
      <h4>{t("Lesson Discussion")} </h4>
      <form
        className="text-start"
        onSubmit={myFormik.handleSubmit}
        ref={formComment}
      >
        <FloatingInput
          inputType="text"
          inputName="Comment"
          inputTransition={"Comment"}
          myFormik={myFormik}
          t={t}
          icon="fa-comment-dots"
          idx={1}
          flagDirection={flagDirection}
        />
        <div className="d-flex justify-content-between w-100">
          {isMobile ? (
            <button
              type="button"
              onClick={() => setFlagDisplayComment(!flagDisplayComment)}
              className="btn btn-outline-info mt-2 p-1"
            >
              {flagDisplayComment ? t("Hide Comments") : t("Show Comments")}
            </button>
          ) : (
            <div />
          )}
          <button
            type="submit"
            disabled={buttonLoading}
            aria-label="add Comment button"
            className="btn btn-primary mt-2 p-1  "
          >
            <span
              className={
                buttonLoading ? "fa-solid fa-spinner fa-spin mx-3" : ""
              }
            >
              {!buttonLoading && t("add Comment")}
            </span>
          </button>
        </div>
      </form>
      <div className={!flagDisplayComment && isMobile && " d-none"}>
        {comments ? (
          comments.length !== 0 ? (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                flagComment={true}
                t={t}
                flagDisplayComment={flagDisplayComment}
                formComment={formComment}
                setCommentParentId={setCommentParentId}
                deleteComment={deleteComment}
                user={user}
                flagDirection={flagDirection}
              />
            ))
          ) : (
            <p className="text-center">{t("No comments yet")}</p>
          )
        ) : (
          <Spinner sectionFlag={false} />
        )}
      </div>
    </div>
  );
}

function Comment({
  comment,
  flagComment,
  t,
  formComment,
  setCommentParentId,
  deleteComment,
  user,
  flagDirection,
}) {
  // flagComment is a flag to determine whether the comment is user's comment or not
  const flagUserMyComment = user && user.id === comment.accountId;

  const [replyFlag, setReplyFlag] = useState(false);
  const wetherThisCommentHasReplies =
    flagComment && comment.replies && comment.replies.length !== 0;
  return (
    <div className={style["comment"] + " position-relative"}>
      <div
        className={"d-flex align-items-center px-1 " + style["comment-header"]}
      >
        <div
          className="rounded-circle bg-primary d-flex justify-content-center  align-items-center mx-2"
          style={{ width: "30px", height: "30px" }}
        >
          <i className="rounded-circle text-white fs-6 fa-solid fa-user" />
        </div>

        <p className="lead p-0 mx-2 mb-0">
          {comment.firstName + " " + comment.lastName}
        </p>
      </div>
      <div className={style["comment-body"]}>
        <p>{comment.text}</p>
      </div>
      <div className="mx-5">
        {flagUserMyComment && (
          <>
            <button
              className={`btn btn-danger p-0 px-1 my-3 border-0 position-absolute top-0 ${
                flagDirection ? "start-0" : "end-0"
              }`}
              style={{ fontSize: "0.8rem" }}
              aria-label="delete comment button"
              onClick={() => deleteComment(comment.id)}
            >
              <i className="fa-solid fa-trash mx-2"></i>
            </button>
            <button
              className="btn btn-secondary p-0 px-1 border-0  mb-2 ms-auto "
              style={{ fontSize: "0.8rem" }}
              onClick={() => {
                // scroll to above the form
                formComment.current.scrollIntoView({ behavior: "smooth" });
                formComment.current.Comment.focus();
                setCommentParentId(comment.id);
              }}
            >
              {t("Reply")}
            </button>
          </>
        )}
        {wetherThisCommentHasReplies && (
          <>
            <button
              className="btn btn-outline-info p-0 px-1 border-0 mx-2  mb-2 ms-auto "
              style={{ fontSize: "0.8rem" }}
              onClick={() => setReplyFlag(!replyFlag)}
            >
              {comment?.replies?.length} {t("Replies")}
              <i
                className={
                  "fa-solid fa-arrow-down mx-2 " +
                  (replyFlag ? style["rotated"] : "")
                }
              ></i>
            </button>

            {replyFlag &&
              comment?.replies?.map((reply, idx) => (
                <Comment key={idx} comment={reply} t={t} />
              ))}
          </>
        )}
      </div>
    </div>
  );
}
