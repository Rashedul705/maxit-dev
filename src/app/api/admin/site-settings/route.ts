import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { revalidatePath } from 'next/cache';

const DEFAULT_SETTINGS = {
  servicesHeaderTitle: "Our Services",
  servicesHeaderSubtitle: "Comprehensive technology and engineering solutions designed for efficiency, sustainability, and growth.",
  projectsHeaderTitle: "Our Recent Projects",
  projectsHeaderSubtitle: "Explore our portfolio of successful implementations across solar energy, smart home automation, and agro tech.",
  contactHeaderTitle: "Get in Touch",
  contactHeaderSubtitle: "Ready to start your next project or need technical assistance? Our team of experts is here to help.",
  contactInfoSectionTitle: "Contact Information",
  teamHeaderTitle: "Complete Corporate Governance and Web Team Directory",
  teamHeaderSubtitle: "Corporate Organogram and Profile Layout with Global Supply Chain Network.",
  
  featuredServiceTitle: "Solar & Renewable Energy",
  featuredServiceDescription: "Leading the transition to sustainable energy with end-to-end solar engineering, ensuring maximum efficiency and reliability for industrial, commercial, and residential sectors.",
  featuredServicePoints: [
    { name: "Solar Installation", desc: "End-to-end design and setup." },
    { name: "Roof Top Solar", desc: "Optimizing commercial rooftops." },
    { name: "Complete Solar Setup", desc: "Turnkey off-grid & on-grid." },
    { name: "Net Metering", desc: "Grid synchronization & setup." },
    { name: "Solar Lift Integration", desc: "Powering heavy industrial lifts." },
    { name: "Maintenance & Support", desc: "24/7 technical assistance." }
  ],
  headerLogo: "/logo.png",
  navItems: [
    { label: "Home", link: "/", order: 0 },
    { label: "Services", link: "/services", order: 1 },
    { label: "Projects", link: "/projects", order: 2 },
    { label: "Team", link: "/team", order: 3 },
    { label: "About", link: "/about", order: 4 },
    { label: "Contact", link: "/contact", order: 5 }
  ],
  footerLogo: "/logo.png",
  footerDescription: "Your partner for sustainable energy, advanced agro-tech, and intelligent automation solutions. Empowering a greener tomorrow.",
  socialLinks: [
    { platform: "Facebook", url: "#", icon: "Facebook", order: 0 },
    { platform: "LinkedIn", url: "#", icon: "Linkedin", order: 1 },
    { platform: "GitHub", url: "#", icon: "Github", order: 2 }
  ],
  quickLinks: [
    { label: "About Us", link: "/about", order: 0 },
    { label: "Company Profile", link: "/company-profile", order: 1 },
    { label: "Services", link: "/services", order: 2 },
    { label: "Our Team", link: "/team", order: 3 },
    { label: "Contact", link: "/contact", order: 4 }
  ],
  copyrightText: "© 2026 Max iT Solution. All rights reserved.",
  privacyPolicyLink: "/privacy",
  termsOfServiceLink: "/terms",
  footerEmail: "sales@m4xit.com",
  footerPhone: "+8801733-272445",
  footerAddressLine1: "2nd Floor, Afroza Tower,",
  footerAddressLine2: "Uposhohor Newmarket,",
  footerAddressLine3: "Rajshahi-6000"
};

export async function GET() {
  try {
    await dbConnect();
    let settings = await (SiteSettings.findOne as any)().lean();
    if (!settings) {
      settings = DEFAULT_SETTINGS;
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    let settings = await (SiteSettings.findOne as any)();
    if (settings) {
      Object.assign(settings, body);
      await settings.save();
    } else {
      settings = await SiteSettings.create(body);
    }

    revalidatePath('/', 'layout');
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving site settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
