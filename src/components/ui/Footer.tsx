"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import styles from "./Footer.module.css";

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTopBorder} />

      <div className={styles.content}>
        {/* COL 1: Brand */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Capital Blinds and Shades"
              width={56}
              height={56}
              className={styles.logoImage}
            />
            <div className={styles.logoText}>
              <span className={styles.logoMain}>CAPITAL</span>
              <span className={styles.logoTag}>BLINDS AND SHADES</span>
            </div>
          </Link>
          <p className={styles.brandDesc}>
            Style your space.<br />
            Elevate your living.
          </p>
          <div className={styles.socialLinks}>
            <Link href="#" className={styles.socialLink} aria-label="Facebook"><FacebookIcon size={16} /></Link>
            <Link href="#" className={styles.socialLink} aria-label="Instagram"><InstagramIcon size={16} /></Link>
          </div>
        </div>

        {/* COL 2: Quick Links */}
        <div>
          <h4 className={styles.colTitle}>QUICK LINKS</h4>
          <ul className={styles.linkList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Products</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>


        {/* COL 4: Contact & Map */}
        <div>
          <h4 className={styles.colTitle}>CONTACT US</h4>
          <div className={styles.contactWrap}>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <Phone size={14} className={styles.contactIcon} />
                <div>
                  Mitul Maniya<br />
                  <Link href="tel:+61414336936">+61 414 336 936</Link>
                </div>
              </li>
              <li className={styles.contactItem}>
                <Phone size={14} className={styles.contactIcon} />
                <div>
                  Mehul Makarubiya<br />
                  <Link href="tel:+61481369018">+61 481 369 018</Link>
                </div>
              </li>
              <li className={styles.contactItem}>
                <Mail size={14} className={styles.contactIcon} />
                <Link href="mailto:sales@capitalblindandshades.com.au">sales@capitalblindandshades.com.au</Link>
              </li>
              <li className={styles.contactItem}>
                <MapPin size={14} className={styles.contactIcon} />
                <span>21 Huddart Court,<br />Mitchell, ACT 2911</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <span>&copy; {new Date().getFullYear()} Capital Blinds and Shades. All Rights Reserved.</span>
        <div className={styles.legalLinks}>
          <Link href="#">Privacy Policy</Link>
          <span>|</span>
          <Link href="#">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
