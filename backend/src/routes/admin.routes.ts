import { Router, Request, Response } from 'express';
import dbConnect from '../db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';

// Models
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import ProjectCategory from '../models/ProjectCategory.js';
import TeamMember from '../models/TeamMember.js';
import TeamSection from '../models/TeamSection.js';
import Testimonial from '../models/Testimonial.js';
import Partner from '../models/Partner.js';
import Reason from '../models/Reason.js';
import HomeContent from '../models/HomeContent.js';
import AboutContent from '../models/AboutContent.js';
import GlobalContact from '../models/GlobalContact.js';
import SiteSettings from '../models/SiteSettings.js';
import HeroContent from '../models/HeroContent.js';
import LegalPage from '../models/LegalPage.js';
import CompanyProfileData from '../models/CompanyProfileData.js';
import Conversation from '../models/Conversation.js';

const router = Router();

// ==========================================
// DASHBOARD STATS
// ==========================================
router.get('/dashboard-stats', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const [unreadCount, totalInquiries, teamCount, projectCount] = await Promise.all([
      Conversation.countDocuments({
        status: { $ne: 'archived' },
        $or: [{ status: 'unread' }, { unreadCount: { $gt: 0 } }]
      }),
      Conversation.countDocuments(),
      TeamMember.countDocuments(),
      Project.countDocuments(),
    ]);
    return res.json({
      unreadCount,
      totalInquiries,
      teamCount: teamCount || 9,
      projectCount: projectCount || 12,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      unreadCount: 0,
      totalInquiries: 0,
      teamCount: 9,
      projectCount: 12,
    });
  }
});

// ==========================================
// 1. SERVICES
// ==========================================
router.get('/services', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const services = await (Service.find as any)({}).sort({ order: 1 }).lean();
    return res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.post('/services', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { title, iconUrl, imageUrl, subServices, order } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const newService = await Service.create({
      title,
      iconUrl: iconUrl || '',
      imageUrl: imageUrl || '',
      subServices: subServices || [],
      order: order || 0,
    });
    return res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/services/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const updated = await (Service.findByIdAndUpdate as any)(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.json(updated);
  } catch (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const deleted = await (Service.findByIdAndDelete as any)(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ==========================================
// 2. PROJECTS
// ==========================================
router.get('/projects', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const projects = await (Project.find as any)({}).sort({ order: 1 }).lean();
    return res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/projects', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      return res.status(400).json({ error: 'Title, description, and imageUrl are required' });
    }
    const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = req.body.slug || slugify(title);
    const newProject = await Project.create({
      ...req.body,
      slug,
      order: req.body.order || 0,
    });
    return res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/projects/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const updated = await (Project.findByIdAndUpdate as any)(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const deleted = await (Project.findByIdAndDelete as any)(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ==========================================
// 3. PROJECT CATEGORIES
// ==========================================
router.get('/project-categories', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const cats = await (ProjectCategory.find as any)({}).sort({ order: 1 }).lean();
    return res.json(cats);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/project-categories', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { name, order } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const cat = await ProjectCategory.create({ name, order: order || 0 });
    return res.status(201).json(cat);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/project-categories/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const updated = await (ProjectCategory.findByIdAndUpdate as any)(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/project-categories/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const deleted = await (ProjectCategory.findByIdAndDelete as any)(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ==========================================
// 4. TEAM MEMBERS
// ==========================================
router.get('/team', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const members = await (TeamMember.find as any)({}).sort({ order: 1 }).lean();
    return res.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

router.post('/team', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { name, position } = req.body;
    if (!name || !position) {
      return res.status(400).json({ error: 'Name and position are required' });
    }
    const member = await TeamMember.create({
      ...req.body,
      order: req.body.order || 0,
    });
    return res.status(201).json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    return res.status(500).json({ error: 'Failed to create team member' });
  }
});

router.put('/team/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const updated = await (TeamMember.findByIdAndUpdate as any)(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    return res.json(updated);
  } catch (error) {
    console.error('Error updating team member:', error);
    return res.status(500).json({ error: 'Failed to update team member' });
  }
});

router.delete('/team/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const deleted = await (TeamMember.findByIdAndDelete as any)(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    return res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return res.status(500).json({ error: 'Failed to delete team member' });
  }
});

// ==========================================
// 5. TEAM SECTIONS
// ==========================================
router.get('/team-sections', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const sections = await (TeamSection.find as any)({}).sort({ order: 1 }).lean();
    return res.json(sections);
  } catch (error) {
    console.error('Error fetching team sections:', error);
    return res.status(500).json({ error: 'Failed to fetch team sections' });
  }
});

router.post('/team-sections', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { name, order } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Section name is required' });
    }
    const section = await TeamSection.create({ name, order: order || 0 });
    return res.status(201).json(section);
  } catch (error) {
    console.error('Error creating team section:', error);
    return res.status(500).json({ error: 'Failed to create team section' });
  }
});

