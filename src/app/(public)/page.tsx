"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer, CarFront, Store, FileText, BadgeCheck, Clock,
  ShieldCheck, Star, ChevronDown, ArrowRight, Award, Users2, Zap,
  ImageIcon, Tag, Palette, LayoutPanelLeft, Square, Lightbulb,
  ShieldAlert, HardHat, Brush, Wrench, Signpost, Frame, PanelTop, FileImage, X, LayoutDashboard,
  Car, Flag, PictureInPicture, Sticker, AppWindow, PaintRoller, Contact, Image as LucideImage, Navigation, PenTool
} from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collections } from "@/lib/firebase";
import { getDocs, query, orderBy, addDoc, deleteDoc } from "firebase/firestore";
import type { ServiceDocument, TestimonialDocument } from "@/lib/schema";

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const whyChooseUs = [
  { icon: <BadgeCheck size={22} />, title: "Premium Quality Materials", desc: "Only the finest vinyls, inks and substrates used on every job." },
  { icon: <Clock size={22} />, title: "Fast Turnaround", desc: "Standard orders ready in 3–5 business days, rush available." },
  { icon: <ShieldCheck size={22} />, title: "Satisfaction Guaranteed", desc: "We don't rest until you're 100% happy with the result." },
  { icon: <Award size={22} />, title: "Professional Installation", desc: "Expert fitters who get it right the first time, every time." },
  { icon: <Users2 size={22} />, title: "Creative Designers", desc: "Our in-house team brings your brand vision to life." },
  { icon: <Zap size={22} />, title: "Local Australian Support", desc: "Real people, right here in Canberra. Always reachable." },
];

const faqs = [
  { q: "What artwork formats do you accept?", a: "We accept PDF, AI, EPS, PSD, SVG, JPG, and PNG files in high resolution (300 DPI or higher). For vector formats like AI and EPS, all fonts must be outlined." },
  { q: "Can you design my artwork?", a: "Absolutely! Our creative team offers full graphic design services from concept to final artwork. We'll work with you to capture your brand identity perfectly." },
  { q: "How long does printing take?", a: "Standard orders take 3–5 business days. Rush services (1–2 days) are available for most products. Large format or complex installation jobs may require additional time." },
  { q: "Do you install signage?", a: "Yes — we offer professional installation services across Canberra and surrounding regions. Our experienced team handles everything from shopfront signs to vehicle wraps." },
  { q: "What areas do you service?", a: "We're based in Mitchell, ACT and service the greater Canberra region, including Queanbeyan, Fyshwick, and surrounding NSW areas. Delivery is available Australia-wide." },
];

const iconMap: Record<string, React.ReactNode> = {
  CarFront: <CarFront size={32} />,
  Store: <Store size={32} />,
  Printer: <Printer size={32} />,
  FileText: <FileText size={32} />,
  ImageIcon: <ImageIcon size={32} />,
  Tag: <Tag size={32} />,
  Palette: <Palette size={32} />,
  LayoutPanelLeft: <LayoutPanelLeft size={32} />,
  Square: <Square size={32} />,
  Lightbulb: <Lightbulb size={32} />,
  ShieldAlert: <ShieldAlert size={32} />,
  HardHat: <HardHat size={32} />,
  Brush: <Brush size={32} />,
  Wrench: <Wrench size={32} />,
  Signpost: <Signpost size={32} />,
  Frame: <Frame size={32} />,
  PanelTop: <PanelTop size={32} />,
  FileImage: <FileImage size={32} />,
  Car: <Car size={32} />,
  Flag: <Flag size={32} />,
  PictureInPicture: <PictureInPicture size={32} />,
  Sticker: <Sticker size={32} />,
  AppWindow: <AppWindow size={32} />,
  PaintRoller: <PaintRoller size={32} />,
  Contact: <Contact size={32} />,
  Image: <LucideImage size={32} />,
  Navigation: <Navigation size={32} />,
  PenTool: <PenTool size={32} />,
};

