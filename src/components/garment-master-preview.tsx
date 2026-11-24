"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type GarmentMaster = "hoodie" | "crewneck";
type GarmentSide = "front" | "back";

const MASTER_IMAGES: Record<GarmentMaster, Record<GarmentSide, { white: string; black: string }>> = {
  hoodie: {
    front: { white: "/garments/hoodie-white-front.png", black: "/garments/hoodie-black-front.png" },
    back: { white: "/garments/hoodie-white-back.png", black: "/garments/hoodie-black-back.png" },
  },
  crewneck: {
    front: { white: "/garments/tshirt-white-front.png", black: "/garments/tshirt-black-front.png" },
    back: { white: "/garments/tshirt-white-back.png", black: "/garments/tshirt-black-back.png" },
  },
};

// Swatches that should show the photographed master exactly as shot.
const WHITE_HEX = "#f5f3ed";
const BLACK_HEX = "#1a1a1a";
// Colours darker than this (perceived luminance 0-1) are built from the BLACK master,
// because dark fabric is defined by highlights, not shadows.
const DARK_LUMA = 0.33;

const renderCache = new Map<string, string>();
const MAX_CACHE_ENTRIES = 24;

function remember(key: string, value: string) {
  renderCache.set(key, value);
  if (renderCache.size > MAX_CACHE_ENTRIES) {
    const oldest = renderCache.keys().next().value;
    if (oldest) renderCache.delete(oldest);
  }
}

function lumaOf(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function trimToVisibleGarment(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context || !canvas.width || !canvas.height) return;
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (data[(y * canvas.width + x) * 4 + 3] > 10) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < left || bottom < top) return;
  const padX = Math.round((right - left + 1) * 0.025);
  const padY = Math.round((bottom - top + 1) * 0.025);
  left = Math.max(0, left - padX); top = Math.max(0, top - padY);
  right = Math.min(canvas.width - 1, right + padX); bottom = Math.min(canvas.height - 1, bottom + padY);
  const width = right - left + 1, height = bottom - top + 1;
  if (width === canvas.width && height === canvas.height) return;
  const cropped = document.createElement("canvas"); cropped.width = width; cropped.height = height;
  const croppedContext = cropped.getContext("2d"); if (!croppedContext) return;
  croppedContext.drawImage(canvas, left, top, width, height, 0, 0, width, height);
  canvas.width = width; canvas.height = height;
  canvas.getContext("2d")?.drawImage(cropped, 0, 0);
}

function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  const value = match[1];
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

/** Darkest and brightest typical luminance (2nd / 98th percentile) of the garment pixels. */
function shadingRange(pixels: Uint8ClampedArray): [number, number] {
  const histogram = new Uint32Array(256);
  let total = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 200) continue;
    histogram[Math.round(lumaOf(pixels[i], pixels[i + 1], pixels[i + 2]) * 255)]++;
    total++;
  }
  if (!total) return [0, 1];
  const at = (quantile: number) => {
    const goal = total * quantile;
    let sum = 0;
    for (let bin = 0; bin < 256; bin++) { sum += histogram[bin]; if (sum >= goal) return bin / 255; }
    return 1;
  };
  const lo = at(0.02), hi = at(0.98);
  return hi - lo < 0.02 ? [lo, lo + 0.02] : [lo, hi];
}

/**
 * Recolours a garment master while keeping its cut-out, folds and seams.
 *
 * Light/mid colours: WHITE master. Shading is stretched to its real range, then multiplied
 * into the colour (brightest area = the exact swatch colour, folds = darker).
 * Dark colours: BLACK master. Shading is multiplied in AND a soft neutral sheen is added on the
 * highlights, which is what makes real black / navy / forest fabric read as fabric instead of
 * a flat dark shape.
 * This is still a screen preview, not a colour proof.
 */
