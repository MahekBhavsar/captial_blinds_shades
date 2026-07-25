"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { collections } from "@/lib/firebase";
import { getDocs, query, orderBy } from "firebase/firestore";
import type { ServiceDocument } from "@/lib/schema";
import {
  CarFront, Store, Printer, ImageIcon, Tag, Palette,
  LayoutPanelLeft, Square, Lightbulb, ShieldAlert,
  HardHat, Brush, Wrench, Signpost, Frame, PanelTop, FileImage,
  X, Car, Flag, PictureInPicture, Sticker,
  AppWindow, PaintRoller, Contact, FileText, Image as LucideImage,
  Navigation, PenTool, ArrowRight, Ruler, CheckCircle2,
  Sun, Moon, Wind, Zap, Shield, Eye, Home, Star, Settings, Clock, Leaf,
  ThumbsUp, Layers, Maximize2, Volume2, VolumeX, Wifi,
} from "lucide-react";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

/* ── Product images ── */
const productImages: Record<string, string> = {
  "Roller Blinds": "https://northsolarscreen.com/wp-content/uploads/2013/11/cellular-shades.jpg",
  "Vertical Blinds": "https://www.norwichsunblinds.co.uk/wp-content/uploads/2016/09/LL-Vertical-blind-Chenille-mauve.jpg",
  "Sheer Curtains": "https://tse1.mm.bing.net/th/id/OIP.BLCxmNpMUedlL2bTd_1LHgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "Blockout Curtains": "https://tse1.mm.bing.net/th/id/OIP.AtUVQdiSU-GrQ4LUgw7SBAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "Plantation Shutters": "https://miro.medium.com/max/8524/1*mUueHmsKpysal07B__UzEw.jpeg",
  "Motorised Solution": "https://tse4.mm.bing.net/th/id/OIP.Vjo0ayQqGdIIPOzJ3mzDeQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "Motorised Solutions": "https://tse4.mm.bing.net/th/id/OIP.Vjo0ayQqGdIIPOzJ3mzDeQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "Verishade Blinds": "https://tse1.mm.bing.net/th/id/OIP.tvnVtAbQu0U0gZXyrMXZPAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "Expert Installation": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
};
function getProductImage(service: ServiceDocument): string {
  if (service.imageUrl && service.imageUrl.trim()) return service.imageUrl.trim();
  return productImages[service.title] ?? productImages["default"];
}

/* ── Icon map for feature tiles (stored as string names in Firebase) ── */
const featureIconMap: Record<string, React.ReactNode> = {
  Sun: <Sun size={18} />, Moon: <Moon size={18} />, Shield: <Shield size={18} />,
  Leaf: <Leaf size={18} />, Settings: <Settings size={18} />, Clock: <Clock size={18} />,
  Star: <Star size={18} />, Home: <Home size={18} />, Wind: <Wind size={18} />,
  Zap: <Zap size={18} />, Eye: <Eye size={18} />, Layers: <Layers size={18} />,
  Maximize2: <Maximize2 size={18} />, ThumbsUp: <ThumbsUp size={18} />,
  Volume2: <Volume2 size={18} />, VolumeX: <VolumeX size={18} />,
  Wifi: <Wifi size={18} />, Ruler: <Ruler size={18} />, HardHat: <HardHat size={18} />,
  Palette: <Palette size={18} />, CheckCircle2: <CheckCircle2 size={18} />,
  ArrowRight: <ArrowRight size={18} />, Lightbulb: <Lightbulb size={18} />,
};

/* ── Default rich data per service (fallback if admin hasn't set) ── */
interface ServiceExtra {
  tagline: string;
  benefits: string[];
  features: { icon: React.ReactNode; label: string; value: string }[];
  specs: { label: string; value: string }[];
  fabrics?: string[];
}


