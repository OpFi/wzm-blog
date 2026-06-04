# Chinese Content Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Localize the blog into Simplified Chinese and populate it with realistic launch-ready sample content.

**Architecture:** Keep the existing Astro content-collection structure. Update site metadata, shared UI copy, page copy, MDX entries, and the build verification script without changing routing or component boundaries.

**Tech Stack:** Astro, MDX content collections, Tailwind CSS, `scripts/verify-build.mjs`.

---

### Task 1: Verification Assertions

**Files:**
- Modify: `scripts/verify-build.mjs`

- [ ] **Step 1: Write failing verification checks**

Add assertions for `lang="zh-CN"`, Chinese nav labels, Chinese homepage copy, four project routes, four writing routes, six public note routes, draft exclusion, and Chinese RSS titles.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL in `scripts/verify-build.mjs` because current content and UI are still partly English and only have one project/article/note.

### Task 2: Chinese UI Copy

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/ContentLayout.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/StatusPanel.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/writing/index.astro`
- Modify: `src/pages/notes/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/rss.xml.ts`

- [ ] **Step 1: Replace English chrome with Chinese copy**

Use Chinese labels for navigation, homepage sections, listing headings, fallback states, back links, footer, About, RSS metadata, and default SEO metadata.

- [ ] **Step 2: Run test to verify partial pass**

Run: `npm run test`
Expected: any remaining failures should point to missing sample content.

### Task 3: Realistic Sample Content

**Files:**
- Modify: `src/content/projects/personal-blog-system.mdx`
- Create: `src/content/projects/reading-notes-hub.mdx`
- Create: `src/content/projects/lightweight-crm-prototype.mdx`
- Create: `src/content/projects/deploy-watch-dashboard.mdx`
- Modify: `src/content/writing/building-a-personal-site.mdx`
- Create: `src/content/writing/astro-content-workflow.mdx`
- Create: `src/content/writing/designing-small-tools.mdx`
- Create: `src/content/writing/vercel-deployment-notes.mdx`
- Modify: `src/content/notes/first-note.mdx`
- Create five more public note files under `src/content/notes/`

- [ ] **Step 1: Add realistic Chinese MDX entries**

Each public entry should include concrete titles, descriptions, dates, tags, and body text. Projects should include stack/status; writing and notes should use Chinese descriptions and paragraphs.

- [ ] **Step 2: Run full verification**

Run: `npm run test`
Expected: `astro check` reports 0 errors/warnings/hints, `astro build` succeeds, and `Build verification passed.`
