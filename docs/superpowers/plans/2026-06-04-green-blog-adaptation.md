# Green Blog Adaptation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an original green-themed blog homepage and supporting style system inspired by the reference site's blog structure.

**Architecture:** Keep Astro content collections and existing routes. Add friend-link data and homepage sections while updating shared CSS variables, component colors, and verification assertions.

**Tech Stack:** Astro, MDX, Tailwind CSS, `scripts/verify-build.mjs`.

---

### Task 1: Red Verification

**Files:**
- Modify: `scripts/verify-build.mjs`

- [ ] **Step 1: Add failing assertions**

Assert homepage includes `绿色主题`, `精选文章`, `友情链接`, `青木开发日志`, and existing route/content checks.

- [ ] **Step 2: Run red test**

Run: `npm run test`
Expected: FAIL in `scripts/verify-build.mjs` before implementation.

### Task 2: Green Theme and Data

**Files:**
- Modify: `src/styles/global.css`
- Create: `src/lib/friends.ts`
- Modify: `src/components/StatusPanel.astro`

- [ ] **Step 1: Update CSS variables**

Use green ink, moss primary color, soft leaf background, green tag/link colors, and card shadows.

- [ ] **Step 2: Add friend-link data**

Create a small array of believable friend links with name, URL, and description.

### Task 3: Homepage Adaptation

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rebuild homepage sections**

Show intro, featured articles, latest posts, friend links, category/sidebar blocks, and featured project in a green card-based blog layout.

- [ ] **Step 2: Preserve routes**

Keep existing links to `/writing/`, `/notes/`, `/daily/`, `/projects/`, and `/about/`.

### Task 4: Verify, QA, Commit, Push

- [ ] **Step 1: Run full test**

Run: `npm run test`
Expected: `astro check` 0 errors/warnings/hints, build succeeds, and `Build verification passed.`

- [ ] **Step 2: Run browser QA**

Check homepage, writing page, daily page, and article detail for no horizontal overflow and no console errors.

- [ ] **Step 3: Commit and push**

Commit implementation and push `personal-blog-implementation`.
