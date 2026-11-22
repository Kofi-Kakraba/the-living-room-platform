import DesignStudio from "@/components/design-studio";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="tlr-editor-page">
      <header className="editor-sitebar">
        <a className="editor-brand" href="/" aria-label="The Living Room home"><span className="editor-brand-mark">TLR</span><span><strong>THE LIVING ROOM</strong><small>WEAR YOUR IDEA</small></span></a>
        <div className="editor-sitebar-note"><span className="editor-live-dot"/> DESIGN STUDIO <span className="editor-sitebar-separator">/</span> CREATE YOUR MOCKUP</div>
        <a className="editor-help-link" href="#studio-help">Need help? <ArrowUpRight size={14}/></a>
      </header>
      <section className="editor-workspace" id="studio">
        <div className="editor-workspace-heading"><div><span>YOUR CREATIVE SPACE</span><h1>Make it <em>yours.</em></h1></div><p>Choose a garment, add your artwork and create a mockup worth sharing.</p></div>
        <DesignStudio />
        <p className="editor-workspace-footnote" id="studio-help">Your design stays in this session until you download it. Mockup previews are for visualisation; final print colours may vary.</p>
      </section>
    </main>
  );
}
