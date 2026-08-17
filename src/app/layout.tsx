import type { Metadata } from "next";
import { Outfit, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sahabat Al-Qur'an - Mulai Perjalananmu Bersama Al-Qur'an",
  description: "Temukan pengalaman membaca dan mempelajari Al-Qur'an yang lebih nyaman, terarah, dan bermakna.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} ${playfair.variable} ${montserrat.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full font-sans bg-[#FAF8F1] selection:bg-[#9CC7B5]/30 selection:text-[#1F4D3D]">
        {children}
      </body>
    </html>
  );
}
