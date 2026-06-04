# Chinese Content Refresh Design

## Goal

Turn the first-version personal blog into a Chinese-language site with realistic placeholder content suitable for a public launch preview.

## Scope

- Localize the site chrome, SEO metadata, navigation, listing pages, detail affordances, footer, About page, and homepage copy into Simplified Chinese.
- Add realistic sample content for a product-minded web developer: four projects, four long-form articles, and six public notes.
- Keep one draft note in place to verify unpublished content remains hidden from routes, homepage highlights, listing pages, and RSS.
- Preserve the current Astro + MDX architecture, visual direction, and frosted-glass status panel.

## Content Direction

The fake data should read like an early-stage independent developer portfolio, not generic filler. Projects should include clear status, stack, product intent, lessons learned, and believable next steps. Writing should cover technical implementation, product thinking, publishing workflow, and deployment notes. Notes should be concise observations from daily building.

## Verification

`scripts/verify-build.mjs` should assert the Chinese language marker, Chinese navigation, enough published content, draft filtering, RSS inclusion, project routes, and article Open Graph behavior after build.
