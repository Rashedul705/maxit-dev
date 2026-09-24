"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search, Building2, Image as ImageIcon } from "lucide-react";

type Partner = {
  id: string;
  name: string;
  section: "home" | "profile";
  order: number;
  logo?: string;
  description?: string;
};

export default function PartnersManagement() {
  const [activeTab, setActiveTab] = useState<"home" | "profile">("home");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", logo: "", description: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, [activeTab]);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/partners?section=${activeTab}`);
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (err) {
      console.error("Failed to fetch partners", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData({ name: "", logo: "", description: "" });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (partner: Partner) => {
    setEditId(partner.id);
    setFormData({ name: partner.name, logo: partner.logo || "", description: partner.description || "" });
    setError("");
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, logo: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this partner?")) {
      try {
        const res = await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setPartners(partners.filter(p => p.id !== id));
        } else {
          alert("Failed to delete partner");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    if (formData.name.trim().length > 30) {
      setError("Name must be 30 characters or less");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) {
        const res = await fetch(`/api/admin/partners/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, logo: formData.logo, description: formData.description })
        });
        
        if (res.ok) {
          const updated = await res.json();
          setPartners(partners.map(p => p.id === editId ? updated : p));
          setIsModalOpen(false);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to update partner");
        }
      } else {
        const res = await fetch('/api/admin/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, section: activeTab, logo: formData.logo, description: formData.description })
        });
        
        if (res.ok) {
          const newPartner = await res.json();
          setPartners([...partners, newPartner]);
          setIsModalOpen(false);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to add partner");
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary mb-2">Partner Management</h1>
          <p className="text-gray-500">Manage partner organizations for different sections of the website.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Partner
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "home" 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Homepage partners
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "profile" 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Company profile partners
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search partners..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">Loading partners...</div>
          ) : partners.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">No partners found for this section.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Partner Name</th>
                  <th className="px-6 py-4 font-medium">Appearance</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{partner.name}</td>
                    <td className="px-6 py-4">
                      {partner.logo ? (
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                           <div className="w-10 h-10 rounded-md bg-white border border-gray-100 flex items-center justify-center p-1 shadow-sm">
                             <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                           </div>
                           <span>Custom Logo</span>
                        </div>
                      ) : activeTab === 'home' ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                            <Building2 className="w-3 h-3" />
                          </div>
                          <span>White Card</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center text-accent" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
                            <Building2 className="w-3 h-3" />
                          </div>
                          <span>Teal Hexagon</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(partner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(partner.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editId ? "Edit Partner" : "Add New Partner"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partner Logo</label>
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors bg-white">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium text-center px-1">Upload Logo</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner Name *
                  </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. NESCO"
                />
                  <p className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>Used for {activeTab === 'home' ? 'Homepage' : 'Company Profile'} section</span>
                    <span>{formData.name.length}/30</span>
                  </p>
                </div>
              </div>

              {activeTab === 'profile' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Export to spreadsheet in one click"
                  />
                  <p className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>Only visible on Company Profile grid</span>
                    <span>{formData.description.length}/100</span>
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
