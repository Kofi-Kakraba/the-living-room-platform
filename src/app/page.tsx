import { ArrowRight, Check, Shirt, Sparkles, Truck } from "lucide-react";
import DesignStudio from "@/components/design-studio";

const highlights = [
  { icon: Shirt, title: "Choose your product", text: "Start with a T-shirt or hoodie and select a colour." },
  { icon: Sparkles, title: "Make it yours", text: "Add text and artwork, then position your design." },
  { icon: Check, title: "Review your design", text: "Preview the layout before requesting a quotation." },
  { icon: Truck, title: "We take it from there", text: "Our team reviews the artwork and confirms production details." }
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#" aria-label="The Living Room home">
          <span className="brand-mark">TLR</span>
          <span><strong>THE LIVING ROOM</strong><small>APPAREL · PRINT · BRANDING</small></span>
        </a>
        <nav className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#studio">Design studio</a>
          <a className="nav-cta" href="#studio">Create a design <ArrowRight size={15} /></a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> YOUR IDEA. YOUR STYLE. YOUR APPAREL.</div>
          <h1>Wear your idea.<br /><em>Make it yours.</em></h1>
          <p>Custom apparel for teams, businesses, churches, schools, events and everything worth bringing together.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#studio">Start designing <ArrowRight size={17} /></a>
            <a className="text-link" href="#how-it-works">See how it works</a>
          </div>
          <div className="hero-note"><span className="note-dot" /> Made for your moment, printed with care.</div>
        </div>
        <div className="hero-art" aria-label="Illustration of custom apparel">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="floating-tag tag-top">MADE TO BE YOURS</div>
          <div className="hero-shirt">
            <svg viewBox="0 0 420 430" role="img" aria-label="Illustrated cream T-shirt">
              <path d="M133 55 177 35Q210 72 243 35L287 55 382 116 337 190 293 164 303 390 117 390 127 164 83 190 38 116Z" fill="#e9dfce" stroke="#d0c2ae" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M177 35Q210 107 243 35" fill="none" stroke="#c9baa4" strokeWidth="7"/>
              <path d="M127 164 83 190M293 164 337 190" stroke="#d0c2ae" strokeWidth="3"/>
              <rect x="155" y="170" width="110" height="112" rx="3" fill="none" stroke="#a56d4b" strokeDasharray="6 6" strokeWidth="2"/>
              <text x="210" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="#794c36" letterSpacing="2">YOUR</text>
              <text x="210" y="238" textAnchor="middle" fontSize="23" fontWeight="800" fill="#794c36">DESIGN</text>
              <path d="M179 252h62" stroke="#b7805d" strokeWidth="2"/>
            </svg>
          </div>
          <div className="floating-tag tag-bottom">DESIGNED BY YOU <span>✳</span></div>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span className="eyebrow">SIMPLE FROM START TO FINISH</span>
          <h2>From blank to <em>branded.</em></h2>
        </div>
        <div className="steps-grid">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return <article className="step-card" key={item.title}>
              <div className="step-top"><span>0{index + 1}</span><Icon size={21} strokeWidth={1.7} /></div>
              <h3>{item.title}</h3><p>{item.text}</p>
            </article>;
          })}
        </div>
      </section>

      <section className="studio-section" id="studio">
        <div className="studio-intro">
          <span className="eyebrow">THE CREATIVE SPACE</span>
          <h2>Your design.<br /><em>Your direction.</em></h2>
          <p>Try our first design-studio prototype. Add a message, upload artwork and explore how your apparel could look.</p>
          <div className="prototype-note"><Sparkles size={17} /> Prototype preview. Final garment templates and print dimensions will be calibrated using The Living Room's production assets.</div>
        </div>
        <DesignStudio />
      </section>

      <footer className="footer">
        <a className="brand brand-footer" href="#"><span className="brand-mark">TLR</span><span><strong>THE LIVING ROOM</strong><small>APPAREL · PRINT · BRANDING</small></span></a>
        <span>Custom apparel, made meaningful.</span>
      </footer>
    </main>
  );
}
