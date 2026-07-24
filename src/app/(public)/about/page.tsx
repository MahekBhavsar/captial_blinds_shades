"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2, Target, Users, ShieldCheck,
  Award, Star, MapPin, Phone, Mail,
  ArrowRight, Sparkles, Heart, Leaf,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

/* ── Framer variants ── */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.85, delay: d, ease } }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease } }
};

/* ── Data ── */
const features = [
  "Precise custom measure for every window",
  "Premium Australian-sourced fabrics & materials",
  "Expert in-home installation, guaranteed",
  "Commitment to quality & after-sales support",
];

const stats = [
  { num: "1+", label: "Years of Experience" },
  { num: "100+", label: "Happy Clients" },
  { num: "7+", label: "Product Styles" },
  { num: "100%", label: "Custom Made" },
];

const values = [
  {
    icon: <Target size={28} strokeWidth={1.5} />,
    title: "Excellence",
    body: "Every product that leaves our showroom meets the highest standard of craft. We never compromise on quality — from fabric to final install.",
  },
  {
    icon: <Heart size={28} strokeWidth={1.5} />,
    title: "Human Touch",
    body: "We treat every home as if it were our own. Our consultants listen first, then guide you to the perfect solution for your space.",
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    title: "Reliability",
    body: "When we book an appointment, we show up — on time, every time. Our word is our guarantee, from measure to delivery.",
  },
  {
    icon: <Leaf size={28} strokeWidth={1.5} />,
    title: "Sustainability",
    body: "We champion eco-conscious materials and low-waste manufacturing. Beautiful products that are kinder to the planet.",
  },
  {
    icon: <Users size={28} strokeWidth={1.5} />,
    title: "Partnership",
    body: "We view every client as a long-term partner. Your satisfaction doesn't end at installation — we're here whenever you need us.",
  },
  {
    icon: <Sparkles size={28} strokeWidth={1.5} />,
    title: "Innovation",
    body: "From motorised systems to the latest sheer fabrics, we stay at the frontier of window furnishing technology and design.",
  },
];

const team = [
  {
    name: "Mitul Maniya",
    role: "Founder",
    phone: "+61 414 336 936",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    quote: "Every window tells a story. We make sure it's a beautiful one."
  },
  {
    name: "Mehul Makarubiya",
    role: "Founder",
    phone: "+61 481 369 018",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    quote: "Quality isn't a checkbox — it's the standard we start from."
  },
];

