# Personal Blog Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first version of a creator-studio personal website with projects, long-form writing, short notes, MDX content, SEO basics, RSS, and a responsive frosted-glass homepage.

**Architecture:** The site is a static-first Astro app. Content lives in MDX files validated by Astro Content Collections, shared UI lives in focused Astro components, and pages query collections through a small content utility module.

**Tech Stack:** Astro, MDX, Astro Content Collections, Tailwind CSS 4 via `@tailwindcss/vite`, `@astrojs/rss`, `@astrojs/sitemap`, Vercel.

---

## Reference Docs

- Astro setup and project structure: https://docs.astro.build/en/install-and-setup/
- Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
- Astro MDX integration: https://docs.astro.build/en/guides/integrations-guide/mdx/
- Astro RSS recipe: https://docs.astro.build/en/recipes/rss/
- Astro deployment: https://docs.astro.build/en/guides/deploy/

## File Structure

Create the Astro app at the repository root.

- `package.json`: npm scripts and dependencies.
- `astro.config.mjs`: Astro integrations, site URL, Tailwind Vite plugin.
- `tsconfig.json`: Astro TypeScript configuration.
- `src/env.d.ts`: Astro environment types.
- `src/content.config.ts`: collection schemas for `projects`, `writing`, and `notes`.
- `src/content/projects/*.mdx`: project entries.
- `src/content/writing/*.mdx`: long-form posts.
- `src/content/notes/*.mdx`: short notes.
- `src/lib/site.ts`: site metadata and navigation constants.
- `src/lib/content.ts`: collection query helpers and sorting.
- `src/styles/global.css`: Tailwind import, design tokens, prose styling, glass panel styling.
- `src/layouts/BaseLayout.astro`: HTML shell, metadata, header, footer.
- `src/layouts/ContentLayout.astro`: shared detail-page layout for writing, notes, and projects.
- `src/components/Header.astro`: responsive top navigation.
- `src/components/Footer.astro`: footer links and RSS link.
- `src/components/StatusPanel.astro`: frosted-glass `Now / Focus` panel.
- `src/components/ContentCard.astro`: reusable writing and note card.
- `src/components/ProjectCard.astro`: project card with optional links.
- `src/components/TagList.astro`: tag rendering.
- `src/pages/index.astro`: homepage.
- `src/pages/projects/index.astro`: projects list.
- `src/pages/projects/[slug].astro`: project detail page.
- `src/pages/writing/index.astro`: writing list.
- `src/pages/writing/[slug].astro`: writing detail page.
- `src/pages/notes/index.astro`: notes list.
- `src/pages/notes/[slug].astro`: note detail page.
- `src/pages/about.astro`: about page.
- `src/pages/rss.xml.ts`: RSS feed.
- `scripts/verify-build.mjs`: post-build assertions.

## Task 1: Project Foundation

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `src/styles/global.css`
- Modify: `.gitignore`

- [ ] **Step 1: Write package manifest**

Create `package.json`:

```json
{
  "name": "personal-blog-studio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "engines": {
    "node": ">=22.12.0"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.9",
    "@astrojs/mdx": "^6.0.2",
    "@astrojs/rss": "^4.0.18",
    "@astrojs/sitemap": "^3.7.3",
    "@tailwindcss/vite": "^4.3.0",
    "astro": "^6.4.4",
    "tailwindcss": "^4.3.0",
    "typescript": "^6.0.3"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and npm exits with code 0.

- [ ] **Step 3: Write Astro configuration**

Create `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://syd-studio.vercel.app",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Write TypeScript configuration**

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

Create `src/env.d.ts`:

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

- [ ] **Step 5: Update ignore rules**

Replace `.gitignore` with:

```gitignore
.superpowers/
.DS_Store
.astro/
dist/
node_modules/
.vercel/
```

- [ ] **Step 6: Write global styles**

