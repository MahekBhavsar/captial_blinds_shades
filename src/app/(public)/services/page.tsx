"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { collections } from "@/lib/firebase";
import { getDocs, query, orderBy } from "firebase/firestore";
import type { ServiceDocument } from "@/lib/schema";
import {
  CarFront, Store, Printer, ImageIcon, Tag, Palette,
  LayoutPanelLeft, Square, Lightbulb, ShieldAlert,
  HardHat, Brush, Wrench, Signpost, Frame, PanelTop, FileImage,
  X, LayoutDashboard, Car, Flag, PictureInPicture, Sticker,
  AppWindow, PaintRoller, Contact, FileText, Image as LucideImage,
  Navigation, PenTool, ArrowRight, ArrowUpRight,
  Ruler, ShieldCheck, CheckCircle2, ChevronDown,
} from "lucide-react";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

/* ── Product images mapped by common keywords ── */
const productImages: Record<string, string> = {
  "Roller Blinds": "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=800&auto=format&fit=crop",
  "Vertical Blinds": "https://www.norwichsunblinds.co.uk/wp-content/uploads/2016/09/LL-Vertical-blind-Chenille-mauve.jpg",
  "Sheer Curtains": "https://tse1.mm.bing.net/th/id/OIP.BLCxmNpMUedlL2bTd_1LHgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "Blockout Curtains": "https://tse1.mm.bing.net/th/id/OIP.AtUVQdiSU-GrQ4LUgw7SBAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "Plantation Shutters": "https://miro.medium.com/max/8524/1*mUueHmsKpysal07B__UzEw.jpeg",
  "Motorised Solutions": "https://usshuttersandblinds.com/wp-content/uploads/2026/01/How-do-motorized-blinds-work-2.webp",
  "Verishade Blinds": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop",
  "Expert Installation": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
};

function getProductImage(title: string): string {
  return productImages[title] ?? productImages["default"];
}

/* ── Icon map ── */
const iconMap: Record<string, React.ReactNode> = {
  CarFront: <CarFront size={22} />, Store: <Store size={22} />,
  Printer: <Printer size={22} />, ImageIcon: <ImageIcon size={22} />,
  Tag: <Tag size={22} />, Palette: <Palette size={22} />,
  LayoutPanelLeft: <LayoutPanelLeft size={22} />, Square: <Square size={22} />,
  Lightbulb: <Lightbulb size={22} />, ShieldAlert: <ShieldAlert size={22} />,
  HardHat: <HardHat size={22} />, Brush: <Brush size={22} />,
  Wrench: <Wrench size={22} />, Signpost: <Signpost size={22} />,
  Frame: <Frame size={22} />, PanelTop: <PanelTop size={22} />,
  FileImage: <FileImage size={22} />, Car: <Car size={22} />,
  Flag: <Flag size={22} />, PictureInPicture: <PictureInPicture size={22} />,
  Sticker: <Sticker size={22} />, AppWindow: <AppWindow size={22} />,
  PaintRoller: <PaintRoller size={22} />, Contact: <Contact size={22} />,
  FileText: <FileText size={22} />, Image: <LucideImage size={22} />,
  Navigation: <Navigation size={22} />, PenTool: <PenTool size={22} />,
};

/* ── Rich text renderer ── */
function RichText({ text, words }: { text: string; words?: string[] }) {
  if (!text) return null;
  let t = text.replace(/\s*->/g, "\n• ").replace(/Services Included\s*:/gi, "\n**Services Included:**\n");

  const hi = (line: string) => {
    if (!words?.length) return <span>{line}</span>;
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
    return <>{parts.map((p, i) => p.h ? <mark key={i} className={styles.mark}>{p.t}</mark> : <span key={i}>{p.t}</span>)}</>;
  };

  return (
    <div className={styles.richBody}>
      {t.split("\n").map((line, i) => {
        const s = line.trim();
        if (!s) return null;
        if (s.startsWith("• ") || s.startsWith("- ") || s.startsWith("* "))
          return <div key={i} className={styles.richBullet}><span>•</span><span>{hi(s.slice(2))}</span></div>;
        if (s.startsWith("**") && s.endsWith("**"))
          return <strong key={i} className={styles.richH}>{hi(s.replace(/\*\*/g, ""))}</strong>;
        return <p key={i} className={styles.richP}>{hi(line)}</p>;
      })}
    </div>
  );
}

