import mongoose from 'mongoose';

const AboutContentSchema = new mongoose.Schema(
  {
    journey: { type: String, required: true },
    mission: { type: String, required: true },
    vision: { type: String, required: true },
    aboutHeaderTitle: { type: String, default: "The Story Behind Max iT" },
    aboutHeaderSubtitle: { type: String },
    whatSetsUsApartTitle: { type: String, default: "What Sets Us Apart" },
    whatSetsUsApartSubtitle: { type: String, default: "Why forward-thinking companies choose Max iT as their trusted technology partner." },
    features: { type: [{ title: String, desc: String }], default: [] },
    coreValuesTitle: { type: String, default: "Our Core Values" },
    coreValuesSubtitle: { type: String, default: "These guiding principles shape our culture, drive our decisions, and define how we interact with our clients and the world." },
    coreValues: { type: [{ title: String, desc: String }], default: [] },
    behindTheScenesTitle: { type: String, default: "Behind The Scenes" },
    behindTheScenesSubtitle: { type: String, default: "A glimpse into our operational excellence and the technology that drives us." },
    ctaTitle: { type: String, default: "Ready to Transform Your Future?" },
    ctaSubtitle: { type: String, default: "Whether you need scalable solar energy, industrial automation, or enterprise networking, our team is ready to build your solution." }
  },
  { timestamps: true }
);

export default mongoose.models.AboutContent || mongoose.model('AboutContent', AboutContentSchema);
