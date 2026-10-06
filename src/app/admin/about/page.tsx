"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2 } from "lucide-react";

export default function AboutManagement() {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    journey: "",
    mission: "",
    vision: "",
    aboutHeaderTitle: "The Story Behind Max iT",
    whatSetsUsApartTitle: "What Sets Us Apart",
    whatSetsUsApartSubtitle: "Why forward-thinking companies choose Max iT as their trusted technology partner.",
    coreValuesTitle: "Our Core Values",
    coreValuesSubtitle: "These guiding principles shape our culture, drive our decisions, and define how we interact with our clients and the world.",
    behindTheScenesTitle: "Behind The Scenes",
    behindTheScenesSubtitle: "A glimpse into our operational excellence and the technology that drives us.",
    ctaTitle: "Ready to Transform Your Future?",
    ctaSubtitle: "Whether you need scalable solar energy, industrial automation, or enterprise networking, our team is ready to build your solution.",
    features: [
      { title: "Premium Equipment", desc: "We source and deploy only industry-leading, rigorously tested materials." },
      { title: "Expert Engineers", desc: "Our team consists of certified professionals with years of hands-on experience." },
      { title: "End-to-End Solutions", desc: "From conceptual design to final commissioning and maintenance." },
      { title: "24/7 Support", desc: "Dedicated after-sales support ensuring maximum uptime and reliability." }
    ],
    coreValues: [
      { title: "Quality Assurance", desc: "Never compromising on standards. Excellence is our baseline." },
      { title: "Integrity & Transparency", desc: "Honest communication and ethical business practices in every deal." },
      { title: "Customer Success", desc: "Your success is our success. We build long-term partnerships." },
      { title: "Sustainable Innovation", desc: "Prioritizing eco-friendly solutions that protect our future." }
    ]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/about");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            journey: data.journey || "",
            mission: data.mission || "",
            vision: data.vision || "",
            aboutHeaderTitle: data.aboutHeaderTitle || "The Story Behind Max iT",
            whatSetsUsApartTitle: data.whatSetsUsApartTitle || "What Sets Us Apart",
            whatSetsUsApartSubtitle: data.whatSetsUsApartSubtitle || "Why forward-thinking companies choose Max iT as their trusted technology partner.",
            coreValuesTitle: data.coreValuesTitle || "Our Core Values",
            coreValuesSubtitle: data.coreValuesSubtitle || "These guiding principles shape our culture, drive our decisions, and define how we interact with our clients and the world.",
            behindTheScenesTitle: data.behindTheScenesTitle || "Behind The Scenes",
            behindTheScenesSubtitle: data.behindTheScenesSubtitle || "A glimpse into our operational excellence and the technology that drives us.",
            ctaTitle: data.ctaTitle || "Ready to Transform Your Future?",
            ctaSubtitle: data.ctaSubtitle || "Whether you need scalable solar energy, industrial automation, or enterprise networking, our team is ready to build your solution.",
            features: data.features?.length > 0 ? data.features : [
              { title: "Premium Equipment", desc: "We source and deploy only industry-leading, rigorously tested materials." },
              { title: "Expert Engineers", desc: "Our team consists of certified professionals with years of hands-on experience." },
              { title: "End-to-End Solutions", desc: "From conceptual design to final commissioning and maintenance." },
              { title: "24/7 Support", desc: "Dedicated after-sales support ensuring maximum uptime and reliability." }
            ],
            coreValues: data.coreValues?.length > 0 ? data.coreValues : [
              { title: "Quality Assurance", desc: "Never compromising on standards. Excellence is our baseline." },
              { title: "Integrity & Transparency", desc: "Honest communication and ethical business practices in every deal." },
              { title: "Customer Success", desc: "Your success is our success. We build long-term partnerships." },
              { title: "Sustainable Innovation", desc: "Prioritizing eco-friendly solutions that protect our future." }
            ]
          });
        }
      } catch (err) {
        console.error("Failed to fetch about data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert("Failed to save changes");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto relative pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-primary mb-2">About Section Management</h1>
        <p className="text-gray-500">Update the content displayed on the About Us page.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Brand Story */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">Our Journey (Brand Story)</label>
            <p className="text-sm text-gray-500 mb-4">This text appears at the very top of the About Us page.</p>
            <textarea 
              rows={4}
              required
              value={formData.journey}
              onChange={(e) => setFormData({...formData, journey: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
          </div>

          <hr className="border-gray-100" />

          {/* Mission */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">Mission Statement</label>
            <p className="text-sm text-gray-500 mb-4">What value do you deliver to customers today?</p>
            <textarea 
              rows={3}
              required
              value={formData.mission}
              onChange={(e) => setFormData({...formData, mission: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
          </div>

          <hr className="border-gray-100" />

          {/* Section Titles */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Section Titles & Subtitles</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Header Title</label>
                <input type="text" value={formData.aboutHeaderTitle} onChange={(e) => setFormData({...formData, aboutHeaderTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What Sets Us Apart Title</label>
                <input type="text" value={formData.whatSetsUsApartTitle} onChange={(e) => setFormData({...formData, whatSetsUsApartTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What Sets Us Apart Subtitle</label>
                <input type="text" value={formData.whatSetsUsApartSubtitle} onChange={(e) => setFormData({...formData, whatSetsUsApartSubtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            
            {/* Features Array Edit */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
              <h4 className="font-semibold text-gray-800 mb-2">What Sets Us Apart - Features (4 Items)</h4>
              {formData.features.map((feature, idx) => (
                <div key={`feature-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start border-b border-gray-200 pb-3 mb-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title {idx + 1}</label>
                    <input type="text" value={feature.title} onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[idx].title = e.target.value;
                      setFormData({...formData, features: newFeatures});
                    }} className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary/20" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description {idx + 1}</label>
                    <textarea rows={2} value={feature.desc} onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[idx].desc = e.target.value;
                      setFormData({...formData, features: newFeatures});
                    }} className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary/20 resize-y" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Core Values Title</label>
                <input type="text" value={formData.coreValuesTitle} onChange={(e) => setFormData({...formData, coreValuesTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Core Values Subtitle</label>
                <input type="text" value={formData.coreValuesSubtitle} onChange={(e) => setFormData({...formData, coreValuesSubtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            {/* Core Values Array Edit */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
              <h4 className="font-semibold text-gray-800 mb-2">Our Core Values (4 Items)</h4>
              {formData.coreValues.map((val, idx) => (
                <div key={`val-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start border-b border-gray-200 pb-3 mb-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title {idx + 1}</label>
                    <input type="text" value={val.title} onChange={(e) => {
                      const newVals = [...formData.coreValues];
                      newVals[idx].title = e.target.value;
                      setFormData({...formData, coreValues: newVals});
                    }} className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary/20" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description {idx + 1}</label>
                    <textarea rows={2} value={val.desc} onChange={(e) => {
                      const newVals = [...formData.coreValues];
                      newVals[idx].desc = e.target.value;
                      setFormData({...formData, coreValues: newVals});
                    }} className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary/20 resize-y" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Behind The Scenes Title</label>
                <input type="text" value={formData.behindTheScenesTitle} onChange={(e) => setFormData({...formData, behindTheScenesTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Behind The Scenes Subtitle</label>
                <input type="text" value={formData.behindTheScenesSubtitle} onChange={(e) => setFormData({...formData, behindTheScenesSubtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
                <input type="text" value={formData.ctaTitle} onChange={(e) => setFormData({...formData, ctaTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Subtitle</label>
                <input type="text" value={formData.ctaSubtitle} onChange={(e) => setFormData({...formData, ctaSubtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium disabled:opacity-70"
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Success Toast */}
      <div className={`fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center transform transition-all duration-300 ${
        showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}>
        <CheckCircle2 className="w-6 h-6 mr-3" />
        <div>
          <h4 className="font-bold">Success</h4>
          <p className="text-green-50 text-sm">About section updated successfully.</p>
        </div>
      </div>
    </div>
  );
}
