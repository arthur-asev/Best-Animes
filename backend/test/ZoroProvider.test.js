import test from "node:test";
import assert from "node:assert/strict";
import { ZoroProvider } from "../src/providers/anime/ZoroProvider.js";

test("ZoroProvider normalizes search and info for the app domain", async () => {
  const fakeZoro = {
    search: async () => ({ results: [{ id: "anime-1", title: { english: "Naruto" } }] }),
    fetchAnimeInfo: async () => ({
      id: "anime-1",
      title: { english: "Naruto" },
      episodes: [{ id: "ep-1", number: "1", isSubbed: 1 }],
    }),
  };
  const provider = new ZoroProvider(fakeZoro);

  assert.equal((await provider.search("naruto")).results[0].title, "Naruto");
  assert.deepEqual((await provider.getInfo("anime-1")).episodes[0], {
    id: "ep-1", number: 1, isSubbed: true, title: "Episode 1",
  });
});

test("ZoroProvider validates the requested streaming server", async () => {
  let called = false;
  const provider = new ZoroProvider({
    fetchEpisodeSources: async () => { called = true; return { sources: [] }; },
  });

  await assert.rejects(() => provider.getWatchSources("ep-1", { server: "http://localhost" }), { status: 400 });
  assert.equal(called, false);
});

test("ZoroProvider normalizes recent episodes and top airing", async () => {
  const fakeZoro = {
    fetchRecentlyUpdated: async () => ({ results: [{ id: "recent-1", title: "Recent" }] }),
    fetchTopAiring: async () => ({ results: [{ id: "airing-1", title: "Airing" }] }),
  };
  const provider = new ZoroProvider(fakeZoro);

  assert.equal((await provider.getRecentEpisodes()).results[0].title, "Recent");
  assert.equal((await provider.getTopAiring()).results[0].title, "Airing");
});
