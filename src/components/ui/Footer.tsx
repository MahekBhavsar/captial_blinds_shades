"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { SettingsDocument } from "@/lib/schema";

const FacebookIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);



export function Footer() {
  const [settings, setSettings] = useState<SettingsDocument | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SettingsDocument);
      }
    });
    return () => unsub();
  }, []);

  return (
    <footer className={styles.footer}>
      {/* Top gradient border */}
      <div className={styles.footerTopBorder} />

      <div className={styles.content}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.footerLogoContainer}>
            <div className={styles.logoTextureWrapper}>
              <Image
                src="/CPS-SecondaryLogo.png"
                alt="Capital Print & Sign Logo"
                width={180}
                height={60}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>
                Capital Print <span className={styles.logoAmp}>&</span> Sign
              </span>
            </div>
          </Link>
          <p className={styles.brandTagline}>We Print. You Shine.</p>
          <p className={styles.brandDesc}>
            Elevating Australian brands with premium printing, custom signage, and expert installations.
          </p>
          <div className={styles.socialLinks}>
            <Link href={settings?.facebookUrl || "https://facebook.com"} target="_blank" aria-label="Facebook" className={styles.socialLink}>
              <FacebookIcon />
            </Link>
            <Link href={settings?.instagramUrl || "https://instagram.com"} target="_blank" aria-label="Instagram" className={styles.socialLink}>
              <InstagramIcon />
            </Link>

          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.links}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Get a Quote</Link></li>
          </ul>
        </div>



        {/* Contact */}
        <div className={styles.links}>
          <h4>Contact Us</h4>
          <ul>
            <li className={styles.contactItem}>
              <MapPin size={15} className={styles.contactIcon} />
              <span>{settings?.address || "21 Huddart Court, Mitchell, ACT 2911"}</span>
            </li>
            <li className={styles.contactItem}>
              <Phone size={15} className={styles.contactIcon} />
              <Link href={`tel:${settings?.phone?.replace(/\s/g, '') || "0481369018"}`}>{settings?.phone || "0481 369 018"}</Link>
            </li>
            <li className={styles.contactItem}>
              <Mail size={15} className={styles.contactIcon} />
              <Link href={`mailto:${settings?.email || "sales@capitalprintandsign.com.au"}`}>
                {settings?.email || "sales@capitalprintandsign.com.au"}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Capital Print &amp; Sign Pty Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}
