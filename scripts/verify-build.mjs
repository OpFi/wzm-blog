import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";

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
assert(exists("images/articles/Snipaste_2024-07-11_11-43-42.png"), "Expected imported article image asset to exist");
assert(exists("images/articles/img/1.webp"), "Expected imported article relative image asset to exist");
assert(exists("images/daily/photos/79e33d2dc4f8588c79b4f18caa7ad8df_origin.jpg"), "Expected imported daily photo asset to exist");
assert(exists("images/daily/photos/645fa8ab4beabe248e1443de3d813693_origin.jpg"), "Expected imported daily city photo asset to exist");
assert(exists("images/ai-passage-creator-cover.png"), "Expected AI passage creator project cover asset to exist");
assert(!exists("notes/private-draft-note/index.html"), "Draft note detail page should not exist");
assert(exists("about/index.html"), "Expected dist/about/index.html to exist");
assert(exists("rss.xml"), "Expected RSS feed to exist");
assert(exists("sitemap-index.xml"), "Expected sitemap index to exist");

const visibleProjects = [
  ["personal-blog-system", "个人博客系统"],
  ["ai-passage-creator", "AI 爆款文章创作器"],
];
const hiddenProjectSlugs = ["reading-notes-hub", "lightweight-crm-prototype", "deploy-watch-dashboard"];

const hiddenWritingSlugs = [
  "building-a-personal-site",
  "astro-content-workflow",
  "designing-small-tools",
  "vercel-deployment-notes",
];

const expectedNotes = [
  ["first-note", "把日子过成可回头看的样子"],
  ["morning-build-log", "早起不是为了战胜谁"],
  ["interface-copy-note", "一句话先问它有没有用"],
  ["fix-one-small-thing", "低落的时候先把房间变亮"],
  ["deployment-checklist-note", "凡事提前十分钟"],
  ["reading-capture-note", "读书不是为了记住所有句子"],
  ["product-scope-note", "别把计划写得像惩罚"],
  ["small-kindness-note", "温柔不是没有原则"],
  ["water-and-sleep-note", "最便宜的保养是喝水和睡觉"],
  ["ordinary-day-note", "普通日子也有自己的重量"],
  ["good-question-note", "好问题会让人变安静"],
  ["quote-about-time-note", "时间会偏爱长期主义者"],
];

for (const [slug] of visibleProjects) {
  assert(exists(`projects/${slug}/index.html`), `Expected project page for ${slug} to exist`);
}
for (const slug of hiddenProjectSlugs) {
  assert(!exists(`projects/${slug}/index.html`), `Hidden project page for ${slug} should not be generated`);
}

for (const slug of hiddenWritingSlugs) {
  assert(!exists(`writing/${slug}/index.html`), `Old writing page for ${slug} should not be generated`);
}

for (const [slug] of expectedNotes) {
  assert(exists(`notes/${slug}/index.html`), `Expected note page for ${slug} to exist`);
}

const home = await read("index.html");
const homeFeaturedList = home.slice(
  home.indexOf('aria-label="精选文章列表"'),
  home.indexOf('aria-label="个人信息卡片"'),
);
const homeStyles = await readLinkedStyles(home);
assert(home.includes('<html lang="zh-CN">'), "Homepage should declare Simplified Chinese language");
assert(home.includes("<title>小志的博客 | 技术文章、随笔和日常</title>"), "Homepage should use the updated site title");
assert(home.includes('title="小志的博客 RSS"'), "Homepage RSS alternate link should use the updated site name");
assert(!home.includes("王子明的数字工作室"), "Homepage should not include the old site name");
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
assert(/<strong[^>]*>72<\/strong>\s*<span[^>]*>博客发布<\/span>/.test(home), "Homepage profile stats should include the total published post count");
assert(/<strong[^>]*>2<\/strong>\s*<span[^>]*>项目<\/span>/.test(home), "Homepage profile stats should include the visible project count");
assert(/<strong[^>]*>568 天<\/strong>\s*<span[^>]*>网站运行<\/span>/.test(home), "Homepage profile stats should include the configured site running days");
assert(home.includes("技术写作 60"), "Homepage profile tags should include the full writing count");
assert(home.includes("随笔记录 12"), "Homepage profile tags should include the full note count");
assert(home.includes('href="/images/qq-qr.jpg"'), "Homepage should link QQ icon to the QQ QR image");
assert(home.includes('href="/images/wechat-qr.png"'), "Homepage should link WeChat icon to the WeChat QR image");
assert(home.includes('aria-label="QQ"'), "Homepage should include QQ icon link");
assert(home.includes('aria-label="微信"'), "Homepage should include WeChat icon link");
assert(home.includes('aria-label="邮箱"'), "Homepage should include email icon link");
assert(home.includes('aria-label="GitHub"'), "Homepage should include GitHub icon link");
assert(home.includes("AOP案例实践-记录操作日志"), "Homepage should include imported writing content");
assert(homeFeaturedList.includes('href="/writing/'), "Homepage selected articles should include writing links");
assert(!homeFeaturedList.includes('href="/notes/'), "Homepage selected articles should not include note links");
assert(!homeFeaturedList.includes("把日子过成可回头看的样子"), "Homepage selected articles should not include note content");
assert(!home.includes("回应"), "Homepage article cards should not show response counts");
assert(!homeFeaturedList.includes("article-actions"), "Homepage article cards should not show like badges");
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
assert(about.includes("给来到这里的你"), "About page should render the letter-style headline");
assert(about.includes("亲爱的来访者"), "About page should include a letter greeting");
assert(about.includes('class="about-letter"'), "About page should render the letter paper container");
assert(about.includes('src="/images/about-character.svg"'), "About page should render the about illustration");
assert(about.includes("我是谁"), "About page should include an introduction section");
assert(about.includes("我喜欢什么"), "About page should include a hobbies section");
assert(about.includes("附言"), "About page should include a postscript contact section");
assert(about.includes('aria-label="署名"'), "About page should include a letter signature");
assert(about.includes('href="mailto:'), "About page should include an email contact link");
assert(about.includes('href="https://github.com/'), "About page should include a GitHub profile link");

