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

One-time setup in the repository: go to **Settings → Pages** and set **Source**
to **GitHub Actions**.

The site is served as a project page at `https://ewels.github.io/numbercontext/`,
so the Vite `base` is `/numbercontext/` (see `vite.config.ts`).

### Custom domain (later)

To serve from `numbercontext.com` once the domain is owned:

1. Set `base` back to `"/"` in `vite.config.ts`.
2. Add a `public/CNAME` file containing `numbercontext.com`.
3. Point the domain's DNS at GitHub Pages and enable **Enforce HTTPS** in the
   Pages settings.
