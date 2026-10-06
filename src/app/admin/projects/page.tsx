"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Loader2 } from "lucide-react";

type Project = {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  client: string;
  date: string;
  technologies: string[];
  clientType: string;
  location: string;
  challenge: string;
  solution: string;
  scopeOfWork: string[];
  gallery: string[];
  stats: {
    capacityInstalled: string;
    energySaved: string;
    projectDuration: string;
  };
  imageUrl: string;
  order: number;
};

type Category = {
  _id: string;
  name: string;
  order: number;
};

export default function ProjectManagement() {
  const [activeTab, setActiveTab] = useState<"projects" | "categories">("projects");
  
  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  
  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  
  // Delete Modal State
  const [deleteItem, setDeleteItem] = useState<{ id: string, type: 'project' | 'category' } | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const defaultProjectForm = {
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    client: "",
    clientType: "",
    location: "",
    date: "",
    technologies: "",
    challenge: "",
    solution: "",
    scopeOfWork: "",
    gallery: [] as string[],
    statsCapacity: "",
    statsEnergy: "",
    statsDuration: "",
    imageUrl: "",
    order: 0
  };

  const [projectForm, setProjectForm] = useState(defaultProjectForm);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    order: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [projRes, catRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/project-categories')
      ]);
      if (projRes.ok) setProjects(await projRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploader = isGallery ? setIsUploadingGallery : setIsUploading;
    uploader(true);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        }
      }
      
      if (isGallery) {
        setProjectForm(prev => ({ ...prev, gallery: [...prev.gallery, ...uploadedUrls] }));
      } else if (uploadedUrls.length > 0) {
        setProjectForm(prev => ({ ...prev, imageUrl: uploadedUrls[0] }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
    } finally {
      uploader(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setProjectForm(prev => {
      const newGallery = [...prev.gallery];
      newGallery.splice(index, 1);
      return { ...prev, gallery: newGallery };
    });
  };

  // --- Project Handlers ---
  const openProjectModal = (project?: Project) => {
    setError("");
    if (project) {
      setEditProjectId(project._id);
      setProjectForm({
        title: project.title,
        description: project.description || "",
        shortDescription: project.shortDescription || "",
        category: project.category || (categories[0]?.name || ""),
        client: project.client || "",
        clientType: project.clientType || "",
        location: project.location || "",
        date: project.date || "",
        technologies: project.technologies ? project.technologies.join(", ") : "",
        challenge: project.challenge || "",
        solution: project.solution || "",
        scopeOfWork: project.scopeOfWork ? project.scopeOfWork.join("\n") : "",
        gallery: project.gallery || [],
        statsCapacity: project.stats?.capacityInstalled || "",
        statsEnergy: project.stats?.energySaved || "",
        statsDuration: project.stats?.projectDuration || "",
        imageUrl: project.imageUrl || "",
        order: project.order || 0
      });
    } else {
      setEditProjectId(null);
      setProjectForm({ ...defaultProjectForm, category: categories[0]?.name || "" });
    }
    setIsProjectModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    setIsSubmitting(true);
    try {
      if (deleteItem.type === 'project') {
        const res = await fetch(`/api/admin/projects/${deleteItem.id}`, { method: 'DELETE' });
        if (res.ok) {
          setProjects(prev => prev.filter(p => p._id !== deleteItem.id));
        } else {
          alert(`Failed to delete project: ${await res.text()}`);
        }
      } else {
        const res = await fetch(`/api/admin/project-categories/${deleteItem.id}`, { method: 'DELETE' });
        if (res.ok) {
          setCategories(prev => prev.filter(c => c._id !== deleteItem.id));
        } else {
          alert(`Failed to delete category: ${await res.text()}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error deleting: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setDeleteItem(null);
    }
  };

  const handleDeleteProject = (id: string) => {
    setDeleteItem({ id, type: 'project' });
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!projectForm.title.trim() || !projectForm.imageUrl) {
      setError("Title and Image are required");
      return;
    }

    const submitData = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean),
      scopeOfWork: projectForm.scopeOfWork.split('\n').map(t => t.trim()).filter(Boolean),
      stats: {
        capacityInstalled: projectForm.statsCapacity,
        energySaved: projectForm.statsEnergy,
        projectDuration: projectForm.statsDuration
      }
    };

    setIsSubmitting(true);
    try {
      const url = editProjectId ? `/api/admin/projects/${editProjectId}` : '/api/admin/projects';
      const method = editProjectId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      
      if (res.ok) {
        const data = await res.json();
        if (editProjectId) {
          setProjects(projects.map(p => p._id === editProjectId ? data : p));
        } else {
          setProjects([...projects, data]);
        }
        setIsProjectModalOpen(false);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save project");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Category Handlers ---
  const openCategoryModal = (category?: Category) => {
    setError("");
    if (category) {
      setEditCategoryId(category._id);
      setCategoryForm({ name: category.name, order: category.order || 0 });
    } else {
      setEditCategoryId(null);
      setCategoryForm({ name: "", order: 0 });
    }
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    setDeleteItem({ id, type: 'category' });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!categoryForm.name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editCategoryId ? `/api/admin/project-categories/${editCategoryId}` : '/api/admin/project-categories';
      const method = editCategoryId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      
      if (res.ok) {
        const data = await res.json();
        if (editCategoryId) {
          setCategories(categories.map(c => c._id === editCategoryId ? data : c));
        } else {
          setCategories([...categories, data]);
        }
        setIsCategoryModalOpen(false);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save category");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary mb-2">Projects & Categories</h1>
          <p className="text-gray-500">Manage your projects portfolio and categories.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "projects" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            Projects
          </button>
          <button 
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "categories" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            Categories
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === "projects" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Projects List</h2>
              <button onClick={() => openProjectModal()} className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </button>
            </div>
            <div className="overflow-x-auto min-h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
              ) : projects.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-400">No projects found. Add one to get started.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                      <th className="px-4 py-3 font-medium">Image</th>
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projects.map((project) => (
                      <tr key={project._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                            {project.imageUrl ? (
                              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{project.title}</td>
                        <td className="px-4 py-3 text-gray-600">
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                            {project.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => openProjectModal(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProject(project._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Categories List</h2>
              <button onClick={() => openCategoryModal()} className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4 mr-2" /> Add Category
              </button>
            </div>
            <div className="overflow-x-auto min-h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
              ) : categories.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-400">No categories found. Add one to get started.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Order</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{category.name}</td>
                        <td className="px-4 py-3 text-gray-600">{category.order}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => openCategoryModal(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteCategory(category._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && setIsProjectModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editProjectId ? "Edit Project" : "Add New Project"}
              </h2>
              <button onClick={() => setIsProjectModalOpen(false)} disabled={isSubmitting} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-6">
              
              {/* Primary Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Project Image *</label>
                <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors">
                  {projectForm.imageUrl ? (
                    <>
                      <img src={projectForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        {isUploading ? <Loader2 className="w-8 h-8 animate-spin mb-2" /> : <Edit2 className="w-8 h-8 mb-2" />}
                        <span className="font-medium">{isUploading ? "Uploading..." : "Click to change image"}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setProjectForm(prev => ({ ...prev, imageUrl: "" })); }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 group-hover:text-primary">
                      {isUploading ? <Loader2 className="w-8 h-8 mb-2 animate-spin" /> : <ImageIcon className="w-8 h-8 mb-2" />}
                      <span className="text-sm font-medium">{isUploading ? "Uploading..." : "Click to upload main image"}</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" disabled={isUploading} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, false)} />
                </div>
              </div>

              {/* Basic Details */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-800">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                    <input type="text" required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white">
                      <option value="">Select a category...</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <textarea rows={2} value={projectForm.shortDescription} onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                    <textarea required rows={4} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-800">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                    <input type="text" value={projectForm.client} onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Type</label>
                    <input type="text" value={projectForm.clientType} onChange={(e) => setProjectForm({ ...projectForm, clientType: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" value={projectForm.location} onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="text" value={projectForm.date} placeholder="e.g. October 2023" onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                    <input type="number" value={projectForm.order} onChange={(e) => setProjectForm({ ...projectForm, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (Comma-separated)</label>
                    <input type="text" value={projectForm.technologies} placeholder="Solar Panels, Smart Inverter, Battery Storage" onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-800">Key Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity Installed</label>
                    <input type="text" placeholder="e.g. 1.5 MW" value={projectForm.statsCapacity} onChange={(e) => setProjectForm({ ...projectForm, statsCapacity: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Energy Saved</label>
                    <input type="text" placeholder="e.g. 2,000 MWh/yr" value={projectForm.statsEnergy} onChange={(e) => setProjectForm({ ...projectForm, statsEnergy: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Duration</label>
                    <input type="text" placeholder="e.g. 6 Months" value={projectForm.statsDuration} onChange={(e) => setProjectForm({ ...projectForm, statsDuration: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Advanced Content */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-800">Advanced Content</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">The Challenge</label>
                    <textarea rows={3} value={projectForm.challenge} onChange={(e) => setProjectForm({ ...projectForm, challenge: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">The Solution</label>
                    <textarea rows={3} value={projectForm.solution} onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scope of Work (One item per line)</label>
                    <textarea rows={4} placeholder="Site assessment and structural analysis&#10;Custom system design and engineering" value={projectForm.scopeOfWork} onChange={(e) => setProjectForm({ ...projectForm, scopeOfWork: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-800">Project Gallery</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {projectForm.gallery.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 h-24">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="relative rounded-lg border-2 border-dashed border-gray-300 h-24 flex items-center justify-center hover:border-primary transition-colors cursor-pointer group">
                    {isUploadingGallery ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary" />}
                    <input type="file" multiple accept="image/*" disabled={isUploadingGallery} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, true)} />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && setIsCategoryModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editCategoryId ? "Edit Category" : "Add New Category"}
              </h2>
              <button onClick={() => setIsCategoryModalOpen(false)} disabled={isSubmitting} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input type="text" required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                <input type="number" value={categoryForm.order} onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && setDeleteItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 m-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this {deleteItem.type}? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => setDeleteItem(null)} 
                disabled={isSubmitting} 
                className="px-4 py-2 text-gray-600 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                disabled={isSubmitting} 
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Delete {deleteItem.type}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
