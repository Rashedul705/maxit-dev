"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, Github, Linkedin, Facebook, MapPin, ArrowRight } from 'lucide-react';

function WhatsAppIcon({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const Footer = ({ siteSettings }: { siteSettings?: any }) => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const logoUrl = siteSettings?.footerLogo || "/logo.png";
  const description = siteSettings?.footerDescription || "Your partner for sustainable energy, advanced agro-tech, and intelligent automation solutions. Empowering a greener tomorrow.";
  
  const addressLine1 = siteSettings?.footerAddressLine1 || "Afroza Tower,";
  const addressLine2 = siteSettings?.footerAddressLine2 || "4th Floor, Uposhohor Newmarket,";
  const rawAddressLine3 = siteSettings?.footerAddressLine3 || "Rajshahi-6000";
  const addressLine3 = rawAddressLine3.replace(/\s*<!--JSON:.*?-->/g, '').trim();

  let resolvedAddresses = Array.isArray(siteSettings?.footerAddresses) && siteSettings.footerAddresses.length > 0
    ? siteSettings.footerAddresses
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

  const defaultAddresses = [
    {
      title: "Head Office",
      details: [addressLine1, addressLine2, addressLine3].filter(Boolean).join("\n"),
    },
    {
      title: "LAB",
      details: "Innovation & Automation Lab, Rajshahi",
    },
  ];

  const addresses = (resolvedAddresses && resolvedAddresses.length > 0)
    ? resolvedAddresses
    : defaultAddresses;
  const phone = siteSettings?.footerPhone || "+8801733-272445";
  const email = siteSettings?.footerEmail || "sales@m4xit.com";
  
  const copyrightText = siteSettings?.copyrightText || `© ${currentYear} Max iT Solution. All rights reserved.`;
  const privacyPolicyLink = siteSettings?.privacyPolicyLink || "/privacy";
  const termsOfServiceLink = siteSettings?.termsOfServiceLink || "/terms";

  const defaultSocialLinks = [
    { platform: "Facebook", url: "https://www.facebook.com/", icon: "Facebook" },
    { platform: "LinkedIn", url: "https://www.linkedin.com/", icon: "Linkedin" },
    { platform: "WhatsApp", url: "https://wa.me/8801733272445", icon: "WhatsApp" },
  ];

  const configuredLinks = siteSettings?.socialLinks?.length > 0 
    ? [...siteSettings.socialLinks].sort((a,b)=>a.order-b.order) 
    : defaultSocialLinks;
  
  // Guarantee Facebook, LinkedIn, WhatsApp are present
  const socialLinks = configuredLinks.map((item: any) => {
    if (item.platform?.toLowerCase() === 'github' || item.icon?.toLowerCase() === 'github') {
      return {
        ...item,
        platform: 'WhatsApp',
        icon: 'WhatsApp',
        url: item.url === '#' ? 'https://wa.me/8801733272445' : item.url,
      };
    }
    return item;
  });

  const hasWhatsApp = socialLinks.some((s: any) => s.platform?.toLowerCase() === 'whatsapp' || s.icon?.toLowerCase() === 'whatsapp');
  if (!hasWhatsApp) {
    socialLinks.push({ platform: "WhatsApp", url: "https://wa.me/8801733272445", icon: "WhatsApp", order: socialLinks.length });
  }

  const defaultQuickLinks = [
    { label: 'About Us', link: '/about' },
    { label: 'Company Profile', link: '/company-profile' },
    { label: 'Services', link: '/services' },
    { label: 'Our Team', link: '/team' },
    { label: 'Contact', link: '/contact' }
  ];
  const quickLinks = siteSettings?.quickLinks?.length > 0 ? [...siteSettings.quickLinks].sort((a,b)=>a.order-b.order) : defaultQuickLinks;

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#0B1528] text-white relative overflow-hidden border-t border-slate-800">
      {/* Dotted Grid Background Pattern */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2 flex flex-col items-center md:items-start">
            <Link href="/" className="inline-block group mb-6">
              <div className="bg-white p-3 rounded-xl shadow-lg group-hover:scale-105 transition-transform inline-flex">
                <img src={logoUrl} alt="Max iT Solution Logo" className="h-10 w-auto" />
              </div>
            </Link>
            <p className="text-slate-400 mb-8 max-w-md leading-relaxed mx-auto md:mx-0 font-normal">
              {description}
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              {socialLinks.map((social: any, idx: number) => {
                const isFacebook = social.icon === 'Facebook' || social.platform?.toLowerCase() === 'facebook';
                const isLinkedin = social.icon === 'Linkedin' || social.platform?.toLowerCase() === 'linkedin';
                const isWhatsapp = social.icon === 'WhatsApp' || social.platform?.toLowerCase() === 'whatsapp';

                return (
                  <a 
                    key={idx} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={social.platform}
                    className="w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 shadow-sm group"
                  >
                    {isFacebook ? <Facebook size={18} className="group-hover:text-[#1877F2] transition-colors" /> : 
                     isLinkedin ? <Linkedin size={18} className="group-hover:text-[#0A66C2] transition-colors" /> : 
                     isWhatsapp ? <WhatsAppIcon size={18} className="group-hover:text-[#25D366] transition-colors" /> : 
                     <WhatsAppIcon size={18} />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-lg font-bold font-heading mb-6 tracking-wide uppercase text-white">Quick Links</h3>
            <ul className="space-y-3 w-full">
              {quickLinks.map((link: any, index: number) => (
                <li key={index} className="flex justify-center md:justify-start">
                  <Link 
                    href={link.link} 
                    className="flex items-center text-slate-400 hover:text-white transition-colors group font-medium"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 hidden md:block text-slate-500 group-hover:text-white" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
            <h3 className="text-lg font-bold font-heading mb-6 tracking-wide uppercase text-white">Contact</h3>
            <ul className="space-y-4 w-full flex flex-col items-center md:items-start">
              <li className="flex items-center justify-center md:justify-start gap-3 group cursor-pointer">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:bg-slate-700 transition-colors">
                  <Mail size={16} className="text-slate-300 group-hover:text-white" />
                </div>
                <a href={`mailto:${email}`} className="text-slate-400 text-sm group-hover:text-white transition-colors font-medium">{email}</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 group cursor-pointer">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:bg-slate-700 transition-colors">
                  <Phone size={16} className="text-slate-300 group-hover:text-white" />
                </div>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-slate-400 text-sm group-hover:text-white transition-colors font-medium">{phone}</a>
              </li>
              {addresses.map((addr: any, idx: number) => (
                <li key={idx} className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-2.5 md:gap-3 group text-center md:text-left">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:bg-slate-700 transition-colors flex-shrink-0 mt-0.5">
                    <MapPin size={16} className="text-slate-300 group-hover:text-white" />
                  </div>
                  <div className="text-slate-400 text-sm leading-relaxed group-hover:text-white transition-colors font-medium text-center md:text-left">
                    {addr.title && (
                      <span className="block font-bold text-white text-xs uppercase tracking-wider mb-0.5">
                        {addr.title}
                      </span>
                    )}
                    <span className="whitespace-pre-line text-slate-400 group-hover:text-slate-200 transition-colors">
                      {addr.details}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 text-center md:text-left gap-4 md:gap-0">
          <p>{copyrightText}</p>
          <div className="flex space-x-6 justify-center">
            <Link href={privacyPolicyLink} className="hover:text-slate-300 transition-colors font-medium">Privacy Policy</Link>
            <Link href={termsOfServiceLink} className="hover:text-slate-300 transition-colors font-medium">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