Create `src/styles/global.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
  --ink: #111827;
  --muted: #5f6b7a;
  --paper: #f8fafc;
  --line: rgba(17, 24, 39, 0.12);
  --accent-blue: #2563eb;
  --accent-green: #16a34a;
  --accent-gold: #f59e0b;
}

* {
  box-sizing: border-box;
}

html {
  min-width: 320px;
  background: var(--paper);
  color: var(--ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--paper);
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
}

.glass-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.58);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.34)),
    rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    inset 0 -1px 0 rgba(255, 255, 255, 0.22),
    0 22px 46px rgba(15, 23, 42, 0.14);
}

.glass-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(120deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0) 36%),
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.12) 0 1px, transparent 1px 7px);
  opacity: 0.5;
}

.prose-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #1f2937;
}

.prose-content :where(h2, h3, h4) {
  color: #111827;
  line-height: 1.2;
  margin-top: 2.2rem;
  margin-bottom: 0.8rem;
}

.prose-content h2 {
  font-size: 1.7rem;
}

.prose-content h3 {
  font-size: 1.35rem;
}

.prose-content p,
.prose-content ul,
.prose-content ol {
  margin: 1rem 0;
}

.prose-content a {
  color: var(--accent-blue);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.prose-content pre {
  overflow-x: auto;
  border-radius: 8px;
  padding: 1rem;
  background: #111827;
  color: #f8fafc;
}

.prose-content code {
  font-size: 0.92em;
}
```

- [ ] **Step 7: Check foundation**

Run:

```bash
npm run check
```

Expected: FAIL because no Astro pages exist yet. Continue to Task 2.

- [ ] **Step 8: Commit foundation**

Run:

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/env.d.ts src/styles/global.css .gitignore
git commit -m "chore: scaffold astro foundation"
```

## Task 2: Content Collections And Sample Content

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/projects/personal-blog-system.mdx`
- Create: `src/content/writing/building-a-personal-site.mdx`
- Create: `src/content/notes/first-note.mdx`
- Create: `src/content/notes/private-draft-note.mdx`

- [ ] **Step 1: Write content schemas**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    status: z.string(),
    tags: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing, notes };
```

- [ ] **Step 2: Add sample project**

Create `src/content/projects/personal-blog-system.mdx`:

```mdx
---
title: "Personal Blog System"
description: "A creator-studio website for projects, long-form writing, and short notes."
date: "2026-06-04"
status: "In progress"
tags: ["Website", "Writing", "Portfolio"]
stack: ["Astro", "MDX", "Tailwind CSS", "Vercel"]
featured: true
demoUrl: "https://syd-studio.vercel.app"
---

This project is the public home for my work, writing, and evolving ideas.

It starts as a static website because the first goal is momentum: make it easy to publish, easy to maintain, and easy to improve.
```

- [ ] **Step 3: Add sample writing post**

Create `src/content/writing/building-a-personal-site.mdx`:

```mdx
---
title: "Building a Personal Site That Can Grow"
description: "A short walkthrough of how I think about structure, content, and maintenance for a personal website."
date: "2026-06-04"
tags: ["Astro", "Personal Website", "Writing System"]
draft: false
featured: true
---

Personal websites work best when they are small enough to maintain and flexible enough to grow.

## Start With The Shape

This site has three lanes: projects, writing, and notes. Projects show what I am building. Writing captures longer thinking. Notes keep smaller observations moving.

## Keep The System Light

The first version uses MDX files in the repository. That keeps publishing close to the code and avoids maintaining an admin backend before the site needs one.
```

- [ ] **Step 4: Add sample public note**

Create `src/content/notes/first-note.mdx`:

```mdx
---
title: "First Note"
description: "A small note about starting the site."
date: "2026-06-04"
tags: ["Now", "Writing"]
draft: false
---

