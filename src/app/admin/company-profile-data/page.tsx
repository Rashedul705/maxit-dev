"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

type Stat = { label: string; value: string };
type Step = { title: string; description: string };
type Industry = { name: string; icon: string };
type WhyChooseUs = { title: string; description: string; icon: string };

type CompanyProfileData = {
  stats: Stat[];
  howWeWork: Step[];
  industries: Industry[];
  capabilities: string[];
  whyChooseUs: WhyChooseUs[];
};

const iconOptions = [
  "Home", "Sprout", "Building2", "Factory", "GraduationCap",
  "Activity", "Settings", "Landmark", "Cpu", "Cctv", "Target", "Sun"
];

export default function CompanyProfileDataManagement() {
  const [data, setData] = useState<CompanyProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/company-profile-data');
      if (res.ok) {
        const fetched = await res.json();
        // Ensure arrays exist
        setData({
          stats: fetched.stats || [],
          howWeWork: fetched.howWeWork || [],
          industries: fetched.industries || [],
          capabilities: fetched.capabilities || [],
          whyChooseUs: fetched.whyChooseUs || []
        });
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      const res = await fetch('/api/admin/company-profile-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        setMessage({ type: "success", text: "Company Profile Data updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to update data" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !data) {
    return <div className="p-8 text-gray-500">Loading company profile data...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-primary mb-2">Company Profile Data</h1>
        <p className="text-gray-500">Manage Stats, How We Work, and Industries We Serve sections.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-12">
          
          {/* STATS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Quick Introduction Stats</h3>
              <button 
                type="button" 
                onClick={() => setData({ ...data, stats: [...data.stats, { label: "", value: "" }] })}
                className="flex items-center text-sm font-medium text-accent hover:text-accent/80"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Stat
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.stats.map((stat, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                  <button 
                    type="button" 
                    onClick={() => {
                      const newStats = [...data.stats];
                      newStats.splice(i, 1);
                      setData({ ...data, stats: newStats });
                    }}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Value (e.g. 10+)</label>
                      <input
                        type="text"
                        required
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...data.stats];
                          newStats[i].value = e.target.value;
                          setData({ ...data, stats: newStats });
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                      <input
                        type="text"
                        required
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...data.stats];
                          newStats[i].label = e.target.value;
                          setData({ ...data, stats: newStats });
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HOW WE WORK SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">How We Work (Process Steps)</h3>
              <button 
                type="button" 
                onClick={() => setData({ ...data, howWeWork: [...data.howWeWork, { title: "", description: "" }] })}
                className="flex items-center text-sm font-medium text-accent hover:text-accent/80"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Step
              </button>
            </div>
            
            <div className="space-y-4">
              {data.howWeWork.map((step, i) => (
                <div key={i} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-200 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary font-bold rounded-lg flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={step.title}
                        onChange={(e) => {
                          const newSteps = [...data.howWeWork];
                          newSteps[i].title = e.target.value;
                          setData({ ...data, howWeWork: newSteps });
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <textarea
                        required
                        value={step.description}
                        onChange={(e) => {
                          const newSteps = [...data.howWeWork];
                          newSteps[i].description = e.target.value;
                          setData({ ...data, howWeWork: newSteps });
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 resize-none h-20"
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const newSteps = [...data.howWeWork];
                      newSteps.splice(i, 1);
                      setData({ ...data, howWeWork: newSteps });
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors mt-8"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* INDUSTRIES SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Industries We Serve</h3>
              <button 
                type="button" 
                onClick={() => setData({ ...data, industries: [...data.industries, { name: "", icon: "Home" }] })}
                className="flex items-center text-sm font-medium text-accent hover:text-accent/80"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Industry
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.industries.map((ind, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                  <button 
                    type="button" 
                    onClick={() => {
                      const newInds = [...data.industries];
                      newInds.splice(i, 1);
                      setData({ ...data, industries: newInds });
                    }}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Industry Name</label>
                      <input
                        type="text"
                        required
                        value={ind.name}
                        onChange={(e) => {
                          const newInds = [...data.industries];
                          newInds[i].name = e.target.value;
                          setData({ ...data, industries: newInds });
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                      <select
                        value={ind.icon}
                        onChange={(e) => {
                          const newInds = [...data.industries];
                          newInds[i].icon = e.target.value;
                          setData({ ...data, industries: newInds });
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      >
                        {iconOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CAPABILITIES SECTION */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Capabilities List</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comma-separated Capabilities (e.g. Energy, Automation, Security)</label>
              <input
                type="text"
                required
                value={data.capabilities.join(", ")}
                onChange={(e) => setData({ ...data, capabilities: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* WHY CHOOSE US SECTION */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Why Choose MaxIT (Company Profile)</h3>
              <button 
                type="button" 
                onClick={() => setData({ ...data, whyChooseUs: [...data.whyChooseUs, { title: "", description: "", icon: "Target" }] })}
                className="flex items-center text-sm font-medium text-accent hover:text-accent/80"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Reason
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.whyChooseUs.map((reason, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                  <button 
                    type="button" 
                    onClick={() => {
                      const newReasons = [...data.whyChooseUs];
                      newReasons.splice(i, 1);
                      setData({ ...data, whyChooseUs: newReasons });
                    }}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={reason.title}
                        onChange={(e) => {
                          const newReasons = [...data.whyChooseUs];
                          newReasons[i].title = e.target.value;
                          setData({ ...data, whyChooseUs: newReasons });
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <textarea
                        required
                        value={reason.description}
                        onChange={(e) => {
                          const newReasons = [...data.whyChooseUs];
                          newReasons[i].description = e.target.value;
                          setData({ ...data, whyChooseUs: newReasons });
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 resize-none h-16"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                      <select
                        value={reason.icon}
                        onChange={(e) => {
                          const newReasons = [...data.whyChooseUs];
                          newReasons[i].icon = e.target.value;
                          setData({ ...data, whyChooseUs: newReasons });
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      >
                        {["Target", "Settings", "Shield", "Briefcase", "Phone", "Sprout"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg font-medium flex items-center ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.text}
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
