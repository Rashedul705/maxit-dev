const fs = require('fs');

const path = '/Users/rashedulislam/MAXIT/maxit-dev/src/app/team/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
            {/* CEO Section */}
            {ceo && Object.keys(ceo).length > 0 && (
              <div className="mb-24 bg-white rounded-[2rem] shadow-xl p-8 md:p-12 relative overflow-hidden border border-gray-100 flex flex-col md:flex-row gap-10 lg:gap-16 items-center md:items-start max-w-5xl mx-auto">
                {/* CEO Image */}
                <div className="flex-shrink-0 w-56 md:w-64 relative mt-4">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-[#E74C3C]/20 rounded-[4rem] blur-2xl transform scale-110"></div>
                  {/* Image Container */}
                  <div className="relative z-10 w-full aspect-[3/4] rounded-[4rem] border-4 border-white shadow-lg overflow-hidden bg-gray-50">
                    <img 
                      src={ceo.photoUrl || ceo.image || "/images/placeholder.jpg"} 
                      alt={ceo.name} 
                      className="w-full h-full object-cover" 
                    />
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
                          {main.trim()} <span className="text-[#E74C3C]">({rest}</span>
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
                    <span className="text-[#E74C3C] text-5xl font-serif absolute -top-2 -left-6 leading-none">"</span>
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
                        className="text-2xl text-gray-600 pb-1 px-2 border-b-2 border-[#E74C3C]/60 italic" 
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
`;

content = content.replace('<div className="space-y-24">', replacement);
fs.writeFileSync(path, content);
