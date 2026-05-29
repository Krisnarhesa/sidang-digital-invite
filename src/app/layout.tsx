import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  Inter,
  Italianno,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italianno",
  display: "swap",
});

const fontVariables = `${inter.variable} ${cinzel.variable} ${playfair.variable} ${cormorant.variable} ${italianno.variable}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Undangan Sidang Skripsi TI Udayana",
  description:
    "Undangan Sidang Skripsi Program Studi Teknologi Informasi Universitas Udayana",
  icons: {
    icon: "/logo_hmti.png",
    apple: "/logo_hmti.png",
  },
  openGraph: {
    title: "Undangan Sidang Skripsi - HMTI Udayana",
    description: "Undangan Sidang Skripsi",
    images: ["/hmtiudayana_cover.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={fontVariables} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/logo_hmti.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('undangan-theme');if(!t){t='dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