The site starts as a place to collect work in progress, complete essays, and small observations that do not need to become full articles.
```

- [ ] **Step 5: Add sample draft note**

Create `src/content/notes/private-draft-note.mdx`:

```mdx
---
title: "Private Draft Note"
description: "A draft note used to verify draft filtering."
date: "2026-06-04"
tags: ["Draft"]
draft: true
---

This draft should not appear in production lists.
```

- [ ] **Step 6: Run collection check**

Run:

```bash
npm run check
```

Expected: FAIL because pages and layouts are not created yet, but content schema errors should not appear.

- [ ] **Step 7: Commit content setup**

Run:

```bash
git add src/content.config.ts src/content
git commit -m "feat: add content collections"
```

## Task 3: Site Metadata And Content Utilities

**Files:**
- Create: `src/lib/site.ts`
- Create: `src/lib/content.ts`

- [ ] **Step 1: Add site metadata**

Create `src/lib/site.ts`:

```ts
export const site = {
  name: "Syd Studio",
  title: "Syd Studio | Projects, Writing, Notes",
  description: "A creator-studio personal website for projects, long-form writing, and short notes.",
  url: "https://syd-studio.vercel.app",
  author: "Syd",
};

export const navItems = [
  { href: "/projects/", label: "Projects" },
  { href: "/writing/", label: "Writing" },
  { href: "/notes/", label: "Notes" },
  { href: "/about/", label: "About" },
];
```

- [ ] **Step 2: Add content query helpers**

Create `src/lib/content.ts`:

```ts
import { getCollection, type CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;
export type WritingEntry = CollectionEntry<"writing">;
export type NoteEntry = CollectionEntry<"notes">;

type DatedEntry = {
  data: {
    date: Date;
  };
};

export function byDateDesc<T extends DatedEntry>(a: T, b: T) {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export async function getProjects() {
  const projects = await getCollection("projects");
  return projects.sort(byDateDesc);
}

export async function getFeaturedProject() {
  const projects = await getProjects();
  return projects.find((project) => project.data.featured) ?? projects[0];
}

export async function getPublishedWriting() {
  const entries = await getCollection("writing", ({ data }) => !data.draft);
  return entries.sort(byDateDesc);
}

export async function getFeaturedWriting() {
  const entries = await getPublishedWriting();
  return entries.find((entry) => entry.data.featured) ?? entries[0];
}

export async function getPublishedNotes() {
  const entries = await getCollection("notes", ({ data }) => !data.draft);
  return entries.sort(byDateDesc);
}
```

- [ ] **Step 3: Run type check**

Run:

```bash
npm run check
```

Expected: FAIL because no pages exist yet. There should be no TypeScript error in `src/lib/site.ts` or `src/lib/content.ts`.

- [ ] **Step 4: Commit utilities**

Run:

```bash
git add src/lib
git commit -m "feat: add site metadata and content helpers"
```

## Task 4: Layouts And Shared Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/ContentLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/StatusPanel.astro`
- Create: `src/components/TagList.astro`
- Create: `src/components/ContentCard.astro`
- Create: `src/components/ProjectCard.astro`

- [ ] **Step 1: Create header**

Create `src/components/Header.astro`:

```astro
---
import { navItems, site } from "../lib/site";

const currentPath = Astro.url.pathname;
const isActive = (href: string) => href === "/" ? currentPath === "/" : currentPath.startsWith(href);
---

<header class="mx-auto flex w-full max-w-6xl items-center justify-between gap-5 px-5 py-5 sm:px-8">
  <a class="text-sm font-extrabold tracking-tight" href="/" aria-label={`${site.name} home`}>
    {site.name}
  </a>
  <nav aria-label="Primary navigation">
    <ul class="flex items-center gap-3 text-xs text-slate-600 sm:gap-6 sm:text-sm">
      {navItems.map((item) => (
        <li>
          <a
            class:list={[
              "rounded-full px-2 py-1 transition hover:text-slate-950",
              isActive(item.href) && "bg-white/70 text-slate-950 shadow-sm",
            ]}
            href={item.href}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

- [ ] **Step 2: Create footer**

Create `src/components/Footer.astro`:

```astro
---
import { site } from "../lib/site";
---

<footer class="border-t border-slate-200 bg-white/70">
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">
    <p>&copy; 2026 {site.author}. Built with Astro.</p>
    <div class="flex gap-4">
      <a class="hover:text-slate-950" href="/rss.xml">RSS</a>
      <a class="hover:text-slate-950" href="/about/">Contact</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Create base layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import { site } from "../lib/site";
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
}

const { title = site.title, description = site.description } = Astro.props;
const pageTitle = title === site.title ? title : `${title} | ${site.name}`;
const canonical = new URL(Astro.url.pathname, site.url);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="alternate" type="application/rss+xml" title={`${site.name} RSS`} href="/rss.xml" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
  </head>
  <body class="min-h-screen text-slate-950 antialiased">
    <div class="flex min-h-screen flex-col">
      <Header />
      <main class="flex-1">
        <slot />
      </main>
      <Footer />
    </div>
  </body>
</html>
```

- [ ] **Step 4: Create tag list**

Create `src/components/TagList.astro`:

```astro
---
interface Props {
  tags: string[];
}

const { tags } = Astro.props;
---

{tags.length > 0 && (
  <ul class="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <li class="rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-xs text-slate-600">
        {tag}
      </li>
    ))}
  </ul>
)}
```

- [ ] **Step 5: Create content card**

Create `src/components/ContentCard.astro`:

```astro
---
import TagList from "./TagList.astro";
import { formatDate } from "../lib/content";

