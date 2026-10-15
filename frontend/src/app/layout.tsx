import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFromBackend } from "@/lib/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Max iT Solution - Solar Energy, Agro Tech & Automation",
  description: "Leading provider of solar home systems, smart irrigation, agricultural technology, and industrial automation solutions in Bangladesh.",
  keywords: "Solar Energy, Solar Home Systems, Rooftop Solar, Energy Efficiency, Green Power, Smart Irrigation, Agro Tech, Solar Pumps, Water Management, Electric Automation, Industrial Automation, Smart Home Control, Electric Systems, IoT Solutions",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Max iT Solution - Solar Energy, Agro Tech & Automation",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [contactInfo, rawSettings] = await Promise.all([
    fetchFromBackend<any>('/api/admin/contact'),
    fetchFromBackend<any>('/api/admin/site-settings'),
  ]);
  
  // Merge with defaults so new fields (navItems, navbarContactButtonText, etc.) always have values
  const defaultSettings = {
    headerLogo: "/logo.png",
    navItems: [
      { label: "Home", link: "/", order: 0 },
      { label: "Services", link: "/services", order: 1 },
      { label: "Projects", link: "/projects", order: 2 },
      { label: "Shop", link: "#", order: 3 },
      { label: "Team", link: "/team", order: 4 },
      { label: "About", link: "/about", order: 5 },
      { label: "Contact", link: "/contact", order: 6 }
    ],
    navbarContactButtonText: "Get Started",
    navbarContactButtonLink: "/contact",
    footerLogo: "/logo.png",
  };
  const siteSettings = rawSettings ? {
    ...defaultSettings,
    ...Object.fromEntries(
      Object.entries(rawSettings).filter(([, v]) => {
        if (Array.isArray(v)) return v.length > 0;
        return v !== undefined && v !== null && v !== '';
      })
    )
  } : defaultSettings;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <Header siteSettings={siteSettings} />
            {children}
          <Footer siteSettings={siteSettings} />
        </Providers>
      </body>
    </html>
  );
}

