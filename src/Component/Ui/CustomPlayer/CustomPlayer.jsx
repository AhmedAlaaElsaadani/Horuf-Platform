import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import styles from "./CustomPlayer.module.css";

const CustomPlayer = ({ videoUrl, onReady, onEnded }) => {
  const playerRef = useRef(null);
  const plyrInstance = useRef(null);
  const [videoYoutubeId, setVideoYoutubeId] = useState(getYoutubeId(videoUrl));

  const initialPlyr = () => {
    const player = new Plyr(playerRef.current, {
      controls: [
        "play-large",
        "restart",
        "rewind",
        "play",
        "fast-forward",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "captions",
        "settings",
        "pip",
        "fullscreen",
      ],
      settings: ["captions", "quality", "speed"],
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        cc_load_policy: 0,
        cc_lang_pref: "ar",
      },
    });

    plyrInstance.current = player;

    player.on("ready", () => {
      if (onReady) onReady(player);
    });

    player.on("ended", () => {
      if (onEnded) onEnded();
    });
  };

  // Initialize Plyr instance when the component mounts
  useEffect(() => {
    if (!plyrInstance.current) {
      initialPlyr();
    }

    return () => {
      if (plyrInstance.current) {
        plyrInstance.current.destroy();
        plyrInstance.current = null;
      }
    };
  }, []); // Only run once when the component mounts

  // Update the video ID when the video URL changes
  useEffect(() => {
    const newVideoId = getYoutubeId(videoUrl);
    if (newVideoId && newVideoId !== videoYoutubeId) {
      setVideoYoutubeId(newVideoId);
    }
  }, [videoUrl]); // This effect runs when `videoUrl` changes

  // Update the player source when videoYoutubeId changes
  useEffect(() => {
    if (plyrInstance.current) {
      plyrInstance.current.source = {
        type: "video",
        sources: [
          {
            src: videoYoutubeId,
            provider: "youtube",
          },
        ],
      };
      plyrInstance.current.play();
    }
  }, [videoYoutubeId]); // This effect runs when `videoYoutubeId` changes

  return (
    <div className={styles.playerWrapper}>
      <div className={styles.playerContainer}>
        <div
          ref={playerRef}
          className={styles.plyrPlayer}
          data-plyr-provider="youtube"
          data-plyr-embed-id={videoYoutubeId}
        ></div>
        <div className={styles.videoOverlay}></div>
      </div>
    </div>
  );
};

export default CustomPlayer;

// Helper function to extract YouTube video ID from URL
const getYoutubeId = (url) => {
  if (!url) return null;

  // Handle embed URLs (e.g., https://www.youtube.com/embed/VIDEO_ID)
  if (url.includes("/embed/")) {
    return url.split("/embed/")[1].split("?")[0];
  }

  // Handle youtu.be URLs (e.g., https://youtu.be/VIDEO_ID)
  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0];
  }

  // Handle regular YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  // Ensure the video ID is 11 characters long
  return match && match[2].length === 11 ? match[2] : null;
};
