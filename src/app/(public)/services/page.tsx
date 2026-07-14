"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { collections } from "@/lib/firebase";
import { getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import type { ServiceDocument } from "@/lib/schema";
import {
  CarFront, Store, Printer, ImageIcon, Tag, Palette,
  LayoutPanelLeft, Square, Lightbulb, ShieldAlert,
  HardHat, Brush, Wrench, Signpost, Frame, PanelTop, FileImage, X, LayoutDashboard,
  Car, Flag, PictureInPicture, Sticker, AppWindow, PaintRoller, Contact, FileText, Image as LucideImage, Navigation, PenTool
} from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Hardcoded services removed as requested, now fully relying on database
const iconMap: Record<string, React.ReactNode> = {
  CarFront: <CarFront size={36} />,
  Store: <Store size={36} />,
  Printer: <Printer size={36} />,
  ImageIcon: <ImageIcon size={36} />,
  Tag: <Tag size={36} />,
  Palette: <Palette size={36} />,
  LayoutPanelLeft: <LayoutPanelLeft size={36} />,
  Square: <Square size={36} />,
  Lightbulb: <Lightbulb size={36} />,
  ShieldAlert: <ShieldAlert size={36} />,
  HardHat: <HardHat size={36} />,
  Brush: <Brush size={36} />,
  Wrench: <Wrench size={36} />,
  Signpost: <Signpost size={36} />,
  Frame: <Frame size={36} />,
  PanelTop: <PanelTop size={36} />,
  FileImage: <FileImage size={36} />,
  Car: <Car size={36} />,
  Flag: <Flag size={36} />,
  PictureInPicture: <PictureInPicture size={36} />,
  Sticker: <Sticker size={36} />,
  AppWindow: <AppWindow size={36} />,
  PaintRoller: <PaintRoller size={36} />,
  Contact: <Contact size={36} />,
  FileText: <FileText size={36} />,
  Image: <LucideImage size={36} />,
  Navigation: <Navigation size={36} />,
  PenTool: <PenTool size={36} />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function HighlightedText({ text, wordsToHighlight }: { text: string, wordsToHighlight?: string[] }) {
  if (!text) return null;

  // Pre-process common patterns to add formatting
  let formattedText = text.replace(/\s*->/g, '\n• ');
  formattedText = formattedText.replace(/Services Included\s*:/gi, '\n**Services Included:**\n');

  const highlightLine = (line: string) => {
    if (!wordsToHighlight || wordsToHighlight.length === 0) return <span>{line}</span>;
    
    let parts = [{ text: line, isHighlight: false }];
    
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
              padding: "2px 0",
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
  };

  const lines = formattedText.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return null; // skip empty lines

        // Handle bullet points
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.substring(2);
          return (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', paddingLeft: '1.5rem', margin: '0.1rem 0' }}>
              <span style={{ color: '#0f172a' }}>•</span>
              <span>{highlightLine(content)}</span>
            </div>
          );
        }

        // Handle bold headers
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          return (
            <strong key={index} style={{ display: 'block', marginTop: '1rem', color: '#0f172a' }}>
              {highlightLine(trimmed.replace(/\*\*/g, ''))}
            </strong>
          );
        }

        // Just regular text paragraph
        return (
          <div key={index} style={{ marginBottom: '0.5rem' }}>
            {highlightLine(line)}
          </div>
        );
      })}
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceDocument | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collections.services, orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <motion.div initial="hidden" animate="visible" variants={{
          hidden: { opacity: 0, y: 40, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
        }} className={styles.heroContent}>
          <span className={styles.badge}>Our Services</span>
          <h1>Premium Printing &amp; Signage Solutions</h1>
          <p>From vehicle wraps to shopfront signs — we bring your brand to life with exceptional quality and craftsmanship.</p>
          <Link href="/contact" className={styles.heroBtn}>Get a Free Quote</Link>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className={styles.section}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>Loading services...</div>
        ) : (
          <div className={styles.grid}>
            {services.map((service, i) => (
              <motion.div
                key={service.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className={styles.card}
                onClick={() => setSelectedService(service)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.iconBox} style={{ color: service.color, background: `${service.color}18` }}>
                  {iconMap[service.iconName] || <LayoutDashboard size={36} />}
                </div>
                <h3>{service.title}</h3>
                <div className={styles.cardDesc}>
                  <HighlightedText text={service.desc} wordsToHighlight={service.importantWords} />
                </div>
                <div className={styles.cardLink} style={{ color: service.color, marginTop: 'auto', paddingTop: '1rem' }}>
                  Learn More →
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Popup Modal */}
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
                maxHeight: "90vh", overflowY: "auto"
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
                  {iconMap[selectedService.iconName]}
                </div>
                <h2 style={{ margin: 0, fontSize: "1.8rem", color: "#1e293b" }}>{selectedService.title}</h2>
              </div>
              
              <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", color: "#0f172a", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Service Description</h4>
                <div style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#475569", margin: 0 }}>
                  <HighlightedText text={selectedService.longContent || selectedService.desc} wordsToHighlight={selectedService.importantWords} />
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <Button variant="secondary" onClick={() => setSelectedService(null)}>Close</Button>
                <Button variant="primary" href="/contact">Get a Quote for this</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Can&apos;t find what you need?</h2>
        <p>We do custom projects too. Talk to our team about your unique requirements.</p>
        <Link href="/contact" className={styles.ctaBtn}>Contact Our Team</Link>
      </section>
    </main>
  );
}
