import test from "node:test";
import assert from "node:assert/strict";
import { FallbackAnimeProvider } from "../src/providers/anime/FallbackAnimeProvider.js";

test("FallbackAnimeProvider uses the next provider after an upstream failure", async () => {
  let fallbackCalled = false;
  const primary = { search: async () => { throw new Error("unavailable"); } };
  const fallback = { search: async () => { fallbackCalled = true; return { results: [] }; } };
  const provider = new FallbackAnimeProvider([primary, fallback]);

  assert.deepEqual(await provider.search("query", 1), { results: [] });
  assert.equal(fallbackCalled, true);
});

test("FallbackAnimeProvider does not hide client errors", async () => {
  const badRequest = Object.assign(new Error("invalid id"), { status: 400 });
  const fallback = { getInfo: async () => assert.fail("fallback should not run for invalid input") };
  const provider = new FallbackAnimeProvider([{ getInfo: async () => { throw badRequest; } }, fallback]);

  await assert.rejects(() => provider.getInfo("bad"), badRequest);
});
