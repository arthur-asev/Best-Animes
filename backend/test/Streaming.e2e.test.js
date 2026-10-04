import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const secret = "e2e-stream-secret-with-more-than-32-characters";
const apiKey = "e2e-sign-key";

async function listen(server) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
}

async function unusedPort() {
  const server = createServer();
  const port = await listen(server);
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

test("E2E: search → info → episode → watch → sign → stream", { timeout: 15000 }, async (t) => {
  const kuhi = createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    res.setHeader("Content-Type", "application/json");
    if (url.pathname === "/anime/search") {
      res.end(JSON.stringify({ results: [{ id: 21, title: "Fixture Anime" }] }));
    } else if (url.pathname === "/anime/info/21") {
      res.end(JSON.stringify({ id: 21, title: "Fixture Anime" }));
    } else if (url.pathname === "/anime/episodes/21") {
      res.end(JSON.stringify({ providers: { fixture: { episodes: { sub: [{ number: 1 }], dub: [] } } } }));
    } else if (url.pathname === "/anime/extract/21") {
      res.end(JSON.stringify({ provider: "fixture", streams: [{ type: "hls", url: `http://127.0.0.1:${kuhiPort}/master.m3u8` }] }));
    } else if (url.pathname === "/master.m3u8") {
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.end("#EXTM3U\n#EXTINF:4,\nsegment.ts\n");
    } else if (url.pathname === "/segment.ts") {
      res.setHeader("Content-Type", "video/mp2t");
      res.end("segment fixture");
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "not found" }));
    }
  });
  const kuhiPort = await listen(kuhi);
  t.after(() => new Promise((resolve) => kuhi.close(() => resolve())));

  const backendPort = await unusedPort();
  const backendUrl = `http://127.0.0.1:${backendPort}`;
  const child = spawn(process.execPath, ["server-test.js"], {
    cwd: backendDir,
    env: {
      ...process.env,
      NODE_ENV: "test",
      PORT: String(backendPort),
      KUHI_URL: `http://127.0.0.1:${kuhiPort}`,
      STREAM_SECRET: secret,
      SIGN_API_KEY: apiKey,
      ALLOWED_HOSTS: "127.0.0.1",
      PROXY_HOST: backendUrl,
      SERVER_API_REDIS_CONN_URL: "",
    },
    stdio: "ignore",
  });
  t.after(() => child.kill());

  let ready = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Backend exited during startup (${child.exitCode})`);
    try {
      const response = await fetch(`${backendUrl}/health`);
      if (response.ok) { ready = true; break; }
    } catch {}
    await delay(100);
  }
  assert.equal(ready, true, "backend should start");

  const search = await fetch(`${backendUrl}/api/anime/search?q=fixture`).then((response) => response.json());
  assert.equal(search.results[0].title, "Fixture Anime");
  const info = await fetch(`${backendUrl}/api/anime/info/21`).then((response) => response.json());
  assert.equal(info.episodes[0].id, "kuhi:21:1:sub");
  const watch = await fetch(`${backendUrl}/api/anime/watch/kuhi%3A21%3A1%3Asub`).then((response) => response.json());
  assert.match(watch.sources[0].url, /master\.m3u8/);

  const signResponse = await fetch(`${backendUrl}/sign`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({ url: watch.sources[0].url, expiresIn: 120 }),
  });
  assert.equal(signResponse.status, 200);
  const { token } = await signResponse.json();
  const streamResponse = await fetch(`${backendUrl}/stream?token=${encodeURIComponent(token)}`);
  assert.equal(streamResponse.status, 200);
  assert.match(await streamResponse.text(), /\/stream\?token=/);
});