const defaultServiceData: Record<string, ServiceExtra> = {
  "Roller Blinds": {
    tagline: "Sleek, versatile and built for modern Australian homes.",
    benefits: [
      "Precise light control with smooth rolling mechanism",
      "Available in blockout, sunscreen & sheer fabrics",
      "Space-saving design — perfect for any window size",
      "Easy to clean and maintain",
      "Child-safe chain options available",
      "UV protection up to 99% with blockout fabrics",
    ],
    features: [
      { icon: <Sun size={18} />, label: "Light Control", value: "Full to Filtered" },
      { icon: <Shield size={18} />, label: "Privacy", value: "High" },
      { icon: <Leaf size={18} />, label: "Eco Rating", value: "Energy Efficient" },
      { icon: <Settings size={18} />, label: "Operation", value: "Manual or Motorised" },
    ],
    specs: [
      { label: "Max Width", value: "Up to 3.5m" },
      { label: "Fabric Types", value: "Sunscreen, Sheer, Blockout" },
      { label: "Colour Options", value: "50+ Colours" },
      { label: "Warranty", value: "5 Year Manufacturer" },
    ],
    fabrics: ["Sunscreen 5%", "Sunscreen 10%", "Sheer", "Translucent", "Blockout", "Moisture Resistant"],
  },
  "Vertical Blinds": {
    tagline: "The ideal solution for large windows, bi-fold doors & sliding doors.",
    benefits: [
      "Perfect for floor-to-ceiling and sliding door windows",
      "Individual blade rotation for precise light direction",
      "Stacks neatly to the side when open",
      "Ideal for high-traffic areas — durable and low-maintenance",
      "Available in fabric, PVC & aluminium blades",
      "Wide range of colours and textures",
    ],
    features: [
      { icon: <Maximize2 size={18} />, label: "Best For", value: "Large Windows & Doors" },
      { icon: <Sun size={18} />, label: "Light Control", value: "Adjustable" },
      { icon: <Shield size={18} />, label: "Privacy", value: "High" },
      { icon: <Clock size={18} />, label: "Installation", value: "Same Day Available" },
    ],
    specs: [
      { label: "Blade Width", value: "89mm or 127mm" },
      { label: "Blade Types", value: "Fabric, PVC, Aluminium" },
      { label: "Colour Options", value: "40+ Colours" },
      { label: "Warranty", value: "5 Year Manufacturer" },
    ],
    fabrics: ["Fabric", "PVC", "Aluminium", "Metallic Finish", "Blockout", "Translucent"],
  },
  "Sheer Curtains": {
    tagline: "Soft, flowing elegance that diffuses light beautifully.",
    benefits: [
      "Diffuses harsh sunlight into a soft, warm glow",
      "Adds instant sophistication and luxury to any room",
      "Maintains daytime privacy without blocking your view",
      "Available in linen, voile, polyester blends",
      "Dry-clean or machine-washable options",
      "Ideal for living rooms, dining rooms and bedrooms",
    ],
    features: [
      { icon: <Sun size={18} />, label: "Light Diffusion", value: "Soft & Natural" },
      { icon: <Eye size={18} />, label: "Daytime Privacy", value: "Moderate" },
      { icon: <Home size={18} />, label: "Style", value: "Elegant & Timeless" },
      { icon: <Leaf size={18} />, label: "Fabric", value: "Natural & Synthetic" },
    ],
    specs: [
      { label: "Drop Length", value: "Custom made to size" },
      { label: "Heading Type", value: "S-Fold, Eyelet, Pinch Pleat" },
      { label: "Fabric Types", value: "Linen, Voile, Polyester" },
      { label: "Warranty", value: "2 Year Workmanship" },
    ],
    fabrics: ["Linen Blend", "Voile", "Polyester Sheer", "Cotton Blend", "Silk Look", "Velvet"],
  },
  "Blockout Curtains": {
    tagline: "Complete darkness, total privacy — premium quality blockout solutions.",
    benefits: [
      "100% blackout — ideal for bedrooms and media rooms",
      "Thermal lining reduces heat loss by up to 40%",
      "Noise-reducing properties for a quieter home",
      "Prevents UV fading of furniture and floors",
      "Available in 100s of fabric colours and textures",
      "Custom made to your exact window measurements",
    ],
    features: [
      { icon: <Moon size={18} />, label: "Blackout", value: "100% Light Block" },
      { icon: <VolumeX size={18} />, label: "Noise Reduction", value: "Moderate" },
      { icon: <Leaf size={18} />, label: "Thermal", value: "Insulating" },
      { icon: <Shield size={18} />, label: "UV Protection", value: "99%+" },
    ],
    specs: [
      { label: "Drop Length", value: "Custom made to size" },
      { label: "Heading Type", value: "S-Fold, Eyelet, Pinch Pleat, Rod Pocket" },
      { label: "Lining", value: "Blockout, Thermal, Interlined" },
      { label: "Warranty", value: "2 Year Workmanship" },
    ],
    fabrics: ["Velvet Blockout", "Linen Look Blockout", "Dim Out", "Thermal Blockout", "Performance Blockout", "Cotton Blockout"],
  },
  "Plantation Shutters": {
    tagline: "Timeless craftsmanship that adds lasting value to your property.",
    benefits: [
      "Adds significant resale value to your property",
      "Adjustable louvres for perfect light and airflow control",
      "Extremely durable — designed to last decades",
      "Low maintenance — simply wipe clean",
      "Suitable for high-moisture areas like bathrooms",
      "Custom made to fit any window shape or size",
    ],
    features: [
      { icon: <ThumbsUp size={18} />, label: "Property Value", value: "Increases Resale" },
      { icon: <Wind size={18} />, label: "Airflow", value: "Fully Adjustable" },
      { icon: <Shield size={18} />, label: "Durability", value: "30+ Year Lifespan" },
      { icon: <Layers size={18} />, label: "Material", value: "Timber / ABS Polymer" },
    ],
    specs: [
      { label: "Louvre Size", value: "63mm, 76mm, 89mm, 114mm" },
      { label: "Material", value: "Basswood Timber, ABS Polymer" },
      { label: "Panel Types", value: "Hinged, Bi-fold, Fixed" },
      { label: "Warranty", value: "10 Year Manufacturer" },
    ],
    fabrics: ["White Polymer", "Off-White Polymer", "Natural Basswood", "Painted Timber", "Stained Timber", "Coastal White"],
  },
  "Motorised Solutions": {
    tagline: "Smart automation for effortless comfort and total control.",
    benefits: [
      "Control any blind or curtain from your phone or remote",
      "Compatible with Google Home, Amazon Alexa & Apple HomeKit",
      "Set schedules to open and close automatically",
      "Ideal for hard-to-reach skylights and high windows",
      "Battery or hardwired motor options available",
      "Whisper-quiet motor operation",
    ],
    features: [
      { icon: <Wifi size={18} />, label: "Smart Home", value: "Google, Alexa, Apple" },
      { icon: <Zap size={18} />, label: "Power", value: "Battery or Hardwired" },
      { icon: <Volume2 size={18} />, label: "Noise Level", value: "Near Silent" },
      { icon: <Settings size={18} />, label: "Control", value: "App, Remote, Voice" },
    ],
    specs: [
      { label: "Motor Brand", value: "Somfy, Dooya, Automate" },
      { label: "Control Options", value: "Remote, App, Voice, Schedule" },
      { label: "Compatible With", value: "Any blind or curtain system" },
      { label: "Warranty", value: "5 Year Motor Warranty" },
    ],
  },
  "Motorised Solution": {
    tagline: "Smart automation for effortless comfort and total control.",
    benefits: [
      "Control any blind or curtain from your phone or remote",
      "Compatible with Google Home, Amazon Alexa & Apple HomeKit",
      "Set schedules to open and close automatically",
      "Ideal for hard-to-reach skylights and high windows",
      "Battery or hardwired motor options available",
      "Whisper-quiet motor operation",
    ],
    features: [
      { icon: <Wifi size={18} />, label: "Smart Home", value: "Google, Alexa, Apple" },
      { icon: <Zap size={18} />, label: "Power", value: "Battery or Hardwired" },
      { icon: <Volume2 size={18} />, label: "Noise Level", value: "Near Silent" },
      { icon: <Settings size={18} />, label: "Control", value: "App, Remote, Voice" },
    ],
    specs: [
      { label: "Motor Brand", value: "Somfy, Dooya, Automate" },
      { label: "Control Options", value: "Remote, App, Voice, Schedule" },
      { label: "Compatible With", value: "Any blind or curtain system" },
      { label: "Warranty", value: "5 Year Motor Warranty" },
    ],
  },
  "Verishade Blinds": {
    tagline: "The perfect blend of sheer elegance and blockout privacy.",
    benefits: [
      "Dual-layer fabric — sheer and blockout in one blind",
      "Adjust from open sheer view to full privacy instantly",
      "No need for double curtains or layering",
      "Modern floating fabric appearance",
      "Available in a wide range of colours",
      "Easy operation — corded or motorised",
    ],
    features: [
      { icon: <Layers size={18} />, label: "Design", value: "Dual Layer Fabric" },
      { icon: <Sun size={18} />, label: "Light", value: "Sheer to Blockout" },
      { icon: <Eye size={18} />, label: "Privacy", value: "Fully Adjustable" },
      { icon: <Star size={18} />, label: "Style", value: "Contemporary & Modern" },
    ],
    specs: [
      { label: "Fabric Layers", value: "2 — Sheer + Blockout" },
      { label: "Operation", value: "Cord, Chain or Motorised" },
      { label: "Colour Options", value: "30+ Colours" },
      { label: "Warranty", value: "5 Year Manufacturer" },
    ],
    fabrics: ["White", "Ivory", "Soft Grey", "Charcoal", "Stone", "Dusk"],
  },
};

