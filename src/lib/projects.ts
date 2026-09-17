export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  client: string;
  date: string;
  technologies: string[];
  image: string;
}

export const projects: Project[] = [
  {
    id: 'eco-smart-villa',
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
    id: 'greenhouse-agro-tech',
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
    id: 'urban-solar-integration',
    title: 'Urban Solar Roof Integration',
    shortDescription: 'Sleek, highly efficient solar roof installation for a modern home.',
    fullDescription: 'We designed and installed a custom, aesthetically pleasing solar energy system for a newly constructed modern home. The 15kW system utilizes premium, low-profile black solar panels that blend seamlessly with the home\'s architecture. Integrated with a smart energy gateway, the homeowners can track real-time energy production and consumption, allowing them to achieve net-zero energy status.',
    category: 'Solar Energy',
    client: 'The Anderson Family',
    date: 'February 2026',
    technologies: ['Premium Black Solar Panels', 'Smart Energy Gateway', 'Microinverters'],
    image: '/images/projects/solar_home.jpg'
  }
];
