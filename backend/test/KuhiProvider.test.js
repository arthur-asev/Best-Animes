import test from "node:test";
import assert from "node:assert/strict";
import { KuhiProvider } from "../src/providers/anime/KuhiProvider.js";

function createClient(input) {
  const responses = input.responses || input;
  const calls = [];
  return {
    calls,
    async get(path, config = {}) {
      calls.push({ path, config });
      const response = responses.find((item) => path === item.path);
      if (!response) throw new Error(`Unexpected GET ${path}`);
      return { data: response.data };
    },
  };
}

test("KuhiProvider normalizes search results and AniList IDs", async () => {
  const client = createClient({
    responses: [
      { path: "/anime/search", data: { page: 1, results: [{ id: 21, title: { english: "Naruto" } }] } },
    ],
  });
  const provider = new KuhiProvider({ baseUrl: "http://kuhi:8000", client });
  const result = await provider.search("naruto", 1);

  assert.equal(result.results[0].id, "21");
  assert.equal(result.results[0].title, "Naruto");
  assert.equal(client.calls[0].config.params.query, "naruto");
});

test("KuhiProvider maps provider episode lists to internal IDs", async () => {
  const client = createClient({
    responses: [
      { path: "/anime/info/21", data: { id: 21, title: { english: "Naruto" } } },
      {
        path: "/anime/episodes/21",
        data: {
          providers: {
            anineko: {
              episodes: {
                sub: [{ number: 1, title: "Enter Naruto" }],
                dub: [{ number: 1, title: "Enter Naruto Dub" }],
              },
            },
          },
        },
      },
    ],
  });
  const provider = new KuhiProvider({ baseUrl: "http://kuhi:8000", client });
  const result = await provider.getInfo("21");

  assert.deepEqual(result.episodes.map((episode) => episode.id), [
    "kuhi:21:1:dub",
    "kuhi:21:1:sub",
  ]);
});

test("KuhiProvider extracts streams and preserves referer", async () => {
  const client = createClient({
    responses: [
      {
        path: "/anime/extract/21",
        data: {
          provider: "anineko",
          streams: [{ type: "hls", url: "https://cdn.example/master.m3u8", referer: "https://provider.example/" }],
          subtitles: [{ lang: "en", url: "https://cdn.example/en.vtt" }],
        },
      },
    ],
  });
  const provider = new KuhiProvider({ baseUrl: "http://kuhi:8000", client });
  const result = await provider.getWatchSources("kuhi:21:1:sub");

  assert.equal(result.sources[0].type, "application/x-mpegURL");
  assert.equal(result.sources[0].url, "https://cdn.example/master.m3u8");
  assert.equal(result.headers.Referer, "https://provider.example/");
  assert.equal(client.calls[0].config.params.type, "sub");
  assert.equal(client.calls[0].config.params.e, 1);
});

test("KuhiProvider rejects invalid internal episode IDs", async () => {
  const provider = new KuhiProvider({ client: createClient({ responses: [] }) });
  await assert.rejects(() => provider.getWatchSources("episode-1"), { status: 400 });
});

test("KuhiProvider maps HLS, MP4 and DASH types and retains subtitles", async () => {
  const client = createClient({
    responses: [{
      path: "/anime/extract/21",
      data: {
        streams: [
          { type: "hls", url: "https://cdn.example/master.m3u8" },
          { type: "mp4", url: "https://cdn.example/video.mp4" },
          { type: "dash", url: "https://cdn.example/manifest.mpd" },
        ],
        subtitles: [{ lang: "en", url: "https://cdn.example/en.vtt" }],
      },
    }],
  });
  const result = await new KuhiProvider({ client }).getWatchSources("kuhi:21:1:sub");

  assert.deepEqual(result.sources.map((source) => source.type), [
    "application/x-mpegURL", "video/mp4", "application/dash+xml",
  ]);
  assert.equal(result.subtitles[0].lang, "en");
});

test("KuhiProvider propagates upstream 404 and timeout errors", async () => {
  const notFound = Object.assign(new Error("not found"), { response: { status: 404 } });
  const timedOut = Object.assign(new Error("timeout"), { code: "ECONNABORTED" });
  const provider404 = new KuhiProvider({ client: { get: async () => { throw notFound; } } });
  const providerTimeout = new KuhiProvider({ client: { get: async () => { throw timedOut; } } });

  await assert.rejects(() => provider404.search("missing"), notFound);
  await assert.rejects(() => providerTimeout.search("slow"), timedOut);
});

test("KuhiProvider propagates unavailable extraction providers", async () => {
  const unavailable = Object.assign(new Error("provider unavailable"), { response: { status: 503 } });
  const provider = new KuhiProvider({ client: { get: async () => { throw unavailable; } } });
  await assert.rejects(() => provider.getWatchSources("kuhi:21:1:sub"), unavailable);
});
