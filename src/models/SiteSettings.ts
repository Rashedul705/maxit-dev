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

    // Featured Solar Block (Shared)
    featuredServiceTitle: { type: String, default: "Solar & Renewable Energy" },
    featuredServiceDescription: { type: String, default: "Leading the transition to sustainable energy with end-to-end solar engineering, ensuring maximum efficiency and reliability for industrial, commercial, and residential sectors." },
    featuredServicePoints: [{
      name: String,
      desc: String
    }]
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
