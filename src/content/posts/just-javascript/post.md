# Just JavaScript

Everyone means something different when they say something is "just JavaScript".

So here's what "Just JavaScript" means to me, plain and simple:

> It should work without custom transforms

I chose this definition for two related reasons.

First, I want to know what my program is doing.
I don't mind if bundlers or build steps change _how_ its done; go ahead and optimize my code!
But when they change _what_ is being done, that's when I take issue with it.

Second, I want to bring all of my coding skills to bear on the problem.
I want normal refactors to work, no questions asked.
If I don't get any red squiggles when I move some code from one place to another, I expect things to work.

## TypeScript & JSX

I'll make an exception for TypeScript and JSX.
Yes, those two require transforms, but they aren't really "custom" transforms; they are ubiquitous and unambiguous.

At this point, TypeScript and JSX are table stakes and I think JS runtimes should take them on as standard rather than forcing every app and library to set them up.

And it seems like the major JS runtimes agree!
Deno and Bun both handle them out-of-the-box.
Even Node lets you run TypeScript directly now.

Browsers don't currently support neither TypeScript nor JSX so we'll still need build tools or bundlers for that.

Note: when I say "TypeScript", I mean using TypeScript while avoiding the few features that alter the runtime code like`enum`s and `export =` assignments. If you think of TypeScript as "JavaScript with types", that means you agree with me and you should probably enable [`erasableSyntaxOnly`](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly).

## Is React Router just JavaScript?

Disclaimer: I am part of the Remix team that works on Remix and React Router.

In framework mode, React Router is powered by Vite.
That means it already opts in to all the [built-in plugins](https://github.com/vitejs/vite/tree/fa3753a0f3a6c12659d8a68eefbd055c5ab90552/packages/vite/src/node/plugins) that power its [feature set](https://vite.dev/guide/features).
Many of those built-in plugins don't affect your deployment runtime; they are purely optimizations or dev-time conveniences like HMR.
But there's also some that do change the runtime semantics.
For example, you can't normally import `.css` files in JavaScript but with a built-in Vite plugin, now you can.
Already this calls into question if React Router is "just JavaScript".

Fun fact: When Remix v2 moved from a bespoke esbuild-based compiler to Vite, we eliminated as many framework-specific transforms as possible.

Beyond Vite, there are a couple features in React Router that require framework-specific transforms:

- HMR (dev-time): extend Vite's HMR capabilities so that server-side changes automatically trigger data revalidations
- Route chunking (optimization): automatically split up route module exports into their own modules for finer grain JavaScript bundles
- Typegen (dev-time): generate types for route modules

These are all purely optimizations or dev-time conveniences that don't bring your app's runtime code further from "just JavaScript".
But there is one feature that deviates from "just JavaScript": route modules.

In framework mode, routes are modules with specially named `export`s that let you colocate your client and server code in a single file.
That means that moving some code into or out of a specially named `export` changes where that code runs.
Everything else is in React Router is just JavaScript.

I think this is a pretty good trade-off.
Technically, React Router does add semantics to JavaScript via the special `export`s, but they are limited to just the module-level exports in route modules.
There are times where this has caused issues, but they are few and far between.

And most importantly, it means that you can keep writing JavaScript and be confident that it behaves the way you expect.

## Is Svelte just JavaScript?

No. But that's because it doesn't aim to be!

Svelte is its own language, with its typechecker, LSP, and more!
Sure, you can embed some JavaScript within a `.svelte` file, but even there Svelte sprinkles in some magical non-JS semantics in the form of [runes](https://svelte.dev/docs/svelte/what-are-runes).
And for Svelte, that decision makes a ton of sense!

Paraphrasing Rich Harris:

If you have your own semantics, you should have your own language.
Be honest about it and don't use `.ts` or `.js` extensions.

I could have picked any other framework to analyze here, I semi-arbitrarily chose Svelte because I like it and respect the design decisions the Svelte team has made.

## Is Remix 3 just JavaScript?

Yes.

Build tools and bundlers aren't evil.
We may very well use them to power optimizations, HMR, TypeScript & JSX, etc.
But at the end of the day, those are all layered on.
Remix 3 works just fine without them.
