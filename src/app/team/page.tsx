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

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">
      <main className="flex-1 animate-slide-up overflow-hidden w-full">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 z-0">
            <img src="/images/team_hero_bg.jpg" alt="Team Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white"></div>
          </div>
          
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3 z-0" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/2 z-0" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h1 className="text-5xl md:text-6xl font-bold font-heading text-primary mb-6 tracking-tight">
                Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">Team</span>
              </h1>
              <p className="text-xl text-gray-700 font-medium leading-relaxed">
                United by a shared vision of innovation, technological excellence, and sustainable development.
              </p>
            </div>
          </div>
        </section>

        {/* CEO Message Section */}
        {ceo && Object.keys(ceo).length > 0 && (
          <section className="py-16 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="relative bg-primary/5 p-8 md:p-16 rounded-3xl shadow-xl shadow-primary/5 border-2 border-accent/40 overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-accent/10 transition-colors duration-700" />
                
                <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                  <div className="flex-shrink-0 relative group-hover:scale-[1.02] transition-transform duration-700">
                    <div className="absolute inset-0 bg-accent rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                    <div className="w-64 h-64 md:w-[250px] md:h-[350px] rounded-full overflow-hidden border-[6px] border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10 ring-2 ring-accent/20 bg-gray-50 flex items-center justify-center">
                      {ceo.image ? (
                        <img
                          src={ceo.image}
                          alt={ceo.name}
                          className="w-full h-full object-cover object-top transform scale-110 hover:scale-[1.15] transition-all duration-700 ease-in-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-semibold tracking-wider uppercase mb-4">
                      Message from CEO
                    </div>
                    <h3 className="text-3xl font-bold font-heading text-primary mb-2">
                      {ceo.name?.split(' ').slice(0, -1).join(' ')} <span className="text-accent">{ceo.nickname || ceo.name?.split(' ').slice(-1)}</span>
                    </h3>
                    <p className="text-accent font-medium uppercase tracking-wider mb-6">{ceo.designation}</p>
                    
                    <div className="prose prose-lg text-gray-700 font-medium mt-6 mx-auto lg:mx-0">
                      {ceo.message?.split('\n').map((paragraph: string, i: number) => (
                        <p key={i} className="mb-4 leading-relaxed">
                          {i === 0 && <span className="text-3xl text-accent font-serif leading-none mr-2">"</span>}
                          {paragraph}
                        </p>
                      ))}
                      
                      <div className="flex flex-col lg:flex-row items-center justify-between mt-8">
                        {/* CEO Social Icons */}
                        <div className="flex space-x-4 mb-4 lg:mb-0">
                          {ceo.socialLinks?.email && (
                            <a
                              href={`mailto:${ceo.socialLinks.email}`}
                              className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-white transform hover:-translate-y-1 transition-all duration-300"
                              title="Email"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                          {ceo.socialLinks?.linkedin && (
                            <a
                              href={ceo.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full text-primary hover:bg-[#0077b5] hover:text-white transform hover:-translate-y-1 transition-all duration-300"
                              title="LinkedIn"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        
                        <p className="text-3xl text-primary -rotate-2 inline-block transform font-heading italic opacity-80 border-b-2 border-accent pb-1">
                          {ceo.name?.split(' ')[1] || ceo.name?.split(' ')[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Team Members Grid Section */}
        <section className="py-24 bg-gray-50/50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
                Our Key Professionals
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
              {members.map((member: any) => (
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
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center animate-pulse" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>

                  {/* Content Block */}
                  <div className="p-8 relative z-10 flex flex-col flex-grow bg-white">
                    <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-2">{member.designation}</p>
                    <h3 className="text-2xl font-bold font-heading text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-gray-700 font-medium leading-relaxed mb-6 flex-grow whitespace-pre-wrap">
                      {member.description}
                    </p>

                    {/* Social Buttons */}
                    <div className="flex space-x-3 pt-6 border-t border-gray-100 mt-auto">
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
