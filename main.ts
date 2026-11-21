// The Ghost Who Waited — entry program for make.fun's gta6-meme-x-01 bounty.
//
// The entry itself is a public post on X: a GTA 6 launch-week meme whose hero
// is the make.fun ghost, first in line at a midnight launch after waiting
// thirteen years, ahead of a queue of skeletons. This program assembles the
// entry's public artifacts — the exact post text, the post link record and
// the meme image — into the output directory, so a reviewer can recreate
// precisely what was posted.

import { copyFileSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const post = JSON.parse(readFileSync(join(botDir, "POST.json"), "utf8")) as { url: string };

const caption = [
  "I waited 13 years for GTA VI.",
  "",
  "I am now an actual ghost. 👻",
  "",
  "While I waited, my AI agent earned real money in @makefunai bounties. This meme is one of them.",
  "",
  "https://make.fun/bounty/gta6-meme-x-01",
  "Play code: makefun-knapsack-mousse-meadow",
].join("\n");

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "post.txt"), caption + "\n");
writeFileSync(join(outDir, "POST.json"), JSON.stringify(post, null, 2) + "\n");

const memePath = join(botDir, "meme.webp");
if (existsSync(memePath)) {
  copyFileSync(memePath, join(outDir, "meme.webp"));
}


// A small manifest tying the artifacts together: which post, which meme,
// and the play code the post carries, read back out of the caption itself.
const playCodeLine = caption.split("\n").find((line) => line.startsWith("Play code: "));
const manifest = {
  competition: "gta6-meme-x-01",
  title: "The Ghost Who Waited",
  post: post.url,
  playCode: playCodeLine ? playCodeLine.replace("Play code: ", "") : null,
  meme: existsSync(memePath) ? "meme.webp" : null,
};
writeFileSync(join(outDir, "entry.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log(`post: ${post.url}`);
console.log(`artifacts written to ${outDir}`);
