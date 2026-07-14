"use client";

import React from "react";
import styles from "./Button.module.css";
import { motion } from "framer-motion";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline-light";
  href?: string;
  children: React.ReactNode;
}

export function Button({ variant = "primary", href, children, className = "", ...props }: ButtonProps) {
  const variantClass = styles[variant];
  const combinedClassName = `${styles.button} ${variantClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName} style={props.style}>
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={combinedClassName}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
