"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import styles from "./Navbar.module.css";
import { BrandLogo } from "./BrandLogo";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/services", label: "PRODUCTS" },
  { href: "/about", label: "ABOUT US" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.nav}>
        
        {/* LOGO */}
        <BrandLogo size="sm" href="/" />

        {/* EXACT CENTERED LINKS */}
        <div className={styles.links}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.activeLink : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* EXACT RIGHT BUTTON */}
        <a href="https://wa.me/61481369018" target="_blank" rel="noopener noreferrer" className={styles.whatsappNavBtn}>
          <MessageCircle size={18} /> WhatsApp
        </a>

        {/* MOBILE MENU BUTTON */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* MOBILE NAV OVERLAY */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
          <div className={styles.mobileLinks}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileLink} ${pathname === link.href ? styles.activeMobileLink : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a href="https://wa.me/61481369018" target="_blank" rel="noopener noreferrer" className={styles.mobileWhatsappBtn} onClick={() => setMenuOpen(false)}>
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>

      </nav>
    </header>
  );
}
