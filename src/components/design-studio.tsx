"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, FabricImage, IText, Rect } from "fabric";
import { ArrowDownToLine, ArrowLeftRight, Bold, ImagePlus, RotateCcw, RotateCw, Trash2, Type } from "lucide-react";

type Product = "tshirt" | "hoodie";
type Side = "front" | "back";
const colours = [
  { name: "Natural", value: "#e9dfce" },
  { name: "Black", value: "#292929" },
  { name: "White", value: "#f8f7f2" },
  { name: "Forest", value: "#314b3e" }
];

function GarmentShape({ product, colour }: { product: Product; colour: string }) {
  if (product === "hoodie") {
    return <svg className="garment-svg" viewBox="0 0 440 470" aria-hidden="true">
      <path d="M150 91 181 67Q220 104 259 67L290 91 383 157 348 222 303 196 314 425 126 425 137 196 92 222 57 157Z" fill={colour} stroke="rgba(40,35,30,.2)" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M181 67Q220 151 259 67L250 133 190 133Z" fill={colour} stroke="rgba(40,35,30,.25)" strokeWidth="3"/>
      <path d="M190 133Q220 165 250 133" fill="none" stroke="rgba(40,35,30,.3)" strokeWidth="4"/>
      <path d="M126 328Q220 348 314 328L310 376Q220 397 130 376Z" fill="rgba(0,0,0,.055)"/>
      <path d="M190 135 183 208M250 135 257 208" stroke="rgba(40,35,30,.25)" strokeWidth="2"/>
    </svg>;
  }
  return <svg className="garment-svg" viewBox="0 0 440 470" aria-hidden="true">
    <path d="M142 66 184 48Q220 91 256 48L298 66 391 132 350 209 303 180 314 425 126 425 137 180 90 209 49 132Z" fill={colour} stroke="rgba(40,35,30,.2)" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M184 48Q220 125 256 48" fill="none" stroke="rgba(40,35,30,.3)" strokeWidth="9"/>
    <path d="M137 180 90 209M303 180 350 209" stroke="rgba(40,35,30,.2)" strokeWidth="3"/>
  </svg>;
}

