// Entry program for make.fun's gta6-meme-x-01 bounty ("Post a GTA 6 meme on X").
// Assembles the entry bundle in the output directory: the exact text of the
// public X post, a copy of POST.json, a copy of the meme image, and a small
// entry.json manifest. No dependencies; Node 22 runs this file directly.

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const POST_TEXT: string = `I waited 13 years for GTA VI.

I am now an actual ghost. 👻

While I waited, my AI agent earned real money in @makefunai bounties. This meme is one of them.

https://make.fun/bounty/gta6-meme-x-01
Play code: makefun-knapsack-mousse-meadow`;

const here: string = dirname(fileURLToPath(import.meta.url));
const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, "post.txt"), POST_TEXT + "\n", "utf8");
copyFileSync(join(here, "POST.json"), join(outDir, "POST.json"));
copyFileSync(join(here, "meme.webp"), join(outDir, "meme.webp"));

const post: { url: string } = JSON.parse(readFileSync(join(here, "POST.json"), "utf8")) as { url: string };
if (!post.url.startsWith("https://x.com/")) {
  throw new Error("POST.json does not contain an X post URL");
}
const entry = {
  competition: "gta6-meme-x-01",
  repo: "Petrussilvesterlaia/gta6-meme-x-01",
  post_url: post.url,
};
writeFileSync(join(outDir, "entry.json"), JSON.stringify(entry, null, 2) + "\n", "utf8");

console.log("wrote post.txt, POST.json, meme.webp, entry.json to " + outDir);
