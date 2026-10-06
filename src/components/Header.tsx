"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Company Profile', path: '/company-profile' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin Login', path: '/admin/login' },
  ];

  if (pathname.startsWith('/admin')) return null;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-auto ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/95 backdrop-blur-md border-b py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center bg-white rounded-2xl px-6 py-3 transition-all duration-300">
          <Link href="/" className="flex items-center group relative">
            <img src="/logo.png" alt="Max iT Solution Logo" className="h-10 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md overflow-hidden group ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary transition-all"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            <Link 
              href="/contact" 
              className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 shadow-sm rounded-md transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden absolute top-full left-0 right-0 mt-2 bg-white border-b shadow-xl overflow-hidden transition-all duration-300 origin-top transform ${
            isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
        >
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`px-4 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/5'
                    : 'text-foreground hover:text-primary hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t">
              <Link 
                href="/contact" 
                className="flex justify-center w-full px-6 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