interface Props {
  href: string;
  title: string;
  description: string;
  date: Date;
  tags?: string[];
  type: "Writing" | "Note";
}

const { href, title, description, date, tags = [], type } = Astro.props;
---

<article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
  <a class="block" href={href}>
    <p class="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{type}</p>
    <h2 class="text-xl font-bold leading-tight text-slate-950">{title}</h2>
    <p class="mt-3 text-sm leading-6 text-slate-600">{description}</p>
  </a>
  <div class="mt-5 flex flex-col gap-3">
    <time class="text-xs text-slate-500" datetime={date.toISOString()}>{formatDate(date)}</time>
    <TagList tags={tags} />
  </div>
</article>
```

- [ ] **Step 6: Create project card**

Create `src/components/ProjectCard.astro`:

```astro
---
import TagList from "./TagList.astro";
import type { ProjectEntry } from "../lib/content";

interface Props {
  project: ProjectEntry;
}

const { project } = Astro.props;
const href = `/projects/${project.id}/`;
---

<article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
  <a href={href}>
    <p class="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{project.data.status}</p>
    <h2 class="text-xl font-bold leading-tight text-slate-950">{project.data.title}</h2>
    <p class="mt-3 text-sm leading-6 text-slate-600">{project.data.description}</p>
  </a>
  <div class="mt-5">
    <TagList tags={project.data.stack.length > 0 ? project.data.stack : project.data.tags} />
  </div>
  <div class="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
    {project.data.demoUrl && <a class="text-blue-600 hover:text-blue-800" href={project.data.demoUrl}>Demo</a>}
    {project.data.repoUrl && <a class="text-blue-600 hover:text-blue-800" href={project.data.repoUrl}>Repo</a>}
  </div>
</article>
```

- [ ] **Step 7: Create status panel**

Create `src/components/StatusPanel.astro`:

```astro
<aside class="glass-panel rounded-lg p-5">
  <div class="relative z-10 grid gap-4">
    <div>
      <strong class="block text-sm text-slate-950">Now</strong>
      <p class="mt-2 text-sm leading-6 text-slate-700">正在打磨一个个人博客系统，整理技术写作和作品集。</p>
    </div>
    <div class="border-t border-slate-900/10 pt-4">
      <strong class="block text-sm text-slate-950">Focus</strong>
      <p class="mt-2 text-sm leading-6 text-slate-700">Web development, product thinking, writing, creative tools.</p>
    </div>
  </div>
