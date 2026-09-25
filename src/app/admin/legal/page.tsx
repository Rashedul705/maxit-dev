"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

type LegalPage = {
  privacyPolicy: string;
  termsOfService: string;
};

export default function LegalManagement() {
  const [data, setData] = useState<LegalPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/legal');
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch legal pages", err);
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
      const res = await fetch('/api/admin/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        setMessage({ type: "success", text: "Legal Pages updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to update legal pages" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !data) {
    return <div className="p-8 text-gray-500">Loading legal pages...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-primary mb-2">Legal Pages</h1>
        <p className="text-gray-500">Manage your Privacy Policy and Terms of Service. Note: Line breaks will be preserved.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Privacy Policy</h3>
            <div>
              <textarea
                required
                value={data.privacyPolicy}
                onChange={(e) => setData({ ...data, privacyPolicy: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 min-h-[300px]"
                placeholder="Enter privacy policy text..."
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Terms of Service</h3>
            <div>
              <textarea
                required
                value={data.termsOfService}
                onChange={(e) => setData({ ...data, termsOfService: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 min-h-[300px]"
                placeholder="Enter terms of service text..."
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