function HighlightedText({ text, wordsToHighlight }: { text: string, wordsToHighlight?: string[] }) {
  if (!wordsToHighlight || wordsToHighlight.length === 0) return <>{text}</>;

  let parts = [{ text, isHighlight: false }];

  wordsToHighlight.forEach(word => {
    if (!word.trim()) return;
    const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const newParts: { text: string, isHighlight: boolean }[] = [];

    parts.forEach(part => {
      if (part.isHighlight) {
        newParts.push(part);
      } else {
        const splitText = part.text.split(regex);
        splitText.forEach(splitPart => {
          if (splitPart.toLowerCase() === word.toLowerCase()) {
            newParts.push({ text: splitPart, isHighlight: true });
          } else if (splitPart) {
            newParts.push({ text: splitPart, isHighlight: false });
          }
        });
      }
    });
    parts = newParts;
  });

  return (
    <>
      {parts.map((part, i) =>
        part.isHighlight ? (
          <span key={i} style={{
            color: "var(--accent-color)",
            fontWeight: 600,
            background: "linear-gradient(120deg, rgba(230,166,35,0.2) 0%, rgba(230,166,35,0) 100%)",
            padding: "0 4px",
            borderRadius: "4px"
          }}>
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceDocument | null>(null);

  const [testimonials, setTestimonials] = useState<TestimonialDocument[]>([]);

  const [feedbackData, setFeedbackData] = useState({ clientName: '', companyName: '', rating: 5, content: '' });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    const seedTestimonials = async () => {
      try {
        const testmQuery = query(collections.testimonials);
        const testmSnapshot = await getDocs(testmQuery);
        // Only run if there are exactly 5 (the previous seed)
        if (testmSnapshot.docs.length === 5) {
          console.log("Deleting old testimonials...");
          for (const doc of testmSnapshot.docs) {
            await deleteDoc(doc.ref);
          }

          console.log("Seeding 10 new testimonials...");
          const fakeReviews = [
            { clientName: "David M.", companyName: "Retail Group", rating: 5, content: "The best printing service in Canberra. Our shopfront looks amazing!", status: "Approved", featured: true, createdAt: new Date() },
            { clientName: "Sarah L.", companyName: "Logistics Pro", rating: 5, content: "Capital Print & Sign delivered our fleet wraps ahead of schedule. The quality is exceptional.", status: "Approved", featured: true, createdAt: new Date() },
            { clientName: "Tom H.", companyName: "Event Co.", rating: 5, content: "We needed urgent banners for an event and they delivered within 24 hours. Lifesavers!", status: "Approved", featured: true, createdAt: new Date() },
            { clientName: "Jessica K.", companyName: "K-Dining", rating: 5, content: "The 3D illuminated signs they installed for our restaurant have doubled our foot traffic.", status: "Approved", featured: true, createdAt: new Date() },
            { clientName: "Michael R.", companyName: "Tech Solutions", rating: 4, content: "Professional, fast, and highly communicative. The window frosting looks perfect.", status: "Approved", featured: true, createdAt: new Date() },
            { clientName: "Amanda B.", companyName: "Corporate Inc", rating: 5, content: "We've used them for all our corporate printing for 5 years. Always consistent.", status: "Approved", featured: true, createdAt: new Date() },
            { clientName: "Chris P.", companyName: "Design Agency", rating: 5, content: "Their design team helped us rebrand entirely. The new signage is world-class.", status: "Approved", featured: true, createdAt: new Date() },
            { clientName: "John D.", companyName: "BuildIt Construction", rating: 5, content: "Highest quality mesh banners we've ever used on our construction sites. Very durable.", status: "Approved", featured: true, createdAt: new Date() },
            { clientName: "Lisa W.", companyName: "W-Real Estate", rating: 5, content: "Installation was completely hassle-free. They worked around our business hours.", status: "Approved", featured: true, createdAt: new Date() },
            { clientName: "Mark T.", companyName: "Startup Co.", rating: 5, content: "From business cards to huge outdoor signs, they handle it all with perfect attention to detail.", status: "Approved", featured: true, createdAt: new Date() }
          ];
          for (const review of fakeReviews) {
            await addDoc(collections.testimonials, review);
          }
          console.log("10 Testimonials seeded!");
        }
      } catch (err) {
        console.error("Error seeding testimonials:", err);
      }
    };

    seedTestimonials();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const svcQuery = query(collections.services, orderBy("order", "asc"));
        const svcSnapshot = await getDocs(svcQuery);
        const allServices = svcSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as ServiceDocument }));
        
        const mainServiceTitles = ["Flyers & Brochures", "Custom Design", "Professional Printing", "Expert Installation"];
        const filteredServices = allServices.filter(s => mainServiceTitles.includes(s.title));
        
        setServices(filteredServices);
        setLoadingServices(false);

        const testmQuery = query(collections.testimonials, orderBy("createdAt", "desc"));
        const testmSnapshot = await getDocs(testmQuery);
        setTestimonials(testmSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as TestimonialDocument })));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackData.clientName || !feedbackData.content) return;
    setSubmittingFeedback(true);
    try {
      const newTestimonial = {
        ...feedbackData,
        featured: false,
        createdAt: new Date(),
      };
      await addDoc(collections.testimonials, newTestimonial);
      setFeedbackSuccess(true);
      setTestimonials(prev => [newTestimonial as TestimonialDocument, ...prev]);
      setFeedbackData({ clientName: '', companyName: '', rating: 5, content: '' });
      setTimeout(() => setFeedbackSuccess(false), 5000);
    } catch (err) {
      console.error("Error submitting feedback", err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <main className={styles.container}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroMesh} />
        <div className={styles.heroGlowLeft} />
        <div className={styles.heroGlowRight} />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className={styles.heroContent}
        >
          <motion.div variants={fadeUp} className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Australia&apos;s Premium Print &amp; Sign Partner
          </motion.div>

          <motion.h1 variants={fadeUp} className={styles.heroTitle}>
            Your Brand Deserves{" "}
            <span className={styles.heroGradientText}>to Be Seen.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className={styles.heroSubtitle}>
            Capital Print &amp; Sign delivers premium printing, signage, vehicle wraps,
            branding, and installation services that help Australian businesses
            stand out with confidence.
          </motion.p>

          <motion.div variants={fadeUp} className={styles.buttonGroup}>
            <Button variant="primary" href="/contact">Get Free Quote</Button>
            <Button variant="outline-light" href="/services">Explore Services</Button>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={staggerContainer}
          className={styles.stats}
        >
          {[
            { number: "1000+", label: "Designs Delivered" },
            { number: "250+", label: "Clients" },
            { number: "2+", label: "Years" },
            { number: "100%", label: "Satisfaction" },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className={styles.statItem}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── ABOUT SPLIT ── */}
      <section className={styles.section}>
        <div className={styles.aboutSplit}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={fadeUp}
            className={styles.aboutTextContainer}
          >
            <span className={styles.sectionBadge}>Our Story</span>
            <h2 className={styles.sectionTitleLeft}>Crafting Impressions That Last.</h2>
            <p className={styles.aboutTextLeft}>
              At Capital Print &amp; Sign, we don't just print — we bring brands to life. From sleek
              business cards to massive shopfront transformations and eye-catching vehicle wraps, we
              combine premium quality materials with cutting-edge technology.
            </p>
            <p className={styles.aboutTextLeft} style={{ marginTop: "1rem" }}>
              Whether you are launching a new business or refreshing your established brand, our
              experienced creative team guarantees exceptional results, fast turnaround times, and a
              flawless finish every single time.
            </p>
            <div style={{ marginTop: "2rem" }}>
              <Button variant="secondary" href="/about">Discover Our Story</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className={styles.aboutImageWrapper}
          >
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
              alt="Capital Print Team at work"
              className={styles.aboutImage}
            />
            <div className={styles.aboutExperienceBadge}>
              <span className={styles.experienceNumber}>2+</span>
              <span className={styles.experienceText}>Years of<br />Excellence</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}>
            <span className={styles.sectionBadgeCentered}>What We Do</span>
            <h2 className={styles.sectionTitle}>Premium Services</h2>
            <p className={styles.sectionSubtitle}>
              We combine creativity, quality materials, and expert craftsmanship to deliver results that wow.
            </p>
          </motion.div>

          {loadingServices ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>Loading services...</div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={staggerContainer}
              className={styles.servicesGrid}
            >
              {services.map((service, idx) => (
                <motion.div key={idx} variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                  <Card className={styles.serviceCard} onClick={() => setSelectedService(service)} style={{ cursor: "pointer" }}>
                    <div className={styles.serviceIcon} style={{ color: service.color, background: `${service.color}18` }}>
                      {iconMap[service.iconName] || <LayoutDashboard size={32} />}
                    </div>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.serviceDesc}>
                      <HighlightedText text={service.desc} wordsToHighlight={service.importantWords} />
                    </p>
                    <div className={styles.serviceLink} style={{ color: service.color, marginTop: 'auto', paddingTop: '1rem' }}>
                      Learn more <ArrowRight size={14} />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Button variant="secondary" href="/services">View All Services</Button>
          </div>
        </div>
      </section>

      {/* Popup Modal for Services */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
              zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "1rem"
            }}
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "#fff", borderRadius: "16px", padding: "2rem",
                maxWidth: "600px", width: "100%", position: "relative",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                textAlign: "left"
              }}
            >
              <button
                onClick={() => setSelectedService(null)}
                style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={24} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ color: selectedService.color, background: `${selectedService.color}18`, padding: "1rem", borderRadius: "12px", display: "flex" }}>
                  {iconMap[selectedService.iconName] || <LayoutDashboard size={32} />}
                </div>
                <h2 style={{ margin: 0, fontSize: "1.8rem", color: "#1e293b" }}>{selectedService.title}</h2>
              </div>

              <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", color: "#0f172a", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Service Description</h4>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#475569", margin: 0 }}>
                  <HighlightedText text={selectedService.longContent || selectedService.desc} wordsToHighlight={selectedService.importantWords} />
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <Button variant="secondary" onClick={() => setSelectedService(null)}>Close</Button>
                <Button variant="primary" href="/contact">Get a Quote for this</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WHY CHOOSE US ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}>
            <span className={styles.sectionBadgeCentered}>Why Us</span>
            <h2 className={styles.sectionTitle}>Why Choose Capital Print &amp; Sign</h2>
            <p className={styles.sectionSubtitle}>
              We go beyond printing — we deliver a complete brand experience.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={staggerContainer}
            className={styles.whyGrid}
          >
            {whyChooseUs.map((item, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }} className={styles.whyCard}>
                <div className={styles.whyIconBox}>{item.icon}</div>
                <div>
                  <h4 className={styles.whyTitle}>{item.title}</h4>
                  <p className={styles.whyDesc}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}>
            <span className={styles.sectionBadgeCentered}>How It Works</span>
            <h2 className={styles.sectionTitle}>Our Process</h2>
            <p className={styles.sectionSubtitle}>From concept to completion — seamless and stress-free.</p>
          </motion.div>

          <div className={styles.processGrid}>
            {[
              "Consultation", "Design", "Proof Approval",
              "Production", "Quality Check", "Installation", "Delivery & Support"
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className={styles.processStep}
              >
                <div className={styles.processNumber}>{i + 1}</div>
                <h4 className={styles.processLabel}>{step}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (ANIMATED) ── */}
      <section className={styles.section} style={{ overflow: "hidden" }}>
        <div className={styles.sectionInner}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}>
            <span className={styles.sectionBadgeCentered}>Reviews</span>
            <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
            <p className={styles.sectionSubtitle}>Don't just take our word for it.</p>
          </motion.div>
        </div>

        {testimonials.length > 0 ? (
          <div style={{ width: "100%", overflow: "hidden", marginTop: "2rem", display: "flex", position: "relative" }}>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100vw" }}
              transition={{ repeat: Infinity, ease: "linear", duration: Math.max(25, testimonials.length * 6) }}
              style={{ display: "flex", flexDirection: "row-reverse", alignItems: "stretch", gap: "2rem", width: "max-content", paddingRight: "2rem" }}
            >
              {testimonials.map((t, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03, y: -5 }} transition={{ duration: 0.2 }} style={{ display: "flex" }}>
                  <Card className={styles.testimonialCard} style={{ width: "350px", flexShrink: 0, display: "flex", flexDirection: "column", height: "100%" }}>
                    <div className={styles.stars}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} size={15} fill={s < (t.rating || 5) ? "#E6A623" : "none"} stroke={s < (t.rating || 5) ? "#E6A623" : "#cbd5e1"} />
                      ))}
                    </div>
                    <p className={styles.testimonialQuote} style={{ flexGrow: 1 }}>&ldquo;{t.content}&rdquo;</p>
                    <div className={styles.testimonialAuthor}>
                      <div className={styles.testimonialAvatar}>{t.clientName.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className={styles.testimonialName}>{t.clientName}</div>
                        <div className={styles.testimonialRole}>{t.companyName || "Client"}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#64748b" }}>No testimonials yet. Be the first to leave one below!</div>
        )}
      </section>

      {/* ── FEEDBACK FORM (PREMIUM DARK LAYOUT) ── */}
      <section className={styles.feedbackSection}>
        <div className={styles.feedbackGrid}>
          {/* Left Column: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className={styles.feedbackInfo}
          >
            <span className={styles.sectionBadge} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>Feedback</span>
            <h2>We'd Love to Hear From You</h2>
            <p>Your experience matters to us. Whether it's a massive fleet wrap or a simple batch of business cards, we're constantly striving to deliver world-class quality. Drop us a review and let us know how we did!</p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <h4 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E6A623", marginBottom: "0.25rem" }}>4.9/5</h4>
                <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Average Rating</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <h4 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fff", marginBottom: "0.25rem" }}>500+</h4>
                <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Happy Clients</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.feedbackFormCard}>
              {feedbackSuccess ? (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <div style={{ width: "80px", height: "80px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                    <BadgeCheck size={40} />
                  </div>
                  <h3 style={{ fontSize: "1.8rem", marginBottom: "0.5rem", color: "white" }}>Thank You!</h3>
                  <p style={{ color: "#94a3b8" }}>Your feedback has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                      <label className={styles.darkLabel}>Name *</label>
                      <input
                        required
                        type="text"
                        value={feedbackData.clientName}
                        onChange={e => setFeedbackData({ ...feedbackData, clientName: e.target.value })}
                        className={styles.darkInput}
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className={styles.darkLabel}>Company</label>
                      <input
                        type="text"
                        value={feedbackData.companyName}
                        onChange={e => setFeedbackData({ ...feedbackData, companyName: e.target.value })}
                        className={styles.darkInput}
                        placeholder="Company Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={styles.darkLabel}>Rating</label>
                    <div style={{ display: "flex", gap: "0.25rem", margin: "0.25rem 0" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                          className={styles.starBtn}
                        >
                          <Star size={28} fill={star <= feedbackData.rating ? "#E6A623" : "rgba(255,255,255,0.1)"} stroke={star <= feedbackData.rating ? "#E6A623" : "rgba(255,255,255,0.2)"} style={{ transition: "all 0.2s ease" }} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={styles.darkLabel}>Review *</label>
                    <textarea
                      required
                      value={feedbackData.content}
                      onChange={e => setFeedbackData({ ...feedbackData, content: e.target.value })}
                      className={`${styles.darkInput} ${styles.textarea}`}
                      placeholder="Tell us about your experience..."
                    />
                  </div>

                  <Button variant="primary" style={{ width: "100%", padding: "1rem", fontSize: "1.05rem", marginTop: "0.5rem" }}>
                    {submittingFeedback ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}>
            <span className={styles.sectionBadgeCentered}>FAQ</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>Everything you need to know about our services.</p>
          </motion.div>

          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ delay: i * 0.06 }}
                className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ""}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={styles.faqChevron}
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={styles.faqAnswer}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaWrapper}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.7 }}
          className={styles.cta}
        >
          <div className={styles.ctaGlow} />
          <span className={styles.sectionBadgeCentered} style={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.2)" }}>
            Let&apos;s Work Together
          </span>
          <h2 className={styles.ctaTitle}>
            Ready to Make Your Business<br />Impossible to Ignore?
          </h2>
          <p className={styles.ctaSubtitle}>
            Let&apos;s create something extraordinary for your business.
          </p>
          <div className={styles.ctaButtons}>
            <Button variant="accent" href="/contact">Request Your Free Quote</Button>
            <Button variant="outline-light" href="/services">View Services</Button>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
