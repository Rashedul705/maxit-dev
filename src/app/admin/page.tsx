import { Users, FileText, Briefcase, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { name: 'Team Members', value: '9', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Active Projects', value: '12', icon: Briefcase, color: 'text-green-500', bg: 'bg-green-50' },
    { name: 'About Sections', value: '6', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Monthly Visits', value: '2.4k', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-primary mb-2">Welcome Back, Admin</h1>
        <p className="text-gray-500">Here is what's happening with your website today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center mr-4`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold font-heading text-primary mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/team" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-gray-600 hover:text-primary group">
              <Users className="w-8 h-8 mb-3 text-gray-400 group-hover:text-primary" />
              <span className="font-medium">Update Team</span>
            </Link>
            <Link href="/admin/about" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-gray-600 hover:text-primary group">
              <FileText className="w-8 h-8 mb-3 text-gray-400 group-hover:text-primary" />
              <span className="font-medium">Edit About Page</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold font-heading text-primary mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[
              { title: "Team Member Added", time: "2 hours ago", desc: "Rupali was added as Project Director" },
              { title: "About Us Updated", time: "5 hours ago", desc: "Mission and Vision statements revised" },
              { title: "Project Uploaded", time: "1 day ago", desc: "50kW Solar Installation in Rajshahi" }
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-accent flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{activity.desc}</p>
                  <span className="text-xs text-gray-400 mt-1 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
