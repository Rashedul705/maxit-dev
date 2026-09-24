"use client";

import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

type Partner = {
  id: string;
  name: string;
  section: "home" | "profile";
  order: number;
  logo?: string;
};

const Partners = ({ isGrid = false }: { isGrid?: boolean }) => {
  const [partnersList, setPartnersList] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const section = isGrid ? 'profile' : 'home';
        const res = await fetch(`/api/admin/partners?section=${section}`);
        if (res.ok) {
          const data: Partner[] = await res.json();
          setPartnersList(data);
        }
      } catch (err) {
        console.error("Failed to fetch partners", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, [isGrid]);

  if (isLoading) {
    return (
      <section className={`py-24 border-y border-white/10 overflow-hidden relative ${!isGrid ? 'bg-primary' : 'bg-[#f8fafe]'}`}>
        <div className="flex justify-center items-center h-48">
          <div className="animate-pulse flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full mb-4 ${!isGrid ? 'bg-white/20' : 'bg-primary/20'}`}></div>
            <div className={`h-4 w-32 rounded ${!isGrid ? 'bg-white/20' : 'bg-primary/20'}`}></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-24 border-y border-white/10 overflow-hidden relative ${!isGrid ? 'bg-primary' : 'bg-[#f8fafe]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className={`text-4xl md:text-5xl font-bold font-heading mb-6 ${!isGrid ? 'text-white' : 'text-primary'}`}>
          Technologies & Partners with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">MaxIT</span>
        </h2>
        <p className={`max-w-2xl mx-auto font-medium text-lg leading-relaxed ${!isGrid ? 'text-white/80' : 'text-gray-600'}`}>
          We are proud to partner with top government institutions, corporations, educational facilities, and NGOs to deliver engineering excellence.
        </p>
      </div>

      {isGrid ? (
        <div className="max-w-6xl mx-auto px-4 relative">
          <style>{`
            .hex-grid {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 1.5rem;
              padding: 2rem 0;
            }
            .hex-wrap {
              filter: drop-shadow(0px 8px 16px rgba(0,0,0,0.06));
              transition: transform 0.3s ease, filter 0.3s ease;
            }
            .hex-wrap:hover {
              transform: translateY(-8px) scale(1.05);
              filter: drop-shadow(0px 15px 25px rgba(0,0,0,0.12));
              z-index: 10;
            }
            .hex {
              width: 150px;
              height: 130px; /* 150 * 0.866 */
              clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0 20px;
              text-align: center;
            }
            .hex-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            }
            .hex-text {
              font-size: 0.8rem;
              font-weight: 700;
              color: white;
              line-height: 1.2;
            }
            .hex-center-wrap {
              filter: drop-shadow(0px 15px 30px rgba(11, 17, 32, 0.3));
              margin: 1rem 2rem;
            }
            .hex-center {
              width: 260px;
              height: 225px;
              background: linear-gradient(135deg, #0B1120 0%, #1a2744 100%);
              clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              color: white;
            }
          `}</style>
          
          <div className="hex-grid">
            {/* Center piece logic - we place it in the middle of the array visually */}
            {partnersList.slice(0, 14).map((partner, index) => (
              <div key={`p1-${index}`} className="hex-wrap">
                <div className="hex bg-primary border border-white/10">
                  <div className="hex-content">
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <Building2 className="w-5 h-5 text-accent" />
                    )}
                    <span className="hex-text">{partner.name}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="hex-center-wrap w-full md:w-auto flex justify-center order-first md:order-none mb-8 md:mb-0">
              <div className="hex-center border-4 border-accent/20">
                <h3 className="text-3xl font-bold font-heading mb-2 text-white">MaxIT</h3>
                <p className="text-sm text-gray-300 font-medium px-8">Trusted by 28+ Organizations</p>
              </div>
            </div>
            
            {partnersList.slice(14).map((partner, index) => (
              <div key={`p2-${index}`} className="hex-wrap">
                <div className="hex bg-primary border border-white/10">
                  <div className="hex-content">
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <Building2 className="w-5 h-5 text-accent" />
                    )}
                    <span className="hex-text">{partner.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex overflow-x-hidden group">
          {/* Left Gradient Mask */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex animate-scroll whitespace-nowrap py-8">
            {/* Double the list to create a seamless infinite loop */}
            {[...partnersList, ...partnersList].map((partner, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-4 bg-white border border-gray-100 rounded-2xl px-8 py-5 mx-3 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                {partner.logo ? (
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                    <Building2 className="w-5 h-5" />
                  </div>
                )}
                <span className="font-bold text-gray-800 text-base md:text-lg tracking-tight">{partner.name}</span>
              </div>
            ))}
          </div>

          {/* Right Gradient Mask */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none"></div>
        </div>
      )}
    </section>
  );
};

export default Partners;
