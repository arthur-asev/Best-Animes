module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
"[project]/node_modules/react-player/dist/patterns.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUDIO_EXTENSIONS",
    ()=>AUDIO_EXTENSIONS,
    "DASH_EXTENSIONS",
    ()=>DASH_EXTENSIONS,
    "HLS_EXTENSIONS",
    ()=>HLS_EXTENSIONS,
    "MATCH_URL_MUX",
    ()=>MATCH_URL_MUX,
    "MATCH_URL_SPOTIFY",
    ()=>MATCH_URL_SPOTIFY,
    "MATCH_URL_TIKTOK",
    ()=>MATCH_URL_TIKTOK,
    "MATCH_URL_TWITCH",
    ()=>MATCH_URL_TWITCH,
    "MATCH_URL_VIMEO",
    ()=>MATCH_URL_VIMEO,
    "MATCH_URL_WISTIA",
    ()=>MATCH_URL_WISTIA,
    "MATCH_URL_YOUTUBE",
    ()=>MATCH_URL_YOUTUBE,
    "VIDEO_EXTENSIONS",
    ()=>VIDEO_EXTENSIONS,
    "canPlay",
    ()=>canPlay
]);
const AUDIO_EXTENSIONS = /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;
const DASH_EXTENSIONS = /\.(mpd)($|\?)/i;
const MATCH_URL_MUX = /stream\.mux\.com\/(?!\w+\.m3u8)(\w+)/;
const MATCH_URL_YOUTUBE = /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
const MATCH_URL_VIMEO = /vimeo\.com\/(?!progressive_redirect).+/;
const MATCH_URL_WISTIA = /(?:wistia\.(?:com|net)|wi\.st)\/(?:medias|embed)\/(?:iframe\/)?([^?]+)/;
const MATCH_URL_SPOTIFY = /open\.spotify\.com\/(\w+)\/(\w+)/i;
const MATCH_URL_TWITCH = /(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+|(videos?\/|\?video=)\d+)($|\?)/;
const MATCH_URL_TIKTOK = /tiktok\.com\/(?:player\/v1\/|share\/video\/|@[^/]+\/video\/)([0-9]+)/;
const canPlayFile = (url, test)=>{
    if (Array.isArray(url)) {
        for (const item of url){
            if (typeof item === "string" && canPlayFile(item, test)) {
                return true;
            }
            if (canPlayFile(item.src, test)) {
                return true;
            }
        }
        return false;
    }
    return test(url);
};
const canPlay = {
    html: (url)=>canPlayFile(url, (u)=>AUDIO_EXTENSIONS.test(u) || VIDEO_EXTENSIONS.test(u)),
    hls: (url)=>canPlayFile(url, (u)=>HLS_EXTENSIONS.test(u)),
    dash: (url)=>canPlayFile(url, (u)=>DASH_EXTENSIONS.test(u)),
    mux: (url)=>MATCH_URL_MUX.test(url),
    youtube: (url)=>MATCH_URL_YOUTUBE.test(url),
    vimeo: (url)=>MATCH_URL_VIMEO.test(url) && !VIDEO_EXTENSIONS.test(url) && !HLS_EXTENSIONS.test(url),
    wistia: (url)=>MATCH_URL_WISTIA.test(url),
    spotify: (url)=>MATCH_URL_SPOTIFY.test(url),
    twitch: (url)=>MATCH_URL_TWITCH.test(url),
    tiktok: (url)=>MATCH_URL_TIKTOK.test(url)
};
;
}),
"[project]/node_modules/react-player/dist/HtmlPlayer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HtmlPlayer_default
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-player/dist/patterns.js [app-ssr] (ecmascript)");
;
;
const HtmlPlayer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef((props, ref)=>{
    const Media = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUDIO_EXTENSIONS"].test(`${props.src}`) ? "audio" : "video";
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(Media, {
        ...props,
        ref
    }, props.children);
});
var HtmlPlayer_default = HtmlPlayer;
;
}),
"[project]/node_modules/react-player/dist/players.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>players_default
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-player/dist/patterns.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$HtmlPlayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-player/dist/HtmlPlayer.js [app-ssr] (ecmascript)");
;
;
;
const Players = [
    {
        key: "hls",
        name: "hls.js",
        canPlay: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlay"].hls,
        canEnablePIP: ()=>true,
        player: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/node_modules/hls-video-element/dist/react.js [app-ssr] (ecmascript, async loader)"))
    },
    {
        key: "dash",
        name: "dash.js",
        canPlay: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlay"].dash,
        canEnablePIP: ()=>true,
        player: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/node_modules/dash-video-element/dist/react.js [app-ssr] (ecmascript, async loader)"))
    },
    {
        key: "mux",
        name: "Mux",
        canPlay: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlay"].mux,
        canEnablePIP: ()=>true,
        player: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/node_modules/@mux/mux-player-react/dist/index.mjs [app-ssr] (ecmascript, async loader)"))
    },
    {
        key: "youtube",
        name: "YouTube",
        canPlay: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlay"].youtube,
        player: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/node_modules/youtube-video-element/dist/react.js [app-ssr] (ecmascript, async loader)"))
    },
    {
        key: "vimeo",
        name: "Vimeo",
        canPlay: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlay"].vimeo,
        player: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/node_modules/vimeo-video-element/dist/react.js [app-ssr] (ecmascript, async loader)"))
    },
    {
        key: "wistia",
        name: "Wistia",
        canPlay: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlay"].wistia,
        canEnablePIP: ()=>true,
        player: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/node_modules/wistia-video-element/dist/react.js [app-ssr] (ecmascript, async loader)"))
    },
    {
        key: "spotify",
        name: "Spotify",
        canPlay: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlay"].spotify,
        canEnablePIP: ()=>false,
        player: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/node_modules/spotify-audio-element/dist/react.js [app-ssr] (ecmascript, async loader)"))
    },
    {
        key: "twitch",
        name: "Twitch",
        canPlay: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlay"].twitch,
        canEnablePIP: ()=>false,
        player: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/node_modules/twitch-video-element/dist/react.js [app-ssr] (ecmascript, async loader)"))
    },
    {
        key: "tiktok",
        name: "TikTok",
        canPlay: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlay"].tiktok,
        canEnablePIP: ()=>false,
        player: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/node_modules/tiktok-video-element/dist/react.js [app-ssr] (ecmascript, async loader)"))
    },
    {
        key: "html",
        name: "html",
        canPlay: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$patterns$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlay"].html,
        canEnablePIP: ()=>true,
        player: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$HtmlPlayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
    }
];
var players_default = Players;
;
}),
"[project]/node_modules/react-player/dist/props.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultProps",
    ()=>defaultProps
]);
const defaultProps = {
    // Falsy values don't need to be defined
    //
    // native video attrs
    // src: undefined,
    // preload: undefined,
    // crossOrigin: undefined,
    // autoPlay: false,
    // muted: false,
    // loop: false,
    // controls: false,
    // playsInline: false,
    width: "320px",
    height: "180px",
    // native video props
    volume: 1,
    playbackRate: 1,
    // custom props
    // playing: undefined,
    // pip: false,
    // light: false,
    // fallback: null,
    previewTabIndex: 0,
    previewAriaLabel: "",
    oEmbedUrl: "https://noembed.com/embed?url={url}"
};
;
}),
"[project]/node_modules/react-player/dist/Player.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Player_default
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const Player = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef((props, ref)=>{
    const { playing, pip } = props;
    const Player2 = props.activePlayer;
    const playerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startOnPlayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        var _a, _b;
        if (!playerRef.current) return;
        if (playerRef.current.paused && playing === true) {
            playerRef.current.play();
        }
        if (!playerRef.current.paused && playing === false) {
            playerRef.current.pause();
        }
        playerRef.current.playbackRate = (_a = props.playbackRate) != null ? _a : 1;
        playerRef.current.volume = (_b = props.volume) != null ? _b : 1;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        var _a, _b, _c, _d, _e;
        if (!playerRef.current || !globalThis.document) return;
        if (pip && !document.pictureInPictureElement) {
            try {
                (_b = (_a = playerRef.current).requestPictureInPicture) == null ? void 0 : _b.call(_a);
            } catch (err) {}
        }
        if (!pip && document.pictureInPictureElement) {
            try {
                (_d = (_c = playerRef.current).exitPictureInPicture) == null ? void 0 : _d.call(_c);
                (_e = document.exitPictureInPicture) == null ? void 0 : _e.call(document);
            } catch (err) {}
        }
    }, [
        pip
    ]);
    const handleLoadStart = (event)=>{
        var _a, _b;
        startOnPlayRef.current = true;
        (_a = props.onReady) == null ? void 0 : _a.call(props);
        (_b = props.onLoadStart) == null ? void 0 : _b.call(props, event);
    };
    const handlePlay = (event)=>{
        var _a, _b;
        if (startOnPlayRef.current) {
            startOnPlayRef.current = false;
            (_a = props.onStart) == null ? void 0 : _a.call(props, event);
        }
        (_b = props.onPlay) == null ? void 0 : _b.call(props, event);
    };
    if (!Player2) {
        return null;
    }
    const eventProps = {};
    const reactPlayerEventHandlers = [
        "onReady",
        "onStart"
    ];
    for(const key in props){
        if (key.startsWith("on") && !reactPlayerEventHandlers.includes(key)) {
            eventProps[key] = props[key];
        }
    }
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(Player2, {
        ...eventProps,
        style: props.style,
        className: props.className,
        slot: props.slot,
        ref: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((node)=>{
            playerRef.current = node;
            if (typeof ref === "function") {
                ref(node);
            } else if (ref !== null) {
                ref.current = node;
            }
        }, [
            ref
        ]),
        src: props.src,
        crossOrigin: props.crossOrigin,
        preload: props.preload,
        controls: props.controls,
        muted: props.muted,
        autoPlay: props.autoPlay,
        loop: props.loop,
        playsInline: props.playsInline,
        config: props.config,
        onLoadStart: handleLoadStart,
        onPlay: handlePlay
    }, props.children);
});
Player.displayName = "Player";
var Player_default = Player;
;
}),
"[project]/node_modules/react-player/dist/ReactPlayer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createReactPlayer",
    ()=>createReactPlayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-player/dist/props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$Player$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-player/dist/Player.js [app-ssr] (ecmascript)");