export default function DesignStudio() {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<Canvas | null>(null);
  const [product, setProduct] = useState<Product>("tshirt");
  const [side, setSide] = useState<Side>("front");
  const [colour, setColour] = useState(colours[0].value);
  const [designName, setDesignName] = useState("My first design");
  const [status, setStatus] = useState("Ready to create");
  const [textValue, setTextValue] = useState("YOUR DESIGN");

  useEffect(() => {
    if (!canvasElement.current) return;
    const canvas = new Canvas(canvasElement.current, {
      width: 300,
      height: 300,
      backgroundColor: "rgba(255,255,255,0)",
      preserveObjectStacking: true,
      selection: true
    });
    fabricCanvas.current = canvas;
    const boundary = new Rect({
      left: 72, top: 64, width: 156, height: 172,
      fill: "rgba(255,255,255,0.015)",
      stroke: "#a66c4b", strokeDashArray: [6, 5],
      strokeWidth: 1.5, selectable: false, evented: false,
      name: "print-area-guide"
    });
    canvas.add(boundary);
    canvas.renderAll();
    return () => {
      canvas.dispose();
      fabricCanvas.current = null;
    };
  }, []);

  const addText = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const text = new IText(textValue.trim() || "YOUR TEXT", {
      left: 150, top: 135, originX: "center", originY: "center",
      fontFamily: "Arial", fontSize: 24, fontWeight: "bold",
      fill: "#24221f", textAlign: "center",
      cornerColor: "#a66c4b", borderColor: "#a66c4b",
      transparentCorners: false
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setStatus("Text added. Select it to edit or resize.");
  };

  const uploadArtwork = (file?: File) => {
    const canvas = fabricCanvas.current;
    if (!canvas || !file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setStatus("Please use a PNG, JPG or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setStatus("Please choose an image smaller than 8 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result !== "string") return;
      try {
        const image = await FabricImage.fromURL(reader.result);
        const max = 115;
        const scale = Math.min(max / (image.width || max), max / (image.height || max), 1);
        image.set({
          left: 150, top: 150, originX: "center", originY: "center",
          scaleX: scale, scaleY: scale,
          cornerColor: "#a66c4b", borderColor: "#a66c4b",
          transparentCorners: false
        });
        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.renderAll();
        setStatus("Artwork added. Move and resize it within the guide.");
      } catch {
        setStatus("That image could not be opened. Try another file.");
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteSelected = () => {
    const canvas = fabricCanvas.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active) return;
    canvas.remove(active);
    canvas.discardActiveObject();
    canvas.renderAll();
    setStatus("Selected object removed.");
  };

  const exportPreview = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const data = canvas.toDataURL({ format: "png", multiplier: 2 });
    const link = document.createElement("a");
    link.href = data;
    link.download = `${designName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "design"}-${side}-preview.png`;
    link.click();
    setStatus("Preview PNG exported. This is not a production-ready print file.");
  };

  const clearDesign = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const guide = canvas.getObjects().find((object) => object.get("name") === "print-area-guide");
    canvas.clear();
    if (guide) canvas.add(guide);
    canvas.renderAll();
    setStatus("Design canvas cleared.");
  };

  return <div className="studio-card">
    <div className="studio-toolbar">
      <div className="studio-title"><span className="live-indicator" /> DESIGN STUDIO <small>PROTOTYPE</small></div>
      <div className="studio-save-state">{status}</div>
    </div>
    <div className="studio-body">
      <aside className="studio-controls">
        <label className="control-label" htmlFor="design-name">DESIGN NAME</label>
        <input id="design-name" className="text-input" value={designName} onChange={(e) => setDesignName(e.target.value)} maxLength={60}/>
        <div className="control-group">
          <span className="control-label">PRODUCT</span>
          <div className="segmented">
            <button className={product === "tshirt" ? "active" : ""} onClick={() => setProduct("tshirt")}>T-shirt</button>
            <button className={product === "hoodie" ? "active" : ""} onClick={() => setProduct("hoodie")}>Hoodie</button>
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">GARMENT COLOUR</span>
          <div className="colour-options">
            {colours.map((item) => <button key={item.name} title={item.name} aria-label={item.name} className={`colour-swatch ${colour === item.value ? "selected" : ""}`} style={{ background: item.value }} onClick={() => setColour(item.value)}/>)}
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">VIEW</span>
          <div className="segmented">
            <button className={side === "front" ? "active" : ""} onClick={() => setSide("front")}>Front</button>
            <button className={side === "back" ? "active" : ""} onClick={() => setSide("back")}>Back</button>
          </div>
        </div>
        <div className="control-group">
          <label className="control-label" htmlFor="text-content">ADD TEXT</label>
          <input id="text-content" className="text-input" value={textValue} onChange={(e) => setTextValue(e.target.value)} maxLength={50}/>
          <button className="tool-button" onClick={addText}><Type size={16}/> Add text to design</button>
        </div>
        <div className="control-group">
          <span className="control-label">ADD ARTWORK</span>
          <label className="upload-button"><ImagePlus size={17}/> Upload image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => uploadArtwork(e.target.files?.[0])}/></label>
          <small className="helper-text">PNG, JPG or WebP · up to 8 MB</small>
        </div>
        <div className="control-group">
          <span className="control-label">EDIT SELECTION</span>
          <button className="tool-button" onClick={() => { const c = fabricCanvas.current; const a = c?.getActiveObject(); if (c && a) { a.rotate((a.angle || 0) + 15); c.renderAll(); } }}><RotateCw size={16}/> Rotate 15°</button>
          <button className="tool-button danger-tool" onClick={deleteSelected}><Trash2 size={16}/> Delete selected</button>
        </div>
        <button className="export-button" onClick={exportPreview}><ArrowDownToLine size={17}/> Export preview</button>
        <button className="clear-button" onClick={clearDesign}><RotateCcw size={15}/> Clear design</button>
      </aside>

      <div className="design-stage">
        <div className="stage-topline"><span>{product === "tshirt" ? "CLASSIC T-SHIRT" : "PULLOVER HOODIE"}</span><span>{side.toUpperCase()} VIEW</span></div>
        <div className="garment-preview">
          <GarmentShape product={product} colour={colour}/>
          <div className="canvas-wrap"><canvas ref={canvasElement}/></div>
          {side === "back" && <div className="back-label">BACK VIEW · PLACEHOLDER MOCKUP</div>}
        </div>
        <div className="stage-hint"><ArrowLeftRight size={14}/> Select an element to move, resize or rotate it. Dashed box indicates the illustrative print area.</div>
      </div>
    </div>
    <div className="studio-bottom"><span><Bold size={14}/> Design elements remain editable in this session.</span><span>Prototype only · Not yet saved to an account</span></div>
  </div>;
}
