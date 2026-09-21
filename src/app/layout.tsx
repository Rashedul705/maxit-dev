import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "MaxIT Solution - Solar Energy, Agro Tech & Automation",
  description: "Leading provider of solar home systems, smart irrigation, agricultural technology, and industrial automation solutions in Bangladesh.",
  keywords: "Solar Energy, Solar Home Systems, Rooftop Solar, Energy Efficiency, Green Power, Smart Irrigation, Agro Tech, Solar Pumps, Water Management, Electric Automation, Industrial Automation, Smart Home Control, Electric Systems, IoT Solutions",
  openGraph: {
    title: "MaxIT Solution - Solar Energy, Agro Tech & Automation",
    description: "Leading provider of solar home systems, smart irrigation, agricultural technology, and industrial automation solutions in Bangladesh.",
    type: "website",
    images: [{ url: "/images/slides/commercial_rooftop_slide_1789677880098.jpg" }]
  },
  twitter: {
    card: "summary_large_image",
    site: "@maxitsolution",
    images: ["/images/slides/commercial_rooftop_slide_1789677880098.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <Header />
            {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

