"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

type Stat = {
  end: number;
  suffix: string;
  label: string;
};

type HeroContent = {
  brandingText: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  stats: Stat[];
};

export default function HeroManagement() {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/hero');
      if (res.ok) {
        setContent(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch hero content", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatChange = (index: number, field: keyof Stat, value: any) => {
    if (!content) return;
    const newStats = [...content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setContent({ ...content, stats: newStats });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      
      if (res.ok) {
        setMessage({ type: "success", text: "Hero content updated successfully!" });
        // clear success message after 3s
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to update hero content" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !content) {
    return <div className="p-8 text-gray-500">Loading hero settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-primary mb-2">Hero Section & Stats</h1>
        <p className="text-gray-500">Manage the main text and animated counters at the top of the homepage.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Main Text</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branding / Kicker Text</label>
              <input
                type="text"
                required
                value={content.brandingText}
                onChange={(e) => setContent({ ...content, brandingText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 1</label>
                <input
                  type="text"
                  required
                  value={content.titleLine1}
                  onChange={(e) => setContent({ ...content, titleLine1: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 2 (Colored)</label>
                <input
                  type="text"
                  required
                  value={content.titleLine2}
                  onChange={(e) => setContent({ ...content, titleLine2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph</label>
              <textarea
                required
                rows={3}
                value={content.description}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Animated Stats</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Stat Block {index + 1}</div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Number</label>
                      <input
                        type="number"
                        required
                        value={stat.end}
                        onChange={(e) => handleStatChange(index, 'end', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Suffix (e.g. +, /7, k)</label>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) => handleStatChange(index, 'suffix', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      required
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
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
              className="flex items-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