/* ════════════════════════════════════════
   ANIMATED COUNTER
════════════════════════════════════════ */
function Counter({ target }: { target: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const num = parseInt(target.replace(/\D/g, ""), 10);
  const suffix = target.replace(/[0-9]/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      let start = 0;
      const step = Math.ceil(num / 50);
      const t = setInterval(() => {
        start = Math.min(start + step, num);
        setDisplay(start.toLocaleString() + suffix);
        if (start >= num) clearInterval(t);
      }, 28);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [num, suffix]);

  return <span ref={ref}>{display}</span>;
}

/* ════════════════════════════════════════
   PAGE
════════════════════════════════════════ */
export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  /* Scroll reveal observer for elements without framer motion */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add(styles.inView); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const t = setTimeout(() => {
      document.querySelectorAll(`.${styles.sr}`).forEach((el) => io.observe(el));
    }, 80);
    return () => { clearTimeout(t); io.disconnect(); };
  }, []);

  return (
    <main className={styles.main}>

      {/* ════════════════════════════
          1. HERO (GLASSMORPHISM)
      ════════════════════════════ */}
      <section className={styles.hero}>
        <motion.div className={styles.heroBgWrap} style={{ y: yBg }}>
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop"
            alt="Luxurious interior with premium window blinds"
            fill priority
            className={styles.heroBgImg}
            sizes="100vw"
          />
        </motion.div>
        <div className={styles.heroVeil} />

        <div className={styles.heroContentWrap}>
          <motion.div
            className={styles.glassBox}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease }}
          >
            <motion.span
              className={styles.heroPill}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <span className={styles.pillDot} /> Heritage & Craft
            </motion.span>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease }}
            >
              Mastering the <br />
              <em>Art of Light</em> <span style={{ whiteSpace: "nowrap" }}>&amp; Space.</span>
            </motion.h1>

            <motion.p
              className={styles.heroSub}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease }}
            >
              From custom sheer curtains to intelligent motorised blinds, we redefine the
              boundaries of premium window furnishings across Canberra and beyond.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════
          2. STATS STRIP
      ════════════════════════════ */}
      <div className={`${styles.statsStrip} ${styles.sr}`}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <span className={styles.statNum}>
              <Counter target={s.num} />
            </span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ════════════════════════════
          3. OUR STORY (MASONRY/OVERLAP)
      ════════════════════════════ */}
      <section className={styles.story} id="story">
        <div className={styles.wrap}>

          <div className={styles.storyHeader}>
            <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.eyebrow}>
              The Genesis
            </motion.span>
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.h2Dark}>
              A Journey of <em className={styles.serifItalic}>Design & Precision</em>
            </motion.h2>
          </div>

          <div className={styles.storyContentGrid}>

            {/* Dynamic Image Collage */}
            <motion.div
              className={styles.collage}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={scaleUp} className={styles.collageImgMain}>
                <Image
                  src="https://static.asianpaints.com/content/dam/asianpaintsbeautifulhomes/blogs/blackout-curtains-comfort/minimalist-fabric-blackout-curtains.jpg"
                  alt="Premium window furnishings"
                  fill
                  className={styles.imgEl}
                />
              </motion.div>
              <motion.div variants={scaleUp} className={styles.collageImgSec}>
                <Image
                  src="https://northsolarscreen.com/wp-content/uploads/2013/11/cellular-shades.jpg"
                  alt="Modern blinds"
                  fill
                  className={styles.imgEl}
                />
              </motion.div>
              <motion.div variants={fadeRight} className={styles.collageBadge}>
                <Award size={24} className={styles.badgeIcon} />
                <div className={styles.badgeText}>
                  <strong>Award Winning</strong>
                  <span>Service Excellence</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Narrative */}
            <motion.div
              className={styles.narrative}
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className={styles.timelineLine} />

              <div className={styles.timelineBlock}>
                <div className={styles.timelineDot} />
                <h3 className={styles.timelineTitle}>Our Services Foundation</h3>
                <p className={styles.storyP}>
                  Based in Mitchell, ACT, <strong>Capital Blinds &amp; Shades</strong> was founded on a singular obsession: delivering the perfect intersection of form and function. We provide a premium range of window furnishings including <strong>Roller Blinds, Sheer &amp; Blockout Curtains, Plantation Shutters, Motorised Solutions</strong>, and elegant <strong>Verishades</strong>. Every product is curated to elevate your everyday living spaces into extraordinary sanctuaries.
                </p>
              </div>

              <div className={styles.timelineBlock}>
                <div className={styles.timelineDot} />
                <h3 className={styles.timelineTitle}>Our Philosophy</h3>
                <p className={styles.storyP}>
                  Led by founders <strong>Mitul Maniya</strong> and <strong>Mehul Makarubiya</strong>, our approach is deeply personal and tailored to your specific needs. We believe that light is the most important element of interior design. Managing it through our bespoke blinds and shutters requires both technical expertise and an artisan&apos;s touch, ensuring every window receives the perfect treatment.
                </p>
              </div>

              <motion.ul className={styles.featureList}>
                {features.map((f, i) => (
                  <motion.li key={i} className={styles.featureItem} whileHover={{ x: 10, color: "var(--gold)" }}>
                    <CheckCircle2 size={18} className={styles.featureCheck} />
                    <span>{f}</span>
                  </motion.li>
                ))}
              </motion.ul>

            </motion.div>

          </div>
        </div>
      </section>


      {/* ════════════════════════════
          4. VALUES (HORIZONTAL TIMELINE)
      ════════════════════════════ */}
      <section className={styles.valuesSection}>
        {/* Abstract subtle background shapes */}
        <div className={styles.valuesBgDeco} />
        <div className={styles.valuesBgDeco2} />

        <div className={styles.wrap}>
          <div className={styles.valuesHead}>
            <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.eyebrowLight}>
              What We Stand For
            </motion.span>
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.h2Light}>
              The Pillars of Our <em className={styles.serifItalic}>Craft.</em>
            </motion.h2>
          </div>

          <div className={styles.valuesTimelineWrap}>
            <div className={styles.lineTrackContainer}>
              <div className={styles.valuesTimelineLineBg} />
              <motion.div
                className={styles.valuesTimelineLineFill}
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                viewport={{ once: true, amount: 0.5 }}
              />
            </div>
            <motion.div
              className={styles.valuesTimelineNodes}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  className={styles.valueNode}
                  variants={fadeUp}
                >
                  <motion.div
                    className={styles.valueNodeCircle}
                    whileHover={{ scale: 1.15, rotate: 5, boxShadow: "0 0 30px rgba(201,168,76,0.4)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {v.icon}
                  </motion.div>
                  <h3 className={styles.valueNodeTitle}>{v.title}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════
          5. THE FOUNDERS (EDITORIAL)
      ════════════════════════════ */}
      <section className={styles.teamSection}>
        <div className={styles.wrap}>
          <div className={styles.teamHead}>
            <span className={styles.eyebrow}>Visionaries</span>
            <h2 className={styles.h2Dark}>The Minds <em className={styles.serifItalic}>Behind the Brand.</em></h2>
          </div>

          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <motion.div
                key={i}
                className={styles.teamCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.2, ease }}
                whileHover="hover"
              >
                <div className={styles.teamImgWrap}>
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className={styles.teamImg}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className={styles.teamOverlay}>
                    <motion.p
                      className={styles.teamQuote}
                      variants={{ hover: { opacity: 1, y: 0 }, initial: { opacity: 0, y: 20 } }}
                      transition={{ duration: 0.4, ease }}
                    >
                      &ldquo;{member.quote}&rdquo;
                    </motion.p>
                  </div>
                </div>

                <div className={styles.teamBody}>
                  <div className={styles.teamInfo}>
                    <h3 className={styles.teamName}>{member.name}</h3>
                    <span className={styles.teamRole}>{member.role}</span>
                  </div>
                  <div className={styles.teamExpertise}>
                    <span className={styles.expertiseLabel}>Direct Line</span>
                    <a href={`tel:${member.phone.replace(/\s/g, "")}`} className={styles.teamContact}>
                      <Phone size={14} /> {member.phone}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ════════════════════════════
          7. CTA (ELEVATED)
      ════════════════════════════ */}
      <section className={`${styles.cta} ${styles.sr}`}>
        <div className={styles.ctaBgWrap}>
          <Image
            src="https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Curtains Background"
            fill
            className={styles.ctaBg}
          />
          <div className={styles.ctaOverlay} />
        </div>

        <div className={styles.ctaInner}>
          <motion.div
            className={styles.ctaContentBox}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className={styles.eyebrowLight}>Ready to Transform Your Home?</span>
            <h2 className={styles.ctaTitle}>
              Let&apos;s Create Your <br /><em className={styles.serifItalic}>Perfect Space.</em>
            </h2>
            <p className={styles.ctaSub}>
              Book a free in-home consultation — we measure, advise, and install.
              Zero obligation, full expert guidance.
            </p>
            <div className={styles.ctaBtns}>
              <Link href="/contact" className={styles.btnGold}>
                Book Free Measure <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