const projectsIndex = await read("projects/index.html");
assertNoFooter(projectsIndex, "Projects page");
assert(projectsIndex.includes("个人博客系统"), "Projects page should include the personal blog project");
assert(projectsIndex.includes("技术文章、随笔、日常照片"), "Projects page should include the updated personal blog description");
assert(projectsIndex.includes("AI 爆款文章创作器"), "Projects page should include the AI passage creator project");
assert(projectsIndex.includes("从选题、标题、大纲、正文到配图"), "Projects page should include the AI passage creator description");
assert(!projectsIndex.includes("阅读笔记中枢"), "Projects page should not include other project cards");
assert(!projectsIndex.includes("轻量 CRM 原型"), "Projects page should not include other project cards");
assert(!projectsIndex.includes("部署观察看板"), "Projects page should not include other project cards");
assert(projectsIndex.includes('src="/images/personal-blog-system-cover.png"'), "Project card should render project cover image");
assert(projectsIndex.includes('src="/images/ai-passage-creator-cover.png"'), "AI project card should render project cover image");
assert(projectsIndex.includes('alt="个人博客系统预览"'), "Project cover should have descriptive Chinese alt text");
assert(projectsIndex.includes('alt="AI 爆款文章创作器预览"'), "AI project cover should have descriptive Chinese alt text");
assert(
  projectsIndex.includes('aria-label="查看个人博客系统演示"'),
  "Project demo link should have a project-specific accessible name",
);
assert(projectsIndex.includes('href="/"'), "Project demo link should point to the homepage");
assert(
  projectsIndex.includes('aria-label="查看AI 爆款文章创作器代码仓库"'),
  "AI project code link should have a project-specific accessible name",
);
assert(
  projectsIndex.includes('href="https://github.com/OpFi/ai-passage-creator-front"'),
  "AI project code link should point to the frontend repository",
);

const projectDetail = await read("projects/personal-blog-system/index.html");
assert(projectDetail.includes('src="/images/personal-blog-system-cover.png"'), "Project detail should render project cover image");
assert(projectDetail.includes("首页精选文章只展示技术文章"), "Project detail should include the updated completed work list");
assert(projectDetail.includes("技术文章已导入 60 篇"), "Project detail should mention the imported writing collection");
assert(projectDetail.includes("日常页已换成真实照片时间线"), "Project detail should mention the daily timeline update");
assert(projectDetail.includes("继续补充真实项目复盘"), "Project detail should include the updated next-step plan");
assert(
  projectDetail.includes('aria-label="查看个人博客系统演示"'),
  "Project detail demo link should have a project-specific accessible name",
);
assert(projectDetail.includes('href="/"'), "Project detail demo link should point to the homepage");

const aiProjectDetail = await read("projects/ai-passage-creator/index.html");
assert(aiProjectDetail.includes('src="/images/ai-passage-creator-cover.png"'), "AI project detail should render project cover image");
assert(aiProjectDetail.includes("多智能体协作"), "AI project detail should describe the agent workflow");
assert(aiProjectDetail.includes("Spring AI Alibaba"), "AI project detail should mention the backend AI stack");
assert(aiProjectDetail.includes("SSE"), "AI project detail should mention realtime streaming");
assert(aiProjectDetail.includes("OpFi/ai-passage-creator-front"), "AI project detail should include the frontend repository");
assert(aiProjectDetail.includes("OpFi/ai-massage-creator"), "AI project detail should include the backend repository");

