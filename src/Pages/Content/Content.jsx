import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import style from "./Content.module.css";
import { useTranslation } from "react-i18next";
import { authContext } from "../../Context/authContext";
import { motion } from "framer-motion";
import Spinner from "../../Component/Ui/Spinner/Spinner";
import Heading2 from "../../Component/Heading2/Heading2";
import img from "../../assets/Images/Heading2/1.jpeg";
import CustomPlayer from "../../Component/Ui/CustomPlayer/CustomPlayer";
import Comments from "../../Component/Comments/Comments";

export default function Content() {
  let { packageId } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [errorMessage, setErrorMessage] = useState(null);
  const { token, user } = useContext(authContext);
  const [flagDirection, setFlagDirection] = useState(i18n.language === "ar");
  useEffect(() => {
    setFlagDirection(i18n.language === "ar");
  }, [i18n.language]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  // get the package details from the api
  const getPackageDetails = async () => {
    setErrorMessage(null);
    // get package details from api
    try {
      const { data } = await ApiManager.getPackageDetails(packageId, token);
      if (data.success) {
        setPackageDetails(data.data);
        setSelectedVideo({ ...data.data.units[0].videos[0], unitIdx: 0 });
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response.data.code == 404) {
        setErrorMessage(t("package not found"));
      }
    }
  };
  // when the user click on the video we go to that video
  const goToLesson = (unitIdx, videoIdx, video) => {
    reRenderVideo();
    setSelectedVideo({
      unitIdx: unitIdx,
      videoIdx: videoIdx,
      ...video,
    });
  };
  // the video dosen't change when the user click for that we render the whole component
  const reRenderVideo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  // when the video ended we go to the next video
  const goToNextVideo = () => {
    if (selectedVideo.unitIdx == packageDetails.units.length - 1) {
      if (
        selectedVideo.videoIdx ==
        packageDetails.units[selectedVideo.unitIdx].videos.length - 1
      ) {
        return;
      } else {
        reRenderVideo();
        setSelectedVideo({
          unitIdx: selectedVideo.unitIdx,
          videoIdx: selectedVideo.videoIdx + 1,
          ...packageDetails.units[selectedVideo.unitIdx].videos[
            selectedVideo.videoIdx + 1
          ],
        });
      }
    } else {
      reRenderVideo();
      setSelectedVideo({
        unitIdx: selectedVideo.unitIdx + 1,
        videoIdx: 0,
        ...packageDetails.units[selectedVideo.unitIdx + 1].videos[0],
      });
    }
  };
  useEffect(() => {
    getPackageDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section
      style={{
        minHeight: `calc(100vh - ${parseInt(
          window.getComputedStyle(document.body).paddingTop,
          10
        )}px)`,
      }}
    >
      <>
        {!packageDetails ? (
          <>
            {errorMessage ? (
              <div className="d-flex my-5 align-items-center justify-content-center w-100">
                <p className="bg-info w-100 text-center fs-3 text-white p-3 rounded-5">
                  {errorMessage}
                </p>
              </div>
            ) : (
              <Spinner />
            )}
          </>
        ) : (
          <>
            <Heading2 img={img} headingText={packageDetails.title} />

            <div className={style.packageContent + " container my-5"}>
              <div className={"row " + style["package-container"]}>
                <div
                  className={`col-md-3 text-center ${style["unitContainer"]} ${
                    flagDirection ? "offset-1" : ""
                  } `}
                >
                  {/* <h4>{t("units")}</h4> */}
                  <div className="accordion" id="unitAccordion">
                    {packageDetails.units.map((unit, unitIdx) => (
                      <div
                        className="accordion-item border-0 bg-transparent my-2"
                        key={unitIdx}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 100 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.1 * unitIdx < 2 ? 0.1 * unitIdx : 0.1,
                          }}
                          className={`${style.unit} p-0`}
                        >
                          <h3 className="accordion-header w-100 ">
                            <button
                              className="accordion-button bg-transparent p-2 collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#unit${unitIdx}`}
                              aria-expanded="true"
                              aria-controls={`unit${unitIdx}`}
                            >
                              {" "}
                              {unit.title}
                            </button>
                          </h3>
                        </motion.div>
                        <div
                          id={`unit${unitIdx}`}
                          className="accordion-collapse collapse"
                          data-bs-parent="#unitAccordion"
                        >
                          <div className="accordion-body">
                            {unit.videos.map((video, videoIdx) => (
                              <div
                                onClick={() => {
                                  goToLesson(unitIdx, videoIdx, video);
                                }}
                                className={`d-flex align-items-center ${
                                  style.video
                                } ${
                                  selectedVideo.unitIdx === unitIdx &&
                                  selectedVideo.id === video.id
                                    ? style.active
                                    : ""
                                } `}
                                key={videoIdx}
                              >
                                <div>
                                  <i className="fa-solid fa-circle-play mx-2"></i>
                                  <span>{video.title}</span>
                                </div>
                                {selectedVideo.unitIdx === unitIdx &&
                                  selectedVideo.id === video.id && (
                                    <i className="fa-solid fa-television  "></i>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`col-md-8 d-flex align-items-start justify-content-center  ${
                    flagDirection || isMobile ? "" : "offset-1"
                  } ${style.videoContainer}`}
                >
                  {isLoading ? (
                    <Spinner sectionFlag={false} />
                  ) : (
                    <>
                      <div className="w-100 mb-5">
                        <div className="overflow-hidden">
                          <CustomPlayer
                            videoUrl={selectedVideo.videoUrl}
                            onEnded={() => {
                              goToNextVideo();
                            }}
                            onReady={() => {}}
                          />
                        </div>
                        <div
                          className={
                            "d-flex gap-3 my-2 mt-5 flex-column " +
                            style.videoText
                          }
                        >
                          <h4 className="m-0">{selectedVideo.title}</h4>
                          <p>{selectedVideo.description}</p>
                        </div>
                        <Comments
                          flagDirection={flagDirection}
                          t={t}
                          token={token}
                          user={user}
                          videoId={selectedVideo.id}
                          packageId={packageId}
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </>
        )}
      </>
    </section>
  );
}
