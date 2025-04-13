import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./Comments.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import FloatingInput from "../Ui/FloatingInput/FloatingInput";
import Spinner from "../Ui/Spinner/Spinner";
import ApiManager from "../../Utilies/ApiManager";
import { IsMobileContext } from "../../Context/isMobileContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Comments({
  packageId,
  videoId,
  t,
  flagDirection,
  token,
  user,
}) {
  const [comments, setComments] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [flagDisplayComment, setFlagDisplayComment] = useState(false);
  const { isMobile } = useContext(IsMobileContext);
  const formComment = useRef(null);
  const [commentParentId, setCommentParentId] = useState(null);
  const navigate = useNavigate();
  const getComments = async () => {
    try {
      setComments(null);
      let { data } = await ApiManager.getVideoComments(
        token,
        packageId,
        videoId
      );
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      setComments([]);
      console.error(error);
      if (error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: t("Error!"),
          text: t("You aren't subscriber to this package"),
          confirmButtonText: t("OK"),
        });
        navigate("/");
      }
    }
  };
  useEffect(() => {
    getComments();
  }, []);

  const addComment = async (values) => {
    setButtonLoading(true);
    await ApiManager.addComment(token, packageId, null, videoId, values.Comment)
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
    await ApiManager.addComment(
      token,
      packageId,
      commentParentId,
      videoId,
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
    Swal.fire({
      title: t("Are you sure?"),
      text: t("You won't be able to revert this!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("Cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await ApiManager.deleteComment(
            token,
            packageId,
            videoId,
            commentId
          );
          console.log(response);

          if (response.status === 200) {
            Swal.fire(
              t("Deleted!"),
              t("Your comment has been deleted."),
              "success"
            );
            await getComments();
          }
        } catch (error) {
          console.error(error);
          Swal.fire(
            t("Error!"),
            t("Something went wrong. Please try again."),
            "error"
          );
        }
      }
    });
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
      <div className={!flagDisplayComment && isMobile ? " d-none" : ""}>
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
  const [show, setShow] = useState(false);
  const items = [
    {
      icon: <i className="fa-solid fa-flag"></i>,
      text: t("Reply"),
      onClick: () => {
        formComment.current.scrollIntoView({ behavior: "smooth" });
        formComment.current.Comment.focus();
        setCommentParentId(comment.id);
      },
    },
    {
      icon: <i className="fa-solid fa-trash"></i>,
      text: t("Delete"),
      onClick: () => deleteComment(comment.id),
    },
  ];
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

        <p className="lead p-0 mx-2 mb-0">{comment.userName}</p>
      </div>
      <div className={style["comment-body"]}>
        <p>{comment.text}</p>
      </div>
      <div className="mx-5">
        {flagUserMyComment && (
          <>
            <button
              className={`btn btn-outline-info my-3 p-1 rounded-circle position-absolute top-0 ${
                flagDirection ? "start-0" : "end-0"
              } ${style["more-options-btn"]}`}
              aria-label="delete comment button"
              // onClick={() => deleteComment(comment.id)}
              onClick={() => setShow(!show)}
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
            {show && (
              <div
                className={`position-absolute top-0 my-5 ${
                  style["more-options"]
                } ${flagDirection ? "start-0" : "end-0"}`}
              >
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      item.onClick();
                      setShow(!show);
                    }}
                    className={`${style.optionItem}`}
                  >
                    {item.icon}
                    <span>{t(item.text)} </span>
                  </div>
                ))}
              </div>
            )}
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
