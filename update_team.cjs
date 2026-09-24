const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(process.cwd(), 'data', 'team.json');

const teamData = {
  ceo: {
    name: "Engr. Zahangir Alam",
    nickname: "(Sobuj)",
    designation: "Chief Executive Officer",
    image: "/team-images/ceo-maxit.png",
    message: "At Max IT Solution LTD., we believe that technology should serve people, empower communities, and create lasting impact. Since the beginning of our journey, we have been driven by a simple yet powerful mission: to provide reliable, innovative, and sustainable solutions that address real-world challenges faced by businesses and communities alike.\n\nWhether it is supporting business operations through our IT services or contributing to rural development through renewable energy and agro-based technologies, we remain committed to delivering excellence in everything we do.\n\nAs we continue to grow, we stay grounded in our core values of professionalism, integrity, and service. I am proud of the work we have accomplished so far, and I am even more excited about the future we are building together.",
    socialLinks: {
      linkedin: "https://www.linkedin.com/feed/",
      email: "sales@m4xit.com"
    }
  },
  members: [
    // 1. Board of Directors
    {
      id: "team_board_1",
      name: "Subnom Mostari",
      designation: "Chairperson of the Board",
      department: "Board of Directors",
      description: "Oversees the strategic goals, long-term investment plans, and corporate governance of Max IT Solution Ltd. as the head of the board of directors. She provides top-level guardianship to ensure the institution's financial discipline, legal compliance, and policy transparency.",
      image: "",
      socialLinks: {},
      order: 1
    },
    {
      id: "team_board_2",
      name: "Engr. Md. Zahangir Alam",
      designation: "Managing Director & CEO",
      department: "Board of Directors",
      description: "An experienced engineer with a postgraduate degree in Electrical and Electronic Engineering, leading the overall operations, technological innovation, and commercial growth of the institution. He has extensive field-level experience in implementing mega rooftop and ground solar power systems, industrial automation, and precision engineering projects.",
      image: "/team-images/ceo-maxit.png",
      socialLinks: {},
      order: 2
    },
    {
      id: "team_board_3",
      name: "Amaira",
      designation: "Honorary Director",
      department: "Board of Directors",
      description: "The institutional successor of the future generation as part of the international family corporate structure. She serves as a symbolic goodwill ambassador for the institution's commitment to building a sustainable and green earth for future generations, focusing on clean energy and carbon reduction.",
      image: "",
      socialLinks: {},
      order: 3
    },
    
    // 2. Advisory Council
    {
      id: "team_adv_1",
      name: "Md. Ruhul Amin Siddiqui",
      designation: "Senior Corporate & Technical Advisor",
      department: "Advisory Council",
      description: "Provides technical and policy guidance to the Board of Directors and top executives regarding long-term institutional expansion, national and international partnerships, and mega projects.",
      image: "",
      socialLinks: {},
      order: 4
    },

    // 3. Core Engineering & R&D Wing
    {
      id: "team_rnd_1",
      name: "MD JAHID HASSAN",
      designation: "Mechanical & Product Design Engineer",
      department: "Core Engineering & R&D Wing",
      description: "Ensures 3D CAD modeling of solar and electronics equipment, as well as the structural stability and thermal dissipation design of metal enclosures and control panel cabinets.",
      image: "",
      socialLinks: {},
      order: 5
    },
    {
      id: "team_rnd_2",
      name: "Md. Asaduzzaman",
      designation: "Senior Electrical Maintenance & O&M Engineer",
      department: "Core Engineering & R&D Wing",
      description: "Ensures preventive and breakdown maintenance, field troubleshooting, and uninterrupted power runtime for industrial VFDs, PLC control panels, and solar inverters.",
      image: "",
      socialLinks: {},
      order: 6
    },
    {
      id: "team_rnd_3",
      name: "Md. Rubel",
      designation: "Surveillance, Network & Grounding Systems Engineer",
      department: "Core Engineering & R&D Wing",
      description: "Designs and implements IP CCTV camera surveillance, Local Area Network (LAN), rolling communication tower connectivity, and dedicated grounding/earthing and Lightning Protection Systems (LPS) for solar systems.",
      image: "",
      socialLinks: {},
      order: 7
    },
    {
      id: "team_rnd_4",
      name: "Sarwar Jahan",
      designation: "Software Engineer - Automation & IoT",
      department: "Core Engineering & R&D Wing",
      description: "Assists in managing industrial sensor integration, remote data acquisition, cloud monitoring, and smart control architecture.",
      image: "",
      socialLinks: {},
      order: 8
    },
    {
      id: "team_rnd_5",
      name: "Rashedul Islam",
      designation: "Digital Infrastructure & Media Engineer",
      department: "Core Engineering & R&D Wing",
      description: "Assists in managing digital infrastructure and media.",
      image: "",
      socialLinks: {},
      order: 9
    },
    {
      id: "team_rnd_6",
      name: "Md. Emon Ali",
      designation: "Project Site Engineer / Field Trainee",
      department: "Core Engineering & R&D Wing",
      description: "Assists the engineering team in the project execution directory, site measurements, technical drafting, and drawing verification.",
      image: "",
      socialLinks: {},
      order: 10
    },

    // 4. Technical Field Staff
    {
      id: "team_tech_1",
      name: "Senior Electrical Technician (Wiring & Site)",
      designation: "Technician",
      department: "Technical Field Staff",
      description: "Expert in site wiring, cable tray layout, and panel fabrication.",
      image: "",
      socialLinks: {},
      order: 11
    },
    {
      id: "team_tech_2",
      name: "Senior Electrical Technician (Service & VFD)",
      designation: "Technician",
      department: "Technical Field Staff",
      description: "Provides assistance with inverter repair and motor drive servicing.",
      image: "",
      socialLinks: {},
      order: 12
    },
    {
      id: "team_tech_3",
      name: "Site Safety & Grounding Technician",
      designation: "Technician",
      department: "Technical Field Staff",
      description: "Expert in earthing boring, copper rod installation, and lightning arrester safety.",
      image: "",
      socialLinks: {},
      order: 13
    },

    // 5. Global Supply Chain & Procurement Division
    {
      id: "team_supply_1",
      name: "Fahad Hossain Shovon",
      designation: "Lead Global Sourcing & Supplier Quality (East Asia)",
      department: "Global Supply Chain & Procurement",
      description: "Workplace: China, Taiwan, and East Asia Hub\nDirectly inspects Tier-1 solar cell, lithium battery module, and inverter manufacturing plants, oversees Factory Acceptance Tests (FAT), and secures wholesale partnerships.",
      image: "",
      socialLinks: {},
      order: 14
    },
    {
      id: "team_supply_2",
      name: "Rana Sheikh",
      designation: "Senior Specialist - Global Procurement & Technology Partnerships",
      department: "Global Supply Chain & Procurement",
      description: "Workplace: Germany, Europe, and International Market\nCoordinates the sourcing of European standard automation sensors, VFD drive controllers, and power protection equipment, alongside managing strategic agreements with Original Equipment Manufacturers (OEMs).",
      image: "",
      socialLinks: {},
      order: 15
    },
    {
      id: "team_supply_3",
      name: "Titu",
      designation: "Manager - Local Supply Chain, Customs & Site Logistics (Bangladesh)",
      department: "Global Supply Chain & Procurement",
      description: "Workplace: Dhaka Head Office, Sea-port/Airport, and Site Warehouse\nEnsures customs clearance of international shipments, port coordination, local electrical accessories collection, and the timely delivery of materials to various mega project sites.",
      image: "",
      socialLinks: {},
      order: 16
    },

    // 6. Corporate, Finance, HR & Tender Wing
    {
      id: "team_corp_1",
      name: "Amjad Hossen",
      designation: "Manager Finance & Corporate Accounts",
      department: "Corporate, Finance, HR & Tender",
      description: "Handles invoicing, billing, banking, VAT-tax compliance, and financial accounting.",
      image: "",
      socialLinks: {},
      order: 17
    },
    {
      id: "team_corp_2",
      name: "Tauhidur Rahman Rony",
      designation: "Executive HR, Admin & Compliance",
      department: "Corporate, Finance, HR & Tender",
      description: "Manages office administration, corporate policy, human resources coordination, and legal documents.",
      image: "",
      socialLinks: {},
      order: 18
    },
    {
      id: "team_corp_3",
      name: "Hanif Sikder",
      designation: "Executive Tenders & Corporate Affairs",
      department: "Corporate, Finance, HR & Tender",
      description: "Oversees government and private mega tender documentation, RFP processing, and client communication.",
      image: "",
      socialLinks: {},
      order: 19
    },

    // 7. Facilities & Logistics Support
    {
      id: "team_fac_1",
      name: "Zahid",
      designation: "Office Assistant & Logistics Support",
      department: "Facilities & Logistics Support",
      description: "Responsible for office cleaning and environmental maintenance, guest hospitality, banking/urgent document delivery, and maintaining all incoming/outgoing parcel and courier registers.",
      image: "",
      socialLinks: {},
      order: 20
    },
    {
      id: "team_fac_2",
      name: "Md. Delower Hoss",
      designation: "Executive Driver & Fleet Assistant",
      department: "Facilities & Logistics Support",
      description: "Operates company executive vehicles, transports officials for site visits and urgent spare parts, and maintains vehicle fitness, route permits, and fuel logbooks.",
      image: "",
      socialLinks: {},
      order: 21
    }
  ]
};

fs.writeFileSync(dataFilePath, JSON.stringify(teamData, null, 2));
console.log("Team data updated successfully!");
