import React, { useState } from "react";
import style from "./IFrame.module.css";

export default function IFrame({ videoUrl }) {
  const [overlayVisible, setOverlayVisible] = useState(true);

  const handleOverlayClick = () => {
    setOverlayVisible(false); // Hide overlay to allow video interaction
  };

  return (
    <div className={"col-md-9  " + style["videoWrapper"]}>
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
      {overlayVisible && (
        <div className={style.overlay} onClick={handleOverlayClick}></div>
      )}
    </div>
  );
}

// Helper function to format YouTube embed URL
function convertToEmbedUrl(url) {
  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
  const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;

  return embedUrl;
}
