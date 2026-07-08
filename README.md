# pulkit2306.github.io

Personal portfolio, served via [GitHub Pages](https://pages.github.com/).

3D Matrix-rain themed portfolio built with [Vite](https://vitejs.dev/), TypeScript, and [Three.js](https://threejs.org/). The rain scene renders in 3D (instanced glyphs + bloom) on capable devices and falls back to a lightweight 2D canvas rain when WebGL is unavailable, `prefers-reduced-motion` is set, or the device looks low-end. All content (about, projects, contact) is real DOM markup layered on top of the canvas — not drawn into it — so it stays fast, readable, and indexable.

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build
```

Outputs to `dist/`.

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` via GitHub Pages. The repo's Pages source must be set to **GitHub Actions** (Settings → Pages → Source) rather than "Deploy from a branch".

## Structure

- `src/scenes/` — the two rain renderers (`matrixRain3D.ts` Three.js scene, `fallbackRain2D.ts` canvas fallback)
- `src/sections/` — page content (hero, about, projects, contact)
- `src/data/projects.ts` — project entries (currently placeholders)
- `src/utils/capabilities.ts` — decides which rain tier to mount