const fallbackExtra: ServiceExtra = {
  tagline: "Premium quality, expertly installed for your home.",
  benefits: [
    "Custom made to your exact window measurements",
    "Professional installation by our expert team",
    "Wide range of colours, fabrics and finishes",
    "Child-safe options available on all products",
    "Backed by our workmanship warranty",
  ],
  features: [
    { icon: <Star size={18} />, label: "Quality", value: "Premium Grade" },
    { icon: <HardHat size={18} />, label: "Install", value: "Professional" },
    { icon: <Shield size={18} />, label: "Warranty", value: "Backed" },
    { icon: <Settings size={18} />, label: "Custom", value: "Made to Measure" },
  ],
  specs: [
    { label: "Made", value: "Custom to your window" },
    { label: "Install", value: "Professional included" },
    { label: "Warranty", value: "Manufacturer backed" },
    { label: "Colours", value: "Wide range available" },
  ],
};

/* ── Text highlighter ── */
function HighlightedText({ text, words }: { text: string; words?: string[] }) {
  if (!text) return null;
  const snippet = text.split(".")[0] + ".";
  if (!words?.length) return <p className={styles.cardDesc}>{snippet}</p>;
  const hi = (line: string) => {
    let parts: { t: string; h: boolean }[] = [{ t: line, h: false }];
    words.forEach((w) => {
      if (!w.trim()) return;
      const rx = new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      const next: { t: string; h: boolean }[] = [];
      parts.forEach((p) => {
        if (p.h) { next.push(p); return; }
        p.t.split(rx).forEach((s) => next.push({ t: s, h: s.toLowerCase() === w.toLowerCase() }));
      });
      parts = next;
    });
    return <>{parts.map((p, i) => p.h ? <mark key={i} className={styles.cardHighlight}>{p.t}</mark> : <span key={i}>{p.t}</span>)}</>;
  };
  return <p className={styles.cardDesc}>{hi(snippet)}</p>;
}

