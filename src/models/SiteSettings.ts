import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema(
  {
    // Page Headers
    servicesHeaderTitle: { type: String, default: "Our Services" },
    servicesHeaderSubtitle: { type: String, default: "Comprehensive technology and engineering solutions designed for efficiency, sustainability, and growth." },
    projectsHeaderTitle: { type: String, default: "Our Recent Projects" },
    projectsHeaderSubtitle: { type: String, default: "Explore our portfolio of successful implementations across solar energy, smart home automation, and agro tech." },
    contactHeaderTitle: { type: String, default: "Get in Touch" },
    contactHeaderSubtitle: { type: String, default: "Ready to start your next project or need technical assistance? Our team of experts is here to help." },
    contactInfoSectionTitle: { type: String, default: "Contact Information" },
    teamHeaderTitle: { type: String, default: "Complete Corporate Governance and Web Team Directory" },
    teamHeaderCompanyName: { type: String, default: "Max iT Solution Ltd." },
    teamHeaderSubtitle: { type: String, default: "Corporate Organogram and Profile Layout with Global Supply Chain Network." },

    // Button Links
    heroPrimaryButtonLink: { type: String, default: "/services" },
    heroSecondaryButtonLink: { type: String, default: "/contact" },
    navbarContactButtonLink: { type: String, default: "/contact" },
    navbarContactButtonText: { type: String, default: "Get Started" },
    footerContactButtonLink: { type: String, default: "/contact" },

    // Featured Solar Block (Shared)
    featuredServiceTitle: { type: String, default: "Solar & Renewable Energy" },
    featuredServiceDescription: { type: String, default: "Leading the transition to sustainable energy with end-to-end solar engineering, ensuring maximum efficiency and reliability for industrial, commercial, and residential sectors." },
    featuredServicePoints: [{
      name: String,
      desc: String
    }],

    // Header Settings
    headerLogo: { type: String, default: "/logo.png" },
    navItems: [{ label: String, link: String, order: { type: Number, default: 0 } }],

    // Footer Settings
    footerLogo: { type: String, default: "/logo.png" },
    footerDescription: { type: String, default: "Your partner for sustainable energy, advanced agro-tech, and intelligent automation solutions. Empowering a greener tomorrow." },
    socialLinks: [{ platform: String, url: String, icon: String, order: { type: Number, default: 0 } }],
    quickLinks: [{ label: String, link: String, order: { type: Number, default: 0 } }],
    copyrightText: { type: String, default: "© 2026 Max iT Solution. All rights reserved." },
    privacyPolicyLink: { type: String, default: "/privacy" },
    termsOfServiceLink: { type: String, default: "/terms" },
    // Footer contact overrides (if they differ from global contact, but usually we just use the same)
    footerEmail: { type: String, default: "sales@m4xit.com" },
    footerPhone: { type: String, default: "+8801733-272445" },
    footerAddressLine1: { type: String, default: "2nd Floor, Afroza Tower," },
    footerAddressLine2: { type: String, default: "Uposhohor Newmarket," },
    footerAddressLine3: { type: String, default: "Rajshahi-6000" }
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
