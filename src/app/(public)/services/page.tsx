"use client";

import { motion } from "framer-motion";
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

/* ── Text highlighter ── */
function HighlightedText({ text, words }: { text: string; words?: string[] }) {
  if (!text) return null;
  const snippet = text.split(".")[0] + "."; // Just use the first sentence for the card

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ════════════════════════════════════════ */
export default function ServicesPage() {
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [loading, setLoading] = useState(true);

  /* Scroll reveal */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add(styles.inView); }),
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );
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

  return (
    <main className={styles.main}>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroParallax}>
          <Image
            src="https://static.asianpaints.com/content/dam/asianpaintsbeautifulhomes/blogs/blackout-curtains-comfort/minimalist-fabric-blackout-curtains.jpg"
            alt="Minimalist Fabric Blackout Curtains"
            fill
            priority
            unoptimized
            className={styles.heroImg}
          />
        </div>
        <div className={styles.heroVeil} />

        <div className={styles.heroBody}>
          <span className={styles.pill}>Our Services</span>
          <h1 className={styles.heroTitle}>
            Premium Blinds &amp;<br />
            Shutters <span>Solutions</span>
          </h1>
          <p className={styles.heroSub}>
            From elegant sheer curtains to durable plantation shutters — we bring your home to life with exceptional quality and craftsmanship.
          </p>
          <Link href="/contact" className={styles.btnGradient}>
            Get a Free Quote
          </Link>
        </div>
      </section>

      {/* ═══════════════ PRODUCTS (CARD GRID) ═══════════════ */}
      <section className={styles.grid}>
        <div className={styles.wrap}>

          {loading ? (
            <div className={styles.skeletonGrid}>
              {[...Array(8)].map((_, i) => <div key={i} className={styles.skeleton} />)}
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
                <motion.div key={s.id || i} variants={fadeUp} className={styles.whiteCard}>

                  {/* Image */}
                  <div className={styles.cardImgBox}>
                    <Image src={getProductImage(s.title)} alt={s.title} fill className={styles.cardImg} sizes="(max-width:1024px) 50vw, 25vw" />
                  </div>

                  <div className={styles.cardBody}>
                    {/* Text */}
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <HighlightedText text={s.desc} words={s.importantWords} />

                    {/* Link */}
                    <Link href="/contact" className={styles.cardLink}>
                      Learn More &rarr;
                    </Link>
                  </div>
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
            <h2 className={styles.processHeading}>How it works</h2>
            <p className={styles.processSub}>From your first call to the final install — we handle everything.</p>
          </div>

          <div className={styles.processRow}>
            <div className={styles.processLine}></div>
            {[
              { n: "01", title: "Book a Consultation", body: "We visit your home at no cost, measuring every window with precision.", icon: <Ruler size={24} /> },
              { n: "02", title: "Choose Your Style", body: "Browse fabrics, colours and systems with expert guidance from our team.", icon: <Palette size={24} /> },
              { n: "03", title: "We Install", body: "Our professional installers fit everything — perfectly, on time.", icon: <HardHat size={24} /> },
            ].map((step, i) => (
              <motion.div
                key={i}
                className={`${styles.processCard} ${styles.sr}`}
                style={{ transitionDelay: `${i * 0.13}s` }}
              >
                <div className={styles.processNumberBg}>{step.n}</div>
                <div className={styles.processContent}>
                  <div className={styles.processIconBox}>
                    {step.icon}
                  </div>
                  <span className={styles.processNumFront}>Step {step.n}</span>
                  <h3 className={styles.processTitle}>{step.title}</h3>
                  <p className={styles.processBody}>{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BAND ═══════════════ */}
      <section className={`${styles.cta} ${styles.sr}`}>
        <Image
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000&auto=format&fit=crop"
          alt="Premium Roller Blinds"
          fill
          unoptimized
          className={styles.ctaBgImg}
        />
        <div className={styles.ctaOverlay} />

        <div className={styles.ctaInner}>
          <div className={styles.ctaGlassBox}>
            <span className={styles.ctaEyebrow}>Ready to Begin?</span>
            <h2 className={styles.ctaTitle}>
              Transform Your Home<br /><em>Starting Today.</em>
            </h2>
            <p className={styles.ctaSub}>
              Book a free measure &amp; quote — no obligation, just expert advice.
            </p>
            <div className={styles.ctaActionBox}>
              <Link href="/contact" className={styles.btnGold}>
                Book Free Measure <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
