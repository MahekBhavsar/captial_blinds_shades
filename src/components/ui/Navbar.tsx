"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { SettingsDocument } from "@/lib/schema";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SettingsDocument | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SettingsDocument);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <nav className={styles.nav}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image
              src="/CPS-SecondaryLogo.png"
              alt="Capital Print & Sign Logo"
              width={220}
              height={70}
              style={{ objectFit: "contain" }}
              priority
            />
            <div className={styles.logoText}>
              <span className={styles.logoMain}>
                Capital Print <span className={styles.logoAmp}>&</span> Sign
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className={styles.links}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${pathname === link.href ? styles.activeLink : ""}`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className={styles.activeDot} />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className={styles.actions}>
            <Link
              href={`https://wa.me/${settings?.whatsapp || "61481369018"}`}
              target="_blank"
              className={styles.whatsapp}
              aria-label="WhatsApp"
            >
              <MessageCircle size={16} />
              WhatsApp
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={styles.mobileMenu}
            >
              <div className={styles.mobileMenuInner}>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className={`${styles.mobileLink} ${pathname === link.href ? styles.activeMobileLink : ""}`}
                    >
                      {link.label}
                      {pathname === link.href && <span className={styles.mobileDot} />}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={styles.mobileCtas}
                >
                  <Link
                    href={`https://wa.me/${settings?.whatsapp || "61481369018"}`}
                    target="_blank"
                    className={styles.mobileWhatsapp}
                  >
                    <MessageCircle size={16} />
                    Chat on WhatsApp
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating WhatsApp Button */}
      <Link
        href={`https://wa.me/${settings?.whatsapp || "61481369018"}`}
        target="_blank"
        className={styles.floatingWhatsapp}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </Link>
    </>
  );
}
