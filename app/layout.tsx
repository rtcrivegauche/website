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
  title: {
    default: "Rotaract Cica - Cotonou Rive Gauche",
    template: "%s | Rotaract Cica"
  },
  description: "Rotaract Club de Cotonou Rive Gauche Cica - Servir, Inspirer, Grandir Ensemble. Rejoignez-nous pour faire la différence dans notre communauté.",
  keywords: ["Rotaract", "Cotonou", "Bénin", "Service", "Jeunesse", "Volontariat", "Club", "Rotary"],
  authors: [{ name: "Rotaract Cica" }],
  creator: "Rotaract Cica",
  publisher: "Rotaract Cica",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rotaract-cica.com",
    siteName: "Rotaract Cica",
    title: "Rotaract Cica - Cotonou Rive Gauche",
    description: "Servir, Inspirer, Grandir Ensemble",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotaract Cica - Cotonou Rive Gauche",
    description: "Servir, Inspirer, Grandir Ensemble",
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
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
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
