"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

type GlobalContact = {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  phoneNumber: string;
  email: string;
  facebookUrl: string;
  linkedinUrl: string;
  githubUrl: string;
};

export default function ContactManagement() {
  const [content, setContent] = useState<GlobalContact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/contact');
      if (res.ok) {
        setContent(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch contact content", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      
      if (res.ok) {
        setMessage({ type: "success", text: "Contact information updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to update contact information" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !content) {
    return <div className="p-8 text-gray-500">Loading contact settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-primary mb-2">Global Contact Info</h1>
        <p className="text-gray-500">Manage the address, phone, email, and social links used across the site.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Primary Contact</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={content.email}
                  onChange={(e) => setContent({ ...content, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={content.phoneNumber}
                  onChange={(e) => setContent({ ...content, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Office Address</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 (e.g. 2nd Floor, Afroza Tower,)</label>
              <input
                type="text"
                required
                value={content.addressLine1}
                onChange={(e) => setContent({ ...content, addressLine1: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (e.g. Uposhohor Newmarket,)</label>
              <input
                type="text"
                required
                value={content.addressLine2}
                onChange={(e) => setContent({ ...content, addressLine2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 3 (e.g. Rajshahi-6000)</label>
              <input
                type="text"
                required
                value={content.addressLine3}
                onChange={(e) => setContent({ ...content, addressLine3: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Social Links</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={content.facebookUrl}
                onChange={(e) => setContent({ ...content, facebookUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={content.linkedinUrl}
                onChange={(e) => setContent({ ...content, linkedinUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input
                type="text"
                value={content.githubUrl}
                onChange={(e) => setContent({ ...content, githubUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                placeholder="https://github.com/..."
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
