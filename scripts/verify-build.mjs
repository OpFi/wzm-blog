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

async function readLinkedStyles(html) {
  return (
    await Promise.all(
      [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((match) =>
        read(match[1].replace(/^\//, "")),
      ),
    )
  ).join("\n");
}

function hasLinkWithAttribute(html, href, attribute) {
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const linkPattern = new RegExp(`<a\\b(?=[^>]*href="${escapedHref}")(?=[^>]*${escapedAttribute})[^>]*>`);
  return linkPattern.test(html);
}

function assertNoFooter(html, pageName) {
  assert(!html.includes("使用 Astro 构建"), `${pageName} should not include the shared footer copy`);
  assert(!html.includes('<footer'), `${pageName} should not render a footer element`);
}

assert(exists("index.html"), "Expected dist/index.html to exist");
assert(exists("projects/index.html"), "Expected dist/projects/index.html to exist");
assert(exists("writing/index.html"), "Expected dist/writing/index.html to exist");
assert(exists("notes/index.html"), "Expected dist/notes/index.html to exist");
assert(exists("daily/index.html"), "Expected dist/daily/index.html to exist");
assert(exists("images/blog-logo.svg"), "Expected blog logo asset to exist");
assert(exists("images/profile-avatar.jpg"), "Expected profile avatar image to exist");
assert(exists("images/qq-qr.jpg"), "Expected QQ QR image to exist");
assert(exists("images/wechat-qr.png"), "Expected WeChat QR image to exist");
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
const homeStyles = await readLinkedStyles(home);
assert(home.includes('<html lang="zh-CN">'), "Homepage should declare Simplified Chinese language");
assert(!home.includes('aria-label="王子明的数字工作室 home"'), "Homepage should not render the visible header brand link");
assert(home.includes('src="/images/blog-logo.svg"'), "Homepage should render the blog logo in the header");
assert(home.includes('alt="绿色书本羽毛 Logo"'), "Homepage logo should have descriptive alt text");
assert(homeStyles.includes("scrollbar-gutter:stable"), "Site CSS should reserve scrollbar gutter to prevent nav shift");
assert(home.includes("px-3 py-1.5"), "Header nav links should use the larger comfortable padding");
const oldHomeBrownTokens = ["#7c4a1e", "#8a4f1c", "#8a5a2b"];
for (const token of oldHomeBrownTokens) {
  assert(!homeStyles.includes(token), `Homepage styles should not use the old brown color ${token}`);
}
assert(home.includes("首页"), "Homepage should include Chinese Home nav label");
assert(home.includes("技术"), "Homepage should include Chinese Tech nav label");
assert(home.includes("随笔"), "Homepage should include Chinese Essays nav label");
assert(home.includes("日常"), "Homepage should include Chinese Daily nav label");
assert(home.includes("项目"), "Homepage should include Chinese Projects nav label");
assert(home.includes("关于"), "Homepage should include Chinese About nav label");
assert(home.includes("精选文章"), "Homepage should include the selected articles heading");
assert(home.includes('aria-label="精选文章列表"'), "Homepage should include the selected article list");
assert(home.includes('aria-label="个人信息卡片"'), "Homepage should include the profile sidebar card");
assert(home.includes('src="/images/profile-avatar.jpg"'), "Homepage should render the custom profile avatar");
assert(home.includes("你好，我是小志，欢迎来到我的网站"), "Homepage profile card should include custom intro copy");
assert(home.includes("这里是我分享技术文章、生活点滴的地方。"), "Homepage profile card should include custom body copy");
assert(home.includes("希望你能在这里收获知识或者好心情。"), "Homepage profile card should include custom closing copy");
assert(home.includes("博客发布"), "Homepage profile stats should include blog publish label");
assert(home.includes("网站运行"), "Homepage profile stats should include site running label");
assert(home.includes('href="/images/qq-qr.jpg"'), "Homepage should link QQ icon to the QQ QR image");
assert(home.includes('href="/images/wechat-qr.png"'), "Homepage should link WeChat icon to the WeChat QR image");
assert(home.includes('aria-label="QQ"'), "Homepage should include QQ icon link");
assert(home.includes('aria-label="微信"'), "Homepage should include WeChat icon link");
assert(home.includes('aria-label="邮箱"'), "Homepage should include email icon link");
assert(home.includes('aria-label="GitHub"'), "Homepage should include GitHub icon link");
assert(home.includes("把个人网站做成长期资产"), "Homepage should include writing content");
assert(home.includes("第一条公开随记"), "Homepage should include note content");
assert(!home.includes("绿色丝带从右向左飘动的动画"), "Homepage should not include the ribbon animation");
assert(!home.includes("循环生长的绿色叶片动画"), "Homepage should not include the previous leaf animation");
const removedHomeSections = ["最新更新", "分类索引", "友情链接", "青木开发日志"];
for (const section of removedHomeSections) {
  assert(!home.includes(section), `Homepage should not include removed section: ${section}`);
}
assert(!home.includes("仅自己可见的草稿"), "Homepage should not include draft note");
assertNoFooter(home, "Homepage");
assert(home.includes('<meta property="og:type" content="website">'), "Homepage should use website Open Graph type");

const about = await read("about/index.html");
assertNoFooter(about, "About page");
assert(about.includes("关于我"), "About page should be localized");
assert(about.includes('href="mailto:'), "About page should include an email contact link");
assert(about.includes('href="https://github.com/'), "About page should include a GitHub profile link");

const projectsIndex = await read("projects/index.html");
assertNoFooter(projectsIndex, "Projects page");
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
const writingStyles = await readLinkedStyles(writingIndex);
assertNoFooter(writingIndex, "Writing page");
for (const [, title] of expectedWriting) {
  assert(writingIndex.includes(title), `Writing page should include ${title}`);
}
assert(
  /\.index-hero[^{]+h1[^{]*\{[^}]*color:#14532d/.test(writingStyles),
  "Writing page hero title should use the homepage selected-articles title color",
);
assert(writingIndex.includes("data-index-root"), "Writing page should use the shared article index shell");
assert(writingIndex.includes("data-filter-card"), "Writing page should include the right-side filter card hook");
assert(writingIndex.includes('aria-label="技术文章筛选"'), "Writing page should include the search/filter card");
assert(writingIndex.includes('placeholder="搜索文章"'), "Writing page should include a search input");
assert(writingIndex.includes("文章标签"), "Writing page should include the article tags heading");
assert(writingIndex.includes("data-writing-search"), "Writing page should include a searchable input data hook");
assert(writingIndex.includes("data-writing-card"), "Writing page should include filterable article card hooks");
assert(writingIndex.includes('data-filter-tag="全部"'), "Writing page should include an all-tag filter");
assert(writingIndex.includes('data-filter-tag="Astro"'), "Writing page should include a real Astro tag filter");
assert(writingIndex.includes("writingFilterState"), "Writing page should include the client-side filter script");
assert(writingIndex.includes("data-pagination"), "Writing page should include pagination controls");
assert(writingIndex.includes("data-page-prev"), "Writing page should include a previous-page control");
assert(writingIndex.includes("data-page-next"), "Writing page should include a next-page control");
assert(writingIndex.includes("data-page-input"), "Writing page should include a jump-to-page input");
assert(writingIndex.includes('inputmode="numeric"'), "Writing page pagination input should use numeric input mode");
assert(writingIndex.includes("paginationJumpToPage"), "Writing page should include page-jump behavior");
assert(
  hasLinkWithAttribute(writingIndex, "/writing/", 'aria-current="page"'),
  "Writing index should mark its exact nav link as the current page",
);

const notesIndex = await read("notes/index.html");
const notesStyles = await readLinkedStyles(notesIndex);
assertNoFooter(notesIndex, "Notes page");
for (const [, title] of expectedNotes) {
  assert(notesIndex.includes(title), `Notes page should include ${title}`);
}
assert(
  /\.index-hero[^{]+h1[^{]*\{[^}]*color:#14532d/.test(notesStyles),
  "Notes page hero title should use the homepage selected-articles title color",
);
assert(notesIndex.includes("data-index-root"), "Notes page should use the shared article index shell");
assert(notesIndex.includes("data-filter-card"), "Notes page should include the right-side filter card hook");
assert(notesIndex.includes('aria-label="随笔筛选"'), "Notes page should include the essay search/filter card");
assert(notesIndex.includes('placeholder="搜索随笔"'), "Notes page should include a note search input");
assert(notesIndex.includes("文章标签"), "Notes page should include the article tags heading");
assert(notesIndex.includes("data-pagination"), "Notes page should include pagination controls");
assert(notesIndex.includes("data-page-prev"), "Notes page should include a previous-page control");
assert(notesIndex.includes("data-page-next"), "Notes page should include a next-page control");
assert(notesIndex.includes("data-page-input"), "Notes page should include a jump-to-page input");
assert(notesIndex.includes('aria-label="输入页码"'), "Notes page should label the page jump input");
assert(notesIndex.includes("paginationJumpToPage"), "Notes page should include page-jump behavior");
assert(!notesIndex.includes("仅自己可见的草稿"), "Notes page should not include draft note");

const dailyIndex = await read("daily/index.html");
const dailyStyles = await readLinkedStyles(dailyIndex);
assertNoFooter(dailyIndex, "Daily page");
assert(dailyIndex.includes("小志的点滴"), "Daily page should include the chronology title");
assert(dailyIndex.includes("ATMOSPHERIC CHRONOLOGY"), "Daily page should include the atmospheric subtitle");
assert(dailyIndex.includes("data-daily-root"), "Daily page should include the daily timeline root");
assert(dailyIndex.includes("data-month-nav"), "Daily page should include year/month navigation");
assert(dailyIndex.includes("data-year-section"), "Daily page should include collapsible year sections");
assert(dailyIndex.includes("data-year-months"), "Daily page should include collapsible month lists");
assert(dailyIndex.includes("data-daily-card"), "Daily page should include daily timeline cards");
assert(dailyIndex.includes("data-daily-filter"), "Daily page should include tag filter controls");
assert(dailyIndex.includes("data-daily-tag"), "Daily page should include tag metadata hooks");
assert(dailyIndex.includes("updateActiveDailyYear"), "Daily page should update month navigation while scrolling");
assert(dailyIndex.includes("LIFE'S NOTE"), "Daily page should include the right-side note card");
assert(dailyIndex.includes("美食"), "Daily page should include the food tag");
assert(dailyIndex.includes("游戏"), "Daily page should include the game tag");
assert(dailyIndex.includes("摘抄"), "Daily page should include the excerpt tag");
assert(dailyIndex.includes("2026年5月"), "Daily page should include month groups");
assert(
  /\.daily-filter-panel[^{]*\{[^}]*background:/.test(dailyStyles),
  "Daily filter panel should render as a card with a background",
);
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