/* ── Framer variants ── */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const modalVariants = {
  hidden: { opacity: 0, scale: 0.93, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { opacity: 0, scale: 0.93, y: 20, transition: { duration: 0.3 } },
};

/* ─────────────────────────────────────────────
   SERVICE DETAIL MODAL
───────────────────────────────────────────── */
function ServiceModal({ service, onClose }: { service: ServiceDocument; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Merge Firebase data with hardcoded defaults — Firebase always wins
  const extra = defaultServiceData[service.title] ?? fallbackExtra;
  const benefits   = (service.benefits   && service.benefits.length > 0)   ? service.benefits   : extra.benefits;
  const features   = (service.features   && service.features.length > 0)   ? service.features.map(f => ({ ...f, icon: featureIconMap[f.iconName] ?? <Star size={18}/> })) : extra.features;
  const specs      = (service.specs      && service.specs.length > 0)      ? service.specs      : extra.specs;
  const fabrics    = (service.fabrics    && service.fabrics.length > 0)    ? service.fabrics    : extra.fabrics;
  const longContent = service.tagline || service.longContent || extra.tagline;
  const imgSrc = getProductImage(service);

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modalPanel}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero Image Header ── */}
        <div className={styles.modalImgBox}>
          <Image src={imgSrc} alt={service.title} fill unoptimized className={styles.modalImg} />
          <div className={styles.modalImgOverlay} />
          <button className={styles.modalClose} onClick={onClose} aria-label="Close"><X size={18} /></button>
          <div className={styles.modalImgContent}>
            <span className={styles.modalBadge}>Capital Blinds & Shades</span>
            <h2 className={styles.modalTitle}>{service.title}</h2>
            <p className={styles.modalTagline}>{longContent}</p>
          </div>
        </div>

        {/* ── Modal Body ── */}
        <div className={styles.modalBody}>

          {/* Quick Feature Tiles */}
          <div className={styles.featureGrid}>
            {features.map((f: any, i: number) => (
              <div key={i} className={styles.featureTile}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <div>
                  <div className={styles.featureLabel}>{f.label}</div>
                  <div className={styles.featureValue}>{f.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className={styles.benefitsBox}>
            <h4 className={styles.benefitsTitle}>✦ Why Choose {service.title}?</h4>
            <ul className={styles.benefitsList}>
              {benefits.map((b, i) => (
                <li key={i} className={styles.benefitItem}>
                  <CheckCircle2 size={15} className={styles.benefitIcon} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specs Table */}
          <div className={styles.specsBox}>
            <h4 className={styles.specsTitle}>Product Specifications</h4>
            <div className={styles.specsGrid}>
              {specs.map((s: any, i: number) => (
                <div key={i} className={styles.specRow}>
                  <span className={styles.specLabel}>{s.label}</span>
                  <span className={styles.specValue}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fabric / Finish Options */}
          {fabrics && fabrics.length > 0 && (
            <div className={styles.fabricsBox}>
              <h4 className={styles.specsTitle}>Available Fabrics & Finishes</h4>
              <div className={styles.fabricChips}>
                {fabrics.map((f: string, i: number) => (
                  <span key={i} className={styles.fabricChip}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className={styles.trustRow}>
            <div className={styles.trustBadge}><Star size={14} /> Premium Quality</div>
            <div className={styles.trustBadge}><HardHat size={14} /> Expert Install</div>
            <div className={styles.trustBadge}><Shield size={14} /> Warranty Backed</div>
            <div className={styles.trustBadge}><Ruler size={14} /> Made to Measure</div>
          </div>

          {/* CTA */}
          <Link href="/contact" className={styles.modalCta} onClick={onClose}>
            Get a Free Quote for {service.title} <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function ServicesPage() {
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeService, setActiveService] = useState<ServiceDocument | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collections.services, orderBy("order", "asc")));
        if (!snap.empty) setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 800], [0, 200]);

  return (
    <main className={styles.main}>

      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        <motion.div className={styles.heroParallax} style={{ y: yHeroBg }}>
          <Image
            src="https://static.asianpaints.com/content/dam/asianpaintsbeautifulhomes/blogs/blackout-curtains-comfort/minimalist-fabric-blackout-curtains.jpg"
            alt="Minimalist Fabric Blackout Curtains" fill priority unoptimized className={styles.heroImg}
          />
        </motion.div>
        <div className={styles.heroVeil} />
        <motion.div className={styles.heroBody} initial="hidden" animate="visible" variants={stagger}>
          <motion.span variants={fadeUp} className={styles.pill}>Our Services</motion.span>
          <motion.h1 variants={fadeUp} className={styles.heroTitle}>
            Premium Blinds &amp;<br />Shutters <span>Solutions</span>
          </motion.h1>
          <motion.p variants={fadeUp} className={styles.heroSub}>
            From elegant sheer curtains to durable plantation shutters — we bring your home to life with exceptional quality and craftsmanship.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/contact" className={styles.btnGradient}>Get a Free Quote</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ CARD GRID ═══ */}
      <section className={styles.grid}>
        <div className={styles.wrap}>
          {loading ? (
            <div className={styles.skeletonGrid}>
              {[...Array(8)].map((_, i) => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : (
            <motion.div className={styles.cardGrid} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.04 }}>
              {services.map((s, i) => (
                <motion.div key={s.id || i} variants={fadeUp} whileHover={{ scale: 1.02 }} className={styles.whiteCard}>
                  <div className={styles.cardImgBox}>
                    <Image src={getProductImage(s)} alt={s.title} fill className={styles.cardImg} sizes="(max-width:1024px) 50vw, 25vw" />
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <HighlightedText text={s.desc} words={s.importantWords} />
                    <button className={styles.cardLink} onClick={() => setActiveService(s)}>
                      Learn More →
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section className={styles.process}>
        <div className={styles.wrap}>
          <motion.div className={styles.processHead} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <h2 className={styles.processHeading}>How it works</h2>
            <p className={styles.processSub}>From your first call to the final install — we handle everything.</p>
          </motion.div>
          <div className={styles.processRow}>
            <div className={styles.processLine}></div>
            {[
              { n: "01", title: "Book a Consultation", body: "We visit your home at no cost, measuring every window with precision.", icon: <Ruler size={24} /> },
              { n: "02", title: "Choose Your Style", body: "Browse fabrics, colours and systems with expert guidance from our team.", icon: <Palette size={24} /> },
              { n: "03", title: "We Install", body: "Our professional installers fit everything — perfectly, on time.", icon: <HardHat size={24} /> },
            ].map((step, i) => (
              <motion.div key={i} className={styles.processCard} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}>
                <div className={styles.processNumberBg}>{step.n}</div>
                <div className={styles.processContent}>
                  <div className={styles.processIconBox}>{step.icon}</div>
                  <span className={styles.processNumFront}>Step {step.n}</span>
                  <h3 className={styles.processTitle}>{step.title}</h3>
                  <p className={styles.processBody}>{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BAND ═══ */}
      <motion.section className={styles.cta} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <Image src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000&auto=format&fit=crop" alt="Premium Roller Blinds" fill unoptimized className={styles.ctaBgImg} />
        <div className={styles.ctaOverlay} />
        <div className={styles.ctaInner}>
          <div className={styles.ctaGlassBox}>
            <span className={styles.ctaEyebrow}>Ready to Begin?</span>
            <h2 className={styles.ctaTitle}>Transform Your Home<br /><em>Starting Today.</em></h2>
            <p className={styles.ctaSub}>Book a free measure &amp; quote — no obligation, just expert advice.</p>
            <div className={styles.ctaActionBox}>
              <Link href="/contact" className={styles.btnGold}>Book Free Measure <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ SERVICE MODAL ═══ */}
      <AnimatePresence>
        {activeService && <ServiceModal service={activeService} onClose={() => setActiveService(null)} />}
      </AnimatePresence>

    </main>
  );
}
