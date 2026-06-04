import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function exists(pathname) {
  return existsSync(new URL(pathname, dist));
}

async function read(pathname) {
  return readFile(new URL(pathname, dist), "utf8");
}

assert(exists("index.html"), "Expected dist/index.html to exist");
assert(exists("projects/index.html"), "Expected dist/projects/index.html to exist");
assert(exists("projects/personal-blog-system/index.html"), "Expected project detail page to exist");
assert(exists("writing/index.html"), "Expected dist/writing/index.html to exist");
assert(exists("writing/building-a-personal-site/index.html"), "Expected writing detail page to exist");
assert(exists("notes/index.html"), "Expected dist/notes/index.html to exist");
assert(exists("notes/first-note/index.html"), "Expected note detail page to exist");
assert(!exists("notes/private-draft-note/index.html"), "Draft note detail page should not exist");
assert(exists("about/index.html"), "Expected dist/about/index.html to exist");
assert(exists("rss.xml"), "Expected RSS feed to exist");
assert(exists("sitemap-index.xml"), "Expected sitemap index to exist");

const home = await read("index.html");
assert(home.includes("Syd Studio"), "Homepage should include site name");
assert(home.includes("作品、文章和想法放在同一个现场"), "Homepage should include approved hero copy");
assert(home.includes("Now"), "Homepage should include Now panel");
assert(home.includes("Focus"), "Homepage should include Focus panel");
assert(!home.includes("Private Draft Note"), "Homepage should not include draft note");

const notesIndex = await read("notes/index.html");
assert(notesIndex.includes("First Note"), "Notes page should include public note");
assert(!notesIndex.includes("Private Draft Note"), "Notes page should not include draft note");

const rss = await read("rss.xml");
assert(rss.includes("Building a Personal Site That Can Grow"), "RSS should include writing post");
assert(rss.includes("First Note"), "RSS should include public note");
assert(!rss.includes("Private Draft Note"), "RSS should not include draft note");

console.log("Build verification passed.");
