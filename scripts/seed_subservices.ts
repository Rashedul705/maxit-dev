import dbConnect from './src/lib/mongodb.ts';
import Service from './src/models/Service.ts';

const updateServices = async () => {
  await dbConnect();
  await Service.deleteMany({}); // clear existing
  
  const services = [
    { 
      title: "Solar Energy", 
      description: "Expert installation ensuring optimal performance, safety, and long-term reliability across residential, commercial, and industrial solar projects.", 
      iconCategory: "Sun",
      subServices: ["Solar Installation", "Roof Top Solar", "Complete Solar Setup", "Net Metering", "Solar Lift Integration", "Maintenance & Support"],
      order: 1
    },
    { 
      title: "Irrigation & Water", 
      description: "Advanced solar-powered pumping systems integrated with smart technology for highly efficient agricultural water management.", 
      iconCategory: "Droplets",
      subServices: ["Solar Water Pumps", "Smart Irrigation Systems", "Agricultural Piping", "Water Flow Monitoring", "Maintenance Services"],
      order: 2
    },
    { 
      title: "IT & Networking", 
      description: "Robust network infrastructure design and reliable high-speed connectivity solutions for businesses and organizations.", 
      iconCategory: "Wifi",
      subServices: ["Network Infrastructure Design", "Fiber Optic Installation", "Enterprise Wi-Fi", "Server Setup", "IT Support"],
      order: 3
    },
    { 
      title: "Automation & Civil Works", 
      description: "Intelligent control systems and structural civil engineering services to modernize your operational infrastructure.", 
      iconCategory: "Settings",
      subServices: ["Smart Home Systems", "Industrial Automation", "Structural Engineering", "Site Preparation", "System Upgrades"],
      order: 4
    },
    { 
      title: "Power & Electrical", 
      description: "Comprehensive electrical planning, wiring, and safe power distribution services for diverse project scales.", 
      iconCategory: "Zap",
      subServices: ["Electrical Wiring", "Power Distribution Panels", "Safety Inspections", "Generator Setup", "Industrial Cabling"],
      order: 5
    },
    { 
      title: "CCTV Surveillance", 
      description: "Professional IP camera systems and advanced surveillance solutions providing reliable 24/7 security monitoring.", 
      iconCategory: "Cctv",
      subServices: ["IP Camera Setup", "NVR / DVR Systems", "Remote Monitoring Setup", "Access Control Systems", "Security Audits"],
      order: 6
    }
  ];

  for (const s of services) {
    await Service.create(s);
  }
  
  console.log("Done updating services");
  process.exit(0);
};

updateServices();
