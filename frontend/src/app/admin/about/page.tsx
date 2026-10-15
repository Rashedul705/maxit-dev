"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2, Image as ImageIcon, Trash2, Plus, Loader2, UploadCloud } from "lucide-react";

export default function AboutManagement() {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Loading states for image uploads
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    // 1. Hero & Brand Story
    aboutHeaderTitle: "The Story Behind Max iT",
    aboutHeaderSubtitle: "",
    journey: "",
    heroSlides: [
      { image: "/images/slides/commercial_rooftop_slide_1789677880098.jpg", title: "Innovating Since 2014", subtitle: "Building the infrastructure of tomorrow." }
    ],
    // 2. Mission & Vision
    missionTitle: "Our Mission",
    mission: "",
    visionTitle: "Our Vision",
    vision: "",
    // 3. What Sets Us Apart
    whatSetsUsApartTitle: "What Sets Us Apart",
    whatSetsUsApartSubtitle: "Why forward-thinking companies choose Max iT as their trusted technology partner.",
    features: [
      { icon: "ShieldCheck", title: "Premium Equipment", desc: "We source and deploy only industry-leading, rigorously tested materials." },
      { icon: "Users", title: "Expert Engineers", desc: "Our team consists of certified professionals with years of hands-on experience." },
      { icon: "Zap", title: "End-to-End Solutions", desc: "From conceptual design to final commissioning and maintenance." },
      { icon: "Wrench", title: "24/7 Support", desc: "Dedicated after-sales support ensuring maximum uptime and reliability." }
    ],
    // 4. Core Values
    coreValuesTitle: "Our Core Values",
    coreValuesSubtitle: "These guiding principles shape our culture, drive our decisions, and define how we interact with our clients and the world.",
    coreValues: [
      { icon: "Award", title: "Quality Assurance", desc: "Never compromising on standards. Excellence is our baseline." },
      { icon: "CheckCircle2", title: "Integrity & Transparency", desc: "Honest communication and ethical business practices in every deal." },
      { icon: "ThumbsUp", title: "Customer Success", desc: "Your success is our success. We build long-term partnerships." },
      { icon: "Leaf", title: "Sustainable Innovation", desc: "Prioritizing eco-friendly solutions that protect our future." }
    ],
    // 5. Project Gallery
    projectGalleryTitle: "Our Projects",
    projectGallerySubtitle: "A glimpse into our operational excellence and the technology that drives us.",
    galleryProjects: [
      { image: "/images/slides/agro_solar_slide_1789677870674.jpg", title: "Agro Solar Project" },
      { image: "/images/slides/iot_smart_home_slide_1789677856585.jpg", title: "Smart Home Tech" },
      { image: "/images/slides/networking_service_1789678979212.jpg", title: "Networking Infrastructure" }
    ],
    // 6. Call to Action
    ctaTitle: "Ready to Transform Your Future?",
    ctaSubtitle: "Whether you need scalable solar energy, industrial automation, or enterprise networking, our team is ready to build your solution.",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/about");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            ...formData,
            ...data
          });
        }
      } catch (err) {
        console.error("Failed to fetch about data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert("Failed to save changes");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index: number, key: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadKey = `${field}-${index}-${key}`;
    setUploadingFields(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const uploadData = new FormData();
      uploadData.append("image", files[0]);
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      if (res.ok) {
        const data = await res.json();
        handleArrayChange(field, index, key, data.url);
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed");
    } finally {
      setUploadingFields(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  const handleArrayChange = (field: string, index: number, key: string, value: string) => {
    const newArray = [...(formData as any)[field]];
    newArray[index][key] = value;
    setFormData({ ...formData, [field]: newArray });
  };
  const handleAddArrayItem = (field: string, defaultItem: any) => {
    setFormData({ ...formData, [field]: [...((formData as any)[field] || []), defaultItem] });
  };
  const handleRemoveArrayItem = (field: string, index: number) => {
    const newArray = [...(formData as any)[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="max-w-5xl mx-auto relative pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-primary mb-2">About Section Management</h1>
        <p className="text-gray-500">Update the content displayed on the About Us page sequentially.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden space-y-0">
        
        {/* 1. Hero & Brand Story */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
            Hero & Brand Story
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Header Title</label>
                <input type="text" value={formData.aboutHeaderTitle || ''} onChange={(e) => setFormData({...formData, aboutHeaderTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Header Subtitle (Optional)</label>
                <input type="text" value={formData.aboutHeaderSubtitle || ''} onChange={(e) => setFormData({...formData, aboutHeaderSubtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Our Journey (Brand Story)</label>
              <textarea rows={4} required value={formData.journey || ''} onChange={(e) => setFormData({...formData, journey: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y" />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Hero Slider Images</label>
              <div className="space-y-4">
                {formData.heroSlides?.map((slide, idx) => (
                  <div key={idx} className="p-4 bg-white border border-gray-200 rounded-xl relative group">
                    <button type="button" onClick={() => handleRemoveArrayItem('heroSlides', idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      
                      {/* Image Uploader */}
                      <div className="col-span-1 md:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Slide Image</label>
                        <div className="w-full aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors bg-gray-50 flex items-center justify-center">
                          {slide.image ? (
                            <img src={slide.image} alt="Slide" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                            {uploadingFields[`heroSlides-${idx}-image`] ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                          </div>
                          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'heroSlides', idx, 'image')} disabled={uploadingFields[`heroSlides-${idx}-image`]} />
                        </div>
                      </div>

                      {/* Text Details */}
                      <div className="col-span-1 md:col-span-3 space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Image URL (or upload image to the left)</label>
                          <input type="text" value={slide.image || ''} onChange={(e) => handleArrayChange('heroSlides', idx, 'image', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Slide Title</label>
                          <input type="text" value={slide.title || ''} onChange={(e) => handleArrayChange('heroSlides', idx, 'title', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Slide Subtitle</label>
                          <input type="text" value={slide.subtitle || ''} onChange={(e) => handleArrayChange('heroSlides', idx, 'subtitle', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" />
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => handleAddArrayItem('heroSlides', { image: "", title: "", subtitle: "" })} className="flex items-center text-primary text-sm font-bold hover:underline mt-2">
                  <Plus size={16} className="mr-1" /> Add New Slide
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Mission & Vision */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
            Mission & Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mission Title</label>
                <input type="text" value={formData.missionTitle || ''} onChange={(e) => setFormData({...formData, missionTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mission Statement</label>
                <textarea rows={4} required value={formData.mission || ''} onChange={(e) => setFormData({...formData, mission: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Vision Title</label>
                <input type="text" value={formData.visionTitle || ''} onChange={(e) => setFormData({...formData, visionTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Vision Statement</label>
                <textarea rows={4} required value={formData.vision || ''} onChange={(e) => setFormData({...formData, vision: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. What Sets Us Apart */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
            What Sets Us Apart (Features)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
              <input type="text" value={formData.whatSetsUsApartTitle || ''} onChange={(e) => setFormData({...formData, whatSetsUsApartTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Section Subtitle</label>
              <input type="text" value={formData.whatSetsUsApartSubtitle || ''} onChange={(e) => setFormData({...formData, whatSetsUsApartSubtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="space-y-4">
            {formData.features?.map((feature, idx) => (
              <div key={idx} className="p-4 bg-white border border-gray-200 rounded-xl relative">
                <button type="button" onClick={() => handleRemoveArrayItem('features', idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  <div className="col-span-1 md:col-span-4">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Icon Upload or Name (Lucide)</label>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary flex-shrink-0 bg-gray-50 flex items-center justify-center">
                        {feature.icon && (feature.icon.includes('/') || feature.icon.includes('.')) ? (
                          <img src={feature.icon} alt="Icon" className="w-full h-full object-contain p-1" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'features', idx, 'icon')} disabled={uploadingFields[`features-${idx}-icon`]} />
                      </div>
                      <input type="text" value={feature.icon || ''} onChange={(e) => handleArrayChange('features', idx, 'icon', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" placeholder="e.g. ShieldCheck" />
                    </div>
                    {uploadingFields[`features-${idx}-icon`] && <span className="text-xs text-primary font-medium animate-pulse">Uploading icon...</span>}
                  </div>

                  <div className="col-span-1 md:col-span-3">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                    <input type="text" value={feature.title || ''} onChange={(e) => handleArrayChange('features', idx, 'title', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" />
                  </div>
                  <div className="col-span-1 md:col-span-5">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                    <textarea rows={2} value={feature.desc || ''} onChange={(e) => handleArrayChange('features', idx, 'desc', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => handleAddArrayItem('features', { icon: "Star", title: "", desc: "" })} className="flex items-center text-primary text-sm font-bold hover:underline mt-2">
              <Plus size={16} className="mr-1" /> Add Feature
            </button>
          </div>
        </div>

        {/* 4. Core Values */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
            Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
              <input type="text" value={formData.coreValuesTitle || ''} onChange={(e) => setFormData({...formData, coreValuesTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Section Subtitle</label>
              <input type="text" value={formData.coreValuesSubtitle || ''} onChange={(e) => setFormData({...formData, coreValuesSubtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="space-y-4">
            {formData.coreValues?.map((val, idx) => (
              <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative">
                <button type="button" onClick={() => handleRemoveArrayItem('coreValues', idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  <div className="col-span-1 md:col-span-4">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Icon Upload or Name (Lucide)</label>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary flex-shrink-0 bg-white flex items-center justify-center">
                        {val.icon && (val.icon.includes('/') || val.icon.includes('.')) ? (
                          <img src={val.icon} alt="Icon" className="w-full h-full object-contain p-1" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'coreValues', idx, 'icon')} disabled={uploadingFields[`coreValues-${idx}-icon`]} />
                      </div>
                      <input type="text" value={val.icon || ''} onChange={(e) => handleArrayChange('coreValues', idx, 'icon', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" placeholder="e.g. Award" />
                    </div>
                    {uploadingFields[`coreValues-${idx}-icon`] && <span className="text-xs text-primary font-medium animate-pulse">Uploading icon...</span>}
                  </div>

                  <div className="col-span-1 md:col-span-3">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                    <input type="text" value={val.title || ''} onChange={(e) => handleArrayChange('coreValues', idx, 'title', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" />
                  </div>
                  <div className="col-span-1 md:col-span-5">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                    <textarea rows={2} value={val.desc || ''} onChange={(e) => handleArrayChange('coreValues', idx, 'desc', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => handleAddArrayItem('coreValues', { icon: "Check", title: "", desc: "" })} className="flex items-center text-primary text-sm font-bold hover:underline mt-2">
              <Plus size={16} className="mr-1" /> Add Core Value
            </button>
          </div>
        </div>

        {/* 5. Project Gallery */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">5</span>
            Project Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Gallery Title</label>
              <input type="text" value={formData.projectGalleryTitle || ''} onChange={(e) => setFormData({...formData, projectGalleryTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Gallery Subtitle</label>
              <input type="text" value={formData.projectGallerySubtitle || ''} onChange={(e) => setFormData({...formData, projectGallerySubtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Upload or link unlimited photos. They will be displayed in the honeycomb layout.</p>
            {formData.galleryProjects?.map((project, idx) => (
              <div key={idx} className="p-4 bg-white border border-gray-200 rounded-xl relative group">
                <button type="button" onClick={() => handleRemoveArrayItem('galleryProjects', idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  
                  <div className="col-span-1 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Project Image</label>
                    <div className="w-full aspect-square md:aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors bg-gray-50 flex items-center justify-center">
                      {project.image ? (
                        <img src={project.image} alt="Project" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        {uploadingFields[`galleryProjects-${idx}-image`] ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                      </div>
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'galleryProjects', idx, 'image')} disabled={uploadingFields[`galleryProjects-${idx}-image`]} />
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Image URL (or upload image to the left)</label>
                      <input type="text" value={project.image || ''} onChange={(e) => handleArrayChange('galleryProjects', idx, 'image', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Project Name (Title on hover)</label>
                      <input type="text" value={project.title || ''} onChange={(e) => handleArrayChange('galleryProjects', idx, 'title', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary/20" />
                    </div>
                  </div>

                </div>
              </div>
            ))}
            <button type="button" onClick={() => handleAddArrayItem('galleryProjects', { image: "", title: "" })} className="flex items-center text-primary text-sm font-bold hover:underline mt-2">
              <Plus size={16} className="mr-1" /> Add Project Photo
            </button>
          </div>
        </div>

        {/* 6. Call to Action */}
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">6</span>
            Call to Action (CTA)
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">CTA Title</label>
              <input type="text" value={formData.ctaTitle || ''} onChange={(e) => setFormData({...formData, ctaTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">CTA Subtitle</label>
              <input type="text" value={formData.ctaSubtitle || ''} onChange={(e) => setFormData({...formData, ctaSubtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="p-6 border-t border-gray-200 bg-white sticky bottom-0 z-10 flex justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold text-lg disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {isSaving ? (
              <span className="flex items-center">
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Save All Changes
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Success Toast */}
      <div className={`fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center transform transition-all duration-300 z-50 ${
        showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}>
        <CheckCircle2 className="w-6 h-6 mr-3" />
        <div>
          <h4 className="font-bold">Success</h4>
          <p className="text-green-50 text-sm">About page updated successfully.</p>
        </div>
      </div>
    </div>
  );
}
