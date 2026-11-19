"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, FabricImage, IText, Rect } from "fabric";
import { ArrowDownToLine, ImagePlus, RotateCcw, RotateCw, Trash2, Type, Layers3, Shirt, Layout, Sparkles, SlidersHorizontal } from "lucide-react";
import GarmentMasterPreview from "./garment-master-preview";

type Garment = "crewneck" | "ladies" | "polo" | "long-sleeve" | "hoodie" | "sweatshirt" | "vneck" | "tank";
type Side = "front" | "back";
type Tab = "design" | "garment" | "canvas" | "props";
type Ratio = "1:1" | "4:3" | "4:5" | "9:16";
type CanvasRecord = { front: Canvas | null; back: Canvas | null };
const garments: { id: Garment; label: string }[] = [
  { id: "crewneck", label: "Crewneck tee" }, { id: "ladies", label: "Ladies tee" },
  { id: "polo", label: "Polo collar" }, { id: "long-sleeve", label: "Long sleeve" },
  { id: "hoodie", label: "Hoodie" }, { id: "sweatshirt", label: "Sweatshirt" },
  { id: "vneck", label: "V-neck" }, { id: "tank", label: "Tank top" }
];
const palette = [
  { name: "White", hex: "#f5f3ed" }, { name: "Natural", hex: "#e8ddc9" },
  { name: "Black", hex: "#292929" }, { name: "Heather grey", hex: "#aaa9a5" },
  { name: "Red", hex: "#c83d3d" }, { name: "Orange", hex: "#ed693d" },
  { name: "Forest", hex: "#365747" }, { name: "Navy", hex: "#263b58" }
];
const ratios: Record<Ratio, [number, number]> = { "1:1": [300,300], "4:3": [300,225], "4:5": [240,300], "9:16": [169,300] };

function GarmentShape({ garment, colour, side }: { garment: Garment; colour: string; side: Side }) {
  const isHood = garment === "hoodie";
  const isTank = garment === "tank";
  const isLong = garment === "long-sleeve";
  const isPolo = garment === "polo";
  const shoulder = isTank ? "M165 82 L195 82 Q220 112 245 82 L275 82" : "M145 75 L185 48 Q220 86 255 48 L295 75";
  const outline = isHood ? "M150 92 L181 65 Q220 105 259 65 L290 92 L385 155 L348 225 L302 195 L315 430 L125 430 L138 195 L92 225 L55 155 Z"
    : isTank ? "M165 82 L195 82 Q220 112 245 82 L275 82 L340 150 L300 195 L285 170 L300 430 L140 430 L155 170 L140 195 L100 150 Z"
    : isLong ? "M145 75 L185 48 Q220 86 255 48 L295 75 L410 150 L365 230 L305 195 L315 430 L125 430 L135 195 L75 230 L30 150 Z"
    : "M145 75 L185 48 Q220 86 255 48 L295 75 L390 145 L350 220 L302 190 L315 430 L125 430 L138 190 L90 220 L50 145 Z";
  return <svg className="garment-svg" viewBox="0 0 440 470" aria-hidden="true">
    <defs><linearGradient id="fabricLight" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".26"/><stop offset=".48" stopColor="#ffffff" stopOpacity="0"/><stop offset="1" stopColor="#000000" stopOpacity=".13"/></linearGradient></defs>
    <path d={outline} fill={colour} stroke="rgba(35,31,27,.25)" strokeWidth="3" strokeLinejoin="round"/>
    <path d={outline} fill="url(#fabricLight)"/>
    <path d={shoulder} fill="none" stroke="rgba(40,35,30,.23)" strokeWidth="4"/>
    {isHood && <><path d={side === "back" ? "M181 65 Q220 15 259 65 L250 137 Q220 164 190 137 Z" : "M181 65 Q220 115 259 65 L250 132 Q220 151 190 132 Z"} fill={colour} stroke="rgba(40,35,30,.3)" strokeWidth="3"/>{side === "front" && <path d="M195 132 L185 218 M245 132 L255 218" stroke="rgba(40,35,30,.3)" strokeWidth="3"/>}</>}
    {isPolo && <><path d="M185 49 L220 105 L255 49 L244 120 L220 137 L196 120 Z" fill={colour} stroke="rgba(40,35,30,.3)" strokeWidth="2"/>{side === "front" && <path d="M220 105 L220 174" stroke="rgba(40,35,30,.4)" strokeWidth="3"/>}</>}
    {garment === "vneck" && <path d="M185 49 L220 110 L255 49" fill="none" stroke="rgba(40,35,30,.35)" strokeWidth="5"/>}
    {side === "back" && <path d="M185 49 Q220 82 255 49" fill="none" stroke="rgba(40,35,30,.28)" strokeWidth="5"/>}
    {side === "front" && !isHood && !isPolo && garment !== "vneck" && <path d="M185 49 Q220 82 255 49" fill="none" stroke="rgba(40,35,30,.28)" strokeWidth="5"/>}
    <path d="M125 385 Q220 405 315 385" fill="none" stroke="rgba(40,35,30,.16)" strokeWidth="2"/>
    {isTank && <path d="M165 82 L150 145 M275 82 L290 145" stroke="rgba(40,35,30,.25)" strokeWidth="7"/>}
  </svg>;
}

