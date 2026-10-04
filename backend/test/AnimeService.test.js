import test from "node:test";
import assert from "node:assert/strict";
import { AnimeService } from "../src/services/AnimeService.js";
import { ProviderNotConfiguredError } from "../src/providers/anime/ProviderNotConfiguredError.js";

test("AnimeService delegates catalog operations to its provider", async () => {
  const provider = {
    search: async (query, page) => ({ query, page }),
    getInfo: async (id) => ({ id }),
    getWatchSources: async (id, options) => ({ id, options }),
  };
  const service = new AnimeService(provider);

  assert.deepEqual(await service.search("naruto", 2), { query: "naruto", page: 2 });
  assert.deepEqual(await service.getInfo("anime-1"), { id: "anime-1" });
  assert.deepEqual(await service.getWatchSources("episode-1", { server: "vidstream" }), {
    id: "episode-1", options: { server: "vidstream" },
  });
});

test("AnimeService reports the provider integration as unavailable when unset", async () => {
  await assert.rejects(() => new AnimeService().search("naruto", 1), ProviderNotConfiguredError);
});
