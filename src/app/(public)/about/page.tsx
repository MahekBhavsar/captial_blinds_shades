"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2, Target, Users, ShieldCheck,
  Award, Star, MapPin, Phone, Mail,
  ArrowRight, Sparkles, Heart, Leaf,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

/* ── Framer variants ── */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: d, ease } }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ── Data ── */
const features = [
  "Precise custom measure for every window",
  "Premium Australian-sourced fabrics & materials",
  "Expert in-home installation, guaranteed",
  "Commitment to quality & after-sales support",
];

const stats = [
  { num: "15+", label: "Years of Experience" },
  { num: "5,000+", label: "Happy Clients" },
  { num: "50+", label: "Product Styles" },
  { num: "100%", label: "Custom Made" },
];

const values = [
  {
    icon: <Target size={28} />,
    title: "Excellence",
    body: "Every product that leaves our showroom meets the highest standard of craft. We never compromise on quality — from fabric to final install.",
  },
  {
    icon: <Heart size={28} />,
    title: "Human Touch",
    body: "We treat every home as if it were our own. Our consultants listen first, then guide you to the perfect solution for your space.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Reliability",
    body: "When we book an appointment, we show up — on time, every time. Our word is our guarantee, from measure to delivery.",
  },
  {
    icon: <Leaf size={28} />,
    title: "Sustainability",
    body: "We champion eco-conscious materials and low-waste manufacturing. Beautiful products that are kinder to the planet.",
  },
  {
    icon: <Users size={28} />,
    title: "Partnership",
    body: "We view every client as a long-term partner. Your satisfaction doesn't end at installation — we're here whenever you need us.",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Innovation",
    body: "From motorised systems to the latest sheer fabrics, we stay at the frontier of window furnishing technology and design.",
  },
];

