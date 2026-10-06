"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon } from "lucide-react";

type Service = {
  _id: string;
  title: string;
  iconUrl: string;
  imageUrl: string;
  subServices?: string[];
  order: number;
};

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);

  const [form, setForm] = useState({
    title: "",
    iconUrl: "",
    imageUrl: "",
    subServices: "",
    order: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        setServices(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isIcon: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isIcon) setIsUploadingIcon(true);
    else setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (isIcon) {
          setForm(prev => ({ ...prev, iconUrl: data.url }));
        } else {
          setForm(prev => ({ ...prev, imageUrl: data.url }));
        }
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      if (isIcon) setIsUploadingIcon(false);
      else setIsUploadingImage(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      title: "",
      iconUrl: "",
      imageUrl: "",
      subServices: "",
      order: 0
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditId(service._id);
    setForm({
      title: service.title,
      iconUrl: service.iconUrl || "",
      imageUrl: service.imageUrl || "",
      subServices: service.subServices ? service.subServices.join("\n") : "",
      order: service.order || 0
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setServices(services.filter(s => s._id !== id));
        } else {
          alert("Failed to delete service");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    
    const submitData = {
      ...form,
      subServices: form.subServices.split('\n').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editId) {
        const res = await fetch(`/api/admin/services/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
        
        if (res.ok) {
          const updated = await res.json();
          setServices(services.map(s => s._id === editId ? updated : s));
          setIsModalOpen(false);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to update service");
        }
      } else {
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
        
        if (res.ok) {
          const newService = await res.json();
          setServices([...services, newService]);
          setIsModalOpen(false);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to add service");
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary mb-2">Services Management</h1>
          <p className="text-gray-500">Manage services and capabilities shown on the public site.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Service
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400 bg-white rounded-2xl border border-gray-100">
          No services found. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
              <div className="h-40 bg-gray-100 relative group overflow-hidden border-b border-gray-100">
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm text-xs font-bold text-gray-700">
                  Order: {service.order}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col relative">
                {/* Custom Icon Overlay */}
                <div className="w-14 h-14 bg-white rounded-xl shadow-md border border-gray-100 absolute -top-7 left-6 flex items-center justify-center overflow-hidden">
                  {service.iconUrl ? (
                    <img src={service.iconUrl} alt="Icon" className="w-8 h-8 object-contain" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center leading-tight">No<br/>Icon</span>
                  )}
                </div>

                <div className="mt-8 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                </div>

                {service.subServices && service.subServices.length > 0 && (
                  <div className="flex-grow mb-6">
                    <ul className="text-sm text-gray-600 space-y-2">
                      {service.subServices.slice(0, 4).map((sub, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-2 mt-1.5 flex-shrink-0" />
                          <span className="truncate">{sub}</span>
                        </li>
                      ))}
                      {service.subServices.length > 4 && (
                        <li className="text-xs text-primary font-medium italic">+{service.subServices.length - 4} more</li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400">{service.subServices?.length || 0} sub-services</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openEditModal(service)}
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(service._id)}
                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editId ? "Edit Service" : "Add New Service"}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Icon Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Icon *</label>
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors flex items-center justify-center bg-gray-50">
                    {form.iconUrl ? (
                      <img src={form.iconUrl} alt="Icon Preview" className="w-16 h-16 object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-primary">
                        <ImageIcon className="w-6 h-6 mb-2" />
                        <span className="text-xs font-medium">Upload Icon</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">{isUploadingIcon ? "Uploading..." : "Change Icon"}</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      disabled={isUploadingIcon}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleUpload(e, true)}
                    />
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image (Optional)</label>
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors flex items-center justify-center bg-gray-50">
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-primary">
                        <ImageIcon className="w-6 h-6 mb-2" />
                        <span className="text-xs font-medium">Upload Cover</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">{isUploadingImage ? "Uploading..." : "Change Image"}</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      disabled={isUploadingImage}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleUpload(e, false)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Services (One per line)</label>
                <textarea
                  rows={5}
                  value={form.subServices}
                  onChange={(e) => setForm({ ...form, subServices: e.target.value })}
                  placeholder="Solar Installation&#10;Roof Top Solar&#10;Complete Solar Setup"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
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
                  {isSubmitting ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
