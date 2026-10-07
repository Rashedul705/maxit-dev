"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, Github, Linkedin, Facebook, MapPin, ArrowRight } from 'lucide-react';

const Footer = ({ siteSettings }: { siteSettings?: any }) => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const logoUrl = siteSettings?.footerLogo || "/logo.png";
  const description = siteSettings?.footerDescription || "Your partner for sustainable energy, advanced agro-tech, and intelligent automation solutions. Empowering a greener tomorrow.";
  
  const addressLine1 = siteSettings?.footerAddressLine1 || "2nd Floor, Afroza Tower,";
  const addressLine2 = siteSettings?.footerAddressLine2 || "Uposhohor Newmarket,";
  const addressLine3 = siteSettings?.footerAddressLine3 || "Rajshahi-6000";
  const phone = siteSettings?.footerPhone || "+8801733-272445";
  const email = siteSettings?.footerEmail || "sales@m4xit.com";
  
  const copyrightText = siteSettings?.copyrightText || `© ${currentYear} Max iT Solution. All rights reserved.`;
  const privacyPolicyLink = siteSettings?.privacyPolicyLink || "/privacy";
  const termsOfServiceLink = siteSettings?.termsOfServiceLink || "/terms";

  const defaultSocialLinks = [
    { platform: "Facebook", url: "#", icon: "Facebook" },
    { platform: "LinkedIn", url: "#", icon: "Linkedin" },
    { platform: "GitHub", url: "#", icon: "Github" },
  ];
  const socialLinks = siteSettings?.socialLinks?.length > 0 ? [...siteSettings.socialLinks].sort((a,b)=>a.order-b.order) : defaultSocialLinks;

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
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2 flex flex-col items-center md:items-start">
            <Link href="/" className="inline-block group mb-6">
              <div className="bg-white p-3 rounded-xl shadow-lg group-hover:scale-105 transition-transform inline-flex">
                <img src={logoUrl} alt="Max iT Solution Logo" className="h-10 w-auto" />
              </div>
            </Link>
            <p className="text-white/80 mb-8 max-w-md leading-relaxed mx-auto md:mx-0">
              {description}
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              {socialLinks.map((social: any, idx: number) => {
                const IconComponent = social.icon === 'Facebook' ? Facebook : 
                                      social.icon === 'Linkedin' ? Linkedin : 
                                      social.icon === 'Github' ? Github : Github;
                return (
                  <a key={idx} href={social.url} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-primary hover:bg-white transition-all duration-300">
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold font-heading mb-6 tracking-wide uppercase text-white">Quick Links</h3>
            <ul className="space-y-3 w-full">
              {quickLinks.map((link: any, index: number) => (
                <li key={index} className="flex justify-center md:justify-start">
                  <Link 
                    href={link.link} 
                    className="flex items-center text-white/80 hover:text-white transition-colors group"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 hidden md:block text-white" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold font-heading mb-6 tracking-wide uppercase text-white">Contact</h3>
            <ul className="space-y-4 w-full">
              <li className="flex items-center md:items-start justify-center md:justify-start space-x-3 group cursor-pointer">
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors mt-0 md:mt-0.5">
                  <Mail size={16} className="text-white" />
                </div>
                <span className="text-white/80 text-sm group-hover:text-white transition-colors">{email}</span>
              </li>
              <li className="flex items-center md:items-start justify-center md:justify-start space-x-3 group cursor-pointer">
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors mt-0 md:mt-0.5">
                  <Phone size={16} className="text-white" />
                </div>
                <span className="text-white/80 text-sm group-hover:text-white transition-colors">{phone}</span>
              </li>
              <li className="flex items-center md:items-start justify-center md:justify-start space-x-3 group cursor-pointer text-left md:text-left">
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors mt-0 md:mt-0.5 flex-shrink-0">
                  <MapPin size={16} className="text-white" />
                </div>
                <span className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors">
                  {addressLine1}<br className="hidden md:block" />
                  <span className="md:hidden"> </span>{addressLine2}<br className="hidden md:block" />
                  <span className="md:hidden"> </span>{addressLine3}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>{copyrightText}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href={privacyPolicyLink} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href={termsOfServiceLink} className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
