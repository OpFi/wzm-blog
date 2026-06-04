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
assert(exists("writing/index.html"), "Expected dist/writing/index.html to exist");
assert(exists("notes/index.html"), "Expected dist/notes/index.html to exist");
assert(exists("daily/index.html"), "Expected dist/daily/index.html to exist");
assert(!exists("notes/private-draft-note/index.html"), "Draft note detail page should not exist");
assert(exists("about/index.html"), "Expected dist/about/index.html to exist");
assert(exists("rss.xml"), "Expected RSS feed to exist");
assert(exists("sitemap-index.xml"), "Expected sitemap index to exist");

const expectedProjects = [
  ["personal-blog-system", "个人博客系统"],
  ["reading-notes-hub", "阅读笔记中枢"],
  ["lightweight-crm-prototype", "轻量 CRM 原型"],
  ["deploy-watch-dashboard", "部署观察看板"],
];

const expectedWriting = [
  ["building-a-personal-site", "把个人网站做成长期资产"],
  ["astro-content-workflow", "用 Astro Content Collections 管理写作工作流"],
  ["designing-small-tools", "设计小工具时，我会先写下这些边界"],
  ["vercel-deployment-notes", "一次 Vercel 静态站点上线记录"],
];

const expectedNotes = [
  ["first-note", "第一条公开随记"],
  ["morning-build-log", "上午的构建记录"],
  ["interface-copy-note", "界面文案要像路标"],
  ["deployment-checklist-note", "上线前检查清单"],
  ["reading-capture-note", "读书摘录的入口要短"],
  ["product-scope-note", "先砍掉范围，再开始实现"],
];

for (const [slug] of expectedProjects) {
  assert(exists(`projects/${slug}/index.html`), `Expected project page for ${slug} to exist`);
}

for (const [slug] of expectedWriting) {
  assert(exists(`writing/${slug}/index.html`), `Expected writing page for ${slug} to exist`);
}

for (const [slug] of expectedNotes) {
  assert(exists(`notes/${slug}/index.html`), `Expected note page for ${slug} to exist`);
}

const home = await read("index.html");
assert(home.includes('<html lang="zh-CN">'), "Homepage should declare Simplified Chinese language");
assert(home.includes("王子明的数字工作室"), "Homepage should include Chinese site name");
assert(home.includes("首页"), "Homepage should include Chinese Home nav label");
assert(home.includes("技术"), "Homepage should include Chinese Tech nav label");
assert(home.includes("随笔"), "Homepage should include Chinese Essays nav label");
assert(home.includes("日常"), "Homepage should include Chinese Daily nav label");
assert(home.includes("项目"), "Homepage should include Chinese Projects nav label");
assert(home.includes("关于"), "Homepage should include Chinese About nav label");
assert(home.includes("写代码，也写下代码背后的生活"), "Homepage should include blog-style hero copy");
assert(home.includes("最新更新"), "Homepage should include latest updates section");
assert(home.includes("分类索引"), "Homepage should include category index section");
assert(home.includes("现在"), "Homepage should include localized Now panel");
assert(home.includes("关注"), "Homepage should include localized Focus panel");
assert(!home.includes("仅自己可见的草稿"), "Homepage should not include draft note");
assert(home.includes('<meta property="og:type" content="website">'), "Homepage should use website Open Graph type");

const about = await read("about/index.html");
assert(about.includes("关于我"), "About page should be localized");
assert(about.includes('href="mailto:'), "About page should include an email contact link");
assert(about.includes('href="https://github.com/'), "About page should include a GitHub profile link");

const projectsIndex = await read("projects/index.html");
for (const [, title] of expectedProjects) {
  assert(projectsIndex.includes(title), `Projects page should include ${title}`);
}
assert(projectsIndex.includes('src="/images/personal-blog-system-cover.png"'), "Project card should render project cover image");
assert(projectsIndex.includes('alt="个人博客系统预览"'), "Project cover should have descriptive Chinese alt text");
assert(
  projectsIndex.includes('aria-label="查看个人博客系统演示"'),
  "Project demo link should have a project-specific accessible name",
);

const projectDetail = await read("projects/personal-blog-system/index.html");
assert(projectDetail.includes('src="/images/personal-blog-system-cover.png"'), "Project detail should render project cover image");
assert(
  projectDetail.includes('aria-label="查看个人博客系统演示"'),
  "Project detail demo link should have a project-specific accessible name",
);

const writingIndex = await read("writing/index.html");
for (const [, title] of expectedWriting) {
  assert(writingIndex.includes(title), `Writing page should include ${title}`);
}
assert(
  hasLinkWithAttribute(writingIndex, "/writing/", 'aria-current="page"'),
  "Writing index should mark its exact nav link as the current page",
);

const notesIndex = await read("notes/index.html");
for (const [, title] of expectedNotes) {
  assert(notesIndex.includes(title), `Notes page should include ${title}`);
}
assert(!notesIndex.includes("仅自己可见的草稿"), "Notes page should not include draft note");

const dailyIndex = await read("daily/index.html");
assert(dailyIndex.includes("日常"), "Daily page should include daily heading");
assert(dailyIndex.includes("今天只修一个小问题"), "Daily page should include daily note");
assert(!dailyIndex.includes("仅自己可见的草稿"), "Daily page should not include draft note");

const writingDetail = await read("writing/building-a-personal-site/index.html");
assert(
  !hasLinkWithAttribute(writingDetail, "/writing/", 'aria-current="page"'),
  "Writing detail page should not mark the Writing section link as the current page",
);
assert(
  writingDetail.includes('<meta property="og:type" content="article">'),
  "Writing detail should use article Open Graph type",
);
assert(writingDetail.includes("约") && writingDetail.includes("分钟阅读"), "Writing detail should include reading time");
assert(writingDetail.includes("较早一篇"), "Writing detail should include older article navigation");
assert(writingDetail.includes("我希望这个网站不是一次性作品"), "Writing detail should include realistic Chinese article copy");

const noteDetail = await read("notes/first-note/index.html");
assert(noteDetail.includes('<meta property="og:type" content="article">'), "Note detail should use article Open Graph type");
assert(noteDetail.includes("随笔") || noteDetail.includes("日常"), "Note detail should include localized entry type metadata");
assert(noteDetail.includes("先把公开工作台搭起来"), "Note detail should include realistic Chinese note copy");

const rss = await read("rss.xml");
assert(rss.includes("把个人网站做成长期资产"), "RSS should include Chinese writing post");
assert(rss.includes("第一条公开随记"), "RSS should include Chinese public note");
assert(rss.includes("一次 Vercel 静态站点上线记录"), "RSS should include additional Chinese writing post");
assert(!rss.includes("仅自己可见的草稿"), "RSS should not include draft note");

console.log("Build verification passed.");
