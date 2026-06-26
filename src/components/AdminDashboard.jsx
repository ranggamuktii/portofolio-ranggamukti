import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useLenis } from 'lenis/react';
import PropTypes from 'prop-types';
import {
  getProjects, deleteProject, createProject, updateProject,
  getSocialLinks, updateSocialLinks,
  getSkills, createSkill, updateSkill, deleteSkill,
  getExperiences, createExperience, updateExperience, deleteExperience,
  getSettings, updateSettings, uploadImage, getUploadUrl,
  getMessages, markMessageRead, deleteMessage, getAnalytics
} from '../services/api';
import { ThemeContext } from '../ThemeProvider';

function AdminDashboard({ onLogout }) {
  const lenis = useLenis();
  const [activeTab, setActiveTab] = useState('projects');
  const { theme, toggle } = useContext(ThemeContext);

  // Data State
  const [projects, setProjects] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [settings, setSettings] = useState({
    hero_title: '',
    hero_subtitle: '',
    about_text: '',
    cv_link: '',
    contact_email: ''
  });
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState({ totalViews: 0, unreadCount: 0, details: [] });

  const [loading, setLoading] = useState(false);

  // Modal States
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ title: '', slug: '', description: '', img_src: '', tags: '', project_link: '', github_link: '' });

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ img_src: '', label: '', description: '', category: 'frontend', order_index: 0 });

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [expForm, setExpForm] = useState({ title: '', company: '', location: '', start_date: '', end_date: '', description: '', is_education: false, order_index: 0, logo_icon: 'work', company_logo: '' });

  const [toast, setToast] = useState('');

  // Refs for scrollable modal divs — needed to add native (non-passive) wheel
  // listeners that fire BEFORE Lenis intercepts them at document level.
  const projectScrollRef = useRef(null);
  const skillScrollRef = useRef(null);
  const expScrollRef = useRef(null);

  // Native wheel handler: scroll the div itself and stop propagation so Lenis never sees the event.
  const handleModalWheel = useCallback((e) => {
    const el = e.currentTarget;
    const atTop = el.scrollTop === 0 && e.deltaY < 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;
    if (!atTop && !atBottom) {
      e.stopPropagation();
    }
    e.stopPropagation(); // always stop — Lenis should never handle this
  }, []);

  // Attach native wheel listeners to modal scroll containers whenever modals open
  useEffect(() => {
    const attachWheel = (ref) => {
      if (ref.current) {
        ref.current.addEventListener('wheel', handleModalWheel, { passive: false });
      }
    };
    const detachWheel = (ref) => {
      if (ref.current) {
        ref.current.removeEventListener('wheel', handleModalWheel);
      }
    };

    if (isProjectModalOpen) { setTimeout(() => attachWheel(projectScrollRef), 0); }
    else { detachWheel(projectScrollRef); }

    if (isSkillModalOpen) { setTimeout(() => attachWheel(skillScrollRef), 0); }
    else { detachWheel(skillScrollRef); }

    if (isExpModalOpen) { setTimeout(() => attachWheel(expScrollRef), 0); }
    else { detachWheel(expScrollRef); }

    return () => {
      detachWheel(projectScrollRef);
      detachWheel(skillScrollRef);
      detachWheel(expScrollRef);
    };
  }, [isProjectModalOpen, isSkillModalOpen, isExpModalOpen, handleModalWheel]);

  useEffect(() => {
    if (activeTab === 'projects') loadProjects();
    else if (activeTab === 'social') loadSocialLinks();
    else if (activeTab === 'skills') loadSkills();
    else if (activeTab === 'experiences') loadExperiences();
    else if (activeTab === 'settings') loadSettings();
    else if (activeTab === 'inbox') loadMessages();

    loadAnalytics(); // Always refresh analytics on heartbeats
  }, [activeTab]);

  useEffect(() => {
    const isAnyModalOpen = isProjectModalOpen || isSkillModalOpen || isExpModalOpen;
    if (isAnyModalOpen) {
      // Store scroll position before locking
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    } else {
      // Restore scroll position after unlocking
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      if (lenis) lenis.start();
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      if (lenis) lenis.start();
    };
  }, [isProjectModalOpen, isSkillModalOpen, isExpModalOpen, lenis]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleFileUpload = async (e, setter, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const { url } = await uploadImage(file);
      setter(prev => ({ ...prev, [fieldName]: url }));
      showToast('Image uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  /* LOADERS */
  const loadProjects = async () => { setLoading(true); try { setProjects(await getProjects() || []); } catch (e) { console.error(e); } finally { setLoading(false); } };
  const loadSocialLinks = async () => { setLoading(true); try { setSocialLinks(await getSocialLinks() || []); } catch (e) { console.error(e); } finally { setLoading(false); } };
  const loadSkills = async () => { setLoading(true); try { setSkills(await getSkills() || []); } catch (e) { console.error(e); } finally { setLoading(false); } };
  const loadExperiences = async () => { setLoading(true); try { setExperiences(await getExperiences() || []); } catch (e) { console.error(e); } finally { setLoading(false); } };
  const loadSettings = async () => { setLoading(true); try { setSettings(await getSettings() || {}); } catch (e) { console.error(e); } finally { setLoading(false); } };
  const loadMessages = async () => { setLoading(true); try { setMessages(await getMessages() || []); } catch (e) { console.error(e); } finally { setLoading(false); } };
  const loadAnalytics = async () => { try { setAnalytics(await getAnalytics() || { totalViews: 0, unreadCount: 0, details: [] }); } catch (e) { console.error(e); } };

  /* PROJECTS */
  const handleOpenProjectModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        ...project,
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || '',
        features: Array.isArray(project.features) ? project.features.join('\n') : project.features || ''
      });
    } else {
      setEditingProject(null);
      setProjectForm({ title: '', slug: '', description: '', img_src: '', tags: '', demo_link: '', github_link: '', role: '', problem: '', solution: '', technologies: '', features: '' });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...projectForm,
        tags: typeof projectForm.tags === 'string' ? projectForm.tags.split(',').map(t => t.trim()).filter(Boolean) : projectForm.tags,
        technologies: typeof projectForm.technologies === 'string' ? projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean) : projectForm.technologies,
        features: typeof projectForm.features === 'string' ? projectForm.features.split('\n').map(t => t.trim()).filter(Boolean) : projectForm.features
      };
      if (editingProject) { await updateProject(editingProject.id, payload); showToast('Project updated successfully!'); }
      else { await createProject(payload); showToast('Project created successfully!'); }
      setIsProjectModalOpen(false);
      loadProjects();
    } catch (error) { alert(error.response?.data?.error || 'Failed to save project'); }
    finally { setLoading(false); }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try { await deleteProject(id); showToast('Project deleted.'); loadProjects(); }
    catch (e) { alert('Failed to delete project'); }
  };

  /* SKILLS */
  const handleOpenSkillModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm(skill);
    } else {
      setEditingSkill(null);
      setSkillForm({ img_src: '', label: '', description: '', category: 'frontend', order_index: 0 });
    }
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingSkill) { await updateSkill(editingSkill.id, skillForm); showToast('Skill updated successfully!'); }
      else { await createSkill(skillForm); showToast('Skill created successfully!'); }
      setIsSkillModalOpen(false);
      loadSkills();
    } catch (error) { alert(error.response?.data?.error || 'Failed to save skill'); }
    finally { setLoading(false); }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try { await deleteSkill(id); showToast('Skill deleted.'); loadSkills(); }
    catch (e) { alert('Failed to delete skill'); }
  };

  /* EXPERIENCES */
  const handleOpenExpModal = (exp = null) => {
    if (exp) {
      setEditingExp(exp);
      setExpForm(exp);
    } else {
      setEditingExp(null);
      setExpForm({ title: '', company: '', location: '', start_date: '', end_date: '', description: '', is_education: false, order_index: 0, logo_icon: 'work', company_logo: '' });
    }
    setIsExpModalOpen(true);
  };

  const handleSaveExp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingExp) { await updateExperience(editingExp.id, expForm); showToast('Experience updated successfully!'); }
      else { await createExperience(expForm); showToast('Experience created successfully!'); }
      setIsExpModalOpen(false);
      loadExperiences();
    } catch (error) { alert(error.response?.data?.error || 'Failed to save experience'); }
    finally { setLoading(false); }
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    try { await deleteExperience(id); showToast('Experience deleted.'); loadExperiences(); }
    catch (e) { alert('Failed to delete experience'); }
  };

  /* SOCIAL LINKS */
  const handleAddSocialLink = () => setSocialLinks([...socialLinks, { platform: '', href: '' }]);
  const handleRemoveSocialLink = (index) => { const updated = [...socialLinks]; updated.splice(index, 1); setSocialLinks(updated); };
  const handleSaveSocialLinks = async () => {
    setLoading(true);
    try { await updateSocialLinks(socialLinks); showToast('Social links updated successfully!'); }
    catch (e) { alert('Failed to update social links'); }
    finally { setLoading(false); }
  };

  /* MESSAGES / INBOX */
  const handleMarkAsRead = async (id) => {
    try {
      await markMessageRead(id);
      loadMessages();
      loadAnalytics();
    } catch (err) { console.error(err); }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await deleteMessage(id);
      loadMessages();
      loadAnalytics();
      showToast('Message deleted');
    } catch (err) { console.error(err); }
  };

  /* SETTINGS */
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await updateSettings(settings); showToast('Settings updated successfully!'); }
    catch (e) { alert('Failed to update settings'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce">
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30 transition-colors">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Admin Portofolio
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="w-10 h-10 grid place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {theme === 'light' ? (
                <span className="material-symbols-rounded text-lg">dark_mode</span>
              ) : (
                <span className="material-symbols-rounded text-lg">light_mode</span>
              )}
            </button>
            <button onClick={onLogout} className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-5 py-2.5 rounded-xl transition-colors font-medium">
              <span className="material-symbols-rounded text-xl">logout</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="relative overflow-hidden bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-rounded text-6xl text-sky-500">visibility</span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center mb-4">
                <span className="material-symbols-rounded text-sky-600 dark:text-sky-400 text-2xl">monitoring</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold tracking-wide uppercase mb-1">Total Site Views</p>
              <h4 className="text-4xl font-black text-zinc-900 dark:text-zinc-50">{analytics.totalViews}</h4>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </div>

          <div className="relative overflow-hidden bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className={`material-symbols-rounded text-6xl ${analytics.unreadCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>mark_email_unread</span>
            </div>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${analytics.unreadCount > 0 ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                <span className={`material-symbols-rounded text-2xl ${analytics.unreadCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>mail</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold tracking-wide uppercase mb-1">Unread Messages</p>
              <h4 className={`text-4xl font-black ${analytics.unreadCount > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-zinc-900 dark:text-zinc-50'}`}>
                {analytics.unreadCount}
              </h4>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ${analytics.unreadCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
          </div>

          <div className="relative overflow-hidden bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 col-span-1 lg:col-span-2 flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-rounded text-8xl text-indigo-500">leaderboard</span>
            </div>
            <div className="relative z-10 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                <span className="material-symbols-rounded text-indigo-600 dark:text-indigo-400 text-xl">insights</span>
              </div>
              <p className="text-zinc-800 dark:text-zinc-200 text-base font-bold tracking-wide">Top Traffic Breakdown</p>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {analytics.details.slice(0, 3).map((d, idx) => {
                const textColors = [
                  'text-fuchsia-600 dark:text-fuchsia-400',
                  'text-violet-600 dark:text-violet-400',
                  'text-sky-600 dark:text-sky-400'
                ];
                const bgColors = [
                  'bg-fuchsia-50 dark:bg-fuchsia-500/5',
                  'bg-violet-50 dark:bg-violet-500/5',
                  'bg-sky-50 dark:bg-sky-500/5'
                ];
                return (
                  <div key={d.page_path} className={`p-4 rounded-2xl border border-zinc-100 dark:border-zinc-700/50 flex flex-col items-start justify-center transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${bgColors[idx]}`}>
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2 truncate w-full" title={d.page_path}>
                      {d.page_path === '/' ? '🏠 Home Page' : `📄 ${d.page_path}`}
                    </span>
                    <div className="flex items-end gap-1.5 w-full">
                      <span className={`text-2xl font-black ${textColors[idx]} leading-none`}>{d.view_count}</span>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-0.5">views</span>
                    </div>
                  </div>
                );
              })}
              {analytics.details.length === 0 && (
                <div className="col-span-3 py-4 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <span className="text-sm text-zinc-500 italic flex items-center justify-center gap-2">
                    <span className="material-symbols-rounded text-base animate-spin">sync</span> Tracking views...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-2xl w-fit transition-colors">
          {['settings', 'inbox', 'projects', 'skills', 'experiences', 'social'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2.5 rounded-xl font-medium transition-all capitalize ${activeTab === tab ? 'bg-white dark:bg-zinc-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              {tab}
              {tab === 'inbox' && analytics.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-900 animate-pulse">
                  {analytics.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* LOADING STATE - Global overlay if waiting out of Modal */}
        {loading && activeTab !== 'settings' && activeTab !== 'social' &&
          projects.length === 0 && skills.length === 0 && experiences.length === 0 && (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-sky-500 rounded-full animate-spin"></div>
            </div>
          )}

        <div className="max-w-6xl">

          {/* ===================== SETTINGS TAB ===================== */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Site Settings</h2>
              <form onSubmit={handleSaveSettings} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Hero Title</label>
                    <input type="text" value={settings.hero_title || ''} onChange={e => setSettings({ ...settings, hero_title: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Hero Subtitle</label>
                    <input type="text" value={settings.hero_subtitle || ''} onChange={e => setSettings({ ...settings, hero_subtitle: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">About Text (Biography)</label>
                    <textarea rows={5} value={settings.about_text || ''} onChange={e => setSettings({ ...settings, about_text: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">CV Link (Google Drive / DropBox)</label>
                    <input type="url" value={settings.cv_link || ''} onChange={e => setSettings({ ...settings, cv_link: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Contact Email</label>
                    <input type="email" value={settings.contact_email || ''} onChange={e => setSettings({ ...settings, contact_email: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 font-mono text-sm" />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button type="submit" disabled={loading} className="bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-sky-600/20">
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================== PROJECTS TAB ===================== */}
          {activeTab === 'projects' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Manage Projects</h2>
                <button onClick={() => handleOpenProjectModal()} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-sky-600/20 font-medium">
                  <span className="material-symbols-rounded">add</span> Create Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center">
                  <span className="material-symbols-rounded text-6xl text-zinc-300 dark:text-zinc-700 mb-4">folder_off</span>
                  <h3 className="text-xl font-bold mb-2">No Projects Found</h3>
                  <p className="text-zinc-500 font-medium max-w-md mb-6">You haven't created any projects yet. Click the "Create Project" button above to add your first portfolio item.</p>
                  <button onClick={() => handleOpenProjectModal()} className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-2.5 rounded-xl transition-all font-medium">
                    Add Your First Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => {
                    const techList = project.technologies
                      ? (Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',').map(t => t.trim()).filter(Boolean))
                      : [];
                    return (
                      <div key={project.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
                        <div className="relative aspect-square overflow-hidden border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
                          <img src={project.img_src ? getUploadUrl(project.img_src) : '/images/placeholder.jpg'} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <button onClick={() => handleOpenProjectModal(project)} className="w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 hover:bg-sky-500 hover:text-white text-zinc-900 dark:text-white backdrop-blur-md rounded-xl transition-colors shadow-lg"><span className="material-symbols-rounded text-xl">edit</span></button>
                            <button onClick={() => handleDeleteProject(project.id)} className="w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 hover:bg-red-500 hover:text-white text-red-600 backdrop-blur-md rounded-xl transition-colors shadow-lg"><span className="material-symbols-rounded text-xl">delete</span></button>
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          {techList.length > 0 && (
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {techList.slice(0, 2).map((tech, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold rounded-lg truncate max-w-[120px]">{tech}</span>
                              ))}
                              {techList.length > 2 && (
                                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">+{techList.length - 2}</span>
                              )}
                            </div>
                          )}

                          <h3 className="text-xl font-bold mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{project.title}</h3>
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 whitespace-pre-wrap mb-4 flex-1">{project.description}</p>

                          <div className="flex items-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto">
                            {project.demo_link && (
                              <a href={project.demo_link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                <span className="material-symbols-rounded text-[18px]">open_in_new</span> Demo
                              </a>
                            )}
                            {project.github_link && (
                              <a href={project.github_link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                <span className="material-symbols-rounded text-[18px]">code</span> GitHub
                              </a>
                            )}
                            {(!project.demo_link && !project.github_link) && (
                              <span className="text-sm text-zinc-400 italic">No external links</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===================== SKILLS TAB ===================== */}
          {activeTab === 'skills' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Manage Skills</h2>
                <button onClick={() => handleOpenSkillModal()} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-sky-600/20 font-medium">
                  <span className="material-symbols-rounded">add</span> Add Skill
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {skills.map(skill => {
                  const getIcon = (lbl) => {
                    const l = (lbl || '').toLowerCase();
                    if (l.includes('react')) return '/react.svg';
                    if (l.includes('node')) return '/nodejs.svg';
                    if (l.includes('express')) return '/expressjs.svg';
                    if (l.includes('tailwind')) return '/tailwindcss.svg';
                    if (l.includes('mongo')) return '/mongodb.svg';
                    if (l.includes('java')) return '/javascript.svg';
                    if (l.includes('css')) return '/css3.svg';
                    if (l.includes('laravel')) return '/laravel.svg';
                    if (l.includes('mysql')) return '/mysql.svg';
                    if (l.includes('postgres')) return '/postgresql.svg';
                    if (l.includes('git')) return '/git.svg';
                    return `https://ui-avatars.com/api/?name=${encodeURIComponent(lbl)}&background=38bdf8&color=fff&rounded=true&bold=true`;
                  };
                  return (
                    <div key={skill.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center relative group">
                      {/* Overlay actions */}
                      <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 transition-opacity">
                        <button onClick={() => handleOpenSkillModal(skill)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg shrink-0"><span className="material-symbols-rounded text-sm">edit</span></button>
                        <button onClick={() => handleDeleteSkill(skill.id)} className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0"><span className="material-symbols-rounded text-sm">delete</span></button>
                      </div>
                      <img src={skill.img_src ? getUploadUrl(skill.img_src) : getIcon(skill.label)} alt={skill.label} className="w-16 h-16 object-contain mb-3" />
                      <h4 className="font-bold">{skill.label}</h4>
                      <span className="text-xs text-zinc-500 capitalize">{skill.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================== EXPERIENCES TAB ===================== */}
          {activeTab === 'experiences' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Manage Experiences</h2>
                <button onClick={() => handleOpenExpModal()} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-sky-600/20 font-medium">
                  <span className="material-symbols-rounded">add</span> Add History
                </button>
              </div>
              <div className="grid gap-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                      {exp.company_logo ? (
                        <img src={getUploadUrl(exp.company_logo)} alt={exp.company} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-rounded">{exp.logo_icon || (exp.is_education ? 'school' : 'work')}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{exp.title}</h3>
                      <div className="flex gap-4 text-sm text-zinc-500 mb-2">
                        <span>{exp.company}</span> • <span>{exp.location}</span> • <span>{exp.start_date} - {exp.end_date}</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm whitespace-pre-wrap">{exp.description}</p>
                    </div>
                    <div className="flex md:flex-col gap-2 shrink-0">
                      <button onClick={() => handleOpenExpModal(exp)} className="p-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl"><span className="material-symbols-rounded text-base">edit</span></button>
                      <button onClick={() => handleDeleteExp(exp.id)} className="p-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 text-red-600 rounded-xl"><span className="material-symbols-rounded text-base">delete</span></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== INBOX TAB ===================== */}
          {activeTab === 'inbox' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold">Contact Inbox</h2>
                  <p className="text-zinc-500 mt-1">Manage inquiries from your portfolio visitors.</p>
                </div>
                <button onClick={loadMessages} className="p-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors">
                  <span className="material-symbols-rounded">refresh</span>
                </button>
              </div>

              <div className="grid gap-4">
                {messages.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center">
                    <span className="material-symbols-rounded text-5xl text-zinc-300 dark:text-zinc-700 mb-4">mail_outline</span>
                    <p className="text-zinc-500 font-medium">No messages yet. They will appear here when someone contacts you.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`bg-white dark:bg-zinc-900 border ${!msg.is_read ? 'border-sky-500/50 dark:border-sky-500/30 ring-1 ring-sky-500/10' : 'border-zinc-200 dark:border-zinc-800'} rounded-2xl p-6 transition-all`}>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`text-lg ${!msg.is_read ? 'font-bold' : 'font-semibold text-zinc-700 dark:text-zinc-300'}`}>{msg.name}</h3>
                            {!msg.is_read && <span className="bg-sky-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-md tracking-wider">New</span>}
                          </div>
                          <p className="text-sm text-zinc-500 font-medium">
                            <a href={`mailto:${msg.email}`} className="hover:text-sky-500 transition-colors">{msg.email}</a>
                            {msg.company && <span className="mx-2">•</span>}
                            {msg.company && <span className="italic">{msg.company}</span>}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                          {new Date(msg.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800/50 mb-4">
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <div className="flex justify-end gap-3">
                        {!msg.is_read && (
                          <button onClick={() => handleMarkAsRead(msg.id)} className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-sky-500/10">
                            <span className="material-symbols-rounded text-lg">check_circle</span> Mark as Read
                          </button>
                        )}
                        <button onClick={() => handleDeleteMessage(msg.id)} className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 text-sm font-bold rounded-xl transition-all">
                          <span className="material-symbols-rounded text-lg">delete</span> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ===================== SOCIAL LINKS TAB ===================== */}

          {activeTab === 'social' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Social Links</h2>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                <div className="space-y-4 mb-8">
                  {socialLinks.map((link, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                      <input type="text" value={link.platform} onChange={(e) => { const u = [...socialLinks]; u[index].platform = e.target.value; setSocialLinks(u); }} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5" placeholder="Platform" />
                      <input type="text" value={link.href} onChange={(e) => { const u = [...socialLinks]; u[index].href = e.target.value; setSocialLinks(u); }} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5" placeholder="URL" />
                      <button onClick={() => handleRemoveSocialLink(index)} className="p-2.5 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl"><span className="material-symbols-rounded">delete</span></button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-6">
                  <button onClick={handleAddSocialLink} className="flex items-center gap-2 text-zinc-700 font-medium"><span className="material-symbols-rounded">add_circle</span> Add Link</button>
                  <button onClick={handleSaveSocialLinks} disabled={loading} className="bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-400 text-white font-semibold px-8 py-3 rounded-xl">Save Social Data</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ================== MODALS ================== */}

      {/* 1. PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget && !loading) setIsProjectModalOpen(false); }}>
          <div className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm -z-10"></div>
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveProject} className="flex flex-col flex-1 min-h-0 rounded-3xl overflow-hidden">
              <div className="p-6 pb-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <h3 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'New Project'}</h3>
              </div>
              <div ref={projectScrollRef} className="p-6 overflow-y-scroll overscroll-contain flex-1 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <input required type="text" placeholder="Title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input required type="text" placeholder="Slug (e.g. musify)" value={projectForm.slug} onChange={e => setProjectForm({ ...projectForm, slug: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input type="text" placeholder="Project Role (e.g. Lead Developer)" value={projectForm.role || ''} onChange={e => setProjectForm({ ...projectForm, role: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input type="text" placeholder="Short Tags (comma separated)" value={projectForm.tags || ''} onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input type="text" placeholder="Live Demo Link" value={projectForm.demo_link || ''} onChange={e => setProjectForm({ ...projectForm, demo_link: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input type="text" placeholder="Source Code (GitHub Link)" value={projectForm.github_link || ''} onChange={e => setProjectForm({ ...projectForm, github_link: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 flex gap-4 items-center">
                    {projectForm.img_src && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                        <img src={getUploadUrl(projectForm.img_src)} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 flex gap-2 items-center">
                      <input type="text" placeholder="Banner Image URL" value={projectForm.img_src || ''} onChange={e => setProjectForm({ ...projectForm, img_src: e.target.value })} className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 min-w-0" />
                      <label className="cursor-pointer bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 flex items-center gap-2 border border-zinc-200 dark:border-zinc-700">
                        <span className="material-symbols-rounded text-[18px]">upload</span> <span className="hidden sm:inline">Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setProjectForm, 'img_src')} disabled={loading} />
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <textarea required rows={2} placeholder="Short Description / Overview" value={projectForm.description || ''} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2">
                    <textarea rows={2} placeholder="The Problem / Challenge" value={projectForm.problem || ''} onChange={e => setProjectForm({ ...projectForm, problem: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2">
                    <textarea rows={2} placeholder="The Solution" value={projectForm.solution || ''} onChange={e => setProjectForm({ ...projectForm, solution: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2">
                    <textarea rows={3} placeholder="Key Features (one per line)" value={projectForm.features || ''} onChange={e => setProjectForm({ ...projectForm, features: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2">
                    <textarea rows={2} placeholder="Tech Stack (comma separated)" value={projectForm.technologies || ''} onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                </div>
              </div>
              <div className="p-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 shrink-0 bg-white dark:bg-zinc-900">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-6 py-2.5 rounded-xl font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl font-medium bg-sky-600 text-white">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. SKILL MODAL */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget && !loading) setIsSkillModalOpen(false); }}>
          <div className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm -z-10"></div>
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveSkill} className="flex flex-col flex-1 min-h-0 rounded-3xl overflow-hidden">
              <div className="p-6 pb-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <h3 className="text-xl font-bold">{editingSkill ? 'Edit Skill' : 'New Skill'}</h3>
              </div>
              <div ref={skillScrollRef} className="p-6 overflow-y-scroll overscroll-contain flex-1 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="space-y-4">
                  <input required type="text" placeholder="Skill Label (e.g. React)" value={skillForm.label} onChange={e => setSkillForm({ ...skillForm, label: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  <div className="flex gap-4 items-center">
                    {skillForm.img_src && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-2">
                        <img src={getUploadUrl(skillForm.img_src)} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1 flex gap-2 items-center">
                      <input required type="text" placeholder="SVG/Image URL (e.g. /react.svg)" value={skillForm.img_src} onChange={e => setSkillForm({ ...skillForm, img_src: e.target.value })} className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 min-w-0" />
                      <label className="cursor-pointer bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 flex items-center gap-2 border border-zinc-200 dark:border-zinc-700">
                        <span className="material-symbols-rounded text-[18px]">upload</span> <span className="hidden sm:inline">Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setSkillForm, 'img_src')} disabled={loading} />
                      </label>
                    </div>
                  </div>
                  <select required value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5">
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="design">Design</option>
                    <option value="tools">Tools</option>
                  </select>
                  <input type="number" placeholder="Order Index" value={skillForm.order_index} onChange={e => setSkillForm({ ...skillForm, order_index: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                </div>
              </div>
              <div className="p-6 pt-4 flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900">
                <button type="button" onClick={() => setIsSkillModalOpen(false)} className="px-6 py-2.5 rounded-xl font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl font-medium bg-emerald-600 hover:bg-emerald-500 text-white">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EXPERIENCE MODAL */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget && !loading) setIsExpModalOpen(false); }}>
          <div className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm -z-10"></div>
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveExp} className="flex flex-col flex-1 min-h-0 rounded-3xl overflow-hidden">
              <div className="p-6 pb-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <h3 className="text-xl font-bold">{editingExp ? 'Edit Experience' : 'New Experience'}</h3>
              </div>
              <div ref={expScrollRef} className="p-6 overflow-y-scroll overscroll-contain flex-1 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <input required type="text" placeholder="Job/Degree Title" value={expForm.title} onChange={e => setExpForm({ ...expForm, title: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input required type="text" placeholder="Company/University" value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input type="text" placeholder="Location" value={expForm.location} onChange={e => setExpForm({ ...expForm, location: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input type="text" placeholder="Start Date (e.g. 2022)" value={expForm.start_date} onChange={e => setExpForm({ ...expForm, start_date: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input type="text" placeholder="End Date (e.g. Present, 2024)" value={expForm.end_date} onChange={e => setExpForm({ ...expForm, end_date: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="flex gap-4 items-center">
                      {expForm.company_logo && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-1">
                          <img src={getUploadUrl(expForm.company_logo)} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div className="flex-1 flex gap-2 items-center">
                        <input type="text" placeholder="Company Logo URL" value={expForm.company_logo || ''} onChange={e => setExpForm({ ...expForm, company_logo: e.target.value })} className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 min-w-0" />
                        <label className="cursor-pointer bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                          <span className="material-symbols-rounded text-[18px]">upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setExpForm, 'company_logo')} disabled={loading} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input type="text" placeholder="Material Icon (if no logo)" value={expForm.logo_icon || ''} onChange={e => setExpForm({ ...expForm, logo_icon: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5" />
                  </div>
                  <div className="col-span-2">
                    <textarea rows={3} placeholder="Description" value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 resize-none" />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="edu_check" checked={expForm.is_education} onChange={e => setExpForm({ ...expForm, is_education: e.target.checked })} className="w-5 h-5 rounded text-sky-600 border-zinc-300" />
                    <label htmlFor="edu_check" className="font-medium">This is an Education / Degree</label>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-4 flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900">
                <button type="button" onClick={() => setIsExpModalOpen(false)} className="px-6 py-2.5 rounded-xl font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl font-medium bg-sky-600 hover:bg-sky-500 text-white">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

AdminDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default AdminDashboard;
