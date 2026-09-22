"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, Github, Linkedin, Facebook, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-3 mb-6 inline-block group">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                  <img src="/logo.png" alt="MaxIT Solution Logo" className="w-8 h-8" />
                </div>
                <span className="text-2xl font-bold font-heading">MaxIT<span className="text-accent">.</span></span>
              </div>
            </Link>
            <p className="text-white/80 mb-8 max-w-md leading-relaxed mx-auto md:mx-0">
              Your partner for sustainable energy, advanced agro-tech, and intelligent automation solutions. Empowering a greener tomorrow.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-accent hover:shadow-[0_0_15px_rgba(232,87,70,0.5)] transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-accent hover:shadow-[0_0_15px_rgba(232,87,70,0.5)] transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-accent hover:shadow-[0_0_15px_rgba(232,87,70,0.5)] transition-all duration-300">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold font-heading mb-6 tracking-wide uppercase text-white">Quick Links</h3>
            <ul className="space-y-3 w-full">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Company Profile', path: '/company-profile' },
                { name: 'Services', path: '/services' },
                { name: 'Our Team', path: '/team' },
                { name: 'Contact', path: '/contact' }
              ].map((link, index) => (
                <li key={index} className="flex justify-center md:justify-start">
                  <Link 
                    href={link.path} 
                    className="flex items-center text-white/80 hover:text-accent transition-colors group"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 hidden md:block" />
                    <span>{link.name}</span>
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
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent/20 transition-colors mt-0 md:mt-0.5">
                  <Mail size={16} className="text-accent" />
                </div>
                <span className="text-white/80 text-sm group-hover:text-white transition-colors">sales@m4xit.com</span>
              </li>
              <li className="flex items-center md:items-start justify-center md:justify-start space-x-3 group cursor-pointer">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent/20 transition-colors mt-0 md:mt-0.5">
                  <Phone size={16} className="text-accent" />
                </div>
                <span className="text-white/80 text-sm group-hover:text-white transition-colors">+8801733-272445</span>
              </li>
              <li className="flex items-center md:items-start justify-center md:justify-start space-x-3 group cursor-pointer text-left md:text-left">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent/20 transition-colors mt-0 md:mt-0.5 flex-shrink-0">
                  <MapPin size={16} className="text-accent" />
                </div>
                <span className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors">
                  2nd Floor, Afroza Tower,<br className="hidden md:block" />
                  <span className="md:hidden"> </span>Uposhohor Newmarket,<br className="hidden md:block" />
                  <span className="md:hidden"> </span>Rajshahi-6000
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© {currentYear} MaxIT Solution. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
