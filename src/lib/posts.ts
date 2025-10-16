import type { CollectionEntry } from "astro:content"
import { getCollection } from "astro:content"

export type Post = {
  slug: string
  title: string
  description: string
  publishedAt: Date
  render: CollectionEntry<"posts">["render"]
}

export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection("posts")
  return entries
    .map(({ id, data, render }: CollectionEntry<"posts">) => ({
      slug: id.split("/")[0]!,
      title: data.title,
      description: data.description,
      publishedAt: data.publishedAt,
      render,
    }))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}
