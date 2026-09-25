import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  shortDescription: String,
  category: String,
  client: String,
  date: String,
  technologies: [String],
  imageUrl: String,
  order: Number
}, { timestamps: true });
const Project = mongoose.model('Project', ProjectSchema);

const projects = [
  {
    title: 'Eco-Smart Villa Automation',
    shortDescription: 'Complete home automation with integrated solar power management.',
    fullDescription: 'For this modern luxury villa, we implemented a comprehensive smart home solution that seamlessly integrates with a newly installed 10kW solar power system. The project features automated lighting, climate control, and security systems, all managed through custom-designed wall-mounted touch panels and a mobile app. The system optimizes energy usage by utilizing solar power during peak production and switching to battery storage during off-peak hours.',
    category: 'Smart Home & Solar',
    client: 'Private Residence',
    date: 'August 2026',
    technologies: ['KNX Automation', 'SolarEdge Inverters', 'Tesla Powerwall', 'Custom App'],
    image: '/images/projects/smart_home.jpg'
  },
  {
    title: 'Automated Hydroponic Greenhouse',
    shortDescription: 'High-tech greenhouse with automated climate and irrigation control.',
    fullDescription: 'This commercial agro-tech project involved designing and installing a fully automated control system for a 5,000 sq ft hydroponic greenhouse. Our system monitors temperature, humidity, CO2 levels, and nutrient concentrations in real-time. Automated irrigation and LED grow light schedules ensure optimal growing conditions, resulting in a 30% increase in crop yield and a 40% reduction in water usage compared to traditional farming methods.',
    category: 'Agro Tech',
    client: 'FreshHarvest Farms',
    date: 'May 2026',
    technologies: ['IoT Sensors', 'Automated Irrigation', 'LED Grow Lights', 'Cloud Analytics'],
    image: '/images/projects/agro_tech.jpg'
  },
  {
    title: 'Urban Solar Roof Integration',
    shortDescription: 'Sleek, highly efficient solar roof installation for a modern home.',
    fullDescription: 'We designed and installed a custom, aesthetically pleasing solar energy system for a newly constructed modern home. The 15kW system utilizes premium, low-profile black solar panels that blend seamlessly with the home\'s architecture. Integrated with a smart energy gateway, the homeowners can track real-time energy production and consumption, allowing them to achieve net-zero energy status.',
    category: 'Solar Energy',
    client: 'The Anderson Family',
    date: 'February 2026',
    technologies: ['Premium Black Solar Panels', 'Smart Energy Gateway', 'Microinverters'],
    image: '/images/projects/solar_home.jpg'
  },
  {
    title: 'Commercial Solar Farm',
    shortDescription: 'Large-scale solar energy plant for a manufacturing facility.',
    fullDescription: 'Installed a 500kW solar farm on the roof and unused land of a large manufacturing facility. This project provides clean energy to offset up to 70% of the factory\'s power consumption. We also integrated advanced battery storage and a smart grid management system to handle peak loads.',
    category: 'Solar Energy',
    client: 'Industrial Corp Ltd.',
    date: 'July 2026',
    technologies: ['Commercial Solar Panels', 'Smart Grid Integration', 'Battery Storage'],
    image: '/images/projects/solar_home.jpg'
  },
  {
    title: 'Smart Office Automation',
    shortDescription: 'Intelligent climate and lighting control for corporate offices.',
    fullDescription: 'Transformed a traditional 10,000 sq ft office space into a smart, energy-efficient workplace. By integrating IoT sensors, automated window blinds, and intelligent HVAC systems, the office now dynamically adjusts to occupancy and natural sunlight, reducing energy bills by 25% while improving employee comfort.',
    category: 'Smart Home & Solar',
    client: 'TechHub Solutions',
    date: 'June 2026',
    technologies: ['IoT Sensors', 'HVAC Automation', 'Smart Lighting'],
    image: '/images/projects/smart_home.jpg'
  },
  {
    title: 'Automated Poultry Farm',
    shortDescription: 'Climate control and automated feeding for a modern poultry farm.',
    fullDescription: 'Designed and installed a complete automation system for a commercial poultry farm. The system includes automated temperature and ventilation control, synchronized feeding and watering schedules, and real-time health monitoring via sensors. This led to significantly lower mortality rates and higher efficiency.',
    category: 'Agro Tech',
    client: 'Sunrise Poultry',
    date: 'April 2026',
    technologies: ['Climate Sensors', 'Automated Feeders', 'Ventilation Control'],
    image: '/images/projects/agro_tech.jpg'
  },
  {
    title: 'Residential Solar + Battery',
    shortDescription: 'Hybrid solar and battery system for complete grid independence.',
    fullDescription: 'Fitted a suburban home with a robust 8kW solar system coupled with dual high-capacity battery units. This setup allows the home to run entirely off-grid during the summer months and provides reliable backup power during winter storms. The entire system is monitored through our custom mobile application.',
    category: 'Solar Energy',
    client: 'The Miller Residence',
    date: 'January 2026',
    technologies: ['Hybrid Inverter', 'Lithium-ion Batteries', 'Solar Panels'],
    image: '/images/projects/solar_home.jpg'
  },
  {
    title: 'Luxury Apartment IoT',
    shortDescription: 'Seamless voice and app-controlled automation for a penthouse.',
    fullDescription: 'Upgraded a luxury penthouse with a unified smart home ecosystem. The homeowners can control entertainment, lighting, climate, and security using voice commands or centralized wall tablets. Custom "scenes" were created to instantly set the mood for movie nights, dinner parties, or relaxation.',
    category: 'Smart Home & Solar',
    client: 'Private Client',
    date: 'December 2025',
    technologies: ['Voice Control', 'Home Assistant', 'Smart Security'],
    image: '/images/projects/smart_home.jpg'
  },
  {
    title: 'Precision Irrigation System',
    shortDescription: 'Smart water management for open-field agriculture.',
    fullDescription: 'Deployed a smart irrigation system across a 50-acre vegetable farm. Using soil moisture sensors and local weather data, the system automatically determines exactly when and how much water to distribute to different zones. This precision approach saved millions of liters of water over the season.',
    category: 'Agro Tech',
    client: 'Green Acres Farm',
    date: 'November 2025',
    technologies: ['Soil Moisture Sensors', 'Automated Valves', 'Weather API'],
    image: '/images/projects/agro_tech.jpg'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    const count = await Project.countDocuments();
    if (count === 0) {
      const docs = projects.map((p, index) => ({
        title: p.title,
        description: p.fullDescription,
        shortDescription: p.shortDescription,
        category: p.category,
        client: p.client,
        date: p.date,
        technologies: p.technologies,
        imageUrl: p.image,
        order: index + 1
      }));
      await Project.insertMany(docs);
      console.log('Seeded projects');
    } else {
      console.log('Projects already seeded');
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
seed();
