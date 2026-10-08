"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Plus, Trash2, ChevronDown, ChevronUp, Save, Image as ImageIcon, Video } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function HomeAdmin() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('header');

  const [homeData, setHomeData] = useState<any>({});
  const [siteSettings, setSiteSettings] = useState<any>({});
  
  // To restore defaults
  const [defaultHomeData, setDefaultHomeData] = useState<any>({});
  const [defaultSiteSettings, setDefaultSiteSettings] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [homeRes, settingsRes] = await Promise.all([
        fetch('/api/admin/home'),
        fetch('/api/admin/site-settings')
      ]);
      const homeJson = await homeRes.json();
      const settingsJson = await settingsRes.json();
      
      setHomeData(homeJson);
      setDefaultHomeData(homeJson); // Storing initial fetch as default for simplicity, or we can fetch a specific /default route
      
      setSiteSettings(settingsJson);
      setDefaultSiteSettings(settingsJson);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        fetch('/api/admin/home', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(homeData)
        }),
        fetch('/api/admin/site-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siteSettings)
        })
      ]);
      alert('Saved successfully! The live homepage has been updated.');
    } catch (error) {
      alert('Error saving data');
    }
    setIsSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        callback(data.url);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Upload error');
    }
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (isLoading) return <div className="p-10 text-center">Loading Home Page Editor...</div>;

  const tabs = [
    { id: 'header', label: 'A. Header' },
    { id: 'hero', label: 'B. Hero' },
    { id: 'services', label: 'C. Services (One Roof)' },
    { id: 'milestones', label: 'D. Milestones' },
    { id: 'videos', label: 'E. Video Slider' },
    { id: 'whyChooseUs', label: 'F. Why Choose Us' },
    { id: 'aboutPreview', label: 'G. About Max iT' },
    { id: 'testimonials', label: 'H. Testimonials' },
    { id: 'partners', label: 'I. Partners Settings' },
    { id: 'team', label: 'J. Team Settings' },
    { id: 'cta', label: 'K. CTA Section' },
    { id: 'footer', label: 'L. Footer' },
  ];

  const updateHome = (section: string, field: string, value: any) => {
    setHomeData({ ...homeData, [section]: { ...homeData[section], [field]: value } });
  };

  const updateSetting = (field: string, value: any) => {
    setSiteSettings({ ...siteSettings, [field]: value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Home Page Management</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? 'Saving...' : 'Save & Publish Live'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          
          {/* A. Header */}
          {activeTab === 'header' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-2">Header Settings</h2>
              
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Header Logo</label>
                <div className="flex items-center gap-4">
                  {siteSettings.headerLogo && <img src={siteSettings.headerLogo} className="h-12 object-contain bg-gray-100 p-2 rounded" />}
                  <input type="file" onChange={(e) => handleImageUpload(e, (url) => updateSetting('headerLogo', url))} className="text-sm" />
                </div>
              </div>

              {/* CTA "Get Started" Button */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-sm text-blue-800 flex items-center gap-2">
                  🔘 CTA Button (Header Right Side)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Button Text</label>
                    <input type="text" value={siteSettings.navbarContactButtonText || 'Get Started'} onChange={(e) => updateSetting('navbarContactButtonText', e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. Get Started" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Button Link</label>
                    <input type="text" value={siteSettings.navbarContactButtonLink || ''} onChange={(e) => updateSetting('navbarContactButtonLink', e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. /contact" />
                  </div>
                </div>
              </div>

              {/* Navigation Menu Items */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium">Navigation Menu Items</label>
                  <span className="text-xs text-gray-400">{siteSettings?.navItems?.length || 0} items</span>
                </div>
                {siteSettings?.navItems?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border">
                    <span className="text-xs text-gray-400 font-mono w-6 text-center">{idx + 1}</span>
                    <input type="text" value={item.label} onChange={(e) => {
                      const newArr = [...(siteSettings?.navItems || [])];
                      newArr[idx] = { ...newArr[idx], label: e.target.value };
                      updateSetting('navItems', newArr);
                    }} className="flex-1 border p-2 rounded text-sm" placeholder="Label (e.g. Home)" />
                    <input type="text" value={item.link} onChange={(e) => {
                      const newArr = [...(siteSettings?.navItems || [])];
                      newArr[idx] = { ...newArr[idx], link: e.target.value };
                      updateSetting('navItems', newArr);
                    }} className="flex-1 border p-2 rounded text-sm" placeholder="Link (e.g. /)" />
                    {/* Move Up */}
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        const newArr = [...(siteSettings?.navItems || [])];
                        [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
                        newArr.forEach((item: any, i: number) => item.order = i);
                        updateSetting('navItems', newArr);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      title="Move Up"
                    ><ChevronUp size={16} /></button>
                    {/* Move Down */}
                    <button
                      disabled={idx === (siteSettings?.navItems?.length || 0) - 1}
                      onClick={() => {
                        const newArr = [...(siteSettings?.navItems || [])];
                        [newArr[idx], newArr[idx + 1]] = [newArr[idx + 1], newArr[idx]];
                        newArr.forEach((item: any, i: number) => item.order = i);
                        updateSetting('navItems', newArr);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      title="Move Down"
                    ><ChevronDown size={16} /></button>
                    {/* Delete */}
                    <button onClick={() => {
                      const newArr = siteSettings?.navItems?.filter((_:any, i:number) => i !== idx);
                      newArr.forEach((item: any, i: number) => item.order = i);
                      updateSetting('navItems', newArr);
                    }} className="p-1.5 text-red-400 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => updateSetting('navItems', [...(siteSettings.navItems||[]), { label: 'New Page', link: '/', order: siteSettings.navItems?.length||0 }])} className="text-sm text-primary flex items-center mt-2 hover:underline"><Plus size={16} className="mr-1" /> Add Nav Item</button>
              </div>
            </div>
          )}

          {/* B. Hero */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Hero Section</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={homeData.hero?.visible ?? true} onChange={(e) => updateHome('hero', 'visible', e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Visible on Home Page</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Background Image</label>
                <div className="flex items-center gap-4">
                  {homeData.hero?.backgroundImage && <img src={homeData.hero.backgroundImage} className="h-20 w-32 object-cover rounded" />}
                  <input type="file" onChange={(e) => handleImageUpload(e, (url) => updateHome('hero', 'backgroundImage', url))} className="text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title Line 1</label>
                  <input type="text" value={homeData.hero?.titleLine1 || ''} onChange={(e) => updateHome('hero', 'titleLine1', e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title Line 2 (Gradient)</label>
                  <input type="text" value={homeData.hero?.titleLine2 || ''} onChange={(e) => updateHome('hero', 'titleLine2', e.target.value)} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <textarea rows={3} value={homeData.hero?.subtitle || ''} onChange={(e) => updateHome('hero', 'subtitle', e.target.value)} className="w-full border p-2 rounded" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Stats (Max 4 recommended)</label>
                {homeData.hero?.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded border">
                    <input type="text" value={stat.number} onChange={(e) => {
                      const newArr = [...(homeData.hero?.stats || [])];
                      newArr[idx].number = e.target.value;
                      updateHome('hero', 'stats', newArr);
                    }} className="w-24 border p-2 rounded" placeholder="e.g. 50+" />
                    <input type="text" value={stat.label} onChange={(e) => {
                      const newArr = [...(homeData.hero?.stats || [])];
                      newArr[idx].label = e.target.value;
                      updateHome('hero', 'stats', newArr);
                    }} className="flex-1 border p-2 rounded" placeholder="Label (e.g. Projects)" />
                    <button onClick={() => {
                      const newArr = homeData.hero?.stats?.filter((_:any, i:number) => i !== idx);
                      updateHome('hero', 'stats', newArr);
                    }} className="p-2 text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => updateHome('hero', 'stats', [...(homeData.hero?.stats||[]), { number: '10+', label: 'New Stat', order: homeData.hero?.stats?.length||0 }])} className="text-sm text-primary flex items-center mt-2"><Plus size={16} /> Add Stat</button>
              </div>
            </div>
          )}

          {/* C. Services */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Services (Everything You Need)</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={homeData.servicesSection?.visible ?? true} onChange={(e) => updateHome('servicesSection', 'visible', e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Heading Normal Text</label><input type="text" value={homeData.servicesSection?.headingNormal || ''} onChange={(e) => updateHome('servicesSection', 'headingNormal', e.target.value)} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm font-medium mb-1">Heading Highlight Text</label><input type="text" value={homeData.servicesSection?.headingHighlight || ''} onChange={(e) => updateHome('servicesSection', 'headingHighlight', e.target.value)} className="w-full border p-2 rounded" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Subtext</label><textarea rows={2} value={homeData.servicesSection?.subtext || ''} onChange={(e) => updateHome('servicesSection', 'subtext', e.target.value)} className="w-full border p-2 rounded" /></div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Service Cards</label>
                {homeData.servicesSection?.services.map((srv: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded border space-y-3">
                    <div className="flex justify-between">
                      <h4 className="font-semibold text-sm">Card {idx + 1}</h4>
                      <button onClick={() => { const newArr = homeData.servicesSection?.services?.filter((_:any, i:number) => i !== idx); updateHome('servicesSection', 'services', newArr); }} className="text-red-500"><Trash2 size={16} /></button>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input type="text" value={srv.icon} onChange={(e) => { const newArr = [...(homeData.servicesSection?.services || [])]; newArr[idx].icon = e.target.value; updateHome('servicesSection', 'services', newArr); }} className="w-32 border p-2 rounded text-sm" placeholder="Lucide Icon (e.g. Sun)" />
                      <input type="text" value={srv.title} onChange={(e) => { const newArr = [...(homeData.servicesSection?.services || [])]; newArr[idx].title = e.target.value; updateHome('servicesSection', 'services', newArr); }} className="flex-1 border p-2 rounded text-sm" placeholder="Title" />
                    </div>
                    <textarea value={srv.description} onChange={(e) => { const newArr = [...(homeData.servicesSection?.services || [])]; newArr[idx].description = e.target.value; updateHome('servicesSection', 'services', newArr); }} className="w-full border p-2 rounded text-sm" placeholder="Description" rows={2} />
                  </div>
                ))}
                <button onClick={() => updateHome('servicesSection', 'services', [...(homeData.servicesSection?.services||[]), { icon: 'Settings', title: 'New Service', description: '', order: homeData.servicesSection?.services?.length||0 }])} className="text-sm text-primary flex items-center mt-2"><Plus size={16} /> Add Service Card</button>
              </div>
            </div>
          )}

          {/* D. Milestones */}
          {activeTab === 'milestones' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Milestones</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={homeData.milestones?.visible ?? true} onChange={(e) => updateHome('milestones', 'visible', e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
              <div><label className="block text-sm font-medium mb-1">Section Title</label><input type="text" value={homeData.milestones?.title || ''} onChange={(e) => updateHome('milestones', 'title', e.target.value)} className="w-full border p-2 rounded" /></div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Stats</label>
                {homeData.milestones?.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded border">
                    <input type="text" value={stat.number} onChange={(e) => { const newArr = [...(homeData.milestones?.stats || [])]; newArr[idx].number = e.target.value; updateHome('milestones', 'stats', newArr); }} className="w-24 border p-2 rounded" placeholder="e.g. 50+" />
                    <input type="text" value={stat.label} onChange={(e) => { const newArr = [...(homeData.milestones?.stats || [])]; newArr[idx].label = e.target.value; updateHome('milestones', 'stats', newArr); }} className="flex-1 border p-2 rounded" placeholder="Label" />
                    <button onClick={() => { const newArr = homeData.milestones?.stats?.filter((_:any, i:number) => i !== idx); updateHome('milestones', 'stats', newArr); }} className="p-2 text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => updateHome('milestones', 'stats', [...(homeData.milestones?.stats||[]), { number: '10+', label: 'New Stat', order: homeData.milestones?.stats?.length||0 }])} className="text-sm text-primary flex items-center mt-2"><Plus size={16} /> Add Stat</button>
              </div>
            </div>
          )}

          {/* E. Videos */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Video Slider</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={homeData.videosSection?.visible ?? true} onChange={(e) => updateHome('videosSection', 'visible', e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Heading Normal Text</label><input type="text" value={homeData.videosSection?.headingNormal || ''} onChange={(e) => updateHome('videosSection', 'headingNormal', e.target.value)} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm font-medium mb-1">Heading Highlight Text</label><input type="text" value={homeData.videosSection?.headingHighlight || ''} onChange={(e) => updateHome('videosSection', 'headingHighlight', e.target.value)} className="w-full border p-2 rounded" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Subtext</label><textarea rows={2} value={homeData.videosSection?.subtext || ''} onChange={(e) => updateHome('videosSection', 'subtext', e.target.value)} className="w-full border p-2 rounded" /></div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Videos</label>
                {homeData.videosSection?.videos.map((vid: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded border space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={vid.active ?? true} onChange={(e) => { const newArr = [...(homeData.videosSection?.videos || [])]; newArr[idx].active = e.target.checked; updateHome('videosSection', 'videos', newArr); }} /> Active</label>
                      <button onClick={() => { const newArr = homeData.videosSection?.videos?.filter((_:any, i:number) => i !== idx); updateHome('videosSection', 'videos', newArr); }} className="text-red-500"><Trash2 size={16} /></button>
                    </div>
                    <input type="text" value={vid.youtubeLink || ''} onChange={(e) => { 
                      const newArr = [...(homeData.videosSection?.videos || [])]; 
                      newArr[idx].youtubeLink = e.target.value; 
                      newArr[idx].videoId = extractYoutubeId(e.target.value) || '';
                      updateHome('videosSection', 'videos', newArr); 
                    }} className="w-full border p-2 rounded text-sm" placeholder="YouTube Link (e.g. https://youtube.com/watch?v=...)" />
                    {vid.videoId && (
                      <div className="flex gap-4 items-center mt-2">
                        <img src={`https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg`} className="h-20 w-32 object-cover rounded shadow" />
                        <span className="text-xs text-green-600 font-medium">Valid YouTube ID: {vid.videoId}</span>
                      </div>
                    )}
                    <input type="text" value={vid.title || ''} onChange={(e) => { const newArr = [...(homeData.videosSection?.videos || [])]; newArr[idx].title = e.target.value; updateHome('videosSection', 'videos', newArr); }} className="w-full border p-2 rounded text-sm" placeholder="Title on Image" />
                    <textarea value={vid.description || ''} onChange={(e) => { const newArr = [...(homeData.videosSection?.videos || [])]; newArr[idx].description = e.target.value; updateHome('videosSection', 'videos', newArr); }} className="w-full border p-2 rounded text-sm" placeholder="Short description" rows={2} />
                  </div>
                ))}
                <button onClick={() => updateHome('videosSection', 'videos', [...(homeData.videosSection?.videos||[]), { youtubeLink: '', videoId: '', title: 'New Video', description: '', active: true, order: homeData.videosSection?.videos?.length||0 }])} className="text-sm text-primary flex items-center mt-2"><Plus size={16} /> Add Video</button>
              </div>
            </div>
          )}

          {/* F. Why Choose Us */}
          {activeTab === 'whyChooseUs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Why Choose Us</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={homeData.whyChooseUs?.visible ?? true} onChange={(e) => updateHome('whyChooseUs', 'visible', e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Heading Normal</label><input type="text" value={homeData.whyChooseUs?.headingNormal || ''} onChange={(e) => updateHome('whyChooseUs', 'headingNormal', e.target.value)} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm font-medium mb-1">Heading Highlight</label><input type="text" value={homeData.whyChooseUs?.headingHighlight || ''} onChange={(e) => updateHome('whyChooseUs', 'headingHighlight', e.target.value)} className="w-full border p-2 rounded" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Subtext</label><textarea rows={2} value={homeData.whyChooseUs?.subtext || ''} onChange={(e) => updateHome('whyChooseUs', 'subtext', e.target.value)} className="w-full border p-2 rounded" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Button Label</label><input type="text" value={homeData.whyChooseUs?.button?.label || ''} onChange={(e) => updateHome('whyChooseUs', 'button', { ...homeData.whyChooseUs.button, label: e.target.value })} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm font-medium mb-1">Button Link</label><input type="text" value={homeData.whyChooseUs?.button?.link || ''} onChange={(e) => updateHome('whyChooseUs', 'button', { ...homeData.whyChooseUs.button, link: e.target.value })} className="w-full border p-2 rounded" /></div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Cards</label>
                {homeData.whyChooseUs?.cards.map((card: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded border space-y-2">
                    <div className="flex justify-between"><h4 className="font-semibold text-sm">Card {idx + 1}</h4><button onClick={() => { const newArr = homeData.whyChooseUs?.cards?.filter((_:any, i:number) => i !== idx); updateHome('whyChooseUs', 'cards', newArr); }} className="text-red-500"><Trash2 size={16} /></button></div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" value={card.icon || ''} onChange={(e) => { const newArr = [...(homeData.whyChooseUs?.cards || [])]; newArr[idx].icon = e.target.value; updateHome('whyChooseUs', 'cards', newArr); }} className="border p-2 rounded text-sm" placeholder="Icon" />
                      <input type="text" value={card.title || ''} onChange={(e) => { const newArr = [...(homeData.whyChooseUs?.cards || [])]; newArr[idx].title = e.target.value; updateHome('whyChooseUs', 'cards', newArr); }} className="col-span-2 border p-2 rounded text-sm" placeholder="Title" />
                    </div>
                    <textarea value={card.description || ''} onChange={(e) => { const newArr = [...(homeData.whyChooseUs?.cards || [])]; newArr[idx].description = e.target.value; updateHome('whyChooseUs', 'cards', newArr); }} className="w-full border p-2 rounded text-sm" placeholder="Description" rows={2} />
                  </div>
                ))}
                <button onClick={() => updateHome('whyChooseUs', 'cards', [...(homeData.whyChooseUs?.cards||[]), { icon: 'Star', title: 'New Reason', description: '', accentColor: 'from-blue-500 to-cyan-500', order: homeData.whyChooseUs?.cards?.length||0 }])} className="text-sm text-primary flex items-center mt-2"><Plus size={16} /> Add Card</button>
              </div>
            </div>
          )}

          {/* G. About Max iT */}
          {activeTab === 'aboutPreview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">About Preview</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={homeData.aboutPreview?.visible ?? true} onChange={(e) => updateHome('aboutPreview', 'visible', e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex items-center gap-4">
                  {homeData.aboutPreview?.image && <img src={homeData.aboutPreview.image} className="h-20 w-32 object-cover rounded" />}
                  <input type="file" onChange={(e) => handleImageUpload(e, (url) => updateHome('aboutPreview', 'image', url))} className="text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Heading Normal</label><input type="text" value={homeData.aboutPreview?.headingNormal || ''} onChange={(e) => updateHome('aboutPreview', 'headingNormal', e.target.value)} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm font-medium mb-1">Heading Highlight</label><input type="text" value={homeData.aboutPreview?.headingHighlight || ''} onChange={(e) => updateHome('aboutPreview', 'headingHighlight', e.target.value)} className="w-full border p-2 rounded" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Paragraph</label><textarea rows={4} value={homeData.aboutPreview?.paragraph || ''} onChange={(e) => updateHome('aboutPreview', 'paragraph', e.target.value)} className="w-full border p-2 rounded" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Button</label>
                  <input type="text" value={homeData.aboutPreview?.primaryButton?.label || ''} onChange={(e) => updateHome('aboutPreview', 'primaryButton', { ...homeData.aboutPreview.primaryButton, label: e.target.value })} className="w-full border p-2 rounded mb-2" placeholder="Label" />
                  <input type="text" value={homeData.aboutPreview?.primaryButton?.link || ''} onChange={(e) => updateHome('aboutPreview', 'primaryButton', { ...homeData.aboutPreview.primaryButton, link: e.target.value })} className="w-full border p-2 rounded" placeholder="Link" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Secondary Button</label>
                  <input type="text" value={homeData.aboutPreview?.secondaryButton?.label || ''} onChange={(e) => updateHome('aboutPreview', 'secondaryButton', { ...homeData.aboutPreview.secondaryButton, label: e.target.value })} className="w-full border p-2 rounded mb-2" placeholder="Label" />
                  <input type="text" value={homeData.aboutPreview?.secondaryButton?.link || ''} onChange={(e) => updateHome('aboutPreview', 'secondaryButton', { ...homeData.aboutPreview.secondaryButton, link: e.target.value })} className="w-full border p-2 rounded" placeholder="Link" />
                </div>
              </div>
            </div>
          )}

          {/* H. Testimonials */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Testimonials Header</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={homeData.testimonialsSection?.visible ?? true} onChange={(e) => updateHome('testimonialsSection', 'visible', e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
              <p className="text-sm text-gray-500">Note: Actual testimonials are managed in the dedicated Testimonials admin page.</p>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Heading Normal</label><input type="text" value={homeData.testimonialsSection?.headingNormal || ''} onChange={(e) => updateHome('testimonialsSection', 'headingNormal', e.target.value)} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm font-medium mb-1">Heading Highlight</label><input type="text" value={homeData.testimonialsSection?.headingHighlight || ''} onChange={(e) => updateHome('testimonialsSection', 'headingHighlight', e.target.value)} className="w-full border p-2 rounded" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Subtext</label><textarea rows={2} value={homeData.testimonialsSection?.subtext || ''} onChange={(e) => updateHome('testimonialsSection', 'subtext', e.target.value)} className="w-full border p-2 rounded" /></div>
            </div>
          )}

          {/* I. Partners */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Partners Header</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={homeData.partnersSection?.visible ?? true} onChange={(e) => updateHome('partnersSection', 'visible', e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
              <p className="text-sm text-gray-500">Note: Partners are managed in the dedicated Partners admin page.</p>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Heading Normal</label><input type="text" value={homeData.partnersSection?.headingNormal || ''} onChange={(e) => updateHome('partnersSection', 'headingNormal', e.target.value)} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm font-medium mb-1">Heading Highlight</label><input type="text" value={homeData.partnersSection?.headingHighlight || ''} onChange={(e) => updateHome('partnersSection', 'headingHighlight', e.target.value)} className="w-full border p-2 rounded" /></div>
              </div>
            </div>
          )}

          {/* J. Team */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Team Preview Header</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={homeData.teamSection?.visible ?? true} onChange={(e) => updateHome('teamSection', 'visible', e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Heading Normal</label><input type="text" value={homeData.teamSection?.headingNormal || ''} onChange={(e) => updateHome('teamSection', 'headingNormal', e.target.value)} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm font-medium mb-1">Heading Highlight</label><input type="text" value={homeData.teamSection?.headingHighlight || ''} onChange={(e) => updateHome('teamSection', 'headingHighlight', e.target.value)} className="w-full border p-2 rounded" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Subtext</label><textarea rows={2} value={homeData.teamSection?.subtext || ''} onChange={(e) => updateHome('teamSection', 'subtext', e.target.value)} className="w-full border p-2 rounded" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Button Label</label><input type="text" value={homeData.teamSection?.button?.label || ''} onChange={(e) => updateHome('teamSection', 'button', { ...homeData.teamSection.button, label: e.target.value })} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm font-medium mb-1">Button Link</label><input type="text" value={homeData.teamSection?.button?.link || ''} onChange={(e) => updateHome('teamSection', 'button', { ...homeData.teamSection.button, link: e.target.value })} className="w-full border p-2 rounded" /></div>
              </div>
            </div>
          )}

          {/* K. CTA */}
          {activeTab === 'cta' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">CTA Section</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={homeData.ctaSection?.visible ?? true} onChange={(e) => updateHome('ctaSection', 'visible', e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Background Image</label>
                <div className="flex items-center gap-4">
                  {homeData.ctaSection?.backgroundImage && <img src={homeData.ctaSection.backgroundImage} className="h-20 w-32 object-cover rounded" />}
                  <input type="file" onChange={(e) => handleImageUpload(e, (url) => updateHome('ctaSection', 'backgroundImage', url))} className="text-sm" />
                </div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={homeData.ctaSection?.title || ''} onChange={(e) => updateHome('ctaSection', 'title', e.target.value)} className="w-full border p-2 rounded" /></div>
              <div><label className="block text-sm font-medium mb-1">Text</label><textarea rows={2} value={homeData.ctaSection?.text || ''} onChange={(e) => updateHome('ctaSection', 'text', e.target.value)} className="w-full border p-2 rounded" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Button</label>
                  <input type="text" value={homeData.ctaSection?.primaryButton?.label || ''} onChange={(e) => updateHome('ctaSection', 'primaryButton', { ...homeData.ctaSection.primaryButton, label: e.target.value })} className="w-full border p-2 rounded mb-2" placeholder="Label" />
                  <input type="text" value={homeData.ctaSection?.primaryButton?.link || ''} onChange={(e) => updateHome('ctaSection', 'primaryButton', { ...homeData.ctaSection.primaryButton, link: e.target.value })} className="w-full border p-2 rounded" placeholder="Link" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Secondary Button</label>
                  <input type="text" value={homeData.ctaSection?.secondaryButton?.label || ''} onChange={(e) => updateHome('ctaSection', 'secondaryButton', { ...homeData.ctaSection.secondaryButton, label: e.target.value })} className="w-full border p-2 rounded mb-2" placeholder="Label" />
                  <input type="text" value={homeData.ctaSection?.secondaryButton?.link || ''} onChange={(e) => updateHome('ctaSection', 'secondaryButton', { ...homeData.ctaSection.secondaryButton, link: e.target.value })} className="w-full border p-2 rounded" placeholder="Link" />
                </div>
              </div>
            </div>
          )}

          {/* L. Footer */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-2">Footer Settings</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Footer Logo</label>
                  <div className="flex items-center gap-4">
                    {siteSettings.footerLogo && <img src={siteSettings.footerLogo} className="h-12 object-contain bg-gray-900 p-2 rounded" />}
                    <input type="file" onChange={(e) => handleImageUpload(e, (url) => updateSetting('footerLogo', url))} className="text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Copyright Text</label>
                  <input type="text" value={siteSettings.copyrightText || ''} onChange={(e) => updateSetting('copyrightText', e.target.value)} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Description</label>
                <textarea rows={2} value={siteSettings.footerDescription || ''} onChange={(e) => updateSetting('footerDescription', e.target.value)} className="w-full border p-2 rounded" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Privacy Policy Link</label><input type="text" value={siteSettings.privacyPolicyLink || ''} onChange={(e) => updateSetting('privacyPolicyLink', e.target.value)} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm font-medium mb-1">Terms of Service Link</label><input type="text" value={siteSettings.termsOfServiceLink || ''} onChange={(e) => updateSetting('termsOfServiceLink', e.target.value)} className="w-full border p-2 rounded" /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                {/* Contact overrides */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Contact Info</h3>
                  <div><label className="block text-xs text-gray-500">Email</label><input type="text" value={siteSettings.footerEmail || ''} onChange={(e) => updateSetting('footerEmail', e.target.value)} className="w-full border p-2 rounded text-sm" /></div>
                  <div><label className="block text-xs text-gray-500">Phone</label><input type="text" value={siteSettings.footerPhone || ''} onChange={(e) => updateSetting('footerPhone', e.target.value)} className="w-full border p-2 rounded text-sm" /></div>
                  <div><label className="block text-xs text-gray-500">Address Line 1</label><input type="text" value={siteSettings.footerAddressLine1 || ''} onChange={(e) => updateSetting('footerAddressLine1', e.target.value)} className="w-full border p-2 rounded text-sm" /></div>
                  <div><label className="block text-xs text-gray-500">Address Line 2</label><input type="text" value={siteSettings.footerAddressLine2 || ''} onChange={(e) => updateSetting('footerAddressLine2', e.target.value)} className="w-full border p-2 rounded text-sm" /></div>
                  <div><label className="block text-xs text-gray-500">Address Line 3</label><input type="text" value={siteSettings.footerAddressLine3 || ''} onChange={(e) => updateSetting('footerAddressLine3', e.target.value)} className="w-full border p-2 rounded text-sm" /></div>
                </div>

                {/* Quick Links & Social */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Social Links</label>
                    {siteSettings?.socialLinks?.map((soc: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input type="text" value={soc.platform} onChange={(e) => { const newArr = [...(siteSettings?.socialLinks || [])]; newArr[idx].platform = e.target.value; updateSetting('socialLinks', newArr); }} className="w-24 border p-2 rounded text-sm" placeholder="Platform" />
                        <input type="text" value={soc.url} onChange={(e) => { const newArr = [...(siteSettings?.socialLinks || [])]; newArr[idx].url = e.target.value; updateSetting('socialLinks', newArr); }} className="flex-1 border p-2 rounded text-sm" placeholder="URL" />
                        <button onClick={() => { const newArr = siteSettings?.socialLinks?.filter((_:any, i:number) => i !== idx); updateSetting('socialLinks', newArr); }} className="p-2 text-red-500"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button onClick={() => updateSetting('socialLinks', [...(siteSettings.socialLinks||[]), { platform: 'New', url: '#', icon: 'Link', order: siteSettings.socialLinks?.length||0 }])} className="text-sm text-primary flex items-center mt-2"><Plus size={16} /> Add Social Link</button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Quick Links</label>
                    {siteSettings?.quickLinks?.map((ql: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input type="text" value={ql.label} onChange={(e) => { const newArr = [...(siteSettings?.quickLinks || [])]; newArr[idx].label = e.target.value; updateSetting('quickLinks', newArr); }} className="flex-1 border p-2 rounded text-sm" placeholder="Label" />
                        <input type="text" value={ql.link} onChange={(e) => { const newArr = [...(siteSettings?.quickLinks || [])]; newArr[idx].link = e.target.value; updateSetting('quickLinks', newArr); }} className="flex-1 border p-2 rounded text-sm" placeholder="Link" />
                        <button onClick={() => { const newArr = siteSettings?.quickLinks?.filter((_:any, i:number) => i !== idx); updateSetting('quickLinks', newArr); }} className="p-2 text-red-500"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button onClick={() => updateSetting('quickLinks', [...(siteSettings.quickLinks||[]), { label: 'New', link: '#', order: siteSettings.quickLinks?.length||0 }])} className="text-sm text-primary flex items-center mt-2"><Plus size={16} /> Add Quick Link</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
