"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Check } from "lucide-react";

type SocialLinks = {
  linkedin?: string;
  email?: string;
  whatsapp?: string;
};

type CEO = {
  name: string;
  nickname?: string;
  designation: string;
  image: string;
  message: string;
  socialLinks: SocialLinks;
};

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  description: string;
  image: string;
  socialLinks: SocialLinks;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [memberForm, setMemberForm] = useState({
    name: "",
    designation: "",
    description: "",
    image: "",
    socialLinks: { linkedin: "", email: "", whatsapp: "" }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ceoRes, membersRes] = await Promise.all([
        fetch('/api/admin/ceo'),
        fetch('/api/admin/team')
      ]);
      
      if (ceoRes.ok) {
        setCeoData(await ceoRes.json());
      }
      if (membersRes.ok) {
        setMembers(await membersRes.json());
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isCeo: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isCeo && ceoData) {
        setCeoData({ ...ceoData, image: base64String });
      } else {
        setMemberForm({ ...memberForm, image: base64String });
      }
    };
    reader.readAsDataURL(file);
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
      designation: "",
      description: "",
      image: "",
      socialLinks: { linkedin: "", email: "", whatsapp: "" }
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditId(member.id);
    setMemberForm({
      name: member.name,
      designation: member.designation,
      description: member.description || "",
      image: member.image || "",
      socialLinks: member.socialLinks || { linkedin: "", email: "", whatsapp: "" }
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setMembers(members.filter(m => m.id !== id));
        } else {
          alert("Failed to delete member");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!memberForm.name.trim() || !memberForm.designation.trim()) {
      setError("Name and designation are required");
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
          setMembers(members.map(m => m.id === editId ? updated : m));
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

  return (
    <div className="max-w-6xl mx-auto">
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
                      {ceoData.image ? (
                        <img src={ceoData.image} alt="CEO" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">Upload Image</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                          type="text"
                          value={ceoData.designation}
                          onChange={(e) => setCeoData({ ...ceoData, designation: e.target.value })}
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

        {/* Team Members Tab Content */}
        {activeTab === "members" && (
          <div>
            <div className="overflow-x-auto min-h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-64 text-gray-400">Loading members...</div>
              ) : members.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-400">No team members found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                      <th className="px-6 py-4 font-medium">Profile</th>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Designation</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                            {member.image ? (
                              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                            {member.designation}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => openEditModal(member)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(member.id)}
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
                    {memberForm.image ? (
                      <img src={memberForm.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium">Upload Image</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                    <input
                      type="text"
                      required
                      value={memberForm.designation}
                      onChange={(e) => setMemberForm({ ...memberForm, designation: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={memberForm.description}
                  onChange={(e) => setMemberForm({ ...memberForm, description: e.target.value })}
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
    </div>
  );
}
