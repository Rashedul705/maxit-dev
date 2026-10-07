import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HomeContent from '@/models/HomeContent';
import { revalidatePath } from 'next/cache';

const DEFAULT_HOME = {
  hero: {
    visible: true,
    backgroundImage: '/images/hero-bg.jpg',
    titleLine1: 'Solar Energy &',
    titleLine2: 'Smart Automation',
    subtitle: 'Empowering your future with sustainable energy solutions, advanced agro-technology, and intelligent industrial automation.',
    stats: [
      { label: 'Projects', number: '50+', order: 0 },
      { label: 'Clients', number: '30+', order: 1 },
      { label: 'Years Exp', number: '10+', order: 2 },
      { label: 'Support', number: '24/7', order: 3 }
    ]
  },
  servicesSection: {
    visible: true,
    headingNormal: 'Everything You Need, Under ',
    headingHighlight: 'One Roof',
    subtext: 'From solar and irrigation to networking, automation, electrical work, and CCTV, we handle the full job so you deal with one reliable team.',
    services: [
      { icon: 'Sun', isCustomIcon: false, title: 'Solar Home Systems', description: 'Complete solar energy solutions for residential use.', order: 0 },
      { icon: 'Sprout', isCustomIcon: false, title: 'Solar Pump & Smart Irrigation', description: 'Advanced solar-powered pumping systems.', order: 1 },
      { icon: 'Cpu', isCustomIcon: false, title: 'Industrial Automation', description: 'Smart control systems for industries.', order: 2 },
      { icon: 'Wifi', isCustomIcon: false, title: 'Networking Services', description: 'Robust network infrastructure design.', order: 3 }
    ]
  },
  milestones: {
    visible: true,
    title: 'Milestones That Define Our Impact',
    stats: [
      { number: '50+', label: 'Total Rooftop Solar Power', order: 0 },
      { number: '30+', label: 'Solar Irrigation Pumps', order: 1 },
      { number: '10+', label: 'Off-Grid Solar Systems', order: 2 },
      { number: '24/7', label: 'Nationwide Support', order: 3 }
    ]
  },
  videosSection: {
    visible: true,
    headingNormal: 'Pioneering the ',
    headingHighlight: 'Solar Frontier',
    subtext: 'Explore our state-of-the-art videography and see how Max iT Solution is reshaping the energy landscape with break-through technologies.',
    videos: [
      { youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoId: 'dQw4w9WgXcQ', title: 'Solar Energy Automation', description: 'High-tech robotic automation managing large-scale solar farms.', active: true, order: 0 }
    ]
  },
  whyChooseUs: {
    visible: true,
    headingNormal: 'Why Choose ',
    headingHighlight: 'Max iT Solution?',
    subtext: 'We are dedicated to empowering businesses and homes with sustainable energy, advanced agricultural technology, and smart automation solutions.',
    cards: [
      { icon: 'Sun', isCustomIcon: false, title: 'Expertise', description: 'Deep knowledge in solar.', accentColor: 'from-orange-500 to-amber-500', order: 0 },
      { icon: 'Cpu', isCustomIcon: false, title: 'Automation', description: 'Smart solutions.', accentColor: 'from-blue-500 to-cyan-500', order: 1 }
    ],
    button: { label: 'Learn More About Us', link: '/about' }
  },
  aboutPreview: {
    visible: true,
    image: '/images/slides/agro_solar_slide_1789677870674.jpg',
    headingNormal: 'About ',
    headingHighlight: 'Max iT Solution',
    paragraph: 'We are dedicated to empowering businesses and homes with sustainable energy, advanced agricultural technology, and smart automation solutions.',
    primaryButton: { label: 'Discover Our Journey', link: '/about' },
    secondaryButton: { label: 'Company Profile', link: '/company-profile' }
  },
  testimonialsSection: {
    visible: true,
    headingNormal: 'Client ',
    headingHighlight: 'Success Stories',
    subtext: "Don't just take our word for it — hear from the visionaries who have experienced the Max iT difference firsthand."
  },
  partnersSection: {
    visible: true,
    headingNormal: 'Technologies & Partners with ',
    headingHighlight: 'Max iT',
    subtext: ''
  },
  teamSection: {
    visible: true,
    headingNormal: 'Max iT ',
    headingHighlight: 'Management',
    subtext: 'Meet the leaders driving our technology and engineering solutions forward.',
    button: { label: 'View full team', link: '/team' }
  },
  ctaSection: {
    visible: true,
    title: 'Ready to Power Your Future?',
    text: 'Let\'s work together to implement sustainable and intelligent solutions that scale with your ambitions. Get in touch with us today!',
    primaryButton: { label: 'Get Started Today', link: '/contact' },
    secondaryButton: { label: 'View Our Work', link: '/services' },
    backgroundImage: '/images/slides/commercial_rooftop_slide_1789677880098.jpg'
  }
};

export async function GET() {
  try {
    await dbConnect();
    let content = await (HomeContent.findOne as any)().lean();
    if (!content) {
      content = DEFAULT_HOME;
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching home content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Explicitly update all fields or create new document
    const content = await HomeContent.findOneAndUpdate({}, body, { new: true, upsert: true });
    
    revalidatePath('/');
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error saving home content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
