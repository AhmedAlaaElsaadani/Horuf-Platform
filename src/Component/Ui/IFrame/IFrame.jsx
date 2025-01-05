import React, { useContext } from "react";
import style from "./IFrame.module.css";
import { IsMobileContext } from "../../../Context/isMobileContext";

export default function IFrame({ videoUrl, children,flagDirection }) {
  const {isMobile} = useContext(IsMobileContext);
  return (
    <div className={`col-md-8  ${(flagDirection || isMobile)?"":"offset-1"}`}>
      <div className={"row flex-column"}>
        <div className={style["videoWrapper"]}>
          <iframe
            src={convertToEmbedUrl(videoUrl)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
            onContextMenu={(e) => e.preventDefault()} // Disables right-click
          ></iframe>
        </div>
      </div>
      {children}
    </div>
  );
}

// Helper function to format YouTube embed URL
function convertToEmbedUrl(url) {
  const urlObj = new URL(url);
  const videoId =
    urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
  const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
  return embedUrl;
}
