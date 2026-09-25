"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Wrench,
  Star,
  HelpCircle,
  Image as ImageIcon,
  Phone,
  Shield
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Team Members', path: '/admin/team', icon: Users },
    { name: 'About Section', path: '/admin/about', icon: FileText },
    { name: 'Company Profile Data', path: '/admin/company-profile-data', icon: FileText },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Partners', path: '/admin/partners', icon: Building2 },
    { name: 'Homepage Hero', path: '/admin/hero', icon: ImageIcon },
    { name: 'Why Choose Us', path: '/admin/reasons', icon: HelpCircle },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'Contact Info', path: '/admin/contact', icon: Phone },
    { name: 'Legal Pages', path: '/admin/legal', icon: Shield },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="text-xl font-bold font-heading text-primary">Admin Panel</span>
        </Link>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name}
              href={item.path} 
              className={`flex items-center px-4 py-3 rounded-xl transition-colors font-medium ${
                isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </>
  );

  if (pathname === '/admin/login' || pathname === '/admin/setup') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden sticky top-0 z-30">
          <Link href="/admin" className="font-bold text-lg text-primary flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            Admin Panel
          </Link>
          <button 
            className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
