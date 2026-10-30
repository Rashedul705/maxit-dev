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
    navItems: [{ label: String, link: String, openInNewTab: { type: Boolean, default: false }, order: { type: Number, default: 0 } }],

    // Footer Settings
    footerLogo: { type: String, default: "/logo.png" },
    footerDescription: { type: String, default: "Your partner for sustainable energy, advanced agro-tech, and intelligent automation solutions. Empowering a greener tomorrow." },
    socialLinks: [{ platform: String, url: String, icon: String, order: { type: Number, default: 0 } }],
    quickLinks: [{ label: String, link: String, order: { type: Number, default: 0 } }],
    copyrightText: { type: String, default: "© 2026 Max iT Solution. All rights reserved." },
    privacyPolicyLink: { type: String, default: "/privacy" },
    termsOfServiceLink: { type: String, default: "/terms" },
    googleMapsUrl: { type: String, default: "https://maps.app.goo.gl/2N1mLA8RwpcaohFs6" },
    googleMapsEmbedUrl: { type: String, default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1816.9782315667!2d88.5978931!3d24.3776999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14644734df7254d%3A0x9ca140a46bae1fa1!2sMax%20iT%20Solution!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd" },
    footerGoogleMapsUrl: { type: String, default: "https://maps.app.goo.gl/2N1mLA8RwpcaohFs6" },
    // Footer contact overrides (if they differ from global contact, but usually we just use the same)
    footerEmail: { type: String, default: "sales@m4xit.com" },
    footerPhone: { type: String, default: "+8801733-272445" },
    footerAddressLine1: { type: String, default: "Afroza Tower, 4th Floor," },
    footerAddressLine2: { type: String, default: "Uposhohor Newmarket," },
    footerAddressLine3: { type: String, default: "Rajshahi-6000" },
    footerAddresses: [
      {
        title: { type: String, default: "Head Office" },
        details: { type: String, default: "Afroza Tower, 4th Floor, Uposhohor Newmarket, Rajshahi" },
        order: { type: Number, default: 0 }
      },
      {
        title: { type: String, default: "LAB Office" },
        details: { type: String, default: "Afroza Tower, 2nd Floor, Uposhohor Newmarket, Rajshahi" },
        order: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true, strict: false }
);

if (mongoose.models && (mongoose.models as any).SiteSettings) {
  delete (mongoose.models as any).SiteSettings;
}

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