/* ── Framer variants ── */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const modalBg = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const modalBox = {
  hidden: { opacity: 0, scale: 0.95, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { opacity: 0, scale: 0.95, y: 24, transition: { duration: 0.22 } },
};

const perks = [
  { icon: <Ruler size={14} />, text: "Custom Made to Order" },
  { icon: <ShieldCheck size={14} />, text: "Quality Guaranteed" },
  { icon: <CheckCircle2 size={14} />, text: "Free Measure & Quote" },
];

/* ════════════════════════════════════════ */
export default function ServicesPage() {
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ServiceDocument | null>(null);

  /* Scroll reveal — runs after data loads so dynamic sections are in DOM */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add(styles.inView); }),
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );
    // Small delay to let React render dynamic cards first
    const t = setTimeout(() => {
      document.querySelectorAll(`.${styles.sr}`).forEach((el) => io.observe(el));
    }, 100);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [loading]);

  /* Firestore fetch */
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collections.services, orderBy("order", "asc")));
        if (!snap.empty) setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <main className={styles.main}>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroParallax}>
          <Image
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury window blinds interior"
            fill priority
            className={styles.heroImg}
            sizes="100vw"
          />
        </div>
        <div className={styles.heroVeil} />

        <motion.div
          className={styles.heroBody}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Pill */}
          <motion.span
            className={styles.pill}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.pillDot} /> Our Products &amp; Services
          </motion.span>

          {/* Heading */}
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Premium Window<br />
            <em>Furnishings,</em><br />
            <span>Crafted for You.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            From custom roller blinds to elegant plantation shutters —
            every product made-to-measure with expert installation included.
          </motion.p>

          {/* Perk chips */}
          <motion.div
            className={styles.perks}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.7 }}
          >
            {perks.map((p, i) => (
              <span key={i} className={styles.perk}>{p.icon}{p.text}</span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
          >
            <Link href="/contact" className={styles.btnGold}>
              Get Free Quote <ArrowRight size={15} />
            </Link>
            <a href="#collection" className={styles.btnGlass}>
              Browse Collection <ChevronDown size={15} />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll line */}
        <div className={styles.heroScrollLine}>
          <span className={styles.scrollDrip} />
        </div>

        {/* Wave */}
        <div className={styles.wave}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,50 C360,90 1080,10 1440,50 L1440,80 L0,80 Z" fill="#f7f3ee" />
          </svg>
        </div>
      </section>


      {/* ═══════════════ INTRO ═══════════════ */}
      <div className={`${styles.intro} ${styles.sr}`} id="collection">
        <p>
          Every item is <strong>custom made to your exact measurements</strong> — no off-the-shelf
          products. Click any product below to learn more and get a tailored quote.
        </p>
      </div>


      {/* ═══════════════ PRODUCTS GRID ═══════════════ */}
      <section className={styles.grid}>
        <div className={styles.wrap}>

          {/* Section header */}
          <div className={`${styles.gridHead} ${styles.sr}`}>
            <div>
              <span className={styles.eyebrow}>Full Collection</span>
              <h2 className={styles.h2}>Every Window. <em>Every Style.</em></h2>
            </div>
            <Link href="/contact" className={styles.headLink}>
              Request a Quote <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Cards */}
          {loading ? (
            <div className={styles.skeletonGrid}>
              {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : (
            <motion.div
              className={styles.cardGrid}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.04 }}
            >
              {services.map((s, i) => (
                <motion.div
                  key={s.id || i}
                  variants={fadeUp}
                  whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                  className={styles.card}
                  onClick={() => setSelected(s)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelected(s)}
                >
                  {/* Image */}
                  <div className={styles.cardImg}>
                    <Image
                      src={getProductImage(s.title)}
                      alt={s.title}
                      fill
                      className={styles.cardImgEl}
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div className={styles.cardVeil} />
                    {/* Floating icon badge */}
                    <div className={styles.cardBadge} style={{ background: `${s.color}22`, color: s.color || "#c9a84c", borderColor: `${s.color}40` }}>
                      {iconMap[s.iconName] || <LayoutDashboard size={22} />}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <p className={styles.cardDesc}>{s.desc?.split(".")[0]}.</p>
                    <span className={styles.cardCta} style={{ color: s.color || "#c9a84c" }}>
                      Learn More <ArrowUpRight size={13} />
                    </span>
                  </div>

                  {/* Hover shimmer */}
                  <span className={styles.cardShimmer} style={{ background: s.color || "#c9a84c" }} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>


      {/* ═══════════════ PROCESS ═══════════════ */}
      <section className={styles.process}>
        <div className={styles.wrap}>
          <div className={`${styles.processHead} ${styles.sr}`}>
            <span className={styles.eyebrowLight}>How It Works</span>
            <h2 className={styles.h2Light}>Simple as <em>1, 2, 3.</em></h2>
            <p className={styles.processSub}>From your first call to the final install — we handle everything.</p>
          </div>

          <div className={styles.processRow}>
            {[
              { n: "01", title: "Book a Consultation", body: "We visit your home at no cost, measuring every window with precision." },
              { n: "02", title: "Choose Your Style", body: "Browse fabrics, colours and systems with expert guidance from our team." },
              { n: "03", title: "We Install", body: "Our professional installers fit everything — perfectly, on time." },
            ].map((step, i) => (
              <motion.div
                key={i}
                className={`${styles.processCard} ${styles.sr}`}
                style={{ transitionDelay: `${i * 0.13}s` }}
              >
                <span className={styles.processNum}>{step.n}</span>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processBody}>{step.body}</p>
                {i < 2 && <span className={styles.processConnector}>→</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════ CTA BAND ═══════════════ */}
      <section className={`${styles.cta} ${styles.sr}`}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaInner}>
          <div className={styles.ctaLeft}>
            <span className={styles.eyebrow}>Ready to Begin?</span>
            <h2 className={styles.ctaTitle}>
              Transform Your Home<br /><em>Starting Today.</em>
            </h2>
            <p className={styles.ctaSub}>
              Book a free measure &amp; quote — no obligation, just expert advice.
            </p>
          </div>
          <div className={styles.ctaRight}>
            <Link href="/contact" className={styles.btnGold}>
              Book Free Measure <ArrowRight size={16} />
            </Link>
            <Link href="/about" className={styles.btnMuted}>
              Learn About Us →
            </Link>
          </div>
        </div>
        {/* Deco */}
        <div className={styles.ctaDeco} aria-hidden="true">
          <span /><span /><span />
        </div>
      </section>


      {/* ═══════════════ MODAL ═══════════════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className={styles.backdrop}
            variants={modalBg}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setSelected(null)}
          >
            <motion.div
              className={styles.modal}
              variants={modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hero image strip */}
              <div className={styles.modalImgStrip}>
                <Image
                  src={getProductImage(selected.title)}
                  alt={selected.title}
                  fill
                  className={styles.modalImg}
                  sizes="580px"
                />
                <div className={styles.modalImgVeil} />
                <div className={styles.modalImgContent}>
                  <div className={styles.modalImgIcon} style={{ background: `${selected.color}25`, color: selected.color || "#c9a84c" }}>
                    {iconMap[selected.iconName] || <LayoutDashboard size={22} />}
                  </div>
                  <div>
                    <span className={styles.modalTag}>Product Detail</span>
                    <h2 className={styles.modalTitle}>{selected.title}</h2>
                  </div>
                </div>
                <button className={styles.modalClose} onClick={() => setSelected(null)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className={styles.modalContent}>
                <div className={styles.modalDesc}>
                  <RichText
                    text={selected.longContent || selected.desc}
                    words={selected.importantWords}
                  />
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                  <button className={styles.btnClose} onClick={() => setSelected(null)}>Close</button>
                  <Link href="/contact" className={styles.btnGold}>
                    Get a Quote <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