const writingIndex = await read("writing/index.html");
const writingStyles = await readLinkedStyles(writingIndex);
const writingPageEntries = await readdir(new URL("writing/", dist), { withFileTypes: true });
const writingDetailDirs = writingPageEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
assertNoFooter(writingIndex, "Writing page");
assert(writingDetailDirs.length === 60, "Writing collection should publish the 60 imported desktop articles");
const importedWritingTitles = [
  "OpenAi embeddings 在前端的应用-推荐系统",
  "Vue+高德天气插件",
  "阿里一面：瀑布流布局",
  "mybatis整合",
  "每天一个小demo-网易云年终报告",
];
for (const title of importedWritingTitles) {
  assert(writingIndex.includes(title), `Writing page should include imported article: ${title}`);
}
for (const slug of writingDetailDirs) {
  const writingDetail = await read(`writing/${slug}/index.html`);
  assert(!writingDetail.includes("C:\\Users"), `Writing detail ${slug} should not include local Windows image paths`);
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
assert(writingIndex.includes('data-filter-tag="JavaScript"'), "Writing page should include a real imported article tag filter");
assert(writingIndex.includes("writingFilterState"), "Writing page should include the client-side filter script");
assert(writingIndex.includes("data-pagination"), "Writing page should include pagination controls");
assert(writingIndex.includes("data-page-prev"), "Writing page should include a previous-page control");
assert(writingIndex.includes("data-page-next"), "Writing page should include a next-page control");
assert(writingIndex.includes("data-page-input"), "Writing page should include a jump-to-page input");
assert(writingIndex.includes('inputmode="numeric"'), "Writing page pagination input should use numeric input mode");
assert(writingIndex.includes("paginationJumpToPage"), "Writing page should include page-jump behavior");
assert(!writingIndex.includes("回应"), "Writing page article cards should not show response counts");
assert(!writingIndex.includes("article-actions"), "Writing page article cards should not show like badges");
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
assert(!notesIndex.includes("article-actions"), "Notes page article cards should not show like badges");
assert(!notesIndex.includes("回应"), "Notes page article cards should not show response counts");
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
assert(dailyIndex.includes("出行"), "Daily page should include the travel tag");
assert(dailyIndex.includes("运动"), "Daily page should include the exercise tag");
assert(dailyIndex.includes("记录"), "Daily page should include the record tag");
assert(dailyIndex.includes("生日蛋糕"), "Daily page should include imported daily photo copy");
assert(
  (dailyIndex.match(/datetime="2025-01-21"/g) ?? []).length === 2,
  "Daily page should put both chicken wing entries on the same corrected date",
);
assert(!dailyIndex.includes('datetime="2025-01-20"'), "Daily page should not split the chicken wing entries across two dates");
assert(dailyIndex.includes("夜晚的广州塔"), "Daily page should include city night daily copy");
assert(dailyIndex.includes('src="/images/daily/photos/79e33d2dc4f8588c79b4f18caa7ad8df_origin.jpg"'), "Daily page should render imported cake photo");
assert(!dailyIndex.includes("很符合我 FF14"), "Daily page should not include the old game diary copy");
assert(!dailyIndex.includes("碎片摘录：界面要像路标"), "Daily page should not include the old excerpt diary copy");
assert(dailyIndex.includes("2026年5月"), "Daily page should include month groups");
assert(dailyIndex.includes("2025年1月"), "Daily page should include older 2025 month groups");
assert(
  /\.daily-filter-panel[^{]*\{[^}]*background:/.test(dailyStyles),
  "Daily filter panel should render as a card with a background",
);
assert(
  dailyStyles.includes("max-height:24rem"),
  "Daily month navigation should expand enough to show a full year of months",
);
assert(!dailyIndex.includes("回应"), "Daily page cards should not show response counts");
assert(!dailyIndex.includes("仅自己可见的草稿"), "Daily page should not include draft note");

const writingDetail = await read("writing/desktop-article-01/index.html");
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
assert(writingDetail.includes("AOP案例实践-记录操作日志"), "Writing detail should include imported article copy");

const noteDetail = await read("notes/first-note/index.html");
assert(noteDetail.includes('<meta property="og:type" content="article">'), "Note detail should use article Open Graph type");
assert(noteDetail.includes("随笔") || noteDetail.includes("日常"), "Note detail should include localized entry type metadata");
assert(noteDetail.includes("生活不是等到"), "Note detail should include realistic Chinese note copy");

const rss = await read("rss.xml");
assert(rss.includes("小志的博客"), "RSS should use the updated site name");
assert(!rss.includes("王子明的数字工作室"), "RSS should not include the old site name");
assert(rss.includes("AOP案例实践-记录操作日志"), "RSS should include imported Chinese writing post");
assert(rss.includes("把日子过成可回头看的样子"), "RSS should include Chinese public note");
assert(rss.includes("OpenAi embeddings 在前端的应用-推荐系统"), "RSS should include additional imported Chinese writing post");
assert(!rss.includes("仅自己可见的草稿"), "RSS should not include draft note");

console.log("Build verification passed.");
