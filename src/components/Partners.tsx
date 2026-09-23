import React from 'react';
import { Building2 } from 'lucide-react';

const partnersList = [
  "NESCO (Northern Electricity Supply Company)", 
  "Palli Bidyut", 
  "Nabir Group", 
  "Nabil Group", 
  "Income Tax Office", 
  "Rajshahi City Corporation", 
  "RMP Police (Rajshahi Metropolitan Police)", 
  "BMDA (Barind Multipurpose Development Authority)", 
  "PKSF (Palli Karma-Sahayak Foundation)", 
  "BRAC NGO", 
  "Rajshahi University", 
  "BADC (Bangladesh Agricultural Development Corporation)", 
  "Rajshahi Krishi Unnayan Bank (RAKUB)", 
  "Urban Health Care", 
  "Roads and Highways", 
  "LGED (Local Government Engineering Department)", 
  "Education Engineering Department (EED)", 
  "Department of Public Health Engineering (DPHE)", 
  "DSB Rajshahi (District Special Branch)", 
  "RAB Rajshahi (Rapid Action Battalion)", 
  "TTC / Teachers' Training College", 
  "Panchagarh Police Headquarters", 
  "Aman Cold Storage", 
  "Uttara Cold Storage", 
  "Rajshahi Polytechnic Institute", 
  "Mohila Polytechnic Institute", 
  "Bangla Bari School and College", 
  "Basantapur School and College"
];

const Partners = () => {
  return (
    <section className="py-24 bg-white border-y border-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
          Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Leading Organizations</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          We are proud to partner with top government institutions, corporations, educational facilities, and NGOs to deliver engineering excellence.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        {/* Left Gradient Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex animate-scroll whitespace-nowrap py-4">
          {/* Double the list to create a seamless infinite loop */}
          {[...partnersList, ...partnersList].map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 mx-3 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-800 text-base md:text-lg tracking-tight">{partner}</span>
            </div>
          ))}
        </div>

        {/* Right Gradient Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default Partners;
