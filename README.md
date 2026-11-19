# The Living Room Platform

A custom apparel storefront, customer design studio and business management platform for The Living Room, Ghana.

## Current build

The storefront is paired with an expanded, browser-based mockup editor inspired by the workflow of modern T-shirt mockup tools.

Editor features in this prototype:
- Editor sections for Design, Garment, Canvas and Props
- Eight garment-style choices, front/back views and separate editable artwork canvases
- Fabric colour presets and a custom HEX colour input
- Add text and upload PNG, JPG or WebP artwork (up to 8 MB)
- Drag, resize, rotate and adjust artwork opacity
- Canvas ratios: 1:1, 4:3, 4:5 and 9:16
- Solid, transparent-style and warm wood-style preview backgrounds
- 1000 px and 2000 px PNG design-canvas export
- Prototype controls for fold shadows, fabric shine and scene props

## Photographic hoodie back rendering

The studio now has a client-side garment-master renderer for the supplied hoodie back photographs. It preserves the source alpha channel and fabric luminance while applying a selected colour, and caches recent colour variants in memory. The exact black and white options use their corresponding photographic masters.

Place the two prepared transparent PNGs at:
- `public/garments/hoodie-white-back.png`
- `public/garments/hoodie-black-back.png`

The supplied files are rear views only. The hoodie front and all other garment views remain illustrative until their matching approved master images are added. Colour previews are not calibrated production proofs or a stock feed.

## Important prototype limitations

- Garment visuals are illustrative SVG placeholders, not approved garment photography. Front/back views are not yet production-accurate garment master images.
- Colour presets are visual previews only. They are not linked to stock/inventory and cannot guarantee a physical fabric colour.
- Fold-shadow, fabric-shine and prop controls are interface prototypes; realistic fabric rendering and photorealistic props are not implemented yet.
- Export currently produces the artwork canvas PNG, not a complete composited garment mockup or certified print-ready file.
- Batch export and ZIP packaging are not implemented.
- Designs are not saved to Supabase or a customer account. There is no customer authentication or admin dashboard yet.
- Do not upload confidential customer artwork to a public deployment until private storage and access controls are implemented.

## Run locally

Requirements: Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Recommended next implementation stage

1. Add approved transparent front/back garment master images and accurate print-area masks for each product.
2. Implement fabric-aware colour rendering that preserves folds, highlights, shadows, stitching and seams; connect colour choices to actual stock.
3. Composite artwork with fabric lighting and render complete mockup exports.
4. Add batch export, then Supabase Auth and private Storage with owner-based Row Level Security for saved designs.
5. Add measured print specifications and production-file validation before offering print-ready downloads.
