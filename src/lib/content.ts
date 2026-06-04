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
