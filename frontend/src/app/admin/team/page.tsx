"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Check, Settings } from "lucide-react";

type SocialLinks = {
  linkedin?: string;
  email?: string;
  whatsapp?: string;
};

type CEO = {
  name: string;
  nickname?: string;
  officialTitle: string;
  functionalDesignation: string;
  photoUrl: string;
  message: string;
  socialLinks: SocialLinks;
};

type TeamMember = {
  _id: string;
  name: string;
  officialTitle: string;
  functionalDesignation: string;
  section: string;
  bio: string;
  photoUrl: string;
  socialLinks: SocialLinks;
  order: number;
};

type TeamSection = {
  _id: string;
  name: string;
  order: number;
};

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState<"ceo" | "members">("ceo");
  
  // CEO State
  const [ceoData, setCeoData] = useState<CEO | null>(null);
  const [isSavingCeo, setIsSavingCeo] = useState(false);
  const [ceoSaveSuccess, setCeoSaveSuccess] = useState(false);

  // Members State
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [sections, setSections] = useState<TeamSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSectionConfirmId, setDeleteSectionConfirmId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [siteSettings, setSiteSettings] = useState<any>(null);
  
  // Section Management State
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const [memberForm, setMemberForm] = useState({
    name: "",
    officialTitle: "",
    functionalDesignation: "",
    section: "",
    bio: "",
    photoUrl: "",
    socialLinks: { linkedin: "", email: "", whatsapp: "" }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ceoRes, membersRes, sectionsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/ceo'),
        fetch('/api/admin/team'),
        fetch('/api/admin/team-sections'),
        fetch('/api/admin/site-settings')
      ]);
      
      if (ceoRes.ok) setCeoData(await ceoRes.json());
      if (membersRes.ok) setMembers(await membersRes.json());
      if (sectionsRes.ok) {
        const data = await sectionsRes.json();
        setSections(data);
        if (data.length > 0 && !memberForm.section) {
          setMemberForm(prev => ({ ...prev, section: data[0].name }));
        }
      }
      if (settingsRes.ok) setSiteSettings(await settingsRes.json());
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCeo: boolean) => {
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
        if (isCeo && ceoData) {
          setCeoData({ ...ceoData, photoUrl: data.url });
        } else {
          setMemberForm({ ...memberForm, photoUrl: data.url });
        }
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

  const handleSaveCeo = async () => {
    if (!ceoData?.name) return;
    setIsSavingCeo(true);
    try {
      const res = await fetch('/api/admin/ceo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ceoData)
      });
      if (res.ok) {
        setCeoSaveSuccess(true);
        setTimeout(() => setCeoSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save CEO data", err);
    } finally {
      setIsSavingCeo(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setMemberForm({
      name: "",
      officialTitle: "",
      functionalDesignation: "",
      section: sections.length > 0 ? sections[0].name : "Board of Directors",
      bio: "",
      photoUrl: "",
      socialLinks: { linkedin: "", email: "", whatsapp: "" }
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditId(member._id);
    setMemberForm({
      name: member.name,
      officialTitle: member.officialTitle,
      functionalDesignation: member.functionalDesignation || "",
      section: member.section || (sections.length > 0 ? sections[0].name : "Board of Directors"),
      bio: member.bio || "",
      photoUrl: member.photoUrl || "",
      socialLinks: {
        linkedin: member.socialLinks?.linkedin || "",
        email: member.socialLinks?.email || "",
        whatsapp: member.socialLinks?.whatsapp || ""
      }
    });
    setError("");
    setIsModalOpen(true);
  };

  const confirmDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers(members.filter(m => m._id !== id));
      } else {
        alert("Failed to delete member");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!memberForm.name.trim() || !memberForm.officialTitle.trim()) {
      setError("Name and official title are required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) {
        const res = await fetch(`/api/admin/team/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberForm)
        });
        
        if (res.ok) {
          const updated = await res.json();
          setMembers(members.map(m => m._id === editId ? updated : m));
          setIsModalOpen(false);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to update member");
        }
      } else {
        const res = await fetch('/api/admin/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberForm)
        });
        
        if (res.ok) {
          const newMember = await res.json();
          setMembers([...members, newMember]);
          setIsModalOpen(false);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to add member");
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section Management Functions
  const handleSaveSection = async () => {
    if (!newSectionName.trim()) return;
    try {
      if (editingSectionId) {
        const res = await fetch(`/api/admin/team-sections/${editingSectionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newSectionName })
        });
        if (res.ok) {
          const updated = await res.json();
          const oldSection = sections.find(s => s._id === editingSectionId);
          setSections(sections.map(s => s._id === editingSectionId ? updated : s));
          if (oldSection && oldSection.name !== newSectionName) {
            setMembers(members.map(m => m.section === oldSection.name ? { ...m, section: newSectionName } : m));
          }
          setEditingSectionId(null);
          setNewSectionName("");
        }
      } else {
        const res = await fetch('/api/admin/team-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newSectionName, order: sections.length })
        });
        if (res.ok) {
          const newSection = await res.json();
          setSections([...sections, newSection]);
          setNewSectionName("");
        }
      }
    } catch (err) {
      console.error("Failed to save section", err);
    }
  };

  const confirmDeleteSection = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/team-sections/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSections(sections.filter(s => s._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteSectionConfirmId(null);
    }
  };

  const handleDeleteSection = (id: string) => {
    setDeleteSectionConfirmId(id);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary mb-2">Team Management</h1>
          <p className="text-gray-500">Manage CEO profile and team members.</p>
        </div>
        {activeTab === "members" && (
          <button 
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Member
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("ceo")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "ceo" 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            CEO Profile
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "members" 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Team Members
          </button>
        </div>

        {/* CEO Tab Content */}
        {activeTab === "ceo" && (
          <div className="p-8">
            {isLoading || !ceoData ? (
              <div className="flex justify-center items-center h-64 text-gray-400">Loading CEO profile...</div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Image Upload */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors">
                      {ceoData.photoUrl ? (
                        <img src={ceoData.photoUrl} alt="CEO" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">{isUploading ? "Uploading..." : "Upload Image"}</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        disabled={isUploading}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleImageUpload(e, true)}
                      />
                    </div>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={ceoData.name}
                        onChange={(e) => setCeoData({ ...ceoData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nickname (e.g. Sobuj)</label>
                        <input
                          type="text"
                          value={ceoData.nickname || ""}
                          onChange={(e) => setCeoData({ ...ceoData, nickname: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Official Title</label>
                        <input
                          type="text"
                          value={ceoData.officialTitle}
                          onChange={(e) => setCeoData({ ...ceoData, officialTitle: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Functional Designation</label>
                        <input
                          type="text"
                          value={ceoData.functionalDesignation || ""}
                          onChange={(e) => setCeoData({ ...ceoData, functionalDesignation: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEO Message</label>
                  <textarea
                    rows={6}
                    value={ceoData.message}
                    onChange={(e) => setCeoData({ ...ceoData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Social Links</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={ceoData.socialLinks?.linkedin || ""}
                        onChange={(e) => setCeoData({ ...ceoData, socialLinks: { ...ceoData.socialLinks, linkedin: e.target.value }})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={ceoData.socialLinks?.email || ""}
                        onChange={(e) => setCeoData({ ...ceoData, socialLinks: { ...ceoData.socialLinks, email: e.target.value }})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleSaveCeo}
                    disabled={isSavingCeo}
                    className="flex items-center px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {ceoSaveSuccess ? (
                      <><Check className="w-5 h-5 mr-2" /> Saved!</>
                    ) : isSavingCeo ? (
                      "Saving..."
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Team Members Tab Content (Card System) */}
        {activeTab === "members" && (
          <div className="p-8 bg-gray-50/50">
            {/* Team Page Header Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Team Page Header</h2>
              <form key={siteSettings ? 'loaded' : 'loading'} onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                setIsSavingCeo(true); // Reusing state for button loading
                try {
                  const currentRes = await fetch('/api/admin/site-settings');
                  const currentSettings = currentRes.ok ? await currentRes.json() : {};
                  
                  const res = await fetch('/api/admin/site-settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ...currentSettings,
                      teamHeaderTitle: formData.get('teamHeaderTitle'),
                      teamHeaderCompanyName: formData.get('teamHeaderCompanyName'),
                      teamHeaderSubtitle: formData.get('teamHeaderSubtitle'),
                    })
                  });
                  if (res.ok) {
                    setCeoSaveSuccess(true);
                    setTimeout(() => setCeoSaveSuccess(false), 3000);
                  }
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsSavingCeo(false);
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      name="teamHeaderTitle"
                      type="text" required
                      defaultValue={siteSettings?.teamHeaderTitle || "Complete Corporate Governance and Web Team Directory"}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      name="teamHeaderCompanyName"
                      type="text" required
                      defaultValue={siteSettings?.teamHeaderCompanyName || "Max iT Solution Ltd."}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <textarea
                      name="teamHeaderSubtitle"
                      required
                      defaultValue={siteSettings?.teamHeaderSubtitle || "Corporate Organogram and Profile Layout with Global Supply Chain Network."}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 h-20 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button type="submit" disabled={isSavingCeo} className="flex items-center px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {ceoSaveSuccess ? <><Check className="w-5 h-5 mr-2" /> Saved!</> : isSavingCeo ? "Saving..." : "Save Header"}
                  </button>
                </div>
              </form>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-gray-400">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <ImageIcon className="w-12 h-12 mb-4 text-gray-300" />
                <p>No team members found.</p>
                <button onClick={openAddModal} className="mt-4 text-primary font-medium hover:underline">Add one now</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {members.map((member) => (
                  <div key={member._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                    <div className="p-6 flex flex-col items-center text-center flex-1">
                      <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-50 mb-4 group-hover:border-primary/20 transition-colors">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-sm font-medium text-primary mb-2">{member.officialTitle}</p>
                      
                      {member.functionalDesignation && (
                        <p className="text-xs text-gray-500 mb-3">{member.functionalDesignation}</p>
                      )}
                      
                      <div className="mt-auto pt-4">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          {member.section}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex border-t border-gray-100 divide-x divide-gray-100 bg-gray-50/50">
                      <button 
                        onClick={() => openEditModal(member)}
                        className="flex-1 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center"
                      >
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(member._id)}
                        className="flex-1 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editId ? "Edit Team Member" : "Add New Team Member"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Image Upload */}
                <div className="flex-shrink-0 flex flex-col items-center pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors">
                    {memberForm.photoUrl ? (
                      <img src={memberForm.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium">{isUploading ? "Uploading..." : "Upload Image"}</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      disabled={isUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleImageUpload(e, false)}
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Official Title *</label>
                    <input
                      type="text"
                      required
                      value={memberForm.officialTitle}
                      onChange={(e) => setMemberForm({ ...memberForm, officialTitle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Functional Designation</label>
                    <input
                      type="text"
                      value={memberForm.functionalDesignation}
                      onChange={(e) => setMemberForm({ ...memberForm, functionalDesignation: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Section (Grouping) *
                  <button
                    type="button"
                    onClick={() => setIsSectionModalOpen(true)}
                    className="ml-2 text-primary hover:text-primary/80 transition-colors"
                    title="Manage Sections"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    required
                    value={memberForm.section}
                    onChange={(e) => setMemberForm({ ...memberForm, section: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {sections.length === 0 ? (
                      <option value="Board of Directors">Board of Directors</option>
                    ) : (
                      sections.map(s => <option key={s._id} value={s.name}>{s.name}</option>)
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Short Description)</label>
                <textarea
                  rows={3}
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Social Links</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={memberForm.socialLinks.linkedin}
                      onChange={(e) => setMemberForm({ ...memberForm, socialLinks: { ...memberForm.socialLinks, linkedin: e.target.value }})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={memberForm.socialLinks.email}
                      onChange={(e) => setMemberForm({ ...memberForm, socialLinks: { ...memberForm.socialLinks, email: e.target.value }})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={memberForm.socialLinks.whatsapp || ""}
                      onChange={(e) => setMemberForm({ ...memberForm, socialLinks: { ...memberForm.socialLinks, whatsapp: e.target.value }})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
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
                  {isSubmitting ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sections Management Modal */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSectionModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
              <h2 className="text-xl font-bold text-gray-900">Manage Sections</h2>
              <button onClick={() => setIsSectionModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {sections.map(section => (
                <div key={section._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="font-medium text-gray-800">{section.name}</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => { setEditingSectionId(section._id); setNewSectionName(section.name); }}
                      className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSection(section._id)}
                      className="text-red-600 hover:bg-red-50 p-1.5 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {sections.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No sections available.</p>}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingSectionId ? 'Edit Section Name' : 'Add New Section'}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g. Advisory Council"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handleSaveSection}
                  disabled={!newSectionName.trim()}
                  className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {editingSectionId ? 'Update' : 'Add'}
                </button>
                {editingSectionId && (
                  <button
                    onClick={() => { setEditingSectionId(null); setNewSectionName(""); }}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal for Member */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Team Member</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this team member? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => confirmDeleteMember(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Section */}
      {deleteSectionConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteSectionConfirmId(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Section</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this section? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeleteSectionConfirmId(null)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => confirmDeleteSection(deleteSectionConfirmId)}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
