# Minimal Green Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage content with a minimal green welcome screen and centered looping leaf animation.

**Architecture:** Keep the existing shared `BaseLayout` and global navigation. Update only the homepage page component and the build verification script, leaving content routes and shared site data unchanged.

**Tech Stack:** Astro, CSS keyframes, existing Node build verification script.

---

### File Structure

- Modify: `scripts/verify-build.mjs`
  - Updates homepage assertions to require the new welcome line and accessible animation label.
  - Rejects old homepage section labels that should be removed.
- Modify: `src/pages/index.astro`
  - Removes homepage content imports and old sections.
  - Adds the minimal homepage layout and CSS-only animation.

### Task 1: Homepage Verification

- [ ] **Step 1: Update the failing build verification**

Change the homepage-specific assertions in `scripts/verify-build.mjs` so `dist/index.html` must include:

```js
assert(home.includes("欢迎来到我的网站"), "Homepage should include the minimal welcome line");
assert(
  home.includes('aria-label="循环生长的绿色叶片动画"'),
  "Homepage should include an accessible label for the center animation",
);
```

Also assert that removed homepage sections are absent:

```js
const removedHomeSections = ["精选文章", "最新更新", "分类索引", "友情链接", "青木开发日志", "现在", "关注"];
for (const section of removedHomeSections) {
  assert(!home.includes(section), `Homepage should not include removed section: ${section}`);
}
```

- [ ] **Step 2: Run the verification and confirm it fails**

Run:

```bash
npm run test
```

Expected: fail because the current homepage still contains old sections and does not contain the new animation label.

### Task 2: Minimal Animated Homepage

- [ ] **Step 1: Replace `src/pages/index.astro` with the minimal page**

Use `BaseLayout`, one visible welcome line, and a centered animation block with:

```html
<div class="leaf-motion" role="img" aria-label="循环生长的绿色叶片动画">
```

The animation should use CSS-only leaf shapes, circular rings, and `@keyframes` for slow rotation and breathing motion.

- [ ] **Step 2: Run the verification and confirm it passes**

Run:

```bash
npm run test
```

Expected: pass with `Build verification passed.`

### Task 3: Browser QA

- [ ] **Step 1: Start the local dev server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

- [ ] **Step 2: Verify the homepage visually**

Open `http://127.0.0.1:4321/` and confirm:

- The navigation remains visible.
- `欢迎来到我的网站` appears near the upper-left of the homepage body.
- The centered green animation renders and moves.
- No old homepage sections are visible.
- No horizontal overflow or console errors are present.

- [ ] **Step 3: Save a desktop screenshot**

Save the screenshot to:

```text
.superpowers/qa-screenshots/homepage-minimal-green-animation-desktop.png
```

### Task 4: Commit and Push

- [ ] **Step 1: Re-run verification before committing**

Run:

```bash
npm run test
```

Expected: pass with `Build verification passed.`

- [ ] **Step 2: Commit the implementation**

Run:

```bash
git add scripts/verify-build.mjs src/pages/index.astro docs/superpowers/specs/2026-06-04-minimal-green-home-design.md docs/superpowers/plans/2026-06-04-minimal-green-home.md
git commit -m "feat: simplify homepage with green animation"
```

- [ ] **Step 3: Push the branch**

Run the existing SSH-key-backed push command for `personal-blog-implementation`.

- [ ] **Step 4: Verify the remote branch**

Run:

```bash
git status --short --branch
git ls-remote --heads origin personal-blog-implementation
```

Expected: local branch is clean and the remote branch points at the new commit.
