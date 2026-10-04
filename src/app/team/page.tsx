import { Mail, Linkedin, MessageCircle } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import TeamSection from '@/models/TeamSection';

export const dynamic = 'force-dynamic';

async function getTeamData() {
  try {
    await dbConnect();
    let ceoDoc = await (TeamMember.findOne as any)({ isCeo: true } as any).lean();
    let membersDocs = await (TeamMember.find as any)({ isCeo: false }).sort({ order: 1 }).lean();
    let sectionsDocs = await (TeamSection.find as any)({}).sort({ order: 1 }).lean();
    
    // Fallback: extract CEO from membersDocs if not found by isCeo flag
    if (!ceoDoc) {
      const ceoIndex = membersDocs.findIndex((m: any) => m.name.toLowerCase().includes('zahangir') || m.isCeo);
      if (ceoIndex !== -1) {
        ceoDoc = membersDocs[ceoIndex];
        membersDocs.splice(ceoIndex, 1);
      }
    } else {
      // Ensure CEO is not in membersDocs
      membersDocs = membersDocs.filter((m: any) => !m.name.toLowerCase().includes('zahangir') && !m.isCeo);
    }
    
    // Parse to stringify ObjectIds for Next.js
    const ceo = JSON.parse(JSON.stringify(ceoDoc || {}));
    const members = JSON.parse(JSON.stringify(membersDocs));
    const sections = JSON.parse(JSON.stringify(sectionsDocs || []));
    
    return { ceo, members, sections };
  } catch (error) {
    console.error('Error fetching team data:', error);
    return { ceo: {}, members: [], sections: [] };
  }
}

export default async function Team() {
  const teamData = await getTeamData();
  const { ceo, members = [], sections = [] } = teamData;
  
  // Sort members by order
  members.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  const sectionsOrder = sections.map((s: any) => s.name);

  // Group members by section based on the strict order
  const groupedMembers = sectionsOrder.map((sectionName: string) => {
    return {
      section: sectionName,
      members: members.filter((m: any) => m.section === sectionName)
    };
  }).filter((g: any) => g.members.length > 0);

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
                Complete Corporate Governance and <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Web Team Directory</span>
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

            {/* CEO Section */}
            {ceo && Object.keys(ceo).length > 0 && (
              <div className="mb-24 bg-white rounded-[2rem] shadow-xl p-8 md:p-12 relative overflow-hidden border border-gray-100 flex flex-col md:flex-row gap-10 lg:gap-16 items-center md:items-start max-w-5xl mx-auto">
                {/* CEO Image */}
                <div className="flex-shrink-0 w-56 md:w-64 relative mt-4">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-accent/20 rounded-[4rem] blur-2xl transform scale-110"></div>
                  {/* Image Container */}
                  <div className="relative z-10 w-full aspect-[3/4] rounded-[4rem] border-4 border-white shadow-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    {ceo.photoUrl || ceo.image ? (
                      <img 
                        src={ceo.photoUrl || ceo.image} 
                        alt={ceo.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="text-gray-400 font-bold text-6xl">{ceo.name?.charAt(0)}</div>
                    )}
                  </div>
                </div>

                {/* CEO Content */}
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center mb-6">
                    <span className="bg-gray-100 text-gray-800 text-xs font-bold px-4 py-2 rounded-full tracking-widest uppercase">
                      Message from CEO
                    </span>
                  </div>
                  
                  {(() => {
                    if (ceo.name?.includes('(')) {
                      const [main, rest] = ceo.name.split('(');
                      return (
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">
                          {main.trim()} <span className="text-accent">({rest}</span>
                        </h2>
                      );
                    }
                    return (
                      <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">
                        {ceo.name}
                      </h2>
                    );
                  })()}
                  
                  <div className="relative">
                    <span className="text-accent text-5xl font-serif absolute -top-2 -left-6 leading-none">"</span>
                    <div className="text-gray-500 space-y-4 text-base md:text-[15px] leading-relaxed relative z-10 pl-2">
                      {ceo.message ? (
                        <div className="whitespace-pre-wrap">{ceo.message}</div>
                      ) : (
                        <>
                          <p>At Max IT Solution LTD., we believe that technology should serve people, empower communities, and create lasting impact. Since the beginning of our journey, we have been driven by a simple yet powerful mission: to provide reliable, innovative, and sustainable solutions that address real-world challenges faced by businesses and communities alike.</p>
                          <p>Whether it is supporting business operations through our IT services or contributing to rural development through renewable energy and agro-based technologies, we remain committed to delivering excellence in everything we do.</p>
                          <p>As we continue to grow, we stay grounded in our core values of professionalism, integrity, and service. I am proud of the work we have accomplished so far, and I am even more excited about the future we are building together.</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end w-full">
                    <div className="text-right inline-block">
                      <div 
                        className="text-2xl text-gray-600 pb-1 px-2 border-b-2 border-accent/60 italic" 
                        style={{ fontFamily: "'Dancing Script', 'Caveat', 'Segoe Script', cursive" }}
                      >
                        {ceo.name?.split('(')[0].replace('Engr.', '').trim() || 'Zahangir Alam'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                        key={member._id} 
                        className="group relative bg-white rounded-3xl flex flex-col h-full shadow-md hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border-2 border-gray-200 hover:border-accent/40"
                      >
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Image Wrapper */}
                        <div className="relative w-48 h-48 mx-auto mt-8 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm group-hover:border-accent/30 transition-colors duration-500 z-10 flex items-center justify-center bg-gray-50">
                          {member.photoUrl || member.image ? (
                            <img
                              src={member.photoUrl || member.image}
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
                            <p className="text-accent font-semibold tracking-wider capitalize text-sm mb-1">{member.officialTitle.toLowerCase()}</p>
                          )}
                          {member.functionalDesignation && (
                            <p className="text-gray-500 font-medium tracking-wide text-xs mb-1 capitalize">{member.functionalDesignation.toLowerCase()}</p>
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
