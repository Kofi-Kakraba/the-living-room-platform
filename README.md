# The Living Room Platform

A custom apparel storefront, customer design studio and business management platform for The Living Room, Ghana.

## Current build

This first build is the application foundation and an interactive design-studio proof of concept.

Included:
- Next.js App Router with TypeScript
- Responsive storefront-style landing page
- Product selector for T-shirts and hoodies
- Front/back design surfaces
- Colour switching
- Add and edit text
- Upload PNG, JPG and WebP artwork
- Move, resize and rotate canvas objects
- Delete selected objects
- Export a preview PNG

The garment illustrations are clearly labelled prototype mockups. Replace them with approved garment photography and measured print-area templates before using the editor for production work.

## Run locally

Requirements: Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Important limitations in this first build

- Designs are not yet saved to Supabase.
- There is no customer authentication or admin dashboard yet.
- The editor export is a visual preview, not certified print-ready artwork.
- Product templates and print boundaries are illustrative placeholders.
- Do not upload confidential customer artwork to a public deployment until private storage and access controls are implemented.

## Next implementation stage

Connect Supabase Auth and private Storage, then implement secure design save/reopen with owner-based Row Level Security. After that, replace placeholder product templates with The Living Room's actual garment assets and print specifications.