export default function DesignStudio() {
  const frontElement = useRef<HTMLCanvasElement>(null);
  const backElement = useRef<HTMLCanvasElement>(null);
  const canvases = useRef<CanvasRecord>({ front: null, back: null });
  const [tab, setTab] = useState<Tab>("design");
  const [garment, setGarment] = useState<Garment>("crewneck");
  const [side, setSide] = useState<Side>("front");
  const [colour, setColour] = useState("#f5f3ed");
  const [customHex, setCustomHex] = useState("#f5f3ed");
  const [designName, setDesignName] = useState("My first design");
  const [textValue, setTextValue] = useState("YOUR DESIGN");
  const [status, setStatus] = useState("Ready to create");
  const [ratio, setRatio] = useState<Ratio>("1:1");
  const [backgroundMode, setBackgroundMode] = useState<"solid" | "transparent" | "wood">("solid");
  const [backgroundColour, setBackgroundColour] = useState("#f0eee9");
  const [quality, setQuality] = useState<"1x" | "2x">("2x");
  const [foldShadows, setFoldShadows] = useState(65);
  const [fabricShine, setFabricShine] = useState(35);
  const [opacity, setOpacity] = useState(100);
  const [props, setProps] = useState<string[]>([]);
  const [activeScale, setActiveScale] = useState(100);
  const [activeRotation, setActiveRotation] = useState(0);
  const sideRef = useRef<Side>("front");
  sideRef.current = side;

  useEffect(() => {
    const [w,h] = ratios[ratio];
    const syncSelection = () => {
      const active = canvases.current[sideRef.current]?.getActiveObject();
      if (active) {
        setOpacity(Math.round((active.opacity ?? 1)*100));
         setActiveScale(Math.round(((active as any).__designScalePercent ?? 100)));
        setActiveRotation(Math.round(active.angle ?? 0));
      } else {
        setOpacity(100); setActiveScale(100); setActiveRotation(0);
      }
    };
    const setup = (element: HTMLCanvasElement | null, view: Side) => {
      if (!element) return;
      const canvas = new Canvas(element, { width:w, height:h, backgroundColor:"rgba(255,255,255,0)", preserveObjectStacking:true, selection:true, skipTargetFind:false, defaultCursor:"default", hoverCursor:"move", moveCursor:"grabbing" });
      const guide = new Rect({ left:w*.24, top:h*.2, width:w*.52, height:h*.58, fill:"rgba(255,255,255,0.01)", stroke:"#a66c4b", strokeDashArray:[5,5], strokeWidth:1.3, selectable:false, evented:false, visible:false, name:"print-area-guide" });
      canvas.add(guide);
      canvas.on("selection:created", syncSelection);
      canvas.on("selection:updated", syncSelection);
      canvas.on("object:modified", syncSelection);
      canvases.current[view] = canvas;
    };
    setup(frontElement.current,"front");
    setup(backElement.current,"back");
    return () => { canvases.current.front?.dispose(); canvases.current.back?.dispose(); canvases.current={front:null,back:null}; };
  // Canvas ratio is intentionally applied when the editor is initialized.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const [w,h] = ratios[ratio];
    ([canvases.current.front, canvases.current.back]).forEach((canvas) => {
      if (!canvas) return;
      canvas.setDimensions({ width:w, height:h });
      const guide = canvas.getObjects().find(object => object.get("name") === "print-area-guide");
      if (guide) guide.set({ left:w*.24, top:h*.2, width:w*.52, height:h*.58 });
      canvas.renderAll();
    });
  }, [ratio]);

  useEffect(() => {
    const active = canvases.current[side]?.getActiveObject();
    if (active) {
      setOpacity(Math.round((active.opacity ?? 1)*100));
      setActiveScale(Math.round((active.scaleX ?? 1)*100));
      setActiveRotation(Math.round(active.angle ?? 0));
    } else {
      setOpacity(100); setActiveScale(100); setActiveRotation(0);
    }
  }, [side]);

  const currentCanvas = () => canvases.current[side];
  const addText = () => {
    const canvas=currentCanvas(); if(!canvas) return;
    const [w,h]=ratios[ratio];
    const object=new IText(textValue.trim() || "YOUR TEXT",{left:w/2,top:h*.44,originX:"center",originY:"center",fontFamily:"Arial",fontSize:24,fontWeight:"bold",fill:"#24221f",textAlign:"center",cornerColor:"#a66c4b",borderColor:"#a66c4b",transparentCorners:false});
    (object as any).__baseScaleX=1; (object as any).__baseScaleY=1; (object as any).__designScalePercent=100;
    canvas.add(object); canvas.setActiveObject(object); canvas.renderAll(); setStatus("Text added. Drag, resize or rotate it on the canvas.");
  };
  const uploadArtwork = (file?: File) => {
    const canvas=currentCanvas(); if(!canvas || !file) return;
    if(!["image/png","image/jpeg","image/webp"].includes(file.type)){setStatus("Please use a PNG, JPG or WebP image.");return;}
    if(file.size>8*1024*1024){setStatus("Please choose an image smaller than 8 MB.");return;}
    const reader=new FileReader();
    reader.onload=async()=>{if(typeof reader.result!=="string")return;try{
      const image=await FabricImage.fromURL(reader.result); const max=Math.min(130,ratios[ratio][0]*.44);
      const scale=Math.min(max/(image.width||max),max/(image.height||max),1);
      image.set({left:ratios[ratio][0]/2,top:ratios[ratio][1]*.44,originX:"center",originY:"center",scaleX:scale,scaleY:scale,cornerColor:"#a66c4b",borderColor:"#a66c4b",transparentCorners:false});
      (image as any).__baseScaleX=scale; (image as any).__baseScaleY=scale; (image as any).__designScalePercent=100;
      canvas.add(image);canvas.setActiveObject(image);canvas.renderAll();setStatus("Artwork uploaded. Position it inside the print guide.");
    }catch{setStatus("That image could not be opened. Try another file.");}};
    reader.readAsDataURL(file);
  };
  const removeSelected=()=>{const c=currentCanvas(),a=c?.getActiveObject();if(!c||!a)return;c.remove(a);c.discardActiveObject();c.renderAll();setStatus("Selected element removed.");};
  const updateSelected=(key:"opacity"|"scale"|"angle",value:number)=>{
    const c=currentCanvas(),a=c?.getActiveObject();if(!c||!a)return;
    if(key==="opacity")a.set("opacity",value/100);
    if(key==="scale"){const baseX=(a as any).__baseScaleX ?? a.scaleX ?? 1;const baseY=(a as any).__baseScaleY ?? a.scaleY ?? 1;(a as any).__designScalePercent=value;a.set({scaleX:baseX*value/100,scaleY:baseY*value/100});}
    if(key==="angle")a.rotate(value);
    c.renderAll();
  };
  const exportPreview=()=>{
    const c=currentCanvas();if(!c)return;
    const targetLongEdge=quality==="2x"?2000:1000;
    const multiplier=targetLongEdge/Math.max(c.getWidth(),c.getHeight());
    const guide=c.getObjects().find(object=>object.get("name")==="print-area-guide");
    if(guide) guide.set("visible",false);
    c.renderAll();
    const dataUrl=c.toDataURL({format:"png",multiplier});
    if(guide) guide.set("visible",true);
    c.renderAll();
    const link=document.createElement("a");
    link.href=dataUrl;
    link.download=(designName.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"tlr-design")+"-"+side+"-artwork-"+targetLongEdge+"px.png";
    link.click();
    setStatus("Transparent artwork PNG exported. This is artwork only, not a garment mockup or print-ready production file.");
  };
  const clearDesign=()=>{const c=currentCanvas();if(!c)return;const guide=c.getObjects().find(o=>o.get("name")==="print-area-guide");c.clear();if(guide)c.add(guide);c.renderAll();setStatus("Current side cleared.");};
  const chooseColour=(hex:string)=>{setColour(hex);setCustomHex(hex);};
  const tabItems: {id:Tab;label:string;icon:typeof Layers3}[]=[{id:"design",label:"Design",icon:Layers3},{id:"garment",label:"Garment",icon:Shirt},{id:"canvas",label:"Canvas",icon:Layout},{id:"props",label:"Props",icon:Sparkles}];
  const ratioStyle={aspectRatio:ratio.replace(":"," / ")};
  return <div className="studio-card studio-v2">
    <div className="studio-toolbar"><div className="studio-title"><span className="live-indicator"/> THE LIVING ROOM STUDIO <small>PREVIEW</small></div><div className="studio-save-state">{status}</div></div>
    <div className="editor-tabs">{tabItems.map(item=><button key={item.id} className={tab===item.id?"active":""} onClick={()=>setTab(item.id)}><item.icon size={15}/>{item.label}</button>)}</div>
    <div className="studio-v2-body">
      <aside className="studio-v2-controls">
        {tab==="design" && <>
          <label className="control-label" htmlFor="design-name">DESIGN NAME</label><input id="design-name" className="text-input" value={designName} onChange={e=>setDesignName(e.target.value)} maxLength={60}/>
          <div className="control-group"><span className="control-label">PRINT SIDE</span><div className="segmented"><button className={side==="front"?"active":""} onClick={()=>setSide("front")}>Front</button><button className={side==="back"?"active":""} onClick={()=>setSide("back")}>Back</button></div></div>
          <div className="control-group"><label className="control-label" htmlFor="text-content">ADD TEXT</label><input id="text-content" className="text-input" value={textValue} onChange={e=>setTextValue(e.target.value)} maxLength={50}/><button className="tool-button" onClick={addText}><Type size={16}/> Add text</button></div>
          <div className="control-group"><span className="control-label">DESIGN GRAPHIC</span><label className="upload-button"><ImagePlus size={17}/> Upload PNG / JPG<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>uploadArtwork(e.target.files?.[0])}/></label><small className="helper-text">Transparent PNG recommended · up to 8 MB</small></div>
          <div className="control-group"><span className="control-label">ADJUST SELECTED DESIGN</span><label className="slider-label">Size <b>{activeScale}%</b></label><input type="range" min="25" max="250" value={activeScale} onChange={e=>{setActiveScale(+e.target.value);updateSelected("scale",+e.target.value);}}/><label className="slider-label">Rotation <b>{activeRotation}°</b></label><input type="range" min="-180" max="180" value={activeRotation} onChange={e=>{setActiveRotation(+e.target.value);updateSelected("angle",+e.target.value);}}/><label className="slider-label">Opacity <b>{opacity}%</b></label><input type="range" min="10" max="100" value={opacity} onChange={e=>{setOpacity(+e.target.value);updateSelected("opacity",+e.target.value);}}/></div>
          <div className="control-group"><button className="tool-button" onClick={()=>{const c=currentCanvas(),a=c?.getActiveObject();if(c&&a){a.rotate((a.angle||0)+15);c.renderAll();setActiveRotation(Math.round(a.angle||0));}}}><RotateCw size={15}/> Rotate +15°</button><button className="tool-button danger-tool" onClick={removeSelected}><Trash2 size={15}/> Delete selected</button></div>
        </>}
        {tab==="garment" && <>
          <span className="control-label">CHOOSE GARMENT</span><div className="garment-choice-grid">{garments.map(g=><button key={g.id} className={garment===g.id?"selected":""} onClick={()=>setGarment(g.id)}>{g.label}</button>)}</div>
          <div className="control-group"><span className="control-label">FABRIC COLOUR</span><div className="colour-grid">{palette.map(c=><button key={c.hex} className={colour===c.hex?"selected":""} onClick={()=>chooseColour(c.hex)}><i style={{background:c.hex}}/><span>{c.name}</span></button>)}</div></div>
          <div className="control-group"><label className="control-label" htmlFor="custom-colour">CUSTOM COLOUR · HEX</label><div className="hex-input-row"><input type="color" value={/^#[0-9a-fA-F]{6}$/.test(customHex)?customHex:"#ffffff"} onChange={e=>chooseColour(e.target.value)}/><input id="custom-colour" className="text-input" value={customHex} onChange={e=>{setCustomHex(e.target.value);if(/^#[0-9a-fA-F]{6}$/.test(e.target.value))setColour(e.target.value);}} onBlur={()=>{if(!/^#[0-9a-fA-F]{6}$/.test(customHex)){setCustomHex(colour);setStatus("Enter a valid six-digit HEX colour.");}}}/></div></div>
          <p className="editor-note">Colour controls are illustrative until approved garment master images and colour masks are connected. Screen colour is not a guarantee of fabric colour.</p>
        </>}
        {tab==="canvas" && <>
          <span className="control-label">MOCKUP BACKGROUND</span><div className="segmented vertical-segmented"><button className={backgroundMode==="solid"?"active":""} onClick={()=>setBackgroundMode("solid")}>Solid colour</button><button className={backgroundMode==="transparent"?"active":""} onClick={()=>setBackgroundMode("transparent")}>Transparent</button><button className={backgroundMode==="wood"?"active":""} onClick={()=>setBackgroundMode("wood")}>Warm wood tone</button></div>
          <div className="control-group"><label className="control-label" htmlFor="background-colour">BACKGROUND COLOUR</label><div className="hex-input-row"><input type="color" value={backgroundColour} onChange={e=>setBackgroundColour(e.target.value)}/><input id="background-colour" className="text-input" value={backgroundColour} onChange={e=>setBackgroundColour(e.target.value)}/></div></div>
          <div className="control-group"><span className="control-label">CANVAS SIZE</span><div className="garment-choice-grid ratio-grid">{(Object.keys(ratios) as Ratio[]).map(r=><button className={ratio===r?"selected":""} key={r} onClick={()=>setRatio(r)}>{r}</button>)}</div></div>
          <div className="control-group"><span className="control-label">EXPORT QUALITY</span><div className="segmented"><button className={quality==="1x"?"active":""} onClick={()=>setQuality("1x")}>1000 px</button><button className={quality==="2x"?"active":""} onClick={()=>setQuality("2x")}>2000 px</button></div></div>
        </>}
        {tab==="props" && <>
          <span className="control-label">STYLE YOUR SCENE</span><p className="editor-note">Decorative props are a planned part of the editor. These controls are a preview of the scene options and do not yet place photorealistic objects.</p>
          <div className="props-grid">{["Plant","Straw hat","Sneakers","Sunglasses","Jeans","Tote bag","Palm leaf","Denim shorts"].map(p=><button className={props.includes(p)?"selected":""} key={p} onClick={()=>setProps(old=>old.includes(p)?old.filter(x=>x!==p):[...old,p])}>{p}</button>)}</div>
          <div className="control-group"><span className="control-label">FABRIC EFFECTS · PREVIEW CONTROLS</span><label className="slider-label">Fold shadows <b>{foldShadows}%</b></label><input type="range" min="0" max="100" value={foldShadows} onChange={e=>setFoldShadows(+e.target.value)}/><label className="slider-label">Fabric shine <b>{fabricShine}%</b></label><input type="range" min="0" max="100" value={fabricShine} onChange={e=>setFabricShine(+e.target.value)}/></div>
        </>}
        <button className="export-button" onClick={exportPreview}><ArrowDownToLine size={16}/> Export {quality==="2x"?"2000":"1000"} px PNG</button><button className="clear-button" onClick={clearDesign}><RotateCcw size={14}/> Clear {side} design</button>
      </aside>
      <main className="design-stage design-stage-v2">
        <div className="stage-topline"><span>{garments.find(g=>g.id===garment)?.label.toUpperCase()}</span><span>{side.toUpperCase()} · {colour.toUpperCase()}</span></div>
        <div className={"garment-preview "+(backgroundMode==="transparent"?"transparent-stage":backgroundMode==="wood"?"wood-stage":"")} style={{background:backgroundMode==="solid"?backgroundColour:undefined}} onPointerDown={(event)=>{if(!(event.target as HTMLElement).closest(".canvas-container")){const active=currentCanvas();active?.discardActiveObject();const guide=active?.getObjects().find(object=>object.get("name")==="print-area-guide");guide?.set("visible",false);active?.requestRenderAll();setOpacity(100);setActiveScale(100);setActiveRotation(0);}}}>
          {(garment === "hoodie" || garment === "crewneck") ? <GarmentMasterPreview colour={colour} garment={garment} side={side} fallback={<GarmentShape garment={garment} colour={colour} side={side}/>} /> : <GarmentShape garment={garment} colour={colour} side={side}/>}
          <div className="garment-artwork-overlay">
            <div className="canvas-wrap" style={{...ratioStyle,width:ratios[ratio][0],height:ratios[ratio][1]}}>
              <canvas ref={frontElement} style={{display:side==="front"?"block":"none"}}/>
              <canvas ref={backElement} style={{display:side==="back"?"block":"none"}}/>
            </div>
          </div>
          <div className="mockup-placeholder-tag">{(garment === "hoodie" || garment === "crewneck") ? `PHOTOGRAPHIC GARMENT MASTER · ${side.toUpperCase()}` : "ILLUSTRATIVE GARMENT TEMPLATE"}</div>
        </div>
        <div className="stage-hint"><SlidersHorizontal size={14}/> Drag artwork to position · corner handles to resize · rotate with the top control</div>
      </main>
    </div>
    <div className="studio-bottom"><span><Layers3 size={14}/> Front and back artwork have separate editable canvases.</span><span>Preview prototype · designs are not saved to an account yet</span></div>
  </div>;
}
