---
title: Your app's `package.json` is wrong
description: "Unless you're already using `private: true`"
publishedAt: 2023-01-20
---

You create a new app and start with this `package.json`:

```json
{
  "name": "my-app",
  "description": "My awesome app",
  "version": "1.0.0",
}
```

Can you spot what's wrong?

Well, everything actually.

There are a ton of properties — `name`, `version`, `description`, `keywords`, `authors`, etc — that are designed packages published to `npm`.
They power things like the `npm info` and `npm search` commands.
Perfect for finding just the right framework or library.

But apps aren't like that.
In fact, `package.json` has a way to [declare that you are not going to publish this package](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#private):

```json
{
  "private": true
}
```

So start with that, then add `scripts` and `dependencies` as you need them.
But don't add any properties meant for publishing packages.
Otherwise, you'll create [false affordances](https://en.wikipedia.org/wiki/Affordance#False_affordances).

If you need a place for others to read about your app, do yourself a favor and write a `README.md` instead.
Your coworkers will thank you.

## The one exception...

If you need a central place to put your app's metadata where you will _programmatically_ access it, then I won't judge you for putting it in `package.json`.
For example, if you wanted to templetize your docs so that your app's name and version came directly from the `name` and `version` fields in `package.json`.
