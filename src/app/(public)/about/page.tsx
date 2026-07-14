"use client";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, Users, Target, ShieldCheck } from "lucide-react";
import styles from "./page.module.css";
import Image from "next/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function AboutPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className={styles.heroContent}>
          <span className={styles.badge}>Our Story</span>
          <h1>About Capital Print & Sign</h1>
          <p>Australia's trusted partner for premium printing, signage, and corporate branding.</p>
        </motion.div>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={styles.textContent}>
            <h2>Who We Are</h2>
            <p>Based in Mitchell, ACT, <strong>Capital Print & Sign</strong> is a premier printing and signage agency dedicated to helping businesses make a lasting impression.</p>
            <p>Founded by Mitul Maniya and Mehul Makarubiya, our company was built on a simple philosophy: <em>We Print. You Shine.</em> We believe that your brand's physical presence is just as important as its digital one.</p>
            
            <div className={styles.featuresList}>
              {[
                "State-of-the-art printing technology",
                "Expert in-house design team",
                "Professional installation services",
                "Commitment to sustainable materials"
              ].map((item, i) => (
                <div key={i} className={styles.featureItem}>
                  <CheckCircle2 color="var(--color-primary)" size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className={styles.imageGrid}>
            <div className={styles.imageBox}>
              <Image src="https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&w=600&q=80" alt="Team meeting" fill style={{ objectFit: "cover" }} />
            </div>
            <div className={styles.imageBox} style={{ marginTop: "2rem" }}>
              <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80" alt="Creative work" fill style={{ objectFit: "cover" }} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className={styles.section}>
          <h2 style={{ textAlign: "center", marginBottom: "4rem", fontSize: "2.5rem" }}>Our Core Values</h2>
          <div className={styles.valuesGrid}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={styles.valueCard}>
              <div className={styles.iconWrapper}><Target size={32} /></div>
              <h3>Excellence</h3>
              <p>We never compromise on quality. Every project that leaves our facility meets the highest industry standards.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={styles.valueCard}>
              <div className={styles.iconWrapper}><Users size={32} /></div>
              <h3>Partnership</h3>
              <p>We view our clients as partners. Your success is our success, and we work collaboratively to achieve your goals.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={styles.valueCard}>
              <div className={styles.iconWrapper}><ShieldCheck size={32} /></div>
              <h3>Reliability</h3>
              <p>When we commit to a deadline, we deliver. You can count on us for consistent, on-time performance.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
