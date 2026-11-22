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
const renderCache = new Map<string, string>();
const MAX_CACHE_ENTRIES = 24;

function remember(key: string, value: string) {
  renderCache.set(key, value);
  if (renderCache.size > MAX_CACHE_ENTRIES) {
    const oldest = renderCache.keys().next().value;
    if (oldest) renderCache.delete(oldest);
  }
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

/**
 * Recolours a light garment master while retaining its pixel luminance,
 * alpha cut-out, folds and seams. Exact black/white masters are preferred
 * for those colours; this renderer is a visual preview, not a colour proof.
 */
export default function GarmentMasterPreview({ colour, garment = "hoodie", side = "back", fallback, zoom = 100, fitScale = 1, onDimensions }: { colour: string; garment?: GarmentMaster; side?: GarmentSide; fallback?: ReactNode; zoom?: number; fitScale?: number; onDimensions?: (size: { width: number; height: number }) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("Loading garment master…");
  const [assetFailed, setAssetFailed] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 440, height: 470 });
  const fittedWidth = Math.max(1, Math.round(dimensions.width * fitScale));
  const fittedHeight = Math.max(1, Math.round(dimensions.height * fitScale));

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const target = hexToRgb(colour);
    if (!canvas || !target) return;

    const isWhite = colour.toLowerCase() === "#f5f3ed";
    // Use one white master for every fabric colour so framing and garment scale never jump.
    const source = MASTER_IMAGES[garment][side].white;
    setAssetFailed(false);
    setMessage("Loading garment master…");
    const cacheKey = source + ":" + colour.toLowerCase();
    const cached = renderCache.get(cacheKey);

    const drawCached = (dataUrl: string) => {
      const output = new Image();
      output.onload = () => {
        if (cancelled) return;
        canvas.width = output.naturalWidth;
        canvas.height = output.naturalHeight;
        setDimensions({ width: output.naturalWidth, height: output.naturalHeight });
        onDimensions?.({ width: output.naturalWidth, height: output.naturalHeight });
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(output, 0, 0);
        setMessage("");
      };
      output.src = dataUrl;
    };

    if (cached) {
      drawCached(cached);
      return () => { cancelled = true; };
    }

    const master = new Image();
    master.decoding = "async";
    master.onload = () => {
      if (cancelled) return;
      canvas.width = master.naturalWidth;
      canvas.height = master.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        setMessage("Your browser could not initialise the garment renderer.");
        return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(master, 0, 0);
      if (!isWhite) {
        try {
          const frame = context.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = frame.data;
          const [red, green, blue] = target;
          const targetLuma = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
          for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] === 0) continue;
            const luminance = (0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]) / 255;
            const fabricShade = 0.28 + 0.72 * luminance;
            const neutralHighlight = 14 * luminance * (1 - targetLuma);
            pixels[i] = Math.min(255, red * fabricShade + neutralHighlight);
            pixels[i + 1] = Math.min(255, green * fabricShade + neutralHighlight);
            pixels[i + 2] = Math.min(255, blue * fabricShade + neutralHighlight);
          }
          context.putImageData(frame, 0, 0);
        } catch {
          setMessage("Colour rendering failed; showing the original garment.");
        }
      }
      try {
        // Front and back source files have different transparent margins.
        // Crop to the visible pixels before fitting the image into the stage.
        trimToVisibleGarment(canvas);
        const size = { width: canvas.width, height: canvas.height };
        setDimensions(size);
        onDimensions?.(size);
        const result = canvas.toDataURL("image/png");
        remember(cacheKey, result);
      } catch {
        // Keep the current canvas visible even if browser caching is unavailable.
      }
      setMessage("");
    };
    master.onerror = () => {
      if (!cancelled) { setAssetFailed(true); setMessage(""); }
    };
    master.src = source;
    return () => { cancelled = true; };
  }, [colour, garment, side, onDimensions]);

  return (
    <div className="garment-master-frame" style={{ width: `${fittedWidth}px`, height: `${fittedHeight}px`, transform: `translate(-50%, -50%) scale(${zoom / 100})` }}>
      <canvas ref={canvasRef} className="garment-master-render" aria-label={`Photographic ${garment} ${side} preview`} style={{ width: `${fittedWidth}px`, height: `${fittedHeight}px`, display: assetFailed ? "none" : "block" }} />
      {assetFailed ? fallback : null}
      {message && <span className="garment-master-message">{message}</span>}
    </div>
  );
}
