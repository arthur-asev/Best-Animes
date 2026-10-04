import React, { useRef, useState, useEffect } from "react";
import VideoJS from "./videojs";
import axios from "axios";

const VideoJSPlayer = ({ dataVideo }) => {
    const playerRef = useRef(null);
    const [proxyUrl, setProxyUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        if (!dataVideo?.sources?.[0]?.url) {
            setError("Dados de vídeo inválidos");
            return;
        }

        const source = dataVideo.sources[0];
        const videoUrl = source.url;
        const referer = (source.referer || dataVideo.headers?.Referer || "").trim();
        const sourceType = source.type || "application/x-mpegURL";
        if (sourceType === "application/dash+xml") {
            setError("Este player ainda não reproduz fontes DASH.");
            return;
        }

        axios.post("/sign", {
            url: videoUrl,
            referer: referer,
            expiresIn: 120, // 2 minutos para o manifesto
        }, {
            headers: { "x-api-key": process.env.NEXT_PUBLIC_STREAM_API_KEY }
        })
            .then(res => {
                const token = res.data.token;
                const refererParam = referer ? `&referer=${encodeURIComponent(referer)}` : "";
                const streamUrl = `/stream?token=${encodeURIComponent(token)}${refererParam}`;
                setProxyUrl(streamUrl);
            })
            .catch(err => {
                setError("Erro ao carregar stream: " + (err.response?.data?.error || "falha desconhecida"));
            });
    }, [dataVideo]);

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        const tech = player.tech({ IWillNotUseThisInFutureVersions: true });
        if (tech?.vhs) {
            tech.vhs.bufferTarget_ = 30; // mantém 30s de buffer futuro
            tech.vhs.goalBufferLength_ = 60; // tenta manter até 60s
        }


        player.on("error", () => {
            const err = player.error();
            if (err) setError(`Erro: ${err.message || "reprodução falhou"}`);
        });
    };

    const subtitleTracks = (dataVideo?.subtitles || [])
        .filter(sub => sub.lang !== "thumbnails")
        .map((sub, i) => ({
            kind: "subtitles",
            src: sub.url,
            srclang: sub.lang,
            label: sub.lang,
            default: i === 0,
        }));

    const videoJsOptions = proxyUrl ? {
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{ src: proxyUrl, type: dataVideo.sources[0].type || "application/x-mpegURL" }],
        tracks: subtitleTracks,
        preload: "auto",
        html5: {
            hls: {
                bandwidth: 10000000,
                overrideNative: true,
                handleManifestRedirects: true,
                smoothQualityChange: true,
            }
        },
        plugins: { hlsQualitySelector: { displayCurrentQuality: true } },
    } : null;

    if (error) return <div style={{ color: "red", padding: 20 }}>❌ {error}</div>;
    if (!proxyUrl) return <p>Carregando stream...</p>;

    return (
        <div style={{ margin: "20px 0", maxWidth: 800 }}>
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
    );
};

export default VideoJSPlayer;