;
;
;
const Preview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/node_modules/react-player/dist/Preview.js [app-ssr] (ecmascript, async loader)"));
const customPlayers = [];
const createReactPlayer = (players, playerFallback)=>{
    const getActivePlayer = (src)=>{
        for (const player of [
            ...customPlayers,
            ...players
        ]){
            if (src && player.canPlay(src)) {
                return player;
            }
        }
        if (playerFallback) {
            return playerFallback;
        }
        return null;
    };
    const ReactPlayer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef((_props, ref)=>{
        const props = {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultProps"],
            ..._props
        };
        const { src, slot, className, style, width, height, fallback, wrapper } = props;
        const [showPreview, setShowPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(!!props.light);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
            if (props.light) {
                setShowPreview(true);
            } else {
                setShowPreview(false);
            }
        }, [
            props.light
        ]);
        const handleClickPreview = (e)=>{
            var _a;
            setShowPreview(false);
            (_a = props.onClickPreview) == null ? void 0 : _a.call(props, e);
        };
        const renderPreview = (src2)=>{
            if (!src2) return null;
            const { light, playIcon, previewTabIndex, oEmbedUrl, previewAriaLabel } = props;
            return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(Preview, {
                src: src2,
                light,
                playIcon,
                previewTabIndex,
                previewAriaLabel,
                oEmbedUrl,
                onClickPreview: handleClickPreview
            });
        };
        const renderActivePlayer = (src2)=>{
            var _a, _b;
            const player = getActivePlayer(src2);
            if (!player) return null;
            const { style: style2, width: width2, height: height2, wrapper: wrapper2 } = props;
            const config = (_a = props.config) == null ? void 0 : _a[player.key];
            return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$Player$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                ...props,
                ref,
                activePlayer: (_b = player.player) != null ? _b : player,
                slot: wrapper2 ? void 0 : slot,
                className: wrapper2 ? void 0 : className,
                style: wrapper2 ? {
                    display: "block",
                    width: "100%",
                    height: "100%"
                } : {
                    display: "block",
                    width: width2,
                    height: height2,
                    ...style2
                },
                config
            });
        };
        const Wrapper = wrapper == null ? ForwardChildren : wrapper;
        const UniversalSuspense = fallback === false ? ForwardChildren : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"];
        return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(Wrapper, {
            slot,
            className,
            style: {
                width,
                height,
                ...style
            }
        }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(UniversalSuspense, {
            fallback
        }, showPreview ? renderPreview(src) : renderActivePlayer(src)));
    });
    ReactPlayer.displayName = "ReactPlayer";
    ReactPlayer.addCustomPlayer = (player)=>{
        customPlayers.push(player);
    };
    ReactPlayer.removeCustomPlayers = ()=>{
        customPlayers.length = 0;
    };
    ReactPlayer.canPlay = (src)=>{
        if (src) {
            for (const Player2 of [
                ...customPlayers,
                ...players
            ]){
                if (Player2.canPlay(src)) {
                    return true;
                }
            }
        }
        return false;
    };
    ReactPlayer.canEnablePIP = (src)=>{
        var _a;
        if (src) {
            for (const Player2 of [
                ...customPlayers,
                ...players
            ]){
                if (Player2.canPlay(src) && ((_a = Player2.canEnablePIP) == null ? void 0 : _a.call(Player2))) {
                    return true;
                }
            }
        }
        return false;
    };
    return ReactPlayer;
};
const ForwardChildren = ({ children })=>children;
;
}),
"[project]/node_modules/react-player/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>src_default
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$players$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-player/dist/players.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$ReactPlayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-player/dist/ReactPlayer.js [app-ssr] (ecmascript)");
"use client";
;
;
const fallback = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$players$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"][__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$players$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].length - 1];
var src_default = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$ReactPlayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createReactPlayer"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$player$2f$dist$2f$players$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], fallback);
;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ff43b6a5._.js.map