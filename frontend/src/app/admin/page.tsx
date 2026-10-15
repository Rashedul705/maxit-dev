import { Users, FileText, Briefcase, MessageSquare, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { fetchFromBackend } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  const stats = await fetchFromBackend<any>('/api/admin/dashboard-stats');
  return stats || {
    unreadCount: 0,
    totalInquiries: 0,
    teamCount: 9,
    projectCount: 12,
  };
}

export default async function AdminDashboard() {
  const { unreadCount, totalInquiries, teamCount, projectCount } = await getDashboardStats();

  const stats = [
    { 
      name: 'Unread Inquiries', 
      value: unreadCount.toString(), 
      icon: MessageSquare, 
      color: unreadCount > 0 ? 'text-red-500' : 'text-primary', 
      bg: unreadCount > 0 ? 'bg-red-50' : 'bg-blue-50',
      href: '/admin/inbox' 
    },
    { 
      name: 'Total Messages', 
      value: totalInquiries.toString(), 
      icon: Mail, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50',
      href: '/admin/inbox' 
    },
    { 
      name: 'Team Members', 
      value: teamCount.toString(), 
      icon: Users, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      href: '/admin/team' 
    },
    { 
      name: 'Active Projects', 
      value: projectCount.toString(), 
      icon: Briefcase, 
      color: 'text-green-500', 
      bg: 'bg-green-50',
      href: '/admin/projects' 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary mb-1">Welcome Back, Admin</h1>
          <p className="text-gray-500 text-sm">Overview of website inquiries and active portal metrics.</p>
        </div>
        
        {unreadCount > 0 && (
          <Link 
            href="/admin/inbox" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>You have {unreadCount} unread {unreadCount === 1 ? 'inquiry' : 'inquiries'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Link 
            key={idx} 
            href={stat.href} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center mr-4 group-hover:scale-105 transition-transform`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold font-heading text-primary mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/inbox" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-gray-600 hover:text-primary group relative">
              <MessageSquare className="w-8 h-8 mb-3 text-gray-400 group-hover:text-primary" />
              <span className="font-medium">Manage Inbox</span>
              {unreadCount > 0 && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </Link>
            <Link href="/admin/team" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-gray-600 hover:text-primary group">
              <Users className="w-8 h-8 mb-3 text-gray-400 group-hover:text-primary" />
              <span className="font-medium">Update Team</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold font-heading text-primary mb-6">System Notice</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-sm text-blue-900 leading-relaxed">
              <p className="font-semibold mb-1">SMTP Notification Engine Active</p>
              <p className="text-xs text-blue-700">
                Visitor inquiries submitted via the Contact form automatically dispatch notifications to the admin and send confirmation receipts to the visitor. Replies sent from the Inbox are delivered directly to the visitor's email with Gmail threading headers.
              </p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <Link 
                href="/admin/inbox" 
                className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                Go to Inbox &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
