"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./BrandLogo.module.css";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

/** Animated multi-colour floating brand name — Capital Blinds & Shades */
export function BrandLogo({ size = "md", href = "/" }: BrandLogoProps) {
  return (
    <Link href={href} className={`${styles.root} ${styles[size]}`}>
      {/* Logo image — floats gently */}
      <span className={styles.logoWrap}>
        <Image
          src="/logo.png"
          alt="Capital Blinds and Shades logo"
          width={56}
          height={56}
          className={styles.logoImg}
          priority
        />
      </span>

      {/* Coloured animated words */}
      <span className={styles.mainLine}>
        <span className={`${styles.word} ${styles.capital}`}>Capital</span>
        <span className={`${styles.word} ${styles.blinds}`}>&nbsp;Blinds</span>
        <span className={`${styles.word} ${styles.and_word}`}>&nbsp;and</span>
        <span className={`${styles.word} ${styles.shades}`}>&nbsp;Shades</span>
      </span>
    </Link>
  );
}
