# Minimal Green Home Design

## Goal

Turn the homepage into a quiet green entry screen. The navigation stays unchanged. Everything else on the homepage is removed except one small top-left welcome line and a centered looping animation.

## User-Approved Direction

- Keep the site theme green.
- Preserve the existing global navigation and other routes.
- Show one small line near the upper-left area of the homepage content: `欢迎来到我的网站`.
- Put an interesting looping animation in the center of the homepage.
- Remove homepage sections such as featured articles, latest updates, category index, friend links, and status/project panels.

## Design

The homepage body becomes a single full-viewport composition below the shared header. The background uses the existing green palette, with a soft botanical feel that stays lightweight and readable.

The center animation is CSS-only: a layered green leaf-ring form that slowly rotates and breathes. Several leaf-shaped elements grow outward from a central ring, while thin circular guide rings pulse gently. The effect should feel alive, calm, and personal without adding JavaScript or heavy assets.

The animation container uses `role="img"` and an accessible label, so the visual has a meaningful non-visual description. A `prefers-reduced-motion` rule freezes the movement for visitors who disable motion.

## Boundaries

- Do not change navigation labels or destination routes.
- Do not remove content pages, collections, RSS, sitemap, or existing sample data.
- Do not add visible explanatory text beyond `欢迎来到我的网站`.
- Do not use external animation libraries.

## Verification

The build verification must confirm:

- The homepage still renders Chinese metadata and navigation.
- The homepage contains `欢迎来到我的网站`.
- The homepage contains the accessible animation label.
- Old homepage sections no longer appear in `dist/index.html`.
- Existing content routes, RSS, sitemap, and draft filtering still work.

Browser verification should confirm the animation is centered, the page does not overflow horizontally, and no console errors appear.
