# Blog Style Refresh Design

## Goal

Move the site from a portfolio-first homepage toward a warm Chinese personal blog style inspired by `flowersink.com`: technical writing, essays, daily fragments, and projects in one calm reading-focused interface.

## Scope

- Rework the homepage into a blog-first surface with personal introduction, latest updates, category index, and current status.
- Update navigation to include `首页`, `技术`, `随笔`, `日常`, `项目`, and `关于`.
- Add a `/daily/` page for daily-life notes and mark at least one note as daily content.
- Improve article/note detail pages with reading-time metadata and newer/older post navigation.
- Preserve the current Astro + MDX architecture, existing routes, content collections, RSS, sitemap, draft filtering, and static deployment model.

## Visual Direction

The design should feel like a Chinese personal blog rather than a landing page: softer hero scale, paper-like page rhythm, readable article lists, small status blocks, and restrained borders/shadows. It should not copy another site's brand, text, layout one-to-one, or assets.

## Verification

The build verification script should assert the new navigation, homepage copy, daily page route, daily note visibility, reading metadata, adjacent post navigation, RSS behavior, and draft exclusion.
