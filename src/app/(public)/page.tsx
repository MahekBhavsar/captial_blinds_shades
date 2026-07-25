"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Ruler,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Star,
  Award,
  Home as HomeIcon,
  Zap,
} from "lucide-react";
import styles from "./page.module.css";

const products = [
  { title: "Roller Blinds", desc: "Sleek, versatile & effortless", img: "https://northsolarscreen.com/wp-content/uploads/2013/11/cellular-shades.jpg", span: "tall" },
  { title: "Vertical Blinds", desc: "Perfect for large windows", img: "https://www.norwichsunblinds.co.uk/wp-content/uploads/2016/09/LL-Vertical-blind-Chenille-mauve.jpg", span: "short" },
  { title: "Sheer Curtains", desc: "Soft light, total elegance", img: "https://tse1.mm.bing.net/th/id/OIP.BLCxmNpMUedlL2bTd_1LHgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", span: "short" },
  { title: "Blockout Curtains", desc: "Complete darkness, total comfort", img: "https://tse1.mm.bing.net/th/id/OIP.AtUVQdiSU-GrQ4LUgw7SBAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", span: "short" },
  { title: "Verishade Blinds", desc: "Curtains meets blinds", img: "https://tse1.mm.bing.net/th/id/OIP.tvnVtAbQu0U0gZXyrMXZPAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", span: "tall" },
  { title: "Plantation Shutters", desc: "Timeless beauty, lasting quality", img: "https://miro.medium.com/max/8524/1*mUueHmsKpysal07B__UzEw.jpeg", span: "tall" },
  { title: "Motorised Solution", desc: "Smart living, effortlessly elevated", img: "https://tse4.mm.bing.net/th/id/OIP.Vjo0ayQqGdIIPOzJ3mzDeQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", span: "short" },
];

const stats = [
  { num: "50+", label: "Homes Transformed" },
  { num: "1+ yr", label: "Industry Experience" },
  { num: "100%", label: "Custom Made" },
  { num: "★ 4.4", label: "Average Rating" },
];

const features = [
  { icon: <Ruler size={20} />, title: "Precision Custom Fit", desc: "Every blind is made-to-measure for your exact window." },
  { icon: <Wrench size={20} />, title: "Expert Installation", desc: "Our trained team handles everything, on time and on budget." },
  { icon: <ShieldCheck size={20} />, title: "Quality Guaranteed", desc: "Premium materials backed by a manufacturer warranty." },
  { icon: <CheckCircle2 size={20} />, title: "Free In-Home Consult", desc: "A design expert visits at no cost to help you choose." },
];

const reviews = [
  { name: "Sarah M.", text: "Absolutely stunning. The team was professional from measure to install. I couldn't be happier.", rating: 5 },
  { name: "James D.", text: "Quality exceeded all expectations. Every detail was perfect. Highly recommend to anyone.", rating: 5 },
  { name: "Priya K.", text: "Transformed our living room completely. The shutters are gorgeous and installation was seamless.", rating: 5 },
];

