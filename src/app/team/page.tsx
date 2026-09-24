import { Mail, Linkedin, MessageCircle } from 'lucide-react';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

async function getTeamData() {
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'team.json');
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading team data:', error);
    return { ceo: {}, members: [] };
  }
}

export default async function Team() {
  const teamData = await getTeamData();
  const { ceo, members = [] } = teamData;
  
  // Sort members by order
  members.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  const sectionsOrder = [
    "Board of Directors",
    "Advisory Council",
    "Core Engineering & R&D Wing",
    "Technical Field Staff",
    "Global Supply Chain & Procurement Division",
    "Corporate, Finance, HR & Tender Wing",
    "Facilities & Logistics Support"
  ];

  // Group members by section based on the strict order
  const groupedMembers = sectionsOrder.map(sectionName => {
    return {
      section: sectionName,
      members: members.filter((m: any) => m.section === sectionName)
    };
  }).filter(g => g.members.length > 0);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">
      <main className="flex-1 animate-slide-up overflow-hidden w-full">
        {/* Hero Section */}
        <section className="relative pt-32 pb-10 overflow-hidden">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 z-0">
            <img src="/images/team_hero_bg.jpg" alt="Team Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white"></div>
          </div>
          
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3 z-0" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/2 z-0" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary mb-6 tracking-tight leading-tight">
                Complete Corporate Governance and <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">Web Team Directory</span>
              </h1>
              <p className="text-2xl text-gray-800 font-bold mb-4">
                Max IT Solution Ltd.
              </p>
              <p className="text-xl text-gray-700 font-medium leading-relaxed">
                Corporate Organogram and Profile Layout with Global Supply Chain Network.
              </p>
            </div>
          </div>
        </section>


        {/* Team Members Grid Section */}
        <section className="pt-10 pb-24 bg-gray-50/50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="space-y-24">
              {groupedMembers.map((group, groupIndex) => (
                <div key={groupIndex} className="relative">
                  <div className="flex items-center justify-center mb-12 relative">
                    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                    <h3 className="relative bg-gray-50/50 px-8 text-3xl font-bold font-heading text-primary text-center">
                      {groupIndex + 1}. {group.section}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
                    {group.members.map((member: any) => (
                      <div 
                        key={member.id} 
                        className="group relative bg-white rounded-3xl flex flex-col h-full shadow-md hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border-2 border-gray-200 hover:border-accent/40"
                      >
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Image Wrapper */}
                        <div className="relative w-48 h-48 mx-auto mt-8 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm group-hover:border-accent/30 transition-colors duration-500 z-10 flex items-center justify-center bg-gray-50">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transform group-hover:scale-110 transition-all duration-700 ease-in-out"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-4xl">
                              {member.name.charAt(0)}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>

                        {/* Content Block */}
                        <div className="p-8 relative z-10 flex flex-col flex-grow bg-white text-center">
                          <h4 className="text-2xl font-bold font-heading text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                            {member.name}
                          </h4>
                          {member.officialTitle && (
                            <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-1">{member.officialTitle}</p>
                          )}
                          {member.functionalDesignation && (
                            <p className="text-gray-500 font-medium tracking-wide text-xs mb-1 uppercase">{member.functionalDesignation}</p>
                          )}
                          {member.department && (
                            <p className="text-gray-600 font-medium tracking-wide text-sm mb-4">
                              <span className="font-bold text-primary">Department:</span> {member.department}
                            </p>
                          )}
                          {member.bio && (
                            <p className="text-gray-700 font-medium leading-relaxed mb-6 flex-grow whitespace-pre-wrap text-sm">
                              {member.bio}
                            </p>
                          )}

                          {/* Social Buttons */}
                          {(member.socialLinks?.email || member.socialLinks?.whatsapp || member.socialLinks?.linkedin) && (
                            <div className="flex justify-center space-x-3 pt-6 border-t border-gray-100 mt-auto">
                              {member.socialLinks?.email && (
                                <a
                                  href={`mailto:${member.socialLinks.email}`}
                                  className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl text-gray-700 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/40 transform hover:-translate-y-1 transition-all duration-300"
                                  title="Email"
                                >
                                  <Mail className="w-4 h-4" />
                                </a>
                              )}
                              {member.socialLinks?.whatsapp && (
                                <a
                                  href={`https://wa.me/88${member.socialLinks.whatsapp}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl text-gray-700 hover:bg-[#25D366] hover:text-white hover:shadow-lg hover:shadow-[#25D366]/40 transform hover:-translate-y-1 transition-all duration-300"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              )}
                              {member.socialLinks?.linkedin && (
                                <a
                                  href={member.socialLinks.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl text-gray-700 hover:bg-[#0077b5] hover:text-white hover:shadow-lg hover:shadow-[#0077b5]/40 transform hover:-translate-y-1 transition-all duration-300"
                                  title="LinkedIn"
                                >
                                  <Linkedin className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
