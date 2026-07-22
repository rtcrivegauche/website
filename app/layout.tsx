import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#014F43",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rotaract-cica.com'),
  title: {
    default: "Club Rotaract de Cotonou Rive Gauche Cica",
    template: "%s | Club Rotaract de Cotonou Rive Gauche Cica"
  },
  description: "Club Rotaract de Cotonou Rive Gauche Cica - Servir, Inspirer, Grandir Ensemble. Rejoignez-nous pour faire la différence dans notre communauté.",
  keywords: ["Club Rotaract de Cotonou Rive Gauche Cica", "Rotaract", "Cotonou Rive Gauche", "Cica", "Bénin", "Service", "Jeunesse", "Volontariat", "Club", "Rotary"],
  authors: [{ name: "Club Rotaract de Cotonou Rive Gauche Cica" }],
  creator: "Club Rotaract de Cotonou Rive Gauche Cica",
  publisher: "Club Rotaract de Cotonou Rive Gauche Cica",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rotaract-cica.com",
    siteName: "Club Rotaract de Cotonou Rive Gauche Cica",
    title: "Club Rotaract de Cotonou Rive Gauche Cica",
    description: "Servir, Inspirer, Grandir Ensemble - Club Rotaract de Cotonou Rive Gauche Cica",
    images: [
      {
        url: "/icons/favicon-rtc-rgc.png",
        width: 512,
        height: 512,
        alt: "Club Rotaract de Cotonou Rive Gauche Cica"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Club Rotaract de Cotonou Rive Gauche Cica",
    description: "Servir, Inspirer, Grandir Ensemble - Club Rotaract de Cotonou Rive Gauche Cica",
    images: ["/icons/favicon-rtc-rgc.png"],
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RTC Cica",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

import PwaRegister from "@/components/ui/PwaRegister";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
