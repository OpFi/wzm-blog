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
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function estimateReadingMinutes(text: string) {
  const cjkCount = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const wordCount = text.replace(/[\u4e00-\u9fff]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const units = cjkCount + wordCount;
  return Math.max(1, Math.ceil(units / 500));
}

export async function getProjects() {
  const projects = await getCollection("projects");
  return [...projects].sort(byDateDesc);
}

export async function getFeaturedProject(): Promise<ProjectEntry | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.data.featured) ?? projects[0];
}

export async function getPublishedWriting() {
  const entries = await getCollection("writing", ({ data }) => !data.draft);
  return [...entries].sort(byDateDesc);
}

export async function getFeaturedWriting(): Promise<WritingEntry | undefined> {
  const entries = await getPublishedWriting();
  return entries.find((entry) => entry.data.featured) ?? entries[0];
}

export async function getPublishedNotes() {
  const entries = await getCollection("notes", ({ data }) => !data.draft);
  return [...entries].sort(byDateDesc);
}

export async function getDailyNotes() {
  const notes = await getPublishedNotes();
  return notes.filter((note) => note.data.tags.includes("日常"));
}

export async function getLatestUpdates(limit = 6) {
  const writing = await getPublishedWriting();
  const notes = await getPublishedNotes();
  return [
    ...writing.map((entry) => ({
      entry,
      type: "技术",
      href: `/writing/${entry.id}/`,
    })),
    ...notes.map((entry) => ({
      entry,
      type: entry.data.tags.includes("日常") ? "日常" : "随笔",
      href: `/notes/${entry.id}/`,
    })),
  ]
    .sort((a, b) => byDateDesc(a.entry, b.entry))
    .slice(0, limit);
}
