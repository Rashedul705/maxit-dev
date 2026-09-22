"use client";

import { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";

export default function AboutManagement() {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    journey: "Founded with a passion for innovation, MaxIT Solution began with a simple goal: to make industrial-grade engineering and sustainable energy accessible.",
    mission: "To empower businesses, industries, and communities by delivering robust, scalable, and sustainable technology solutions.",
    vision: "To be the region's most trusted engineering and technology partner, driving the transition towards smart automation.",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

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

          {/* Vision */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">Vision Statement</label>
            <p className="text-sm text-gray-500 mb-4">Where do you aim to take the brand in the future?</p>
            <textarea 
              rows={3}
              required
              value={formData.vision}
              onChange={(e) => setFormData({...formData, vision: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
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
