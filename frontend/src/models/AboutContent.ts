import mongoose from 'mongoose';

const AboutContentSchema = new mongoose.Schema(
  {
    journey: { type: String, required: true },
    mission: { type: String, required: true },
    vision: { type: String, required: true },
    missionTitle: { type: String, default: "Our Mission" },
    visionTitle: { type: String, default: "Our Vision" },
    aboutHeaderTitle: { type: String, default: "The Story Behind Max iT" },
    aboutHeaderSubtitle: { type: String },
    heroSlides: { 
      type: [{ image: String, title: String, subtitle: String }], 
      default: [
        { image: "/images/slides/commercial_rooftop_slide_1789677880098.jpg", title: "Innovating Since 2014", subtitle: "Building the infrastructure of tomorrow." }
      ]
    },
    whatSetsUsApartTitle: { type: String, default: "What Sets Us Apart" },
    whatSetsUsApartSubtitle: { type: String, default: "Why forward-thinking companies choose Max iT as their trusted technology partner." },
    features: { type: [{ icon: String, title: String, desc: String }], default: [] },
    coreValuesTitle: { type: String, default: "Our Core Values" },
    coreValuesSubtitle: { type: String, default: "These guiding principles shape our culture, drive our decisions, and define how we interact with our clients and the world." },
    coreValues: { type: [{ icon: String, title: String, desc: String }], default: [] },
    projectGalleryTitle: { type: String, default: "Our Projects" },
    projectGallerySubtitle: { type: String, default: "A glimpse into our operational excellence and the technology that drives us." },
    galleryProjects: { 
      type: [{ image: String, title: String }],
      default: [
        { image: "/images/slides/agro_solar_slide_1789677870674.jpg", title: "Agro Solar Project" },
        { image: "/images/slides/iot_smart_home_slide_1789677856585.jpg", title: "Smart Home Tech" },
        { image: "/images/slides/networking_service_1789678979212.jpg", title: "Networking Infrastructure" }
      ]
    },
    ctaTitle: { type: String, default: "Ready to Transform Your Future?" },
    ctaSubtitle: { type: String, default: "Whether you need scalable solar energy, industrial automation, or enterprise networking, our team is ready to build your solution." }
  },
  { timestamps: true }
);

export default mongoose.models.AboutContent || mongoose.model('AboutContent', AboutContentSchema);