</aside>
```

- [ ] **Step 8: Create content layout**

Create `src/layouts/ContentLayout.astro`:

```astro
---
import BaseLayout from "./BaseLayout.astro";
import TagList from "../components/TagList.astro";
import { formatDate } from "../lib/content";

interface Props {
  title: string;
  description: string;
  date: Date;
  tags?: string[];
  backHref: string;
  backLabel: string;
}

const { title, description, date, tags = [], backHref, backLabel } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <article class="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
    <a class="text-sm font-semibold text-blue-600 hover:text-blue-800" href={backHref}>{backLabel}</a>
    <header class="mt-8 border-b border-slate-200 pb-8">
      <time class="text-sm text-slate-500" datetime={date.toISOString()}>{formatDate(date)}</time>
      <h1 class="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">{title}</h1>
      <p class="mt-5 text-lg leading-8 text-slate-600">{description}</p>
      <div class="mt-6">
        <TagList tags={tags} />
      </div>
    </header>
    <div class="prose-content mt-8">
      <slot />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 9: Run type check**

Run:

```bash
npm run check
```

Expected: FAIL because no route pages exist yet. Component import and prop errors should not appear.

- [ ] **Step 10: Commit layouts and components**

Run:

```bash
git add src/layouts src/components src/styles/global.css
git commit -m "feat: add shared layouts and components"
```

## Task 5: Homepage And List Pages

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/notes/index.astro`
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create homepage**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ContentCard from "../components/ContentCard.astro";
import ProjectCard from "../components/ProjectCard.astro";
import StatusPanel from "../components/StatusPanel.astro";
import { getFeaturedProject, getFeaturedWriting, getPublishedNotes } from "../lib/content";

const featuredProject = await getFeaturedProject();
const featuredWriting = await getFeaturedWriting();
const latestNote = (await getPublishedNotes())[0];
---

<BaseLayout>
  <section class="relative overflow-hidden bg-[linear-gradient(135deg,rgba(219,234,254,0.88),rgba(254,243,199,0.7)_42%,rgba(220,252,231,0.88))]">
    <div class="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0_1px,transparent_1px_8px)] opacity-40"></div>
    <div class="relative mx-auto grid min-h-[70vh] w-full max-w-6xl items-end gap-10 px-5 pb-14 pt-16 sm:px-8 lg:grid-cols-[1.25fr_0.75fr]">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Personal website / Lab / Notebook</p>
        <h1 class="mt-4 max-w-3xl font-serif text-5xl font-black leading-[0.98] text-slate-950 sm:text-7xl">
          作品、文章和想法放在同一个现场。
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
          这里记录我正在构建的项目、完整的技术文章，以及一些更短、更松弛的思考。它像一个公开工作台，也像一间可以长期整理自己的房间。
        </p>
      </div>
      <StatusPanel />
    </div>
  </section>

  <section class="bg-white/80 px-5 py-12 sm:px-8">
    <div class="mx-auto w-full max-w-6xl">
      <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Featured</p>
          <h2 class="mt-2 text-2xl font-black text-slate-950">Start here</h2>
        </div>
        <p class="max-w-md text-sm leading-6 text-slate-600">A project, a long-form article, and a short note make the homepage feel alive from the first version.</p>
      </div>
      <div class="grid gap-4 lg:grid-cols-3">
        {featuredProject && <ProjectCard project={featuredProject} />}
        {featuredWriting && (
          <ContentCard
            href={`/writing/${featuredWriting.id}/`}
            title={featuredWriting.data.title}
            description={featuredWriting.data.description}
            date={featuredWriting.data.date}
            tags={featuredWriting.data.tags}
            type="Writing"
          />
        )}
        {latestNote && (
          <ContentCard
            href={`/notes/${latestNote.id}/`}
            title={latestNote.data.title}
            description={latestNote.data.description}
            date={latestNote.data.date}
            tags={latestNote.data.tags}
            type="Note"
          />
        )}
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Create projects list**

Create `src/pages/projects/index.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import ProjectCard from "../../components/ProjectCard.astro";
import { getProjects } from "../../lib/content";