router.put('/team-sections/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const updated = await (TeamSection.findByIdAndUpdate as any)(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Team section not found' });
    }
    return res.json(updated);
  } catch (error) {
    console.error('Error updating team section:', error);
    return res.status(500).json({ error: 'Failed to update team section' });
  }
});

router.delete('/team-sections/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const deleted = await (TeamSection.findByIdAndDelete as any)(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Team section not found' });
    }
    return res.json({ message: 'Team section deleted successfully' });
  } catch (error) {
    console.error('Error deleting team section:', error);
    return res.status(500).json({ error: 'Failed to delete team section' });
  }
});

// ==========================================
// 6. TESTIMONIALS
// ==========================================
router.get('/testimonials', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const tests = await (Testimonial.find as any)({}).sort({ order: 1 }).lean();
    return res.json(tests);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.post('/testimonials', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { name, review } = req.body;
    if (!name || !review) {
      return res.status(400).json({ error: 'Name and review are required' });
    }
    const test = await Testimonial.create({
      ...req.body,
      order: req.body.order || 0,
    });
    return res.status(201).json(test);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

router.put('/testimonials/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const updated = await (Testimonial.findByIdAndUpdate as any)(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    return res.json(updated);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

router.delete('/testimonials/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const deleted = await (Testimonial.findByIdAndDelete as any)(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    return res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ==========================================
// 7. PARTNERS
// ==========================================
router.get('/partners', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const partners = await (Partner.find as any)({}).sort({ order: 1 }).lean();
    return res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

router.post('/partners', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { name, logoUrl } = req.body;
    if (!name || !logoUrl) {
      return res.status(400).json({ error: 'Name and logoUrl are required' });
    }
    const partner = await Partner.create({
      ...req.body,
      order: req.body.order || 0,
    });
    return res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    return res.status(500).json({ error: 'Failed to create partner' });
  }
});

router.put('/partners/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const updated = await (Partner.findByIdAndUpdate as any)(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    return res.json(updated);
  } catch (error) {
    console.error('Error updating partner:', error);
    return res.status(500).json({ error: 'Failed to update partner' });
  }
});

router.delete('/partners/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const deleted = await (Partner.findByIdAndDelete as any)(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    return res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return res.status(500).json({ error: 'Failed to delete partner' });
  }
});

// ==========================================
// 8. REASONS (WHY CHOOSE US)
// ==========================================
router.get('/reasons', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const reasons = await (Reason.find as any)({}).sort({ order: 1 }).lean();
    return res.json(reasons);
  } catch (error) {
    console.error('Error fetching reasons:', error);
    return res.status(500).json({ error: 'Failed to fetch reasons' });
  }
});

router.post('/reasons', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { title, description, iconCategory, gradient, order } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    const newReason = await Reason.create({
      title,
      description,
      iconCategory: iconCategory || 'Settings',
      gradient: gradient || 'from-blue-400 to-indigo-500',
      order: order || 0,
    });
    return res.status(201).json(newReason);
  } catch (error) {
    console.error('Error creating reason:', error);
    return res.status(500).json({ error: 'Failed to create reason' });
  }
});

router.put('/reasons/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const updated = await (Reason.findByIdAndUpdate as any)(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Reason not found' });
    }
    return res.json(updated);
  } catch (error) {
    console.error('Error updating reason:', error);
    return res.status(500).json({ error: 'Failed to update reason' });
  }
});

router.delete('/reasons/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const deleted = await (Reason.findByIdAndDelete as any)(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Reason not found' });
    }
    return res.json({ message: 'Reason deleted successfully' });
  } catch (error) {
    console.error('Error deleting reason:', error);
    return res.status(500).json({ error: 'Failed to delete reason' });
  }
});

