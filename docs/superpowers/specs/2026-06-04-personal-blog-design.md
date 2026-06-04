# Personal Blog Website Design

Date: 2026-06-04

## Summary

Build a personal website that combines a portfolio, long-form writing, and short notes. The site should feel like a creator studio: personal, vivid, and work-focused, with projects as the first signal and writing as the long-term content engine.

The first version will be a static, content-file-driven Astro site using MDX and GitHub-to-Vercel deployment. It will avoid backend complexity until the site has enough real content to justify it.

## Positioning

The site presents the owner as a builder and writer. It is not only a traditional blog, and not only a portfolio. It is a public workspace where visitors can quickly understand:

- What the owner is building.
- How the owner thinks through technical and creative problems.
- What the owner is currently paying attention to.

The homepage should prioritize personal identity and selected work, then invite visitors into longer writing and shorter notes.

## Visual Direction

The approved direction is "creator studio":

- Distinct, personal, and slightly playful.
- Bright layered background with blue, yellow, and green tones.
- Large serif hero headline for personality.
- Clean navigation and readable content areas.
- A frosted-glass `Now / Focus` status panel using translucent background, blur, subtle highlights, and soft shadow.

The design should keep the expressive homepage separate from the reading experience. Article pages should be calmer and optimized for long reading.

## Information Architecture

Primary navigation:

- `Projects`
- `Writing`
- `Notes`
- `About`

Main pages:

- `Home`: personal introduction, `Now / Focus` panel, featured project, latest writing, latest note.
- `Projects`: list of selected projects with title, description, status, tech stack, links, and optional visual preview.
- `Writing`: long-form articles, including technical essays, tutorials, retrospectives, and structured thinking.
- `Notes`: shorter posts for personal notes, updates, fragments, reading notes, and loose thoughts.
- `About`: personal introduction, focus areas, contact links, and social links.

## Content Model

Use Astro Content Collections with three collections:

### Projects

Fields:

- `title`
- `description`
- `date`
- `status`
- `tags`
- `stack`
- `featured`
- `cover`
- `repoUrl`
- `demoUrl`

Purpose: show what has been built or is being built.

### Writing

Fields:

- `title`
- `description`
- `date`
- `updatedDate`
- `tags`
- `draft`
- `featured`

Purpose: long-form articles with stable URLs and strong reading layout.

### Notes

Fields:

- `title`
- `description`
- `date`
- `tags`
- `draft`

Purpose: shorter, lower-pressure updates and personal thoughts.

## Technical Architecture

Framework: Astro.

Content: MDX files stored in the repository.

Content management: Astro Content Collections for validation and querying.

Styling: Tailwind CSS, with custom CSS for the frosted-glass panel and article typography where needed.

Deployment: Vercel connected to GitHub, with automatic deployments on push.

The site should be static-first. No database, login system, CMS, or server-side application layer is needed for version one.

## First Version Scope

Included:

- Responsive homepage with the approved creator-studio style.
- Frosted-glass `Now / Focus` panel.
- `Projects`, `Writing`, `Notes`, and `About` pages.
- Detail pages for projects, writing posts, and notes.
- MDX rendering with code blocks and basic prose styling.
- Draft filtering so draft content does not appear in production lists.
- SEO basics: page titles, descriptions, Open Graph metadata, sitemap, and RSS.
- Sample content for all three collections.

Excluded from version one:

- Comments.
- Admin CMS.
- Login, users, or membership.
- Full-text search.
- Multi-language support.
- Complex animation.

## User Experience Requirements

- The first viewport must clearly signal the person/site identity and show that this is a portfolio plus writing site.
- Featured content should be visible just below the first viewport so the homepage does not feel like only a hero section.
- Article pages must prioritize readability: comfortable line length, clear headings, code block styling, and simple navigation back to lists.
- Mobile layouts must avoid text overlap, horizontal overflow, or squeezed navigation.
- Cards should use small radii and restrained styling; page sections should not become nested card stacks.

## Error Handling And Edge Cases

- Missing optional project links should simply hide those links.
- Draft content should be excluded from production lists.
- Missing cover images should fall back to a text-first project card.
- Empty collections should render a simple empty state rather than a broken page.
- Invalid frontmatter should fail during build through Astro collection schemas.

## Verification Plan

Before considering implementation complete:

- Run the project build command and confirm it passes.
- Verify the local development server opens successfully.
- Check homepage, list pages, and detail pages on desktop and mobile widths.
- Confirm `projects`, `writing`, and `notes` content can be queried and rendered.
- Confirm MDX content renders headings, paragraphs, links, and code blocks correctly.
- Confirm draft posts do not appear in production lists.
- Confirm sitemap and RSS are generated.

## Approved Decisions

- Use the `creator studio` visual direction.
- Use `Projects / Writing / Notes / About` navigation.
- Use local MDX writing rather than a CMS for the first version.
- Use Astro, Content Collections, Tailwind CSS, and Vercel.
- Keep the first version focused and defer comments, CMS, search, login, multi-language support, and complex animation.
