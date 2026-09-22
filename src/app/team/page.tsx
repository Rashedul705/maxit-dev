import { Mail, Linkedin, MessageCircle } from 'lucide-react';
import sobujImg from "@/assets/team/ceo-maxit.png";

import shohidImg from "@/assets/team/shohid.jpg";
import shahidafridiImg from "@/assets/team/shahidafridi.jpeg";
import rupaliImg from "@/assets/team/rupali.jpg";
import touhidurImg from "@/assets/team/touhidur.jpg";
import priyankaImg from "@/assets/team/priyanka.jpg";
import emonImg from "@/assets/team/emon-ali.jpg";
import moznuImg from "@/assets/team/moznu.jpg";
import rashedulImg from "@/assets/team/rashedul.jpg";

const Team = () => {
  const teamMembers = [
    {
      name: "Rupali",
      role: "Project Director",
      description: "Experienced project director ensuring successful execution and delivery of our initiatives.",
      image: rupaliImg,
      email: "rupali@m4xit.com",
      linkedin: "#"
    },
    {
      name: "Sarwar Jahan",
      role: "Software Engineer",
      description: "Expert software engineer developing robust and scalable digital solutions.",
      image: shohidImg,
      email: "shohid@m4xit.com",
      linkedin: "#"
    },
    {
      name: "Rashedul Islam",
      role: "Software Engineer",
      description: "BSc in Computer Science and Engineering. Dedicated to building scalable and robust software solutions.",
      image: rashedulImg,
      email: "rashedul.afl@gmail.com",
      linkedin: "https://www.linkedin.com/in/rislam05/"
    },
    {
      name: "Tauhidur Rahman Rony",
      role: "Adviser",
      description: "Strategic adviser providing expert guidance on business development and operations.",
      image: touhidurImg,
      email: "rony@m4xit.com",
      linkedin: "#"
    },
    {
      name: "Priyanka Roy",
      role: "Senior Executive",
      description: "Dedicated senior executive managing key administrative and operational functions.",
      image: priyankaImg,
      email: "sales@m4xit.com",
      linkedin: "#"
    },
    {
      name: "Md. Emon Ali",
      role: "Assistant Engineer",
      description: "Skilled assistant engineer supporting our technical projects and implementations.",
      image: emonImg,
      email: "emon@m4xit.com",
      linkedin: "#"
    },
    {
      name: "MD .SHAHID AFRIDI",
      role: "Maintaince Engineer",
      description: "Skilled Maintaince Engineer supporting our technical projects and implementations.",
      image: shahidafridiImg, // Using shohidImg as a placeholder. Please update with the actual image when available.
      linkedin: "#"
    },
    {
      name: "Md.Shaifiqul Islam Moznu",
      role: "Electrician",
      description: "Expert electrician ensuring safe and efficient electrical installations and maintenance.",
      image: moznuImg,
      whatsapp: "01711301250",
      linkedin: "#"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]"><main className="flex-1 animate-slide-up overflow-hidden w-full">
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
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative bg-primary/5 p-8 md:p-16 rounded-3xl shadow-xl shadow-primary/5 border-2 border-accent/40 overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-accent/10 transition-colors duration-700" />
            
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex-shrink-0 relative group-hover:scale-[1.02] transition-transform duration-700">
                <div className="absolute inset-0 bg-accent rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                <div className="w-64 h-64 md:w-[250px] md:h-[350px] rounded-full overflow-hidden border-[6px] border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10 ring-2 ring-accent/20 bg-gray-50 flex items-center justify-center">
                  <img
                    src={sobujImg.src}
                    alt="Engr. Zahangir Alam"
                    className="w-full h-full object-cover object-top transform scale-110 hover:scale-[1.15] transition-all duration-700 ease-in-out"
                  />
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-semibold tracking-wider uppercase mb-4">
                  Message from CEO
                </div>
                <h3 className="text-3xl font-bold font-heading text-primary mb-2">Engr. Zahangir Alam <span className="text-accent">(Sobuj)</span></h3>
                
                <div className="prose prose-lg text-gray-700 font-medium mt-6 mx-auto lg:mx-0">
                  <p className="mb-4 leading-relaxed">
                    <span className="text-3xl text-accent font-serif leading-none mr-2">"</span>
                    At Max IT Solution LTD., we believe that technology should serve people, empower communities, and create lasting impact. Since the beginning of our journey, we have been driven by a simple yet powerful mission: to provide reliable, innovative, and sustainable solutions that address real-world challenges faced by businesses and communities alike.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    Whether it is supporting business operations through our IT services or contributing to rural development through renewable energy and agro-based technologies, we remain committed to delivering excellence in everything we do.
                  </p>
                  <p className="leading-relaxed">
                    As we continue to grow, we stay grounded in our core values of professionalism, integrity, and service. I am proud of the work we have accomplished so far, and I am even more excited about the future we are building together.
                  </p>
                  <div className="mt-8 lg:text-right">
                    <p className="text-3xl text-primary -rotate-2 inline-block transform font-heading italic opacity-80 border-b-2 border-accent pb-1">
                      Zahangir Alam
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Grid Section */}
      <section className="py-24 bg-gray-50/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
              Our Key Professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-3xl flex flex-col h-full shadow-md hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border-2 border-gray-200 hover:border-accent/40"
              >
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Image Wrapper */}
                <div className="relative w-48 h-48 mx-auto mt-8 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm group-hover:border-accent/30 transition-colors duration-500 z-10 flex items-center justify-center bg-gray-50">
                  <img
                    src={member.image.src}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transform group-hover:scale-110 transition-all duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Content Block */}
                <div className="p-8 relative z-10 flex flex-col flex-grow bg-white">
                  <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-2">{member.role}</p>
                  <h3 className="text-2xl font-bold font-heading text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-gray-700 font-medium leading-relaxed mb-6 flex-grow">
                    {member.description}
                  </p>

                  {/* Social Buttons */}
                  <div className="flex space-x-3 pt-6 border-t border-gray-100 mt-auto">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl text-gray-700 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/40 transform hover:-translate-y-1 transition-all duration-300"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {member.whatsapp && (
                      <a
                        href={`https://wa.me/88${member.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl text-gray-700 hover:bg-[#25D366] hover:text-white hover:shadow-lg hover:shadow-[#25D366]/40 transform hover:-translate-y-1 transition-all duration-300"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={member.linkedin}
                      className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl text-gray-700 hover:bg-[#0077b5] hover:text-white hover:shadow-lg hover:shadow-[#0077b5]/40 transform hover:-translate-y-1 transition-all duration-300"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main></div>
  );
};

export default Team;
