# Blog Style Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the Chinese personal site into a warmer blog-first experience with technical, essay, daily, project, and about sections.

**Architecture:** Keep the existing Astro content collections and static routes. Add small content helpers, a daily index page, richer homepage composition, and optional detail-page metadata/navigation props.

**Tech Stack:** Astro, MDX, Tailwind CSS, `scripts/verify-build.mjs`.

---

### Task 1: Red Verification

**Files:**
- Modify: `scripts/verify-build.mjs`

- [ ] **Step 1: Add failing checks**

Assert the new navigation labels, homepage blog-first copy, `/daily/` page, daily note title, reading-time copy on a writing detail page, and adjacent post navigation.

- [ ] **Step 2: Run red test**

Run: `npm run test`
Expected: FAIL in `scripts/verify-build.mjs` before implementation.

### Task 2: Content Helpers and Daily Page

**Files:**
- Modify: `src/lib/content.ts`
- Create: `src/pages/daily/index.astro`
- Create or modify one note under `src/content/notes/`

- [ ] **Step 1: Add helpers**

Add `estimateReadingMinutes`, `getLatestUpdates`, and `getDailyNotes`.

- [ ] **Step 2: Add daily route**

Create `/daily/` as a note-based page filtered by the `日常` tag.

### Task 3: Blog-First UI

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/layouts/ContentLayout.astro`
- Modify: `src/pages/writing/[slug].astro`
- Modify: `src/pages/notes/[slug].astro`
- Modify: `src/styles/global.css` if needed

- [ ] **Step 1: Update navigation**

Use `首页`, `技术`, `随笔`, `日常`, `项目`, `关于`.

- [ ] **Step 2: Rework homepage**

Show personal intro, latest updates, category index, and status panel in a softer blog layout.

- [ ] **Step 3: Improve detail pages**

Show reading time and newer/older article navigation for writing and notes.

### Task 4: Verify, Commit, Push

- [ ] **Step 1: Run full test**

Run: `npm run test`
Expected: `astro check` 0 errors/warnings/hints, build succeeds, and `Build verification passed.`

- [ ] **Step 2: Run browser QA**

Check homepage, daily page, writing detail, and notes detail for no horizontal overflow and no console errors.

- [ ] **Step 3: Commit and push**

Commit the implementation and push `personal-blog-implementation`.
