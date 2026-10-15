"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from "lucide-react";

type Testimonial = {
  _id: string;
  name: string;
  company: string;
  testimonial: string;
  rating: number;
  imageUrl: string;
  order: number;
};

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    testimonial: "",
    rating: 5,
    imageUrl: "",
    order: 0
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        setTestimonials(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, imageUrl: data.url });
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      name: "",
      company: "",
      testimonial: "",
      rating: 5,
      imageUrl: "",
      order: 0
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditId(t._id);
    setForm({
      name: t.name,
      company: t.company || "",
      testimonial: t.testimonial || "",
      rating: t.rating || 5,
      imageUrl: t.imageUrl || "",
      order: t.order || 0
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setTestimonials(testimonials.filter(t => t._id !== id));
        } else {
          alert("Failed to delete testimonial");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!form.name.trim() || !form.imageUrl) {
      setError("Name and Image are required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) {
        const res = await fetch(`/api/admin/testimonials/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        
        if (res.ok) {
          const updated = await res.json();
          setTestimonials(testimonials.map(t => t._id === editId ? updated : t));
          setIsModalOpen(false);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to update testimonial");
        }
      } else {
        const res = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        
        if (res.ok) {
          const newT = await res.json();
          setTestimonials([...testimonials, newT]);
          setIsModalOpen(false);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to add testimonial");
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
          <h1 className="text-3xl font-bold font-heading text-primary mb-2">Testimonials Management</h1>
          <p className="text-gray-500">Manage client success stories shown on the home page.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">No testimonials found. Add one to get started.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                        {t.imageUrl ? (
                          <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                    <td className="px-6 py-4 text-gray-600">{t.company}</td>
                    <td className="px-6 py-4 text-gray-600">{t.rating}/5</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(t)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(t._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editId ? "Edit Testimonial" : "Add New Testimonial"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Image *</label>
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors mx-auto">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 group-hover:text-primary">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span className="text-xs font-medium">Upload</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">{isUploading ? "..." : "Change"}</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial *</label>
                <textarea
                  required
                  rows={4}
                  value={form.testimonial}
                  onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
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
                  {isSubmitting ? "Saving..." : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
