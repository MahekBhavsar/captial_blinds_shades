"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

/* ─── DATA ─── */
const products = [
  { title: "Roller Blinds", desc: "Sleek, versatile & effortless", img: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=800&auto=format&fit=crop", span: "tall" },
  { title: "Vertical Blinds", desc: "Perfect for floor-to-ceiling windows", img: "https://www.norwichsunblinds.co.uk/wp-content/uploads/2016/09/LL-Vertical-blind-Chenille-mauve.jpg", span: "short" },
  { title: "Sheer Curtains", desc: "Soft light, total elegance", img: "https://tse1.mm.bing.net/th/id/OIP.BLCxmNpMUedlL2bTd_1LHgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", span: "short" },
  { title: "Blockout Curtains", desc: "Complete darkness, total comfort", img: "https://tse1.mm.bing.net/th/id/OIP.AtUVQdiSU-GrQ4LUgw7SBAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", span: "short" },
  { title: "Plantation Shutters", desc: "Timeless beauty, lasting quality", img: "https://miro.medium.com/max/8524/1*mUueHmsKpysal07B__UzEw.jpeg", span: "tall" },
  { title: "Motorised Solutions", desc: "Smart living, effortlessly elevated", img: "https://usshuttersandblinds.com/wp-content/uploads/2026/01/How-do-motorized-blinds-work-2.webp", span: "short" },
];

const stats = [
  { num: "500+", label: "Homes Transformed" },
  { num: "15yr", label: "Industry Experience" },
  { num: "100%", label: "Custom Made" },
  { num: "★ 4.9", label: "Average Rating" },
];

const features = [
  { icon: <Ruler size={20} />, title: "Precision Custom Fit", desc: "Every blind is made-to-measure for your exact window." },
  { icon: <Wrench size={20} />, title: "Expert Installation", desc: "Our trained team handles everything, on time and on budget." },
  { icon: <ShieldCheck size={20} />, title: "Quality Guaranteed", desc: "Premium materials backed by a manufacturer warranty." },
  { icon: <CheckCircle2 size={20} />, title: "Free In-Home Consult", desc: "A design expert visits at no cost to help you choose." },
];

const reviews = [
  { name: "Sarah M.", location: "Melbourne", text: "Absolutely stunning. The team was professional from measure to install. I couldn't be happier.", rating: 5 },
  { name: "James D.", location: "Sydney", text: "Quality exceeded all expectations. Every detail was perfect. Highly recommend to anyone.", rating: 5 },
  { name: "Priya K.", location: "Brisbane", text: "Transformed our living room completely. The shutters are gorgeous and installation was seamless.", rating: 5 },
];


/* ─── COMPONENT ─── */
export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeReview, setActiveReview] = useState(0);

  /* Scroll-reveal */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add(styles.inView); }),
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(`.${styles.reveal}`).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Auto-advance reviews */
  useEffect(() => {
    const t = setInterval(() => setActiveReview((p) => (p + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* Parallax on hero image */
  const heroImgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className={styles.main}>

      {/* ════════════════════════════
          HERO
      ════════════════════════════ */}
      <section className={styles.hero}>

        {/* Parallax background image */}
        <div className={styles.heroBgWrap} ref={heroImgRef}>
          <Image
            src="/hero-bg.jpg"
            alt="Luxury interior with custom window blinds"
            fill
            priority
            className={styles.heroBgImg}
            onLoad={() => setHeroLoaded(true)}
            sizes="100vw"
          />
        </div>
        <div className={styles.heroVeil} />

        {/* Content */}
        <div className={`${styles.heroContent} ${heroLoaded ? styles.heroVisible : ""}`}>
          <div className={styles.heroTag}>
            <span className={styles.heroDot} />
            Premium Window Furnishings · Australia
          </div>

          <h1 className={styles.heroHeading}>
            <span className={styles.hLine1}>Custom Blinds</span>
            <span className={styles.hLine2}>&amp; Curtains</span>
            <span className={styles.hLine3}>Made for <em>Your</em> Home.</span>
          </h1>

          <p className={styles.heroSub}>
            Bespoke window furnishings, crafted to order. Expert installation.
            Timeless quality that transforms every room.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/contact" className={styles.btnSolid}>
              Book Free Measure <ArrowRight size={15} />
            </Link>
            <Link href="/services" className={styles.btnLine}>
              View Collection <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className={styles.scrollCue}>
          <span className={styles.scrollBar} />
          <span className={styles.scrollLabel}>scroll</span>
        </div>

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
      <section className={styles.statsStrip}>
        {stats.map((s, i) => (
          <div key={i} className={`${styles.statItem} ${styles.reveal}`} style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>


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

          <div className={`${styles.sectionHead} ${styles.reveal}`}>
            <div>
              <span className={styles.eyebrow}>Our Collection</span>
              <h2 className={styles.h2Light}>
                Crafted for <br /><em>Every Window.</em>
              </h2>
            </div>
            <Link href="/services" className={styles.seeAll}>
              Browse all products <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.productGrid}>
            {products.map((p, i) => (
              <Link
                href="/services"
                key={i}
                className={`${styles.productCard} ${styles.reveal}`}
                style={{ transitionDelay: `${i * 0.07}s` }}
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
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════
          WHY US — SPLIT
      ════════════════════════════ */}
      <section className={styles.whyUs}>
        <div className={styles.sectionWrap}>
          <div className={styles.whyGrid}>

            {/* Image side */}
            <div className={`${styles.whyImgSide} ${styles.reveal}`}>
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
                <strong>— Emma R., Melbourne</strong>
              </div>
            </div>

            {/* Copy side */}
            <div className={`${styles.whyCopy} ${styles.reveal}`} style={{ transitionDelay: "0.15s" }}>
              <span className={styles.eyebrowDark}>Why Capital Blinds?</span>
              <h2 className={styles.h2Dark}>
                Precision meets <br /><em>Elegance.</em>
              </h2>
              <p className={styles.whyDesc}>
                We don&rsquo;t just sell window furnishings — we craft bespoke solutions
                that transform your home. Every measurement, material, and installation
                is handled by our expert team with uncompromising attention to detail.
              </p>

              <ul className={styles.featureList}>
                {features.map((f, i) => (
                  <li key={i} className={styles.featureItem} style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className={styles.featureIcon}>{f.icon}</span>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link href="/about" className={styles.btnOutline}>
                Our Story <ArrowRight size={15} />
              </Link>
            </div>

          </div>
        </div>
      </section>


      {/* ════════════════════════════
          REVIEWS CAROUSEL
      ════════════════════════════ */}
      <section className={styles.reviews}>
        <div className={styles.sectionWrap}>
          <div className={`${styles.sectionHead} ${styles.reveal}`} style={{ justifyContent: "center", textAlign: "center" }}>
            <div>
              <span className={styles.eyebrow}>What Customers Say</span>
              <h2 className={styles.h2Light}>Real Stories. <em>Real Results.</em></h2>
            </div>
          </div>

          <div className={`${styles.reviewMarquee} ${styles.reveal}`}>
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
                      <span>{r.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════
          CTA BAND
      ════════════════════════════ */}
      <section className={`${styles.ctaBand} ${styles.reveal}`}>
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
      </section>

    </main>
  );
}
