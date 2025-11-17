import { z, defineCollection } from "astro:content"

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.preprocess((arg) => {
      if (arg instanceof Date) return arg
      if (typeof arg === "string") return Date.parse(arg)
    }, z.date()),
  }),
})

const bookmarks = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    link: z.string().url(),
    author: z.string().optional(),
  }),
})

export const collections = { posts, bookmarks }