const team = [
  {
    name: "Mitul Maniya",
    role: "Co-Founder & Director",
    phone: "+61 414 336 936",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    quote: "Every window tells a story. We make sure it's a beautiful one.",
  },
  {
    name: "Mehul Makarubiya",
    role: "Co-Founder & Operations",
    phone: "+61 481 369 018",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
    quote: "Quality isn't a checkbox — it's the standard we start from.",
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
  /* Scroll reveal */
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
          1. HERO
      ════════════════════════════ */}
      <section className={styles.hero}>
        {/* Parallax image */}
        <div className={styles.heroBgWrap}>
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop"
            alt="Luxurious interior with premium window blinds"
            fill priority
            className={styles.heroBgImg}
            sizes="100vw"
          />
        </div>
        <div className={styles.heroVeil} />

        <div className={styles.heroContent}>
          <motion.span
            className={styles.heroPill}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            <span className={styles.pillDot} /> Our Story
          </motion.span>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease }}
          >
            Crafting Beautiful<br />
            <em>Window Experiences</em><br />
            <span>Since Day One.</span>
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.55, ease }}
          >
            Based in Mitchell, ACT — Capital Blinds &amp; Shades is Canberra&apos;s trusted
            partner for premium custom window furnishings, installed with care.
          </motion.p>

          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            <Link href="/contact" className={styles.btnGold}>
              Book Free Consultation <ArrowRight size={15} />
            </Link>
            <a href="#story" className={styles.btnGlass}>
              Our Story ↓
            </a>
          </motion.div>
        </div>

        {/* Wave */}
        <div className={styles.wave}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,45 C480,95 960,5 1440,45 L1440,80 L0,80 Z" fill="#f7f3ee" />
          </svg>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollBar} />
          <span className={styles.scrollLabel}>Scroll</span>
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
          3. WHO WE ARE
      ════════════════════════════ */}
      <section className={styles.story} id="story">
        <div className={styles.wrap}>
          <div className={styles.storyGrid}>

            {/* Images column */}
            <motion.div
              className={styles.storyImgs}
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Main large image */}
              <div className={styles.imgMain}>
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=900&auto=format&fit=crop"
                  alt="Premium sheer curtains in beautiful living room"
                  fill
                  className={styles.imgEl}
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                {/* Floating badge */}
                <div className={styles.imgBadge}>
                  <Award size={20} className={styles.badgeIcon} />
                  <div>
                    <strong>ACT&apos;s #1</strong>
                    <span>Window Specialists</span>
                  </div>
                </div>
              </div>

              {/* Small accent image */}
              <div className={styles.imgAccent}>
                <Image
                  src="https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?q=80&w=600&auto=format&fit=crop"
                  alt="Plantation shutters in modern bedroom"
                  fill
                  className={styles.imgEl}
                  sizes="280px"
                />
              </div>

              {/* Experience pill */}
              <div className={styles.expPill}>
                <span className={styles.expNum}>15+</span>
                <span className={styles.expLabel}>Years of craftsmanship</span>
              </div>
            </motion.div>

            {/* Text column */}
            <motion.div
              className={styles.storyCopy}
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className={styles.eyebrow}>Who We Are</span>
              <h2 className={styles.h2Dark}>
                Canberra&apos;s Premium <em>Window Furnishing</em> Specialists
              </h2>
              <p className={styles.storyP}>
                Based in Mitchell, ACT, <strong>Capital Blinds &amp; Shades</strong> was
                founded on a single belief: every home deserves windows that are both
                beautiful and functional. Since our first installation, we have grown into
                Canberra&apos;s most trusted name for custom blinds, shutters, curtains
                and motorised solutions.
              </p>
              <p className={styles.storyP}>
                Founded by <strong>Mitul Maniya</strong> and <strong>Mehul Makarubiya</strong>,
                our philosophy is simple — <em>&ldquo;Style your space. Elevate your living.&rdquo;</em>{" "}
                We believe the right window treatment transforms a room from a space you live in
                to one you truly love.
              </p>

              <motion.ul
                className={styles.featureList}
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {features.map((f, i) => (
                  <motion.li key={i} className={styles.featureItem} variants={fadeUp} custom={i * 0.07}>
                    <span className={styles.featureCheck}><CheckCircle2 size={17} /></span>
                    <span>{f}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <Link href="/contact" className={styles.btnOutline}>
                Start Your Free Measure <ArrowRight size={14} />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ════════════════════════════
          4. VALUES
      ════════════════════════════ */}
      <section className={styles.valuesSection}>
        <div className={styles.wrap}>
          <div className={`${styles.valuesHead} ${styles.sr}`}>
            <span className={styles.eyebrow}>What We Stand For</span>
            <h2 className={styles.h2Light}>Our Core <em>Values.</em></h2>
            <p className={styles.valuesSub}>
              These principles guide every consultation, every product, every installation.
            </p>
          </div>

          <motion.div
            className={styles.valuesGrid}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                className={styles.valueCard}
                variants={fadeUp}
                custom={i * 0.08}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
              >
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueBody}>{v.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ════════════════════════════
          5. FOUNDERS / TEAM
      ════════════════════════════ */}
      <section className={styles.teamSection}>
        <div className={styles.wrap}>
          <div className={`${styles.teamHead} ${styles.sr}`}>
            <span className={styles.eyebrow}>The Founders</span>
            <h2 className={styles.h2Dark}>The People <em>Behind the Craft.</em></h2>
          </div>

          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <motion.div
                key={i}
                className={styles.teamCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, delay: i * 0.15, ease }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
              >
                <div className={styles.teamImgWrap}>
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className={styles.teamImg}
                    sizes="360px"
                  />
                  <div className={styles.teamImgVeil} />
                </div>
                <div className={styles.teamBody}>
                  <p className={styles.teamQuote}>&ldquo;{member.quote}&rdquo;</p>
                  <div className={styles.teamMeta}>
                    <div>
                      <strong className={styles.teamName}>{member.name}</strong>
                      <span className={styles.teamRole}>{member.role}</span>
                    </div>
                    <a href={`tel:${member.phone.replace(/\s/g, "")}`} className={styles.teamPhone}>
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
          6. LOCATION STRIP
      ════════════════════════════ */}
      <div className={`${styles.locationStrip} ${styles.sr}`}>
        <div className={styles.locationItem}>
          <MapPin size={18} className={styles.locIcon} />
          <span>21 Huddart Court, Mitchell, ACT 2911</span>
        </div>
        <div className={styles.locationItem}>
          <Phone size={18} className={styles.locIcon} />
          <a href="tel:+61414336936">+61 414 336 936</a>
        </div>
        <div className={styles.locationItem}>
          <Mail size={18} className={styles.locIcon} />
          <a href="mailto:sales@capitalblindandshades.com.au">sales@capitalblindandshades.com.au</a>
        </div>
        <div className={styles.locationItem}>
          <Star size={18} className={styles.locIcon} />
          <span>★★★★★ 5.0 Google Rating</span>
        </div>
      </div>


      {/* ════════════════════════════
          7. CTA BAND
      ════════════════════════════ */}
      <section className={`${styles.cta} ${styles.sr}`}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaInner}>
          <div>
            <span className={styles.eyebrow}>Ready to Transform Your Home?</span>
            <h2 className={styles.ctaTitle}>
              Let&apos;s Create Your <em>Perfect Space.</em>
            </h2>
            <p className={styles.ctaSub}>
              Book a free in-home consultation — we measure, advise, and install.
              Zero obligation, full expert guidance.
            </p>
          </div>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className={styles.btnGold}>
              Book Free Measure <ArrowRight size={15} />
            </Link>
            <Link href="/services" className={styles.btnMuted}>
              View All Products →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
