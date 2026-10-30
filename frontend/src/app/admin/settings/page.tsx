"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

type FeaturedPoint = { name: string; desc: string };

type SiteSettings = {
  servicesHeaderTitle: string;
  servicesHeaderSubtitle: string;
  projectsHeaderTitle: string;
  projectsHeaderSubtitle: string;
  contactHeaderTitle: string;
  contactHeaderSubtitle: string;
  
  heroPrimaryButtonLink: string;
  heroSecondaryButtonLink: string;
  navbarContactButtonLink: string;
  footerContactButtonLink: string;

  featuredServiceTitle: string;
  featuredServiceDescription: string;
  featuredServicePoints: FeaturedPoint[];
  googleMapsUrl?: string;
  footerAddresses?: { title: string; details: string; order?: number }[];
};

export default function SiteSettingsManagement() {
  const [data, setData] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/site-settings');
      if (res.ok) {
        const fetched = await res.json();
        let initialAddresses = Array.isArray(fetched.footerAddresses) && fetched.footerAddresses.length > 0
          ? fetched.footerAddresses
          : null;

        if (!initialAddresses && fetched.footerAddressLine3?.includes('<!--JSON:')) {
          try {
            const match = fetched.footerAddressLine3.match(/<!--JSON:(.*?)-->/);
            if (match && match[1]) {
              initialAddresses = JSON.parse(match[1]);
            }
          } catch (e) {}
        }

        if (!initialAddresses || initialAddresses.length === 0) {
          initialAddresses = [
            { title: "Head Office", details: "Afroza Tower, 4th Floor, Uposhohor Newmarket, Rajshahi" },
            { title: "LAB Office", details: "Afroza Tower, 2nd Floor, Uposhohor Newmarket, Rajshahi" }
          ];
        }

        setData({
          ...fetched,
          featuredServicePoints: fetched.featuredServicePoints || [],
          footerAddresses: initialAddresses
        });
      }
    } catch (err) {
      console.error("Failed to fetch site settings", err);
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
      const toSave = { ...data };
      if (toSave.footerAddresses && toSave.footerAddresses.length > 0) {
        const headOffice = toSave.footerAddresses[0];
        const lines = headOffice?.details ? headOffice.details.split('\n').map((l: string) => l.trim()).filter(Boolean) : [];
        if (lines.length > 0) {
          (toSave as any).footerAddressLine1 = lines[0];
          (toSave as any).footerAddressLine2 = lines[1] || '';
          const line3Base = lines.slice(2).join(', ') || 'Rajshahi-6000';
          (toSave as any).footerAddressLine3 = `${line3Base}\n<!--JSON:${JSON.stringify(toSave.footerAddresses)}-->`;
        } else {
          (toSave as any).footerAddressLine3 = `Rajshahi-6000\n<!--JSON:${JSON.stringify(toSave.footerAddresses)}-->`;
        }
      }

      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave)
      });
      
      if (res.ok) {
        setMessage({ type: "success", text: "Site settings updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: errData.error || "Failed to update site settings" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !data) {
    return <div className="p-8 text-gray-500">Loading site settings...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-primary mb-2">Site Settings & Shared Sections</h1>
        <p className="text-gray-500">Manage global button links and the featured solar service block.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-12">
          
          {/* BUTTON LINKS */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Button Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl">
              <h4 className="col-span-full font-bold text-primary">Homepage Hero Buttons</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Explore Services Link</label>
                <input
                  type="text" required value={data.heroPrimaryButtonLink || ""}
                  onChange={(e) => setData({ ...data, heroPrimaryButtonLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Us Link</label>
                <input
                  type="text" required value={data.heroSecondaryButtonLink || ""}
                  onChange={(e) => setData({ ...data, heroSecondaryButtonLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl">
              <h4 className="col-span-full font-bold text-primary">Global Contact Buttons</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Navbar Contact Link</label>
                <input
                  type="text" required value={data.navbarContactButtonLink || ""}
                  onChange={(e) => setData({ ...data, navbarContactButtonLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Contact Link</label>
                <input
                  type="text" required value={data.footerContactButtonLink || ""}
                  onChange={(e) => setData({ ...data, footerContactButtonLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* FEATURED SOLAR SERVICE */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Featured Solar Service Block</h3>
                <p className="text-sm text-gray-500">This block appears on the Services page and Company Profile page.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setData({ ...data, featuredServicePoints: [...data.featuredServicePoints, { name: "", desc: "" }] })}
                className="flex items-center text-sm font-medium text-accent hover:text-accent/80"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Point
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Title</label>
                <input
                  type="text" required value={data.featuredServiceTitle}
                  onChange={(e) => setData({ ...data, featuredServiceTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Description</label>
                <textarea
                  required value={data.featuredServiceDescription}
                  onChange={(e) => setData({ ...data, featuredServiceDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 h-24 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.featuredServicePoints.map((point, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                  <button 
                    type="button" 
                    onClick={() => {
                      const newPoints = [...data.featuredServicePoints];
                      newPoints.splice(i, 1);
                      setData({ ...data, featuredServicePoints: newPoints });
                    }}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Point Name (e.g. Roof Top Solar)</label>
                      <input
                        type="text" required value={point.name}
                        onChange={(e) => {
                          const newPoints = [...data.featuredServicePoints];
                          newPoints[i].name = e.target.value;
                          setData({ ...data, featuredServicePoints: newPoints });
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <input
                        type="text" required value={point.desc}
                        onChange={(e) => {
                          const newPoints = [...data.featuredServicePoints];
                          newPoints[i].desc = e.target.value;
                          setData({ ...data, featuredServicePoints: newPoints });
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER ADDRESSES */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Footer Multiple Addresses</h3>
                <p className="text-sm text-gray-500">Manage multiple location addresses displayed in the website footer (e.g. Head Office, LAB, Regional Offices).</p>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  const current = data.footerAddresses || [
                    { title: "Head Office", details: "Afroza Tower, 4th Floor,\nUposhohor Newmarket, Rajshahi-6000" },
                    { title: "LAB", details: "Innovation & Automation Lab, Rajshahi" }
                  ];
                  setData({ ...data, footerAddresses: [...current, { title: "New Location", details: "" }] });
                }}
                className="flex items-center text-sm font-medium text-accent hover:text-accent/80 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(data.footerAddresses || [
                { title: "Head Office", details: "Afroza Tower, 4th Floor,\nUposhohor Newmarket, Rajshahi-6000" },
                { title: "LAB", details: "Innovation & Automation Lab, Rajshahi" }
              ]).map((addr, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                  <button 
                    type="button" 
                    onClick={() => {
                      const current = [...(data.footerAddresses || [
                        { title: "Head Office", details: "Afroza Tower, 4th Floor, Uposhohor Newmarket, Rajshahi" },
                        { title: "LAB Office", details: "Afroza Tower, 2nd Floor, Uposhohor Newmarket, Rajshahi" }
                      ])];
                      current.splice(i, 1);
                      setData({ ...data, footerAddresses: current });
                    }}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Location Title (e.g. Head Office, LAB)</label>
                      <input
                        type="text" required value={addr.title}
                        onChange={(e) => {
                          const current = [...(data.footerAddresses || [
                            { title: "Head Office", details: "Afroza Tower, 4th Floor, Uposhohor Newmarket, Rajshahi" },
                            { title: "LAB Office", details: "Afroza Tower, 2nd Floor, Uposhohor Newmarket, Rajshahi" }
                          ])];
                          current[i] = { ...current[i], title: e.target.value };
                          setData({ ...data, footerAddresses: current });
                        }}
                        className="w-full px-3 py-1.5 text-sm font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Address Details (newlines supported)</label>
                      <textarea
                        rows={3}
                        required value={addr.details}
                        onChange={(e) => {
                          const current = [...(data.footerAddresses || [
                            { title: "Head Office", details: "Afroza Tower, 4th Floor, Uposhohor Newmarket, Rajshahi" },
                            { title: "LAB Office", details: "Afroza Tower, 2nd Floor, Uposhohor Newmarket, Rajshahi" }
                          ])];
                          current[i] = { ...current[i], details: e.target.value };
                          setData({ ...data, footerAddresses: current });
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Google Maps Location URL (Footer &amp; Contact)</label>
              <input
                type="text"
                value={data.googleMapsUrl || ""}
                onChange={(e) => setData({ ...data, googleMapsUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 bg-white"
                placeholder="https://maps.app.goo.gl/..."
              />
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