const projects = await getProjects();
---

<BaseLayout title="Projects" description="Selected projects and works in progress.">
  <section class="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
    <header class="mb-8 max-w-2xl">
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Projects</p>
      <h1 class="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">Selected work</h1>
      <p class="mt-4 text-lg leading-8 text-slate-600">Things I have built, explored, or am currently shaping.</p>
    </header>
    {projects.length > 0 ? (
      <div class="grid gap-4 md:grid-cols-2">
        {projects.map((project) => <ProjectCard project={project} />)}
      </div>
    ) : (
      <p class="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">No projects published yet.</p>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 3: Create writing list**

Create `src/pages/writing/index.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import ContentCard from "../../components/ContentCard.astro";
import { getPublishedWriting } from "../../lib/content";

const posts = await getPublishedWriting();
---

<BaseLayout title="Writing" description="Long-form technical writing, essays, and retrospectives.">
  <section class="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
    <header class="mb-8 max-w-2xl">
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Writing</p>
      <h1 class="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">Long-form thinking</h1>
      <p class="mt-4 text-lg leading-8 text-slate-600">Technical essays, implementation notes, tutorials, and structured reflections.</p>
    </header>
    {posts.length > 0 ? (
      <div class="grid gap-4">
        {posts.map((post) => (
          <ContentCard
            href={`/writing/${post.id}/`}
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            tags={post.data.tags}
            type="Writing"
          />
        ))}
      </div>
    ) : (
      <p class="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">No writing published yet.</p>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 4: Create notes list**

Create `src/pages/notes/index.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import ContentCard from "../../components/ContentCard.astro";
import { getPublishedNotes } from "../../lib/content";

const notes = await getPublishedNotes();
---

<BaseLayout title="Notes" description="Short notes, updates, and fragments.">
  <section class="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
    <header class="mb-8 max-w-2xl">
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Notes</p>
      <h1 class="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">Small observations</h1>
      <p class="mt-4 text-lg leading-8 text-slate-600">Short updates, loose thoughts, reading notes, and fragments that do not need to become full articles.</p>
    </header>
    {notes.length > 0 ? (
      <div class="grid gap-4">
        {notes.map((note) => (
          <ContentCard
            href={`/notes/${note.id}/`}
            title={note.data.title}
            description={note.data.description}
            date={note.data.date}
            tags={note.data.tags}
            type="Note"
          />
        ))}
      </div>
    ) : (
      <p class="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">No notes published yet.</p>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 5: Create about page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="About" description="About Syd Studio and current focus areas.">
  <section class="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">About</p>
      <h1 class="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">Builder, writer, and careful collector of ideas.</h1>
    </div>
    <div class="prose-content rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p>
        Syd Studio is a personal website for projects, long-form writing, and short notes. It is designed as a public workspace: a place to show what is being built and how the thinking behind it develops.
      </p>
      <h2>Focus</h2>
      <ul>
        <li>Web development and creative tools.</li>
        <li>Product thinking and implementation notes.</li>
        <li>Writing systems, learning, and personal knowledge management.</li>
      </ul>
      <h2>Contact</h2>
      <p>
        Add social links and email here once the final public profiles are chosen.
      </p>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 6: Run type check**

Run:

```bash
npm run check
```

Expected: FAIL because dynamic detail routes and RSS are not created yet. List-page imports should not report errors.

- [ ] **Step 7: Commit homepage and list pages**

Run:

```bash
git add src/pages/index.astro src/pages/projects/index.astro src/pages/writing/index.astro src/pages/notes/index.astro src/pages/about.astro
git commit -m "feat: add homepage and listing pages"
```

## Task 6: Detail Pages And RSS

**Files:**
- Create: `src/pages/projects/[slug].astro`
- Create: `src/pages/writing/[slug].astro`
- Create: `src/pages/notes/[slug].astro`
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Create project detail page**

Create `src/pages/projects/[slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import ContentLayout from "../../layouts/ContentLayout.astro";
import TagList from "../../components/TagList.astro";

export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
---

<ContentLayout
  title={project.data.title}
  description={project.data.description}
  date={project.data.date}
  tags={project.data.tags}
  backHref="/projects/"
  backLabel="Back to projects"
>
  <div class="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
    <p class="text-sm font-semibold text-slate-950">Status: {project.data.status}</p>
    <div class="mt-4">
      <TagList tags={project.data.stack} />
    </div>
    <div class="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
      {project.data.demoUrl && <a class="text-blue-600 hover:text-blue-800" href={project.data.demoUrl}>Demo</a>}
      {project.data.repoUrl && <a class="text-blue-600 hover:text-blue-800" href={project.data.repoUrl}>Repo</a>}
    </div>
  </div>
  <Content />
</ContentLayout>
```

- [ ] **Step 2: Create writing detail page**

Create `src/pages/writing/[slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import ContentLayout from "../../layouts/ContentLayout.astro";

export async function getStaticPaths() {
  const posts = await getCollection("writing", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<ContentLayout
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  tags={post.data.tags}
  backHref="/writing/"
  backLabel="Back to writing"
>
  <Content />
</ContentLayout>
```

- [ ] **Step 3: Create note detail page**

Create `src/pages/notes/[slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import ContentLayout from "../../layouts/ContentLayout.astro";

export async function getStaticPaths() {
  const notes = await getCollection("notes", ({ data }) => !data.draft);
  return notes.map((note) => ({
    params: { slug: note.id },
    props: { note },
  }));
}

const { note } = Astro.props;
const { Content } = await render(note);
---

<ContentLayout
  title={note.data.title}
  description={note.data.description}
  date={note.data.date}
  tags={note.data.tags}
  backHref="/notes/"
  backLabel="Back to notes"
>
  <Content />
</ContentLayout>
```

- [ ] **Step 4: Create RSS feed**

Create `src/pages/rss.xml.ts`:

```ts
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../lib/site";

export async function GET(context: { site?: URL }) {
  const writing = await getCollection("writing", ({ data }) => !data.draft);
  const notes = await getCollection("notes", ({ data }) => !data.draft);
  const siteUrl = context.site ?? new URL(site.url);

  const items = [
    ...writing.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/writing/${entry.id}/`,
    })),
    ...notes.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/notes/${entry.id}/`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: site.title,
    description: site.description,
    site: siteUrl,
    items,
    customData: "<language>en-us</language>",
  });
}
```

- [ ] **Step 5: Run build**

Run:

```bash
npm run build
```

Expected: PASS. `dist/` contains `index.html`, `projects/`, `writing/`, `notes/`, `about/`, `rss.xml`, and `sitemap-index.xml`.

- [ ] **Step 6: Commit detail pages and RSS**

Run:

```bash
git add src/pages
git commit -m "feat: add detail pages and rss"
```

## Task 7: Build Verification Script

**Files:**
- Modify: `package.json`
- Create: `scripts/verify-build.mjs`

- [ ] **Step 1: Add verification scripts**

Update `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "verify": "node scripts/verify-build.mjs",
    "test": "npm run build && npm run verify"
  }
}
```

- [ ] **Step 2: Write failing verification script**

Create `scripts/verify-build.mjs`:

```js
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

const notesIndex = await read("notes/index.html");
assert(notesIndex.includes("First Note"), "Notes page should include public note");
assert(!notesIndex.includes("Private Draft Note"), "Notes page should not include draft note");

const rss = await read("rss.xml");
assert(rss.includes("Building a Personal Site That Can Grow"), "RSS should include writing post");
assert(rss.includes("First Note"), "RSS should include public note");
assert(!rss.includes("Private Draft Note"), "RSS should not include draft note");

console.log("Build verification passed.");
```

- [ ] **Step 3: Run verification before build**

Run:

```bash
npm run verify
```

Expected: FAIL if `dist/` is absent. This proves the script is checking the build output.

- [ ] **Step 4: Run full test command**

Run:

```bash
npm run test
```

Expected: PASS with `Build verification passed.` after Astro builds the site.

- [ ] **Step 5: Commit verification script**

Run:

```bash
git add scripts/verify-build.mjs package.json package-lock.json
git commit -m "test: add build verification"
```

## Task 8: Local Preview And Responsive QA

**Files:**
- No source edits unless QA finds layout issues.

- [ ] **Step 1: Start dev server**

Run:

```bash
npm run dev
```

Expected: Astro reports a local URL, usually `http://localhost:4321/`.

- [ ] **Step 2: Open homepage in the in-app browser**

Use Browser to open:

```text
http://localhost:4321/
```

Expected: homepage loads with the creator-studio hero, visible navigation, and frosted-glass `Now / Focus` panel.

- [ ] **Step 3: Check core routes**

Open these routes:

```text
http://localhost:4321/projects/
http://localhost:4321/projects/personal-blog-system/
http://localhost:4321/writing/
http://localhost:4321/writing/building-a-personal-site/
http://localhost:4321/notes/
http://localhost:4321/notes/first-note/
http://localhost:4321/about/
http://localhost:4321/rss.xml
```

Expected: every route loads, and `http://localhost:4321/notes/private-draft-note/` returns 404.

- [ ] **Step 4: Check mobile layout**

Use Browser responsive view or screenshot checks at widths near 390px and 768px.

Expected:

- Navigation fits without horizontal scroll.
- Hero text wraps without overlap.
- `Now / Focus` panel remains readable.
- Cards stack cleanly.
- Article pages keep comfortable line length.

- [ ] **Step 5: Stop dev server and commit QA fixes**

If no source edits were needed, do not create a commit. If fixes were made, run:

```bash
npm run test
git add src
git commit -m "fix: polish responsive layout"
```

## Task 9: Deployment Readiness

**Files:**
- Modify only if the user provides a final public domain.

- [ ] **Step 1: Confirm site URL**

Check `astro.config.mjs` and `src/lib/site.ts`.

Expected initial value:

```text
https://syd-studio.vercel.app
```

If the user provides a different domain, update both files to the exact same URL.

- [ ] **Step 2: Run final verification**

Run:

```bash
npm run test
git status --short
```

Expected: tests pass and working tree is clean except for user-approved deployment-domain changes.

- [ ] **Step 3: Commit domain update if changed**

If the URL changed, run:

```bash
git add astro.config.mjs src/lib/site.ts
git commit -m "chore: set production site url"
```

## Self-Review

Spec coverage:

- Creator-studio homepage: Task 5.
- Frosted-glass `Now / Focus` panel: Tasks 1 and 4.
- `Projects / Writing / Notes / About`: Tasks 5 and 6.
- MDX content and collection schemas: Task 2.
- Draft filtering: Tasks 3, 5, 6, and 7.
- SEO basics: Tasks 4 and 6.
- RSS and sitemap: Tasks 1, 6, and 7.
- Responsive verification: Task 8.
- Vercel readiness: Task 9.

Placeholder scan:

- No placeholder markers or incomplete implementation steps.
- Every source file has concrete code.
- Every command has an expected result.

Type consistency:

- Collection names are consistently `projects`, `writing`, and `notes`.
- Route slugs consistently use `entry.id`.
- Site URL is consistently `https://syd-studio.vercel.app`.
