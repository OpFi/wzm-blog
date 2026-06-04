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
    customData: "<language>zh-cn</language>",
  });
}