// ==========================================
// 9. HOME CONTENT
// ==========================================
const DEFAULT_HOME = {
  hero: {
    visible: true,
    backgroundImages: [
      '/images/hero-bg.jpg', 
      '/images/slides/solar_automation_slide_1789677805531.jpg', 
      '/images/slides/commercial_rooftop_slide_1789677880098.jpg', 
      '/images/slides/agro_solar_slide_1789677870674.jpg'
    ],
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
    ],
    button: {
      visible: true,
      label: 'Explore All Services',
      link: '/services'
    }
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

router.get('/home', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let content = await (HomeContent.findOne as any)().lean();
    if (!content) {
      content = DEFAULT_HOME;
    }
    if (content && content.hero && (!content.hero.backgroundImages || content.hero.backgroundImages.length === 0)) {
      content.hero.backgroundImages = DEFAULT_HOME.hero.backgroundImages;
    }
    return res.json(content);
  } catch (error) {
    console.error('Error fetching home content:', error);
    return res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.post('/home', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { _id, __v, createdAt, updatedAt, ...updateData } = req.body;
    const content = await (HomeContent.findOneAndUpdate as any)(
      {},
      { $set: updateData },
      { new: true, upsert: true, returnDocument: 'after' }
    );
    return res.json(content);
  } catch (error) {
    console.error('Error saving home content:', error);
    return res.status(500).json({ error: 'Failed to save content' });
  }
});

// ==========================================
// 10. ABOUT CONTENT
// ==========================================
router.get('/about', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let about = await (AboutContent.findOne as any)().lean();
    if (!about) {
      about = {
        journey: "Founded with a passion for innovation, Max iT Solution began with a simple goal: to make industrial-grade engineering and sustainable energy accessible.",
        mission: "To empower businesses, industries, and communities by delivering robust, scalable, and sustainable technology solutions.",
        vision: "To be the region's most trusted engineering and technology partner, driving the transition towards smart automation.",
      };
    }
    return res.json(about);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return res.status(500).json({ error: 'Failed to fetch about content' });
  }
});

router.post('/about', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const updatedAbout = await (AboutContent.findOneAndUpdate as any)(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    return res.json(updatedAbout);
  } catch (error) {
    console.error('Error updating about content:', error);
    return res.status(500).json({ error: 'Failed to update about content' });
  }
});

// ==========================================
// 11. GLOBAL CONTACT INFO
// ==========================================
router.get('/contact', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let contact = await (GlobalContact.findOne as any)().lean();
    if (!contact) {
      contact = {
        addressLine1: '2nd Floor, Afroza Tower,',
        addressLine2: 'Uposhohor Newmarket,',
        addressLine3: 'Rajshahi-6000',
        phoneNumber: '+88 01733-272445',
        whatsappNumber: '01733272445',
        email: 'sales@m4xit.com',
        facebookUrl: '#',
        linkedinUrl: '#',
        githubUrl: '#'
      };
    }
    return res.json(contact);
  } catch (error) {
    console.error('Error fetching global contact:', error);
    return res.status(500).json({ error: 'Failed to fetch global contact' });
  }
});

router.post('/contact', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let contact = await (GlobalContact.findOne as any)();
    if (contact) {
      Object.assign(contact, req.body);
      await contact.save();
    } else {
      contact = await GlobalContact.create(req.body);
    }
    return res.json(contact);
  } catch (error) {
    console.error('Error saving global contact:', error);
    return res.status(500).json({ error: 'Failed to save global contact' });
  }
});

// ==========================================
// 12. SITE SETTINGS
// ==========================================
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
    { label: "Shop", link: "#", order: 3 },
    { label: "Team", link: "/team", order: 4 },
    { label: "About", link: "/about", order: 5 },
    { label: "Contact", link: "/contact", order: 6 }
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
  footerAddressLine3: "Rajshahi-6000",
  footerAddresses: [
    {
      title: "Head Office",
      details: "Afroza Tower, 4th Floor,\nUposhohor Newmarket, Rajshahi-6000",
      order: 0
    },
    {
      title: "LAB",
      details: "Innovation & Automation Lab, Rajshahi",
      order: 1
    }
  ]
};

router.get('/site-settings', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let settings = await (SiteSettings.findOne as any)().lean();
    if (!settings) {
      settings = DEFAULT_SETTINGS;
    } else {
      const merged: any = { ...DEFAULT_SETTINGS };
      for (const key of Object.keys(merged)) {
        const storedVal = (settings as any)[key];
        if (Array.isArray(merged[key])) {
          if (Array.isArray(storedVal) && storedVal.length > 0) {
            merged[key] = storedVal;
          }
        } else {
          if (storedVal !== undefined && storedVal !== null && storedVal !== '') {
            merged[key] = storedVal;
          }
        }
      }
      if ((settings as any)._id) merged._id = (settings as any)._id;
      if ((settings as any).createdAt) merged.createdAt = (settings as any).createdAt;
      if ((settings as any).updatedAt) merged.updatedAt = (settings as any).updatedAt;
      settings = merged;
    }
    return res.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.post('/site-settings', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { _id, __v, createdAt, updatedAt, ...updateData } = req.body;
    const settings = await (SiteSettings.findOneAndUpdate as any)(
      {},
      { $set: updateData },
      { new: true, upsert: true, returnDocument: 'after' }
    );
    return res.json(settings);
  } catch (error) {
    console.error('Error saving site settings:', error);
    return res.status(500).json({ error: 'Failed to save settings' });
  }
});

