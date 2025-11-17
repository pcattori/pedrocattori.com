import rss from "@astrojs/rss"

import { getPosts } from "../lib/posts"

export async function GET(context: { site: string | URL }) {
  const posts = await getPosts()
  return rss({
    title: "Pedro Cattori",
    description: "Blog posts",
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.publishedAt,
      description: post.description,
      link: `/posts/${post.slug}/`,
    })),
  })
}
