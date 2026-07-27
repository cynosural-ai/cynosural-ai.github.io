---
title: "Welcome to the Blog"
date: 2026-07-27
description: "A placeholder post that doubles as a style template — delete or replace it when you publish something real."
author: "Fernando Rodriguez"
authorUrl: "https://ferjorosa.github.io/"
tags: [Meta]
---

This is a placeholder post. It exists so the blog scaffold has something to
render and so you can see how Markdown looks with this site's styling. Feel free
to **delete this file** and drop in your own.

## Markdown basics

You can write **bold**, *italic*, `inline code`, and [links](https://cynosural.org).

> Block quotes are styled to match the rest of the site.

### Lists

- Unordered items work as expected.
- So do nested ones.
  - Like this.

1. Ordered lists too.
2. Nicely spaced.

### Code blocks

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

### Tables

| Feature      | Supported |
| ------------ | --------- |
| GFM tables   | Yes       |
| Strikethrough | ~~yes~~  |
| Task lists   | [x] done  |

### Math (KaTeX)

Inline math renders inline, like $E = mc^2$, and block math on its own line:

$$
p(\theta \mid \mathcal{D}) = \frac{p(\mathcal{D} \mid \theta)\, p(\theta)}{p(\mathcal{D})}
$$

### Images

Images referenced from `public/` work via absolute paths:

![Historical newspaper collage](/collage_bne.png)

### Raw HTML

Since the posts from your other blog use raw HTML for figures and details
blocks, that's preserved too:

<details>
<summary>Click to expand a collapsible section</summary>

Useful for long tables of contents or appendices.
</details>

---

That's it. To publish a new post, just add a new `.md` file to
`src/content/blog/` with front matter (`title`, `date`, optional `description`
and `tags`) — it shows up on `/blog` automatically.