function recolour(frame: ImageData, target: [number, number, number], mode: "light" | "dark") {
  const pixels = frame.data;
  const [red, green, blue] = target;
  const targetLuma = lumaOf(red, green, blue);
  const [lo, hi] = shadingRange(pixels);

  // Pre-compute shade + sheen for every possible source luminance (fast, no per-pixel pow).
  const shadeLut = new Float32Array(256);
  const sheenLut = new Float32Array(256);
  for (let v = 0; v < 256; v++) {
    const s = Math.min(1, Math.max(0, (v / 255 - lo) / (hi - lo)));
    if (mode === "dark") {
      shadeLut[v] = 0.42 + 0.95 * Math.pow(s, 0.9);
      sheenLut[v] = (26 * (1 - targetLuma) + 6) * Math.pow(s, 2.2);
    } else {
      shadeLut[v] = 0.55 + 0.45 * s;
      sheenLut[v] = 0;
    }
  }

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] === 0) continue;
    const v = Math.round(lumaOf(pixels[i], pixels[i + 1], pixels[i + 2]) * 255);
    const shade = shadeLut[v], sheen = sheenLut[v];
    pixels[i] = Math.min(255, red * shade + sheen);
    pixels[i + 1] = Math.min(255, green * shade + sheen);
    pixels[i + 2] = Math.min(255, blue * shade + sheen);
  }
}

export default function GarmentMasterPreview({ colour, garment = "hoodie", side = "back", fallback, zoom = 100, fitScale = 1 }: { colour: string; garment?: GarmentMaster; side?: GarmentSide; fallback?: ReactNode; zoom?: number; fitScale?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("Loading garment master…");
  const [assetFailed, setAssetFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const target = hexToRgb(colour);
    if (!canvas || !target) return;

    const hex = colour.toLowerCase();
    const wantsDark = lumaOf(...target) < DARK_LUMA;
    const masters = MASTER_IMAGES[garment][side];
    setAssetFailed(false);
    setMessage("Loading garment master…");

    const drawCached = (dataUrl: string) => {
      const output = new Image();
      output.onload = () => {
        if (cancelled) return;
        canvas.width = output.naturalWidth;
        canvas.height = output.naturalHeight;
        canvas.getContext("2d")?.drawImage(output, 0, 0);
        setMessage("");
      };
      output.src = dataUrl;
    };

    const render = (useBlack: boolean) => {
      const source = useBlack ? masters.black : masters.white;
      console.log("garment render", source, hex, useBlack ? "dark" : "light");
      const cacheKey = source + ":" + hex;
      const cached = renderCache.get(cacheKey);
      if (cached) { drawCached(cached); return; }

      const master = new Image();
      master.decoding = "async";
      master.onload = () => {
        if (cancelled) return;
        canvas.width = master.naturalWidth;
        canvas.height = master.naturalHeight;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) { setMessage("Your browser could not initialise the garment renderer."); return; }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(master, 0, 0);

        // The two swatches that match a photographed master are shown untouched.
        const untouched = (!useBlack && hex === WHITE_HEX) || (useBlack && hex === BLACK_HEX);
        if (!untouched) {
          try {
            const frame = context.getImageData(0, 0, canvas.width, canvas.height);
            recolour(frame, target, useBlack ? "dark" : "light");
            context.putImageData(frame, 0, 0);
          } catch {
            setMessage("Colour rendering failed; showing the original garment.");
          }
        }
        try {
          // Front/back and white/black files have different transparent margins,
          // so crop to the visible pixels before fitting into the stage.
          trimToVisibleGarment(canvas);
          remember(cacheKey, canvas.toDataURL("image/png"));
        } catch {
          // Keep the current canvas visible even if caching is unavailable.
        }
        setMessage("");
      };
      master.onerror = () => {
        if (cancelled) return;
        if (useBlack) render(false); // black master missing: fall back to the white master
        else { setAssetFailed(true); setMessage(""); }
      };
      master.src = source;
    };

    render(wantsDark);
    return () => { cancelled = true; };
  }, [colour, garment, side]);

  return (
    <div className="garment-master-frame" style={{ transform: `scale(${(zoom / 100) * fitScale})` }}>
      <canvas ref={canvasRef} className="garment-master-render" aria-label={`Photographic ${garment} ${side} preview`} style={{ display: assetFailed ? "none" : "block" }} />
      {assetFailed ? fallback : null}
      {message && <span className="garment-master-message">{message}</span>}
    </div>
  );
}
