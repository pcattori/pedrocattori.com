import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { getPosts } from "../../lib/posts"

export async function getStaticPaths() {
  const posts = await getPosts()
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: {
      title: post.title,
      description: post.description,
    },
  }))
}

const roboto = await fetch(
  "https://api.fontsource.org/v1/fonts/roboto/latin-400-normal.ttf",
).then((res) => res.arrayBuffer())

const colors = {
  cream: "#fffaf3",
  ink: "#26233a",
  pencil: "#575279",
}

export async function GET({
  props,
}: {
  props: { title: string; description: string }
}) {
  const { title, description } = props

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          height: "100%",
          width: "100%",
          backgroundColor: colors.cream,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                height: "100%",
                width: "100%",
                marginLeft: 96,
                borderLeft: `solid 4px ${colors.ink}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 24,
              },
              children: [
                {
                  type: "h1",
                  props: {
                    style: {
                      borderBottom: `solid 4px ${colors.ink}`,
                      padding: 48,
                      fontSize: 70,
                      color: colors.ink,
                      margin: 0,
                      lineHeight: 1.2,
                    },
                    children: title,
                  },
                },
                {
                  type: "p",
                  props: {
                    style: {
                      padding: 48,
                      fontSize: 36,
                      fontWeight: 400,
                      color: colors.pencil,
                      margin: 0,
                      lineHeight: 1.4,
                    },
                    children: description,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Roboto",
          data: roboto,
          weight: 400,
          style: "normal",
        },
      ],
    },
  )

  const resvg = new Resvg(svg)
  const png = resvg.render().asPng()

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
