"use client";

import { MessageCircle } from "lucide-react";
import styles from "./WhatsAppFloatingBtn.module.css";

export function WhatsAppFloatingBtn() {
  return (
    <a
      href="https://wa.me/61481369018"
      className={styles.floatingBtn}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} color="white" />
    </a>
  );
}
