"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, FileSignature } from "lucide-react";
import styles from "./Navbar.module.css";

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
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.png"
            alt="Capital Blinds and Shades"
            width={56}
            height={56}
            className={styles.logoImage}
            priority
          />
          <div className={styles.logoText}>
            <span className={styles.logoMain}>CAPITAL</span>
            <span className={styles.logoTag}>BLINDS AND SHADES</span>
          </div>
        </Link>

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
        <Link href="/contact" className={styles.ctaBtn}>
          <FileSignature size={14} /> BOOK FREE MEASURE
        </Link>

        {/* MOBILE MENU */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={24} />
        </button>

      </nav>
    </header>
  );
}
