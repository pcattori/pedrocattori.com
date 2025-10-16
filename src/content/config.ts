import { z, defineCollection } from "astro:content"

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.preprocess((arg) => {
      if (typeof arg === "string") return new Date(arg)
    }, z.date()),
  }),
})

const bookmarks = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    link: z.string().url(),
  }),
})

export const collections = { posts, bookmarks }
