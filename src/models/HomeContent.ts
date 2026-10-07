import mongoose from 'mongoose';

const HomeContentSchema = new mongoose.Schema(
  {
    hero: {
      visible: { type: Boolean, default: true },
      backgroundImage: { type: String, default: '/images/hero-bg.jpg' },
      titleLine1: { type: String, default: 'Solar Energy &' },
      titleLine2: { type: String, default: 'Smart Automation' },
      subtitle: { type: String, default: 'Empowering your future with sustainable energy solutions, advanced agro-technology, and intelligent industrial automation.' },
      stats: [{ 
        label: String, 
        number: String, 
        order: { type: Number, default: 0 }
      }]
    },

    servicesSection: {
      visible: { type: Boolean, default: true },
      headingNormal: { type: String, default: 'Everything You Need, Under ' },
      headingHighlight: { type: String, default: 'One Roof' },
      subtext: { type: String, default: 'From solar and irrigation to networking, automation, electrical work, and CCTV, we handle the full job so you deal with one reliable team.' },
      services: [{
        icon: String,
        isCustomIcon: Boolean,
        title: String,
        description: String,
        order: { type: Number, default: 0 }
      }]
    },

    milestones: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: 'Milestones That Define Our Impact' },
      stats: [{
        number: String,
        label: String,
        order: { type: Number, default: 0 }
      }]
    },

    videosSection: {
      visible: { type: Boolean, default: true },
      headingNormal: { type: String, default: 'Pioneering the ' },
      headingHighlight: { type: String, default: 'Solar Frontier' },
      subtext: { type: String, default: 'Explore our state-of-the-art videography and see how Max iT Solution is reshaping the energy landscape with break-through technologies.' },
      videos: [{
        youtubeLink: String,
        videoId: String,
        title: String,
        description: String,
        customThumbnail: String,
        active: { type: Boolean, default: true },
        order: { type: Number, default: 0 }
      }]
    },

    whyChooseUs: {
      visible: { type: Boolean, default: true },
      headingNormal: { type: String, default: 'Why Choose ' },
      headingHighlight: { type: String, default: 'Max iT Solution?' },
      subtext: { type: String, default: 'We are dedicated to empowering businesses and homes with sustainable energy, advanced agricultural technology, and smart automation solutions.' },
      cards: [{
        icon: String,
        isCustomIcon: Boolean,
        title: String,
        description: String,
        accentColor: String,
        order: { type: Number, default: 0 }
      }],
      button: {
        label: { type: String, default: 'Learn More About Us' },
        link: { type: String, default: '/about' }
      }
    },

    aboutPreview: {
      visible: { type: Boolean, default: true },
      image: { type: String, default: '/images/slides/agro_solar_slide_1789677870674.jpg' },
      headingNormal: { type: String, default: 'About ' },
      headingHighlight: { type: String, default: 'Max iT Solution' },
      paragraph: { type: String, default: 'We are dedicated to empowering businesses and homes with sustainable energy, advanced agricultural technology, and smart automation solutions.' },
      primaryButton: {
        label: { type: String, default: 'Discover Our Journey' },
        link: { type: String, default: '/about' }
      },
      secondaryButton: {
        label: { type: String, default: 'Company Profile' },
        link: { type: String, default: '/company-profile' }
      }
    },

    testimonialsSection: {
      visible: { type: Boolean, default: true },
      headingNormal: { type: String, default: 'Client ' },
      headingHighlight: { type: String, default: 'Success Stories' },
      subtext: { type: String, default: "Don't just take our word for it — hear from the visionaries who have experienced the Max iT difference firsthand." }
    },

    partnersSection: {
      visible: { type: Boolean, default: true },
      headingNormal: { type: String, default: 'Technologies & Partners with ' },
      headingHighlight: { type: String, default: 'Max iT' },
      subtext: { type: String, default: '' }
    },

    teamSection: {
      visible: { type: Boolean, default: true },
      headingNormal: { type: String, default: 'Max iT ' },
      headingHighlight: { type: String, default: 'Management' },
      subtext: { type: String, default: 'Meet the leaders driving our technology and engineering solutions forward.' },
      button: {
        label: { type: String, default: 'View full team' },
        link: { type: String, default: '/team' }
      }
    },

    ctaSection: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: 'Ready to Power Your Future?' },
      text: { type: String, default: 'Let\'s work together to implement sustainable and intelligent solutions that scale with your ambitions. Get in touch with us today!' },
      primaryButton: {
        label: { type: String, default: 'Get Started Today' },
        link: { type: String, default: '/contact' }
      },
      secondaryButton: {
        label: { type: String, default: 'View Our Work' },
        link: { type: String, default: '/services' }
      },
      backgroundImage: { type: String, default: '/images/slides/commercial_rooftop_slide_1789677880098.jpg' }
    }
  },
  { timestamps: true }
);

export default mongoose.models.HomeContent || mongoose.model('HomeContent', HomeContentSchema);
