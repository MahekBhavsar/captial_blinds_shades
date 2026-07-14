import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Capital Print & Sign | Premium Printing & Signage in Canberra",
  description: "Australia's Premium Printing, Signage & Branding Partner. From business cards and brochures to vehicle wraps and shopfront branding. We Print. You Shine.",
  keywords: ["Printing Services Canberra", "Signage Canberra", "Vehicle Wraps Canberra", "Business Cards Canberra", "Banner Printing Canberra"],
  icons: {
    icon: [
      { url: '/CPS-SecondaryLogo.png?v=1', type: 'image/png' }
    ]
  },
  openGraph: {
    title: "Capital Print & Sign | We Print. You Shine.",
    description: "Premium printing, signage, vehicle wraps, branding, and installation services that help Australian businesses stand out with confidence.",
    url: "https://capitalprintandsign.com.au",
    siteName: "Capital Print & Sign",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
