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
  teamHeaderCompanyName: "Max iT Solution Ltd.",
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
  navbarContactButtonText: "Get Started",
  navbarContactButtonLink: "/contact",
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
    } else {
      // Merge defaults with stored settings so any missing fields get populated.
      // For arrays: use the stored value only if it exists and has items; otherwise use the default.
      const merged: any = { ...DEFAULT_SETTINGS };
      for (const key of Object.keys(merged)) {
        const storedVal = (settings as any)[key];
        if (Array.isArray(merged[key])) {
          // Use stored array if it exists and has items
          if (Array.isArray(storedVal) && storedVal.length > 0) {
            merged[key] = storedVal;
          }
        } else {
          // Use stored scalar if it's defined and not empty string
          if (storedVal !== undefined && storedVal !== null && storedVal !== '') {
            merged[key] = storedVal;
          }
        }
      }
      // Also carry over _id and timestamps from stored doc
      if ((settings as any)._id) merged._id = (settings as any)._id;
      if ((settings as any).createdAt) merged.createdAt = (settings as any).createdAt;
      if ((settings as any).updatedAt) merged.updatedAt = (settings as any).updatedAt;
      settings = merged;
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
    
    const settings = await (SiteSettings.findOneAndUpdate as any)({}, body, { new: true, upsert: true });

    revalidatePath('/', 'layout');
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving site settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
