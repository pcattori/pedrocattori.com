---
title: Just JavaScript
description: Is React Router just JavaScript? What about React or Remix 3?
publishedAt: 2025-11-17
---

Everyone means something different when they say something is "just JavaScript".

So here's what "just JavaScript" means to me, plain and simple:

> The code should work without custom transforms

I chose this definition for two related reasons.

First, I want to know what my program is doing.
I don't mind if bundlers or build steps change _how_ its done; go ahead and optimize my code!
But when they affect _what_ is being done in non-standard ways, that's when I take issue with it.

Second, I want to bring all of my coding skills to bear on the problem.
I want normal refactors to work, no questions asked.
If I don't get any red squiggles when I move some code from one place to another, I expect things to work.

It might not be a perfect definition.
It might not be your definition.
But that's what "just JavaScript" means to me.

## TypeScript & JSX

I'll make an exception for TypeScript and JSX.
Yes, those two require transforms, but they aren't really "custom" transforms; they are ubiquitous and unambiguous.

In fact they are so ubiquitous that JavaScript runtimes are starting to support them as standard.
Deno and Bun both handle them out-of-the-box.
[Cloudflare workers support TypeScript.](https://developers.cloudflare.com/workers/languages/typescript/)
Even [Node lets you run TypeScript directly](https://nodejs.org/en/learn/typescript/run-natively) now.
In my view, if TypeScript and JSX are part of the runtime, they are no longer transforms; its all just source code.

Browsers don't natively support TypeScript or JSX so we'll still need some way to build or bundle for the browser.

Some quick clarifications:

1. TypeScript can alter your runtime code if you use features like `enum`s and `export =` assignments.
   There are still ubiquitous and unambiguous transforms, but if you want TypeScript to be "just JavaScript (with types)", you can enable [`erasableSyntaxOnly`](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly).

2. Even though different JSX implementations allow for different props — `onClick` in React, `on` in Remix 3 — the transform itself is unambiguous.
   It takes something like `<Component prop={1} />` and produces something like `createElement(Component, { prop: 1 })`.

## Is \_\_\_ just JavaScript?

Let's apply this definition to a couple frameworks and libraries.

Disclaimer: I am part of the Remix team that works on Remix and React Router.

### React Router

Is React Router just JavaScript? Almost, but not quite.

In framework mode, React Router is powered by Vite.
That means React Router already opts in to all the [built-in plugins](https://github.com/vitejs/vite/tree/fa3753a0f3a6c12659d8a68eefbd055c5ab90552/packages/vite/src/node/plugins) that power [Vite's feature set](https://vite.dev/guide/features).
Many of those built-in plugins don't affect your deployment runtime; they are purely optimizations or dev-time conveniences like HMR.
But there's also some that do change the runtime semantics.
For example, you can't normally import `.css` files in JavaScript but with Vite, now you can.
Already this calls into question if React Router is "just JavaScript".

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

Fun fact: The previous esbuild-based compiler for Remix v2 ran a bunch of bespoke, framework-specific transforms for things like polyfills, CSS support (CSS modules, CSS imports, CSS side-effect imports, etc.), and custom HMR runtime.
One major goal when Remix v2 moved to Vite was to eliminate as many of these framework-specific transforms as possible.

### Svelte

Is Svelte just JavaScript? No.

But that's because it doesn't aim to be!
Svelte is its own language, with its typechecker, LSP, and more.
Sure, you can embed some JavaScript within a `.svelte` file, but even there Svelte sprinkles in some magical non-JS semantics in the form of [runes](https://svelte.dev/docs/svelte/what-are-runes).
And for Svelte, that decision makes perfect sense.

Here's what [Rich Harris says about it](https://youtu.be/uXCipjbcQfM?t=965):

> I'm pro DSLs, but there's a crucial caveat: you have to be honest about it.
> In the Svelte case, we're using `.svelte` files.

In my own words: if you have your own semantics, you should have your own language.

### React

Is React just JavaScript? Not anymore.

Directives like `"use client"` and `"use server"` require custom transforms.
And that's ok!
Not everything needs "just JavaScript" as a goal.

That said, I don't like that directives _look_ like just JavaScript, nor that they lack type-safety and traceability (like "Go to Definition").
And [I'm not the only one that feels this way](https://tanstack.com/blog/directives-and-the-platform-boundary#when-directives-look-like-the-platform-developers-treat-them-like-the-platform).

Personally, I'm happy to see that React is exploring what can be done with custom compilers and transforms.
Maybe those directives will become as ubiquitous as TypeScript, maybe not.
Either way is fine by me.

### Remix 3

Is Remix 3 just JavaScript? Yes.

From [the Remix 3 principles](https://github.com/remix-run/remix/blob/main/README.md#welcome-to-remix-3):

> Religiously Runtime. Designing for bundlers/compilers/typegen (and any pre-runtime static analysis) leads to poor API design that eventually pollutes the entire system. All packages must be designed with no expectation of static analysis and all tests must run without bundling. Because browsers are involved, --import loaders for simple transformations like TypeScript and JSX are permissible.

Build tools and bundlers aren't evil.
We may very well use them to power optimizations, HMR, TypeScript & JSX, etc.
But at the end of the day, build tools and bundlers are layered on.
Remix 3 works just fine without them.