/* ─── ANIMATION VARIANTS ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/* ─── COMPONENT ─── */
export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeReview, setActiveReview] = useState(0);

  /* Feedback Form State */
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 5000);
    setFeedbackName("");
    setFeedbackRating(5);
    setFeedbackText("");
  };

  /* Auto-advance reviews */
  useEffect(() => {
    const t = setInterval(() => setActiveReview((p) => (p + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* Parallax via Framer Motion */
  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 1000], [0, 250]);

  return (
    <main className={styles.main}>

      {/* ════════════════════════════
          HERO
      ════════════════════════════ */}
      <section className={styles.hero}>

        {/* Parallax background image */}
        <motion.div className={styles.heroBgWrap} style={{ y: yHeroBg }}>
          <Image
            src="/hero-bg.jpg"
            alt="Luxury interior with custom window blinds"
            fill
            priority
            className={styles.heroBgImg}
            onLoad={() => setHeroLoaded(true)}
            sizes="100vw"
          />
        </motion.div>
        <div className={styles.heroVeil} />

        {/* Content */}
        <motion.div 
          className={`${styles.heroContent} ${heroLoaded ? styles.heroVisible : ""}`}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className={styles.heroTag}>
            <span className={styles.heroDot} />
            Premium Window Furnishings · Australia
          </motion.div>

          <motion.h1 variants={fadeUp} className={styles.heroHeading}>
            <span className={styles.hLine1}>Custom Blinds</span>
            <span className={styles.hLine2}>&amp; Curtains</span>
            <span className={styles.hLine3}>Made for <em>Your</em> Home.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className={styles.heroSub}>
            Bespoke window furnishings, crafted to order. Expert installation.
            Timeless quality that transforms every room.
          </motion.p>

          <motion.div variants={fadeUp} className={styles.heroCtas}>
            <Link href="/contact" className={styles.btnSolid}>
              Book Free Measure <ArrowRight size={15} />
            </Link>
            <Link href="/services" className={styles.btnLine}>
              View Collection <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }} 
          className={styles.scrollCue}
        >
          <span className={styles.scrollBar} />
          <span className={styles.scrollLabel}>scroll</span>
        </motion.div>

        {/* Bottom wave divider */}
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,100 L0,100 Z" fill="#f7f3ee" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════
          STATS STRIP
      ════════════════════════════ */}
      <motion.section 
        className={styles.statsStrip}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
      >
        {stats.map((s, i) => (
          <motion.div key={i} variants={fadeUp} className={styles.statItem}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </motion.section>

      {/* ════════════════════════════
          SCROLLING MARQUEE
      ════════════════════════════ */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeInner}>
          {Array(3).fill(["Custom Made", "Free Measure & Quote", "Expert Installation", "Australian Owned", "Premium Materials", "Motorised Options"]).flat().map((t, i) => (
            <span key={i} className={styles.marqueeChip}>
              <span className={styles.marqueeStar}>✦</span> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════
          PRODUCTS GRID
      ════════════════════════════ */}
      <section className={styles.products}>
        <div className={styles.sectionWrap}>
          <motion.div 
            className={styles.sectionHead}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeUp}
          >
            <div>
              <span className={styles.eyebrow}>Our Collection</span>
              <h2 className={styles.h2Light}>
                Crafted for <br /><em>Every Window.</em>
              </h2>
            </div>
            <Link href="/services" className={styles.seeAll}>
              Browse all products <ChevronRight size={16} />
            </Link>
          </motion.div>

          <motion.div 
            className={styles.productGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={staggerContainer}
          >
            {products.slice(0, 3).map((p, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.02 }} transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}>
                <Link
                  href="/services"
                  className={styles.productCard}
                >
                  <div className={styles.productImgBox}>
                    <Image src={p.img} alt={p.title} fill className={styles.productImg} sizes="(max-width:768px) 100vw, 33vw" />
                    <div className={styles.productFade} />
                  </div>
                  <div className={styles.productInfo}>
                    <div>
                      <h3 className={styles.productName}>{p.title}</h3>
                      <p className={styles.productNote}>{p.desc}</p>
                    </div>
                    <span className={styles.productArrow}><ArrowUpRight size={16} /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════
          WHY US — SPLIT
      ════════════════════════════ */}
      <section className={styles.whyUs}>
        <div className={styles.sectionWrap}>
          <div className={styles.whyGrid}>

            {/* Image side */}
            <motion.div 
              className={styles.whyImgSide}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.whyImgFrame}>
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"
                  alt="Premium blinds in a beautiful living room"
                  fill
                  className={styles.whyImg}
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>

              {/* Floating badge */}
              <div className={styles.whyBadge}>
                <Award size={22} color="#c9a84c" />
                <div>
                  <strong>15+ Years</strong>
                  <span>of Excellence</span>
                </div>
              </div>

              {/* Floating review card */}
              <div className={styles.whyReviewCard}>
                <div className={styles.whyReviewStars}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#c9a84c" color="#c9a84c" />)}
                </div>
                <p>&ldquo;Absolutely transformed our home. Couldn&rsquo;t be happier!&rdquo;</p>
                <strong>— Emma R.</strong>
              </div>
            </motion.div>

            {/* Copy side */}
            <motion.div 
              className={styles.whyCopy}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeUp} className={styles.eyebrowDark}>Why Capital Blinds?</motion.span>
              <motion.h2 variants={fadeUp} className={styles.h2Dark}>
                Precision meets <br /><em>Elegance.</em>
              </motion.h2>
              <motion.p variants={fadeUp} className={styles.whyDesc}>
                We don&rsquo;t just sell window furnishings — we craft bespoke solutions
                that transform your home. Every measurement, material, and installation
                is handled by our expert team with uncompromising attention to detail.
              </motion.p>

              <motion.ul variants={staggerContainer} className={styles.featureList}>
                {features.map((f, i) => (
                  <motion.li key={i} variants={fadeUp} className={styles.featureItem}>
                    <span className={styles.featureIcon}>{f.icon}</span>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp}>
                <Link href="/about" className={styles.btnOutline}>
                  Our Story <ArrowRight size={15} />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════
          FEEDBACK FORM
      ════════════════════════════ */}
      <section className={styles.feedbackSection}>
        <div className={styles.sectionWrap} style={{ position: 'relative', zIndex: 2 }}>
          <motion.div 
            className={styles.feedbackContainer}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.feedbackLeft}>
              <span className={styles.eyebrowDark} style={{ marginLeft: "-36px" }}>Share Your Experience</span>
              <h2 className={styles.h2Dark} style={{ textAlign: "left" }}>
                Help us craft <br /><span style={{ color: "var(--gold)" }}>Perfect Spaces.</span>
              </h2>
              <p className={styles.feedbackDesc}>
                Your feedback is invaluable to us. Let us know how we transformed your space and how our team performed during the process.
              </p>
            </div>
            
            <div className={styles.feedbackRight}>
              {feedbackSubmitted ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={styles.feedbackSuccess}
                >
                  <CheckCircle2 size={48} color="var(--gold)" />
                  <h3>Thank You!</h3>
                  <p>We appreciate your valuable feedback.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className={styles.feedbackForm}>
                  <div className={styles.formRow}>
                    <input 
                      type="text" 
                      required 
                      placeholder="Your Name" 
                      className={styles.feedbackInput} 
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                    />
                  </div>
                  <div className={styles.ratingSelect}>
                    <span className={styles.ratingLabel}>Rate your experience:</span>
                    <div className={styles.starsWrap}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          type="button" 
                          key={star} 
                          onClick={() => setFeedbackRating(star)}
                          className={styles.starBtn}
                        >
                          <Star size={24} fill={star <= feedbackRating ? "var(--gold)" : "transparent"} color={star <= feedbackRating ? "var(--gold)" : "rgba(255,255,255,0.2)"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea 
                    required 
                    placeholder="Share your thoughts..." 
                    className={styles.feedbackTextarea}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  ></textarea>
                  <button type="submit" className={styles.btnGold} style={{ width: '100%', justifyContent: 'center' }}>
                    Submit Review <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════
          REVIEWS CAROUSEL
      ════════════════════════════ */}
      <section className={styles.reviews}>
        <div className={styles.sectionWrap}>
          <motion.div 
            className={styles.sectionHead} 
            style={{ justifyContent: "center", textAlign: "center" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <span className={styles.eyebrow}>What Customers Say</span>
              <h2 className={styles.h2Light}>Real Stories. <span style={{ color: "var(--gold)" }}>Real Results.</span></h2>
            </div>
          </motion.div>

          <motion.div 
            className={styles.reviewMarquee}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1 }}
          >
            <div className={styles.reviewTrack}>
              {[...reviews, ...reviews, ...reviews, ...reviews].map((r, i) => (
                <div key={i} className={styles.reviewCard}>
                  <div className={styles.reviewStars}>
                    {[...Array(r.rating)].map((_, j) => <Star key={j} size={14} fill="#c9a84c" color="#c9a84c" />)}
                  </div>
                  <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>
                  <div className={styles.reviewAuthor}>
                    <div className={styles.reviewAvatar}>{r.name[0]}</div>
                    <div>
                      <strong>{r.name}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════
          CTA BAND
      ════════════════════════════ */}
      <motion.section 
        className={styles.ctaBand}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <div>
            <span className={styles.eyebrow}>Get Started Today</span>
            <h2 className={styles.ctaHeading}>
              Ready to Transform <br /><em>Your Home?</em>
            </h2>
            <p className={styles.ctaSub}>
              Book your free in-home measure and consultation — no obligation, just expert advice.
            </p>
          </div>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className={styles.btnSolidDark}>
              Book Free Measure <ArrowRight size={16} />
            </Link>
            <Link href="/services" className={styles.btnTextDark}>
              View Products →
            </Link>
          </div>
        </div>

        {/* Decorative icon grid */}
        <div className={styles.ctaDeco} aria-hidden="true">
          <HomeIcon size={80} strokeWidth={0.5} />
          <Zap size={50} strokeWidth={0.5} />
        </div>
      </motion.section>

    </main>
  );
}
