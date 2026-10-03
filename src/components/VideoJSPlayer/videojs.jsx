import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// import "videojs-contrib-quality-levels";
// Importe o plugin de UI e CSS
import "videojs-hls-quality-selector";
import "videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css";


const VideoJS = ({ options, onReady }) => {
  const playerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered", "video-js");
      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, options, () => {
        videojs.log("Player is ready");
        onReady && onReady(player);
      });

      player.ready(() => {
        if (player.hlsQualitySelector) {
          player.hlsQualitySelector({ displayCurrentQuality: true });
          videojs.log("hlsQualitySelector ativado.");
        }
      });

      playerRef.current = player;
      return () => {
        if (playerRef.current && !playerRef.current.isDisposed()) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }
  }, [options, onReady]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;