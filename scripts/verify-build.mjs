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

function hasLinkWithAttribute(html, href, attribute) {
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const linkPattern = new RegExp(`<a\\b(?=[^>]*href="${escapedHref}")(?=[^>]*${escapedAttribute})[^>]*>`);
  return linkPattern.test(html);
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
assert(home.includes('<meta property="og:type" content="website">'), "Homepage should use website Open Graph type");

const about = await read("about/index.html");
assert(about.includes('href="mailto:'), "About page should include an email contact link");
assert(about.includes('href="https://github.com/'), "About page should include a GitHub profile link");

const projectsIndex = await read("projects/index.html");
assert(projectsIndex.includes('src="/images/personal-blog-system-cover.png"'), "Project card should render project cover image");
assert(projectsIndex.includes('alt="Personal Blog System preview"'), "Project cover should have descriptive alt text");
assert(
  projectsIndex.includes('aria-label="View Personal Blog System demo"'),
  "Project demo link should have a project-specific accessible name",
);

const projectDetail = await read("projects/personal-blog-system/index.html");
assert(projectDetail.includes('src="/images/personal-blog-system-cover.png"'), "Project detail should render project cover image");
assert(
  projectDetail.includes('aria-label="View Personal Blog System demo"'),
  "Project detail demo link should have a project-specific accessible name",
);

const writingIndex = await read("writing/index.html");
assert(
  hasLinkWithAttribute(writingIndex, "/writing/", 'aria-current="page"'),
  "Writing index should mark its exact nav link as the current page",
);

const notesIndex = await read("notes/index.html");
assert(notesIndex.includes("First Note"), "Notes page should include public note");
assert(!notesIndex.includes("Private Draft Note"), "Notes page should not include draft note");

const writingDetail = await read("writing/building-a-personal-site/index.html");
assert(
  !hasLinkWithAttribute(writingDetail, "/writing/", 'aria-current="page"'),
  "Writing detail page should not mark the Writing section link as the current page",
);
assert(
  writingDetail.includes('<meta property="og:type" content="article">'),
  "Writing detail should use article Open Graph type",
);

const noteDetail = await read("notes/first-note/index.html");
assert(noteDetail.includes('<meta property="og:type" content="article">'), "Note detail should use article Open Graph type");

const rss = await read("rss.xml");
assert(rss.includes("Building a Personal Site That Can Grow"), "RSS should include writing post");
assert(rss.includes("First Note"), "RSS should include public note");
assert(!rss.includes("Private Draft Note"), "RSS should not include draft note");

console.log("Build verification passed.");
