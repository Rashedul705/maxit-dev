import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { fetchFromBackend } from "@/lib/api";

export const dynamic = 'force-dynamic';

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function formatPhoneDisplay(num: string) {
  const digits = num.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("01")) {
    return `+88 ${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  if (digits.length === 13 && digits.startsWith("8801")) {
    return `+88 ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return num.startsWith("+") ? num : `+88 ${num}`;
}

async function getContactInfo() {
  return await fetchFromBackend<any>('/api/admin/contact');
}

async function getSiteSettings() {
  return await fetchFromBackend<any>('/api/admin/site-settings');
}

export default async function Contact() {
  const [contact, settings] = await Promise.all([getContactInfo(), getSiteSettings()]);
  
  const headerTitle = settings?.contactHeaderTitle || "Get in Touch";
  const headerSubtitle = settings?.contactHeaderSubtitle || "Ready to start your next project or need technical assistance? Our team of experts is here to help.";
  const infoTitle = settings?.contactInfoSectionTitle || "Contact Information";
  
  // Office locations (Head Office & LAB Office)
  const rawAddressLine3 = settings?.footerAddressLine3 || contact?.addressLine3 || "";
  let resolvedAddresses: any[] | null = Array.isArray(settings?.footerAddresses) && settings.footerAddresses.length > 0
    ? settings.footerAddresses
    : null;

  if (!resolvedAddresses && rawAddressLine3.includes('<!--JSON:')) {
    try {
      const match = rawAddressLine3.match(/<!--JSON:(.*?)-->/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          resolvedAddresses = parsed;
        }
      }
    } catch (e) {}
  }

  const defaultOffices = [
    {
      title: "Head Office",
      details: "Afroza Tower, 4th Floor, Uposhohor Newmarket, Rajshahi",
    },
    {
      title: "LAB Office",
      details: "Afroza Tower, 2nd Floor, Uposhohor Newmarket, Rajshahi",
    },
  ];

  const offices = (resolvedAddresses && resolvedAddresses.length > 0) ? resolvedAddresses : defaultOffices;
  const phone = contact?.phoneNumber || "+88 01733-272445";
  const email = contact?.email || "sales@m4xit.com";
  const googleMapsUrl = settings?.googleMapsUrl || contact?.googleMapsUrl || "https://maps.app.goo.gl/2N1mLA8RwpcaohFs6";
  const googleMapsEmbedUrl = settings?.googleMapsEmbedUrl || contact?.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1816.9782315667!2d88.5978931!3d24.3776999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14644734df7254d%3A0x9ca140a46bae1fa1!2sMax%20iT%20Solution!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd";

  // WhatsApp setup
  const rawWhatsapp = contact?.whatsappNumber || "01733272445";
  const cleanDigits = rawWhatsapp.replace(/\D/g, "");
  const whatsappApiNumber = cleanDigits.startsWith("88")
    ? cleanDigits
    : (cleanDigits.startsWith("0") ? `88${cleanDigits}` : `880${cleanDigits}`);
  const whatsappUrl = `https://wa.me/${whatsappApiNumber}?text=${encodeURIComponent("Hello Max iT Solution, I would like to inquire about your services.")}`;
  const whatsappDisplay = formatPhoneDisplay(rawWhatsapp);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">
      <main className="flex-1 animate-slide-up overflow-hidden w-full">
        {/* Header */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/5 to-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-primary mb-6 tracking-tight text-left">
              {headerTitle.split(' ').map((word: string, i: number, arr: string[]) => 
                i === arr.length - 1 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{word}</span> : <span key={i}>{word} </span>
              )}
            </h1>
            <p className="text-xl text-gray-700 font-medium leading-relaxed max-w-2xl text-left">
              {headerSubtitle}
            </p>
          </div>
        </section>

        <section className="pb-32 bg-white relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
              
              {/* Contact Information (Left Panel) */}
              <div className="lg:w-2/5 bg-primary p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-[60px] transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full blur-[60px] transform -translate-x-1/3 translate-y-1/3" />
                
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold font-heading mb-8 text-white">{infoTitle}</h2>
                  
                  {/* Fast WhatsApp Callout Card Section (Top of Phone Number) */}
                  <div className="mb-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/95 flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
                          </span>
                          Direct &amp; Fast Contact
                        </span>
                        <span className="text-[11px] font-semibold text-[#25D366] bg-[#25D366]/20 px-2.5 py-0.5 rounded-full border border-[#25D366]/40">
                          Instant Reply
                        </span>
                      </div>
                      <p className="text-xs text-white/80 mb-4 leading-relaxed font-normal">
                        Skip the waiting queue. Chat with our sales &amp; engineering team on WhatsApp for fast response.
                      </p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#25D366]/40 hover:shadow-[#25D366]/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
                      >
                        <WhatsAppIcon className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="space-y-8 pt-6 border-t border-white/15">
                    {/* Phone Number */}
                    <div className="flex items-start group">
                      <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mr-6 border border-white/20 group-hover:bg-white/20 transition-colors shadow-lg">
                        <Phone className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-white tracking-wide">Phone Number</h3>
                        <p className="text-white/80 leading-relaxed font-medium">
                          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
                        </p>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="flex items-start group">
                      <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mr-6 border border-white/20 group-hover:bg-white/20 transition-colors shadow-lg">
                        <Mail className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-white tracking-wide">Email Address</h3>
                        <p className="text-white/80 leading-relaxed font-medium">
                          <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                        </p>
                      </div>
                    </div>

                    {/* Locations (Head Office & LAB Office) */}
                    {offices.map((office: any, idx: number) => (
                      <a 
                        key={idx} 
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start group hover:bg-white/10 p-3 -mx-3 rounded-2xl transition-all duration-200"
                        title="View location on Google Maps"
                      >
                        <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mr-6 border border-white/20 group-hover:bg-white/20 transition-colors shadow-lg">
                          <MapPin className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold mb-1 text-white tracking-wide">
                              {office.title || "Our Location"}
                            </h3>
                            <ExternalLink className="w-3.5 h-3.5 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-white/80 leading-relaxed font-medium whitespace-pre-line group-hover:text-white transition-colors">
                            {office.details}
                          </p>
                        </div>
                      </a>
                    ))}

                    {/* Google Maps Action Button */}
                    <div className="pt-2">
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-xl border border-white/25 shadow-md hover:shadow-lg transition-all duration-200 group"
                      >
                        <MapPin className="w-5 h-5 text-accent transition-transform group-hover:scale-110" />
                        <span>View Location on Google Maps</span>
                        <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mt-10 pt-6 border-t border-white/10">
                  <p className="text-white/60 font-medium text-sm">We typically respond within 24 hours via email, or instantly on WhatsApp.</p>
                </div>
              </div>

              {/* Contact Form (Right Panel) */}
              <div className="lg:w-3/5 p-10 md:p-14 bg-white">
                <h3 className="text-3xl font-bold font-heading text-gray-900 mb-8">Send us a message</h3>
                <ContactForm />
              </div>

            </div>

            {/* Embedded Google Map Section */}
            <div className="mt-16 bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
              <div className="p-6 md:p-8 bg-gray-50/80 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold text-accent tracking-widest uppercase mb-1 block">Live Location</span>
                  <h3 className="text-2xl md:text-3xl font-bold font-heading text-primary">Find Us on Google Maps</h3>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    Afroza Tower, Uposhohor Newmarket, Rajshahi (Head Office: 4th Floor | LAB Office: 2nd Floor)
                  </p>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all self-start sm:self-auto group shrink-0"
                >
                  <MapPin className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Open Navigation</span>
                  <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
              <div className="w-full h-[420px] md:h-[480px] bg-gray-100 relative">
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Max iT Solution Google Maps Location"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Floating WhatsApp Quick Contact Button (Footer / Bottom-Right) */}
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-[#25D366]/50 hover:shadow-[#25D366]/70 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
            title={`Chat on WhatsApp (${whatsappDisplay})`}
            aria-label="Direct WhatsApp Contact"
          >
            <span className="relative flex items-center justify-center">
              <WhatsAppIcon className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></span>
              </span>
            </span>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider font-semibold leading-none text-white/90">Instant Contact</span>
              <span className="text-sm font-bold leading-tight mt-0.5">WhatsApp Us</span>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}