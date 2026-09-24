"use client";

import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

type Partner = {
  id: string;
  name: string;
  section: "home" | "profile";
  order: number;
  logo?: string;
  description?: string;
};

const hoverGradients = [
  { i: '#a955ff', j: '#ea51ff' },
  { i: '#56CCF2', j: '#2F80ED' },
  { i: '#FF9966', j: '#FF5E62' },
  { i: '#80FF72', j: '#7EE8FA' },
  { i: '#ffa9c6', j: '#f434e2' },
];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
          <style>{`
            .partner-hover-ul {
              display: flex;
              position: relative;
              gap: 30px;
              flex-wrap: wrap;
              justify-content: center;
              padding: 20px 0;
            }
            .partner-hover-li {
              position: relative;
              list-style: none;
              width: 100px;
              height: 100px;
              background: white;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              border-radius: 100px;
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
              transition: 0.5s;
            }
            .partner-hover-li::before {
              content: "";
              position: absolute;
              inset: 0;
              border-radius: 100px;
              background: linear-gradient(45deg, var(--i), var(--j));
              opacity: 0;
              transition: 0.5s;
            }
            .partner-hover-li::after {
              content: "";
              position: absolute;
              top: 10px;
              width: 100%;
              height: 100%;
              border-radius: 100px;
              background: linear-gradient(45deg, var(--i), var(--j));
              transition: 0.5s;
              filter: blur(15px);
              z-index: -1;
              opacity: 0;
            }
            .partner-hover-li:hover {
              width: 260px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0);
            }
            .partner-hover-li:hover::before {
              opacity: 1;
            }
            .partner-hover-li:hover::after {
              opacity: 0.5;
            }
            .partner-hover-li .icon {
              width: 60px;
              height: 60px;
              display: flex;
              justify-content: center;
              align-items: center;
              transition: 0.5s;
              transition-delay: 0.25s;
              z-index: 2;
            }
            .partner-hover-li:hover .icon {
              transform: scale(0);
              transition-delay: 0s;
            }
            .partner-hover-li .content-wrap {
              position: absolute;
              z-index: 2;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              transform: scale(0);
              transition: 0.5s;
              transition-delay: 0s;
              width: 100%;
              padding: 0 25px;
            }
            .partner-hover-li:hover .content-wrap {
              transform: scale(1);
              transition-delay: 0.25s;
            }
            .partner-hover-li .title {
              color: #fff;
              font-size: 1.1em;
              font-weight: 700;
              letter-spacing: 0.05em;
              text-align: center;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 100%;
            }
            .partner-hover-li .desc {
              color: rgba(255, 255, 255, 0.9);
              font-size: 0.75em;
              text-align: center;
              margin-top: 4px;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          `}</style>
          <ul className="partner-hover-ul">
            {partnersList.map((partner, index) => {
              const grad = hoverGradients[index % hoverGradients.length];
              return (
                <li 
                  key={index} 
                  className="partner-hover-li" 
                  style={{ '--i': grad.i, '--j': grad.j } as React.CSSProperties}
                >
                  <span className="icon">
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-400" />
                    )}
                  </span>
                  <span className="content-wrap">
                    <span className="title">{partner.name}</span>
                    {partner.description && (
                      <span className="desc">{partner.description}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
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
