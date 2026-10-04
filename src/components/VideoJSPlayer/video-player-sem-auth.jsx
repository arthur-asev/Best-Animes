import React, { useRef } from "react";
import VideoJS from "./videojs";

const VideoJSPlayer = ({ dataVideo }) => {
    const playerRef = useRef(null);

    console.log(`dados do video: ${dataVideo}`);
    const sources = dataVideo.sources.map(source => ({
        src: `/proxy?url=${encodeURIComponent(source.url)}&referer=${encodeURIComponent(dataVideo.headers.Referer)}`,
        type: source.type,
    }));

    console.log(sources);
    

    const [primeiraChave, primeiroValor] = sources.entries().next().value;

    const allTracks = dataVideo.subtitles;

    // 1. Filtrar APENAS as legendas (onde lang NÃO é 'thumbnails')
    const subtitleTracks = allTracks.filter(sub => sub.lang !== "thumbnails");

    // 2. Encontrar a miniatura (onde lang É 'thumbnails')
    const thumbnailData = allTracks.find(sub => sub.lang === "thumbnails");


    // Video.js configuration with HLS for quality switching
    const videoJsOptions = {
        controls: true,
        responsive: true,
        fluid: true,
        autoplay: false,
        muted: false,
        playbackRates: [0.25, 0.5, 1, 1.5, 2],
        sources:
            [
                {
                    src: primeiroValor.src,
                    type: "application/x-mpegURL",
                },
            ],
        tracks:
            subtitleTracks.map((sub, index) => ({
                kind: "subtitles",
                src: sub.url,
                srclang: sub.lang,
                label: sub.lang,
                default: index === 0,
            })),
        html5: {
            hls: {
                overrideNative: true,
            },
        },
        plugins: {
            hlsQualitySelector: {
                displayCurrentQuality: true,
            },
        },
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        player.on("waiting", () => {
            console.log("Player is waiting");
        });

        player.on("loadedmetadata", () => {
            console.log("Video metadata loaded");
        });

        player.on("dispose", () => {
            console.log("Player will dispose");
        });

        if (player.hlsQualitySelector) {
            player.hlsQualitySelector({ displayCurrentQuality: true });
        }

        // 2. ✅ Opcional: Garanta que o player carregue a fonte
        player.on("loadedmetadata", () => {
            // Este evento garante que o player JÁ leu o M3U8 e tem os metadados.
            // Se a chamada acima não funcionar, tente ativá-lo aqui dentro.
            // Geralmente, não é necessário se o plugin estiver nas options.

            // Log dos níveis detectados (Apenas para debug)
            const qualityLevels = player.qualityLevels();
            console.log(`Níveis de qualidade detectados: ${qualityLevels.length}`);
        });
    };

    return (
        <div style={{ margin: "20px 0" }}>
            <div style={{ maxWidth: "800px" }}>
                <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            </div>
        </div>
    );
};

export default VideoJSPlayer;