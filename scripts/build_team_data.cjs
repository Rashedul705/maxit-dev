const fs = require('fs');
const path = require('path');

const members = [
  // 1. Board of Directors
  {
    id: "team_1",
    name: "Subnom Mostari",
    officialTitle: "Chairperson of the Board",
    functionalDesignation: "Chairman",
    department: "Board of Directors & Strategic Governance",
    section: "Board of Directors",
    bio: "Oversees the strategic goals, long-term investment plans, and corporate governance of Max IT Solution Ltd. as the head of the board of directors. She provides top-level guardianship to ensure the institution's financial discipline, legal compliance, and policy transparency.",
    order: 1
  },
  {
    id: "team_2",
    name: "Engr. Md. Zahangir Alam",
    officialTitle: "Managing Director & Chief Executive Officer (MD & CEO)",
    functionalDesignation: "Founder & Managing Director",
    department: "Executive Management & Engineering Architecture",
    section: "Board of Directors",
    bio: "An experienced engineer with a postgraduate degree in Electrical and Electronic Engineering, leading the overall operations, technological innovation, and commercial growth of the institution. He has extensive field-level experience in implementing mega rooftop and ground solar power systems, industrial automation, and precision engineering projects.",
    order: 2
  },
  {
    id: "team_3",
    name: "Amaira",
    officialTitle: "Honorary Director",
    functionalDesignation: "Goodwill Ambassador",
    department: "Corporate Social Responsibility (CSR) & Next-Gen Legacy",
    section: "Board of Directors",
    bio: "The institutional successor of the future generation as part of the international family corporate structure. She serves as a symbolic goodwill ambassador for the institution's commitment to building a sustainable and green earth for future generations, focusing on clean energy and carbon reduction.",
    order: 3
  },

  // 2. Advisory Council
  {
    id: "team_4",
    name: "Md. Ruhul Amin Siddiqui",
    officialTitle: "Senior Corporate & Technical Advisor",
    functionalDesignation: "",
    department: "Institutional Advisory & Strategic Counsel",
    section: "Advisory Council",
    bio: "Provides technical and policy guidance to the Board of Directors and top executives regarding long-term institutional expansion, national and international partnerships, and mega projects.",
    order: 4
  },

  // 3. Core Engineering & R&D Wing
  {
    id: "team_5",
    name: "MD JAHID HASSAN",
    officialTitle: "Mechanical & Product Design Engineer",
    functionalDesignation: "",
    department: "Research, Development & Product Architecture",
    section: "Core Engineering & R&D Wing",
    bio: "Ensures 3D CAD modeling of solar and electronics equipment, as well as the structural stability and thermal dissipation design of metal enclosures and control panel cabinets.",
    order: 5
  },
  {
    id: "team_6",
    name: "Md. Asaduzzaman",
    officialTitle: "Senior Electrical Maintenance & O&M Engineer",
    functionalDesignation: "",
    department: "Power Systems, Service & Industrial O&M",
    section: "Core Engineering & R&D Wing",
    bio: "Ensures preventive and breakdown maintenance, field troubleshooting, and uninterrupted power runtime for industrial VFDs, PLC control panels, and solar inverters.",
    order: 6
  },
  {
    id: "team_7",
    name: "Md.Rubel",
    officialTitle: "Surveillance, Network & Grounding Systems Engineer",
    functionalDesignation: "",
    department: "Infrastructure, ELV & Safety Systems",
    section: "Core Engineering & R&D Wing",
    bio: "Designs and implements IP CCTV camera surveillance, Local Area Network (LAN), rolling communication tower connectivity, and dedicated grounding/earthing and Lightning Protection Systems (LPS) for solar systems.",
    order: 7
  },
  {
    id: "team_8",
    name: "Sarwar Jahan",
    officialTitle: "Software Engineer- Automation & IoT",
    functionalDesignation: "",
    department: "Industrial Automation & Smart Telemetry",
    section: "Core Engineering & R&D Wing",
    bio: "Assists in managing industrial sensor integration, remote data acquisition, cloud monitoring, and smart control architecture.",
    order: 8
  },
  {
    id: "team_8_1",
    name: "Rashedul Islam",
    officialTitle: "Digital Infrastructure & Media Engineer",
    functionalDesignation: "",
    department: "Digital Infrastructure & Media",
    section: "Core Engineering & R&D Wing",
    bio: "Assists in managing digital infrastructure and media engineering tasks.",
    order: 9
  },
  {
    id: "team_9",
    name: "Md. Emon Ali",
    officialTitle: "Project Site Engineer / Field Trainee",
    functionalDesignation: "",
    department: "Field Operations & Project Documentation",
    section: "Core Engineering & R&D Wing",
    bio: "Assists the engineering team in the project execution directory, site measurements, technical drafting, and drawing verification.",
    order: 10
  },

  // 4. Technical Field Staff
  {
    id: "team_10",
    name: "Senior Electrical Technician (Wiring & Site)",
    officialTitle: "Senior Technician",
    functionalDesignation: "",
    department: "Technical Field Staff",
    section: "Technical Field Staff",
    bio: "Expert in site wiring, cable tray layout, and panel fabrication.",
    order: 11
  },
  {
    id: "team_11",
    name: "Senior Electrical Technician (Service & VFD)",
    officialTitle: "Senior Technician",
    functionalDesignation: "",
    department: "Technical Field Staff",
    section: "Technical Field Staff",
    bio: "Provides assistance with inverter repair and motor drive servicing.",
    order: 12
  },
  {
    id: "team_12",
    name: "Site Safety & Grounding Technician",
    officialTitle: "Safety Technician",
    functionalDesignation: "",
    department: "Technical Field Staff",
    section: "Technical Field Staff",
    bio: "Expert in earthing boring, copper rod installation, and lightning arrester safety.",
    order: 13
  },

  // 5. Global Supply Chain & Procurement Division
  {
    id: "team_14a",
    name: "Fahad Hossain Shovon",
    officialTitle: "Lead Global Sourcing & Supplier Quality (East Asia)",
    functionalDesignation: "East Asia Hub",
    department: "Global Supply Chain & Procurement Division",
    section: "Global Supply Chain & Procurement Division",
    bio: "Directly inspects Tier-1 solar cell, lithium battery module, and inverter manufacturing plants, oversees Factory Acceptance Tests (FAT), and secures wholesale partnerships.",
    order: 14
  },
  {
    id: "team_14b",
    name: "Rana Sheikh",
    officialTitle: "Senior Specialist - Global Procurement & Technology Partnerships",
    functionalDesignation: "Europe & Global Hub",
    department: "Global Supply Chain & Procurement Division",
    section: "Global Supply Chain & Procurement Division",
    bio: "Coordinates the sourcing of European standard automation sensors, VFD drive controllers, and power protection equipment, alongside managing strategic agreements with Original Equipment Manufacturers (OEMs).",
    order: 15
  },
  {
    id: "team_14c",
    name: "Titu",
    officialTitle: "Manager - Local Supply Chain, Customs & Site Logistics (Bangladesh)",
    functionalDesignation: "Bangladesh Logistics",
    department: "Global Supply Chain & Procurement Division",
    section: "Global Supply Chain & Procurement Division",
    bio: "Ensures customs clearance of international shipments, port coordination, local electrical accessories collection, and the timely delivery of materials to various mega project sites.",
    order: 16
  },

  // 6. Corporate, Finance, HR & Tender Wing
  {
    id: "team_13",
    name: "Amjad Hossen",
    officialTitle: "Manager Finance & Corporate Accounts",
    functionalDesignation: "",
    department: "Finance and Accounts",
    section: "Corporate, Finance, HR & Tender Wing",
    bio: "Handles invoicing, billing, banking, VAT-tax compliance, and financial accounting.",
    order: 17
  },
  {
    id: "team_15",
    name: "Tauhidur Rahman Rony",
    officialTitle: "Executive HR, Admin & Compliance",
    functionalDesignation: "",
    department: "Human Resources & Administration",
    section: "Corporate, Finance, HR & Tender Wing",
    bio: "Manages office administration, corporate policy, human resources coordination, and legal documents.",
    order: 18
  },
  {
    id: "team_16",
    name: "Hanif Sikder",
    officialTitle: "Executive Tenders & Corporate Affairs",
    functionalDesignation: "",
    department: "Tender & Government Procurement",
    section: "Corporate, Finance, HR & Tender Wing",
    bio: "Oversees government and private mega tender documentation, RFP processing, and client communication.",
    order: 19
  },

  // 7. Facilities & Logistics Support
  {
    id: "team_17",
    name: "Zahid",
    officialTitle: "Office Assistant & Logistics Support",
    functionalDesignation: "",
    department: "Facilities & Logistics Support",
    section: "Facilities & Logistics Support",
    bio: "Responsible for office cleaning and environmental maintenance, guest hospitality, banking/urgent document delivery, and maintaining all incoming/outgoing parcel and courier registers.",
    order: 20
  },
  {
    id: "team_18",
    name: "Md. Delower Hoss",
    officialTitle: "Executive Driver & Fleet Assistant",
    functionalDesignation: "",
    department: "Facilities & Logistics Support",
    section: "Facilities & Logistics Support",
    bio: "Operates company executive vehicles, transports officials for site visits and urgent spare parts, and maintains vehicle fitness, route permits, and fuel logbooks.",
    order: 21
  }
];

// Helper to keep existing images if available
const dataFilePath = path.join(process.cwd(), 'data', 'team.json');
let existingData = { members: [] };
try {
  existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
} catch (e) {}

members.forEach(newM => {
  // Find match by name
  const existingM = existingData.members.find(m => m.name.toLowerCase() === newM.name.toLowerCase());
  if (existingM) {
    newM.image = existingM.image || '';
    newM.socialLinks = existingM.socialLinks || {};
  } else {
    newM.image = '';
    newM.socialLinks = {};
  }
});

const teamData = {
  ceo: {
    name: "Engr. Md. Zahangir Alam",
    nickname: "",
    officialTitle: "Managing Director & Chief Executive Officer (MD & CEO)",
    functionalDesignation: "Founder & Managing Director",
    department: "Executive Management & Engineering Architecture",
    image: existingData.ceo?.image || "",
    message: "An experienced engineer with a postgraduate degree in Electrical and Electronic Engineering, leading the overall operations, technological innovation, and commercial growth of the institution.",
    socialLinks: existingData.ceo?.socialLinks || {}
  },
  members: members
};

fs.writeFileSync(dataFilePath, JSON.stringify(teamData, null, 2));
console.log("Team data perfectly rebuilt based on new requirements!");
