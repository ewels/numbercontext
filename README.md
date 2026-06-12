# numbercontext.com

A Sites-powered scale translator for turning bare numbers into physical, sourced context.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Content

The source-backed conversion catalog lives in `lib/contexts.ts`. Each entry defines:

- the input dimension
- the output dimension
- the conversion factor
- the sensible display range
- the visual group/glyph
- notes and source links

The original brainstorm CSV is not required at runtime; it was used as seed material for this first catalog.
