"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Star } from "lucide-react";
import { 
  Sun, Settings, Leaf, Cpu, Headphones, TrendingDown, 
  Activity, Cctv, Target, Home, Sprout, Building2, 
  Factory, GraduationCap, Landmark
} from 'lucide-react';

type Reason = {
  _id: string;
  title: string;
  description: string;
  iconCategory: string;
  gradient: string;
  order: number;
};

const iconOptions = [
  "Sun", "Settings", "Leaf", "Cpu", "Headphones", "TrendingDown",
  "Activity", "Cctv", "Target", "Home", "Sprout", "Building2", 
  "Factory", "GraduationCap", "Landmark"
];

const gradientOptions = [
  "from-amber-400 to-orange-500",
  "from-blue-400 to-indigo-500",
  "from-green-400 to-emerald-500",
  "from-purple-400 to-pink-500",
  "from-rose-400 to-red-500",
  "from-teal-400 to-cyan-500"
];

const IconMap = ({ iconName, className }: { iconName: string, className?: string }) => {
  const map: Record<string, React.ReactNode> = {
    Sun: <Sun className={className} />,
    Settings: <Settings className={className} />,
    Leaf: <Leaf className={className} />,
    Cpu: <Cpu className={className} />,
    Headphones: <Headphones className={className} />,
    TrendingDown: <TrendingDown className={className} />,
    Activity: <Activity className={className} />,
    Cctv: <Cctv className={className} />,
    Target: <Target className={className} />,
    Home: <Home className={className} />,
    Sprout: <Sprout className={className} />,
    Building2: <Building2 className={className} />,
    Factory: <Factory className={className} />,
    GraduationCap: <GraduationCap className={className} />,
    Landmark: <Landmark className={className} />
  };
  return map[iconName] || <Settings className={className} />;
};

export default function ReasonsManagement() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    iconCategory: "Settings",
    gradient: "from-blue-400 to-indigo-500",
    order: 0
  });

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/reasons');
      if (res.ok) {
        setReasons(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch reasons", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      title: "",
      description: "",
      iconCategory: "Settings",
      gradient: "from-blue-400 to-indigo-500",
      order: 0
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (r: Reason) => {
    setEditId(r._id);
    setForm({
      title: r.title,
      description: r.description || "",
      iconCategory: r.iconCategory || "Settings",
      gradient: r.gradient || "from-blue-400 to-indigo-500",
      order: r.order || 0
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this reason?")) {
      try {
        const res = await fetch(`/api/admin/reasons/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setReasons(reasons.filter(r => r._id !== id));
        } else {
          alert("Failed to delete reason");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) {
        const res = await fetch(`/api/admin/reasons/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        
        if (res.ok) {
          const updated = await res.json();
          setReasons(reasons.map(r => r._id === editId ? updated : r));
          setIsModalOpen(false);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to update reason");
        }
      } else {
        const res = await fetch('/api/admin/reasons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        
        if (res.ok) {
          const newR = await res.json();
          setReasons([...reasons, newR]);
          setIsModalOpen(false);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to add reason");
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
          <h1 className="text-3xl font-bold font-heading text-primary mb-2">Why Choose Us</h1>
          <p className="text-gray-500">Manage the reasons/features grid on the home page.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Reason
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
          ) : reasons.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">No reasons found. Add one to get started.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Icon / Color</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reasons.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white shadow-sm`}>
                        <IconMap iconName={r.iconCategory} className="w-6 h-6" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{r.title}</td>
                    <td className="px-6 py-4 text-gray-600">{r.order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(r)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(r._id)}
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
                {editId ? "Edit Reason" : "Add New Reason"}
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
              
              <div className="flex items-center justify-center mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${form.gradient} flex items-center justify-center text-white shadow-lg transition-all duration-300`}>
                  <IconMap iconName={form.iconCategory} className="w-10 h-10" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={form.iconCategory}
                    onChange={(e) => setForm({ ...form, iconCategory: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 bg-white"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gradient Background</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {gradientOptions.map(grad => (
                    <div 
                      key={grad}
                      onClick={() => setForm({ ...form, gradient: grad })}
                      className={`h-10 rounded-lg bg-gradient-to-br ${grad} cursor-pointer border-2 transition-all ${
                        form.gradient === grad ? 'border-primary scale-110 shadow-md' : 'border-transparent hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
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
                  {isSubmitting ? "Saving..." : "Save Reason"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
