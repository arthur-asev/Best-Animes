
"use client";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (!src.url || !videoRef.current) return;

    const video = videoRef.current;
    const hls = new Hls();

    // Encapsula a URL m3u8 via proxy
    const encodedUrl = encodeURIComponent(src.url);
    const proxyUrl = `/proxy?url=${encodedUrl}`;

    hls.loadSource(proxyUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => { }));

    return () => hls.destroy();
  }, [src.url]);

  
  return (

    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <video
        ref={videoRef}
        controls
        style={{ width: "100%", borderRadius: "8px", background: "#000" }}
      />
    </div>
  );
}
