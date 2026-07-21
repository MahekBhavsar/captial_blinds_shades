import type { Metadata } from "next";
import { Inter, Poppins, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Capital Blinds and Shades | Custom Window Furnishings, Shutters & Curtains",
  description: "Australia's premium window furnishings partner. Shop custom roller blinds, plantation shutters, sheer curtains, and motorised solutions online. Free measure & quote.",
  keywords: ["Custom Blinds", "Plantation Shutters", "Sheer Curtains", "Motorised Blinds", "Roller Blinds", "Window Furnishings", "Blockout Curtains", "Australia"],
  openGraph: {
    title: "Capital Blinds and Shades | Premium Custom Window Treatments",
    description: "Discover truly custom window treatments at Capital Blinds and Shades. Order free samples and find the perfect fit for your home with our expert installation.",
    url: "https://capitalblindsandshades.com.au",
    siteName: "Capital Blinds and Shades",
    locale: "en_AU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${playfair.variable} ${cinzel.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
