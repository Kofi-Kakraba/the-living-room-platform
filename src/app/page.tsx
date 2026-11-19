import {
  ArrowRight, ArrowUpRight, CheckCircle2, Palette, Printer,
  ShoppingBag, Sparkles, Users
} from "lucide-react";
import DesignStudio from "@/components/design-studio";

const categories = [
  { name: "T-shirts", detail: "Everyday essentials", tone: "sand", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85" },
  { name: "Hoodies", detail: "Made to stand out", tone: "blue", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85" },
  { name: "Caps", detail: "Top off your look", tone: "orange", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=85" },
  { name: "Polos", detail: "Smart team style", tone: "pink", image: "https://images.unsplash.com/photo-1625910513413-5fc9f2d7e3e7?auto=format&fit=crop&w=900&q=85" },
];

const reasons = [
  { icon: Palette, title: "Make it yours", text: "Create a design with your words, artwork and ideas." },
  { icon: Printer, title: "Made with care", text: "We bring your approved design to life with quality printing." },
  { icon: Users, title: "For every kind of team", text: "From businesses and schools to churches, events and crews." },
];

export default function Home() {
  return (
    <main className="tlr-site">
      <div className="announcement-bar">YOUR IDEAS LOOK GOOD ON YOU <span>•</span> CUSTOM APPAREL, PRINT & BRANDING</div>
      <header className="site-header">
        <a className="brand" href="#" aria-label="The Living Room home">
          <span className="brand-mark">TLR</span>
          <span className="brand-wording"><strong>THE LIVING ROOM</strong><small>APPAREL · PRINT · BRANDING</small></span>
        </a>
        <nav className="nav-links">
          <a href="#shop">Shop</a>
          <a href="#how-it-works">How it works</a>
          <a href="#studio">Design studio</a>
          <a className="nav-cta" href="#studio">Start creating <ArrowUpRight size={16}/></a>
        </nav>
        <a className="mobile-create" href="#studio"><ShoppingBag size={19}/></a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="kicker-line"/> CUSTOM MADE. ALL YOU.</div>
          <h1>Don't just wear it.<br/><em>Make a statement.</em></h1>
          <p>Custom apparel for your people, your business and every moment worth showing up for.</p>
          <div className="hero-actions">
            <a className="button button-coral" href="#studio">Design your own <ArrowRight size={18}/></a>
            <a className="button button-outline" href="#shop">Explore the shop</a>
          </div>
          <div className="hero-proof"><span><CheckCircle2 size={16}/> Made for your crew</span><span><CheckCircle2 size={16}/> Designed by you</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-main">
            <img src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=90" alt="Friends wearing casual streetwear" />
          </div>
          <div className="hero-sticker"><span>YOUR</span><strong>STYLE.</strong><span>YOUR RULES.</span></div>
          <div className="hero-caption"><Sparkles size={15}/> MADE TO BE YOURS</div>
          <div className="hero-index">01 / 04</div>
        </div>
        <div className="hero-bottomline"><span>THE LIVING ROOM</span><span>CREATE SOMETHING THAT BRINGS YOU TOGETHER <ArrowRight size={14}/></span></div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-topline"><span>THE COLLECTION</span><span>01 — FIND YOUR FIT</span></div>
        <div className="section-heading-row">
          <div><p className="eyebrow">SHOP THE LOOK</p><h2>Good things<br/><em>start with a blank.</em></h2></div>
          <p className="section-description">Pick a product, make it yours, or choose a ready-made look. Your next favorite piece starts here.</p>
        </div>
        <div className="category-grid">
          {categories.map((item, index) => (
            <a className={`category-card category-${item.tone}`} href="#studio" key={item.name}>
              <div className="category-image"><img src={item.image} alt={item.name}/><span className="category-number">0{index + 1}</span><span className="category-arrow"><ArrowUpRight size={19}/></span></div>
              <div className="category-meta"><div><h3>{item.name}</h3><p>{item.detail}</p></div><span className="category-link">CUSTOMIZE <ArrowRight size={13}/></span></div>
            </a>
          ))}
        </div>
        <div className="shop-cta"><span>Have an idea in mind?</span><a href="#studio">Bring it to life <ArrowRight size={16}/></a></div>
      </section>

      <section className="custom-banner">
        <div className="banner-copy"><p className="eyebrow">NOT JUST ANOTHER T-SHIRT</p><h2>Your team.<br/><em>Your identity.</em></h2><p>Make your next event, brand, school or crew impossible to miss.</p><a className="button button-dark" href="#studio">Start a custom order <ArrowRight size={17}/></a></div>
        <div className="banner-image"><img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85" alt="Apparel styling and fashion details"/><span className="banner-stamp">BUILT<br/>AROUND<br/>YOU</span></div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-topline"><span>THE PROCESS</span><span>02 — EASY DOES IT</span></div>
        <div className="section-heading-row"><div><p className="eyebrow">FROM IDEA TO OUTFIT</p><h2>Three steps.<br/><em>One great look.</em></h2></div><p className="section-description">No design degree needed. Just bring the idea. We’ll help you take it from screen to real life.</p></div>
        <div className="reason-grid">
          {reasons.map((item, i) => { const Icon = item.icon; return <article className="reason-card" key={item.title}><div className="reason-icon"><Icon size={22}/></div><span>0{i+1}</span><h3>{item.title}</h3><p>{item.text}</p></article>; })}
        </div>
      </section>

      <section className="studio-section" id="studio">
        <div className="studio-heading">
          <div><p className="eyebrow">THE CREATIVE SPACE</p><h2>Dream it.<br/><em>Design it.</em></h2></div>
          <p>Step into the studio. Choose your garment, add your artwork and play around until it feels like you.</p>
        </div>
        <DesignStudio />
      </section>

      <section className="closing-cta"><div><p className="eyebrow">READY WHEN YOU ARE</p><h2>Let's make<br/><em>something good.</em></h2></div><a className="button button-coral" href="#studio">Create your design <ArrowRight size={18}/></a><span className="closing-spark">✳</span></section>
      <footer className="footer">
        <a className="brand brand-footer" href="#"><span className="brand-mark">TLR</span><span className="brand-wording"><strong>THE LIVING ROOM</strong><small>APPAREL · PRINT · BRANDING</small></span></a>
        <span>Custom apparel, made meaningful.</span><span className="footer-top"><a href="#">BACK TO TOP ↑</a></span>
      </footer>
    </main>
  );
}
