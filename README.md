# numbercontext.com

A scale translator for turning bare numbers into physical, sourced context. Type
a number, pick a unit, and see it re-expressed as memorable real-world comparisons
with sources and caveats.

Built as a fully static, client-only single-page app with **Vite + React +
TypeScript**. There is no server, database, or runtime backend — everything runs
in the browser.

## Local development

```bash
npm install
npm run dev
```

This starts the Vite dev server (default http://localhost:5173) with hot reload.

## Build

```bash
npm run build
```

Runs a TypeScript type check and produces a static bundle in `dist/`.

## Preview the production build

```bash
npm run preview
```

Serves the contents of `dist/` locally so you can verify the production build.

## Lint

```bash
npm run lint
```

## Content

The source-backed conversion catalog lives in `src/contexts.ts`. Each entry defines:

- the input dimension
- the output dimension
- the conversion factor
- the sensible display range
- the visual group/glyph
- notes and source links

## Deployment (GitHub Pages)

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`): every
push to `main` builds the site and publishes `dist/` to GitHub Pages.

One-time setup in the repository:

1. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. The site is served from the domain root, so the Vite `base` is `/`.

### Custom domain

`public/CNAME` contains `numbercontext.com`, which is copied into the build output
so GitHub Pages keeps the custom domain configured on each deploy. To use a
different domain, edit that file (or remove it to serve from the default
`*.github.io` URL — in that case set `base` in `vite.config.ts` to
`/<repo-name>/`). Point the domain's DNS at GitHub Pages and enable
**Enforce HTTPS** in the Pages settings.
