# 🎨 Chroma — Random Color Palette Generator

A clean, modern palette generator. Click **Generate** (or hit **Space**) to roll a new
five-color palette, and click any swatch to copy its hex code.

It doesn't roll *pure* random colors — it picks a random color-harmony scheme
(analogous, complementary, triadic, split-complementary, tetradic, or monochrome)
each time, so every palette actually looks good.

## Features

- Five colors per palette with hex codes
- Click-to-copy any color (with toast confirmation)
- Press **Space** to regenerate
- Harmony-based generation for consistently pleasing results
- Auto-contrasting text, smooth animations, fully responsive
- Zero dependencies, zero build step

## Run locally

It's plain static HTML/CSS/JS — just open `index.html`, or serve the folder:

```bash
npx serve .
```

## Deploy to Vercel

This is a static site, so there's nothing to build.

**Option A — Vercel CLI**

```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

**Option B — Git + Dashboard**

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. In the [Vercel dashboard](https://vercel.com/new), import the repo.
3. Framework Preset: **Other** · Build Command: *(none)* · Output Directory: `./`
4. Click **Deploy**.

That's it.

## Files

| File          | Purpose                          |
| ------------- | -------------------------------- |
| `index.html`  | Markup                           |
| `styles.css`  | Styling & animations             |
| `script.js`   | Palette generation & copy logic  |
| `vercel.json` | Clean URLs config (optional)     |