// ==========================================
// 13. HERO CONTENT
// ==========================================
router.get('/hero', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let content = await (HeroContent.findOne as any)().lean();
    if (!content) {
      content = {
        brandingText: 'Max iT',
        titleLine1: 'Solar Energy &',
        titleLine2: 'Smart Automation',
        description: 'Empowering your future with sustainable energy solutions, advanced agro-technology, and intelligent industrial automation.',
        stats: [
          { end: 50, suffix: '+', label: 'Projects' },
          { end: 30, suffix: '+', label: 'Clients' },
          { end: 10, suffix: '+', label: 'Years Exp' },
          { end: 24, suffix: '/7', label: 'Support' }
        ]
      };
    }
    return res.json(content);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return res.status(500).json({ error: 'Failed to fetch hero content' });
  }
});

router.post('/hero', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let content = await (HeroContent.findOne as any)();
    if (content) {
      Object.assign(content, req.body);
      await content.save();
    } else {
      content = await HeroContent.create(req.body);
    }
    return res.json(content);
  } catch (error) {
    console.error('Error saving hero content:', error);
    return res.status(500).json({ error: 'Failed to save hero content' });
  }
});

// ==========================================
// 14. LEGAL PAGES
// ==========================================
router.get('/legal', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let legal = await (LegalPage.findOne as any)().lean();
    if (!legal) {
      legal = {
        privacyPolicy: 'Privacy Policy content goes here...',
        termsOfService: 'Terms of Service content goes here...'
      };
    }
    return res.json(legal);
  } catch (error) {
    console.error('Error fetching legal pages:', error);
    return res.status(500).json({ error: 'Failed to fetch legal pages' });
  }
});

router.post('/legal', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let legal = await (LegalPage.findOne as any)();
    if (legal) {
      Object.assign(legal, req.body);
      await legal.save();
    } else {
      legal = await LegalPage.create(req.body);
    }
    return res.json(legal);
  } catch (error) {
    console.error('Error saving legal pages:', error);
    return res.status(500).json({ error: 'Failed to save legal pages' });
  }
});

// ==========================================
// 15. CEO
// ==========================================
router.get('/ceo', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const ceo = await (TeamMember.findOne as any)({ isCeo: true });
    return res.json(ceo || {});
  } catch (error) {
    console.error('Error fetching CEO:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/ceo', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { name, nickname, officialTitle, functionalDesignation, image, message, socialLinks } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    let ceo = await (TeamMember.findOne as any)({ isCeo: true });
    const updateData = {
      name,
      nickname: nickname || '',
      position: officialTitle || 'CEO',
      officialTitle: officialTitle || '',
      functionalDesignation: functionalDesignation || '',
      photoUrl: image || req.body.photoUrl || '',
      message: message || '',
      socialLinks: socialLinks || { linkedin: '', email: '' },
      isCeo: true,
    };
    if (ceo) {
      ceo = await (TeamMember.findByIdAndUpdate as any)(ceo._id, updateData, { new: true });
    } else {
      ceo = await TeamMember.create(updateData);
    }
    return res.json(ceo);
  } catch (error) {
    console.error('Error updating CEO:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// 16. COMPANY PROFILE DATA
// ==========================================
const DEFAULT_COMPANY_DATA = {
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

router.get('/company-profile-data', optionalAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let data = await (CompanyProfileData.findOne as any)().lean();
    if (!data) {
      data = DEFAULT_COMPANY_DATA;
    }
    return res.json(data);
  } catch (error) {
    console.error('Error fetching company profile data:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.post('/company-profile-data', requireAuth, async (req: Request, res: Response) => {
  try {
    await dbConnect();
    let data = await (CompanyProfileData.findOne as any)();
    if (data) {
      Object.assign(data, req.body);
      await data.save();
    } else {
      data = await CompanyProfileData.create(req.body);
    }
    return res.json(data);
  } catch (error) {
    console.error('Error saving company profile data:', error);
    return res.status(500).json({ error: 'Failed to save data' });
  }
});

export default router;
