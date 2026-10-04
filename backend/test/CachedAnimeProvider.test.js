import test from "node:test";
import assert from "node:assert/strict";
import { CachedAnimeProvider } from "../src/providers/anime/CachedAnimeProvider.js";

test("CachedAnimeProvider reuses catalog values from Redis", async () => {
  const entries = new Map();
  const redis = {
    get: async (key) => entries.get(key) ?? null,
    setex: async (key, _ttl, value) => entries.set(key, value),
  };
  let calls = 0;
  const provider = new CachedAnimeProvider({ search: async () => ({ call: ++calls }) }, redis);

  assert.deepEqual(await provider.search("naruto", 1), { call: 1 });
  assert.deepEqual(await provider.search("naruto", 1), { call: 1 });
  assert.equal(calls, 1);
});

test("CachedAnimeProvider keeps playback sources uncached", async () => {
  let calls = 0;
  const provider = new CachedAnimeProvider({ getWatchSources: async () => ({ call: ++calls }) }, {
    get: async () => assert.fail("playback must bypass catalog cache"),
    setex: async () => assert.fail("playback must bypass catalog cache"),
  });

  assert.deepEqual(await provider.getWatchSources("episode"), { call: 1 });
  assert.deepEqual(await provider.getWatchSources("episode"), { call: 2 });
});
