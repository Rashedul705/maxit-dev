import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

const DEFAULT_SETTINGS = {
  servicesHeaderTitle: "Our Services",
  servicesHeaderSubtitle: "Comprehensive technology and engineering solutions designed for efficiency, sustainability, and growth.",
  projectsHeaderTitle: "Our Recent Projects",
  projectsHeaderSubtitle: "Explore our portfolio of successful implementations across solar energy, smart home automation, and agro tech.",
  contactHeaderTitle: "Get in Touch",
  contactHeaderSubtitle: "Ready to start your next project or need technical assistance? Our team of experts is here to help.",
  
  featuredServiceTitle: "Solar & Renewable Energy",
  featuredServiceDescription: "Leading the transition to sustainable energy with end-to-end solar engineering, ensuring maximum efficiency and reliability for industrial, commercial, and residential sectors.",
  featuredServicePoints: [
    { name: "Solar Installation", desc: "End-to-end design and setup." },
    { name: "Roof Top Solar", desc: "Optimizing commercial rooftops." },
    { name: "Complete Solar Setup", desc: "Turnkey off-grid & on-grid." },
    { name: "Net Metering", desc: "Grid synchronization & setup." },
    { name: "Solar Lift Integration", desc: "Powering heavy industrial lifts." },
    { name: "Maintenance & Support", desc: "24/7 technical assistance." }
  ]
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
      settings.servicesHeaderTitle = body.servicesHeaderTitle;
      settings.servicesHeaderSubtitle = body.servicesHeaderSubtitle;
      settings.projectsHeaderTitle = body.projectsHeaderTitle;
      settings.projectsHeaderSubtitle = body.projectsHeaderSubtitle;
      settings.contactHeaderTitle = body.contactHeaderTitle;
      settings.contactHeaderSubtitle = body.contactHeaderSubtitle;
      settings.featuredServiceTitle = body.featuredServiceTitle;
      settings.featuredServiceDescription = body.featuredServiceDescription;
      settings.featuredServicePoints = body.featuredServicePoints;
      await settings.save();
    } else {
      settings = await SiteSettings.create(body);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving site settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
