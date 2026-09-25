import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CompanyProfileData from '@/models/CompanyProfileData';

const DEFAULT_DATA = {
  stats: [
    { value: "10+", label: "Years of Experience" },
    { value: "250+", label: "Projects Completed" },
    { value: "100+", label: "Clients Served" },
    { value: "20+", label: "Technical Professionals" }
  ],
  howWeWork: [
    { title: "Consultation", description: "We understand your requirements and objectives." },
    { title: "Site Assessment", description: "Our team evaluates the site, infrastructure and technical requirements." },
    { title: "Solution Design", description: "We develop a suitable technical solution tailored to your exact needs." },
    { title: "Proposal", description: "We provide specifications, scope and a transparent commercial proposal." },
    { title: "Installation & Commissioning", description: "Our team implements, tests and commissions the system." },
    { title: "Support", description: "We provide ongoing technical support and proactive maintenance." }
  ],
  industries: [
    { name: "Residential", icon: "Home" },
    { name: "Agriculture", icon: "Sprout" },
    { name: "Commercial", icon: "Building2" },
    { name: "Industrial", icon: "Factory" },
    { name: "Educational", icon: "GraduationCap" },
    { name: "Healthcare", icon: "Activity" },
    { name: "Construction", icon: "Settings" },
    { name: "Government", icon: "Landmark" }
  ],
  capabilities: ['Energy', 'Automation', 'Agriculture', 'Security', 'Networking', 'Infrastructure'],
  whyChooseUs: [
    { icon: "Target", title: "Integrated Solutions", description: "Multiple technology and engineering capabilities under one roof." },
    { icon: "Settings", title: "Customized Approach", description: "Solutions designed according to each client's technical and operational requirements." },
    { icon: "Shield", title: "Quality Equipment", description: "Reliable equipment and technologies selected for performance and long-term use." },
    { icon: "Briefcase", title: "Professional Installation", description: "Experienced technical teams for installation, configuration and commissioning." },
    { icon: "Phone", title: "End-to-End Support", description: "Support from consultation through implementation and maintenance." },
    { icon: "Sprout", title: "Sustainable Solutions", description: "Technology focused on efficiency, resource optimization and long-term value." }
  ]
};

export async function GET() {
  try {
    await dbConnect();
    let data = await CompanyProfileData.findOne().lean();
    if (!data) {
      data = DEFAULT_DATA;
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching company profile data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    let data = await CompanyProfileData.findOne();
    if (data) {
      data.stats = body.stats;
      data.howWeWork = body.howWeWork;
      data.industries = body.industries;
      data.capabilities = body.capabilities;
      data.whyChooseUs = body.whyChooseUs;
      await data.save();
    } else {
      data = await CompanyProfileData.create(body);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error saving company profile data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
