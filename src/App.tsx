import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  MessageSquare, 
  ChevronRight, 
  ArrowRight,
  GraduationCap,
  Building,
  Menu,
  X,
  Compass,
  FileText,
  Badge,
  CheckCircle2,
  ListRestart
} from 'lucide-react';

import { 
  UserProfile, 
  AcademicProject, 
  WalletTransaction 
} from './types';

import { 
  DEFAULT_USER, 
  INITIAL_PROJECTS, 
  ACADEMIC_DISCIPLINES 
} from './mockData';

// Import Modular Subsystems
import Navbar from './components/Navbar';
import ResearchAssistant from './components/ResearchAssistant';
import ProjectBuilder from './components/ProjectBuilder';
import LiteratureReview from './components/LiteratureReview';
import OriginalityChecker from './components/OriginalityChecker';
import AcademicRewriter from './components/AcademicRewriter';
import LibraryMarketplace from './components/LibraryMarketplace';
import CollaborationPortal from './components/CollaborationPortal';
import AdminInstitutionDashboards from './components/AdminInstitutionDashboards';

// Auth and Landing components
import HomepageLanding from './components/HomepageLanding';
import AuthScreen from './components/AuthScreen';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

type ActiveModuleId = 'assistant' | 'builder' | 'literature' | 'rewriter' | 'originality' | 'collaborate' | 'billing' | 'admin';

export default function App() {
  const [authView, setAuthView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [firebaseUserUid, setFirebaseUserUid] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [projects, setProjects] = useState<AcademicProject[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<AcademicProject | null>(INITIAL_PROJECTS[0]);
  const [activeModule, setActiveModule] = useState<ActiveModuleId>('assistant');

  // AI Copilot slideout/drawer state (Module 16)
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotMessage, setCopilotMessage] = useState('');
  const [copilotHistory, setCopilotHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hello! I am your interactive AI Research Copilot (Module 16). Ask me to explain research methodologies, format a specific citation, or brainstorm topic objectives.' }
  ]);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  // New Project Generator Modal / Form
  const [showConfigWizard, setShowConfigWizard] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [newDeptInput, setNewDeptInput] = useState('Computer Science');

  // On-Boarded Welcome Profile Setup
  const [isOnboarded, setIsOnboarded] = useState(true);

  // Monitor authorization states with persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUserUid(fbUser.uid);
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);
          let userProfile = DEFAULT_USER;
          
          if (userSnap.exists()) {
            userProfile = userSnap.data() as UserProfile;
            setUser(userProfile);
          } else {
            // Write first-time user record
            userProfile = {
              email: fbUser.email || 'scholar@prorite.edu',
              fullName: fbUser.displayName || 'Academic Scholar',
              academicLevel: 'Undergraduate',
              institution: 'Affiliated University',
              department: 'Computer Science',
              researchInterests: ['Computer Science', 'Research methodology'],
              plan: 'Free',
              walletBalance: 0
            };
            await setDoc(userDocRef, userProfile);
            setUser(userProfile);
          }

          // Fetch nested academic projects
          const projectsRef = collection(db, 'users', fbUser.uid, 'projects');
          const querySnap = await getDocs(projectsRef);
          const fetchedProjects: AcademicProject[] = [];
          
          querySnap.forEach((docSnap) => {
            fetchedProjects.push(docSnap.data() as AcademicProject);
          });

          if (fetchedProjects.length > 0) {
            setProjects(fetchedProjects);
            setActiveProject(fetchedProjects[0]);
          } else {
            // Seed initial sample projects
            const seeded = INITIAL_PROJECTS.map(p => ({
              ...p,
              userId: fbUser.uid
            }));
            for (const proj of seeded) {
              await setDoc(doc(db, 'users', fbUser.uid, 'projects', proj.id), proj);
            }
            setProjects(seeded);
            setActiveProject(seeded[0]);
          }
          setAuthView('app');
        } catch (err) {
          console.error("Failed to load user session data:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign out helper
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out fail:", err);
    }
    setUser(DEFAULT_USER);
    setProjects(INITIAL_PROJECTS);
    setActiveProject(INITIAL_PROJECTS[0]);
    setAuthView('landing');
  };

  // Selector callback
  const handleSelectProject = (id: string) => {
    if (id === 'new') {
      setShowConfigWizard(true);
      return;
    }
    const found = projects.find(p => p.id === id);
    if (found) {
      setActiveProject(found);
    }
  };

  // Adding a newly developed subject workspace project with database persistence
  const handleProjectCreated = async (newProj: AcademicProject) => {
    const updatedProj = { ...newProj, userId: firebaseUserUid || 'guest-id' };
    setProjects(prev => [updatedProj, ...prev]);
    setActiveProject(updatedProj);
    setActiveModule('builder'); // Transition to editor view directly
    
    if (firebaseUserUid) {
      try {
        await setDoc(doc(db, 'users', firebaseUserUid, 'projects', newProj.id), updatedProj);
      } catch (err) {
        console.error("Firestore save error:", err);
      }
    }
  };

  // Upgraded user profile callback with database persistence
  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    if (firebaseUserUid) {
      try {
        await setDoc(doc(db, 'users', firebaseUserUid), updatedUser);
      } catch (err) {
        console.error("Firestore profile sync error:", err);
      }
    }
  };

  // Adding a financial transaction record
  const handleAddTransaction = (newTx: WalletTransaction) => {
    // Optionally track transactions history inside profile or state
    console.log('Transaction logged:', newTx);
  };

  // Upgrading project workspace schema with database persistence
  const handleUpdateProject = async (updatedProj: AcademicProject) => {
    const boundProj = { ...updatedProj, userId: firebaseUserUid || 'guest-id' };
    setProjects(prev => prev.map(p => p.id === boundProj.id ? boundProj : p));
    setActiveProject(boundProj);
    
    if (firebaseUserUid) {
      try {
        await setDoc(doc(db, 'users', firebaseUserUid, 'projects', boundProj.id), boundProj);
      } catch (err) {
        console.error("Firestore update error:", err);
      }
    }
  };

  // Process Copilot query (Module 16)
  const handleSendCopilotQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotMessage.trim()) return;

    const userMsg = copilotMessage;
    setCopilotMessage('');
    setCopilotHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsCopilotThinking(true);

    try {
      const response = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          currentTopic: activeProject?.title || 'General Academic Subject',
          history: copilotHistory.slice(-6) // Include context history to fit bounds
        })
      });

      if (!response.ok) throw new Error('Copilot response error');
      const resJson = await response.json();
      
      setCopilotHistory(prev => [...prev, { role: 'assistant', content: resJson.text || 'Understood.' }]);
    } catch (err: any) {
      setCopilotHistory(prev => [...prev, { 
        role: 'assistant', 
        content: `### ProRite Support\nI ran into an error connecting with the AI engine. Ensure your GEMINI_API_KEY environment variable is configured in the custom secret portal.\n\n*Error details: ${err.message}*` 
      }]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  // Manual fast on-the-fly wizard topic creator
  const handleCreateCustomProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicInput.trim()) return;

    const customProj: AcademicProject = {
      id: `proj-${Date.now()}`,
      title: newTopicInput,
      academicLevel: user.academicLevel,
      department: newDeptInput,
      style: 'APA 7th Edition',
      currentChapter: 1,
      lastUpdated: new Date().toISOString().substring(0, 16).replace('T', ' '),
      chapters: {
        1: { title: 'Introduction', content: '# Chapter One: Introduction\n\n*Draft content on background of study, operational scope limits, hypothesis formulations.*', references: [] },
        2: { title: 'Literature Review', content: '# Chapter Two: Literature Review\n\n*Draft structures outlining conceptual, thematic theoretical literature review lines.*', references: [] },
        3: { title: 'Methodology', content: '# Chapter Three: Research Methodology\n\n*Draft quantitative or qualitative sample outlines.*', references: [] }
      },
      tableOfContents: ['1. INTRODUCTION', '2. LITERATURE REVIEW', '3. METHODOLOGY']
    };

    setProjects(prev => [customProj, ...prev]);
    setActiveProject(customProj);
    setNewTopicInput('');
    setShowConfigWizard(false);
    setActiveModule('builder');
  };

  if (authView === 'landing') {
    return (
      <HomepageLanding 
        onGetStarted={() => setAuthView('auth')}
        onLoginClick={() => setAuthView('auth')}
        onRegisterClick={() => setAuthView('auth')}
      />
    );
  }

  if (authView === 'auth') {
    return (
      <AuthScreen 
        onAuthSuccess={(profile) => {
          setUser(profile);
          setAuthView('app');
        }}
        onBackToLanding={() => setAuthView('landing')}
      />
    );
  }

  return (
    <div id="prorite-root-canvas" className="min-h-screen bg-slate-100 flex flex-col font-sans select-none antialiased text-slate-900">
      
      {/* Platform Navigation Header */}
      <Navbar 
        user={user}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onOpenUpgrade={() => setActiveModule('billing')}
        onOpenWallet={() => setActiveModule('billing')}
        activeModule={activeModule}
        onLogout={handleLogout}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Nav menu panel: 20 PRD Modules routes mappings */}
        <aside id="prorite-left-sidebar" className="lg:w-64 shrink-0 space-y-4">
          
          {/* Mobile active workpace selector */}
          <div className="block md:hidden bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-2">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Active Thesis Workspace</span>
            <select
              id="mobile-workspace-project-selector"
              value={activeProject?.id || ''}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="block w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.title.length > 45 ? `${proj.title.substring(0, 45)}...` : proj.title}
                </option>
              ))}
              <option value="new">+ Start A New Project</option>
            </select>
          </div>

          {/* Quick Info card */}
          <div className="bg-gradient-to-br from-emerald-850 to-slate-950 text-white rounded-2xl p-4.5 shadow-md shadow-emerald-100/10 space-y-3 border border-emerald-950/20">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-emerald-400" />
              <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-300">Academic Tracker</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Enrolled Course of Study:</p>
              <h4 className="font-extrabold text-xs leading-snug">{user.department} ({user.academicLevel})</h4>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-1">
            <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest pl-3 block pt-1 pb-1">Academic Modules</span>
            
            <div className="flex flex-row overflow-x-auto lg:flex-col gap-1.5 pb-2 lg:pb-0 lg:space-y-1 scrollbar-none snap-x">
              {[
                { id: 'assistant', label: 'Topic & Foundations', icon: Compass, badge: 'M2/7' },
                { id: 'builder', label: 'Ch 1-5 Thesis Builder', icon: FileText, badge: 'M3/4' },
                { id: 'literature', label: 'Literature Structurer', icon: BookOpen, badge: 'M5' },
                { id: 'rewriter', label: 'Academic Tone Rewriter', icon: Sparkles, badge: 'M9' },
                { id: 'originality', label: 'Originality Assessor', icon: ShieldCheck, badge: 'M10' },
                { id: 'collaborate', label: 'Supervisor Portal', icon: Users, badge: 'M17' },
                { id: 'billing', label: 'Wallet & Pricing Store', icon: Award, badge: 'M14/15' },
                { id: 'admin', label: 'System Analytics', icon: BarChart3, badge: 'M19/20' }
              ].map((mod) => {
                const Icon = mod.icon;
                const active = activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    id={`module-nav-link-${mod.id}`}
                    onClick={() => setActiveModule(mod.id as any)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-left shrink-0 snap-start lg:w-full ${
                      active 
                        ? 'bg-emerald-50 text-emerald-900 font-extrabold shadow-inner border-l-2 lg:border-l-4 border-emerald-700 pl-2' 
                        : 'text-slate-600 hover:bg-slate-50 border-l-2 lg:border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold leading-none">{mod.label}</span>
                    </div>
                    <span className="text-[8px] font-bold py-0.5 px-1.5 rounded-full bg-slate-150 text-slate-500 font-mono scale-90 ml-2 lg:ml-0">{mod.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Toggle Trigger for floating AI Copilot (Module 16) */}
          <button
            id="active-copilot-slide-btn"
            onClick={() => setIsCopilotOpen(prev => !prev)}
            className="w-full bg-slate-950 hover:bg-emerald-900/90 text-white font-extrabold p-3 rounded-2xl flex items-center justify-between shadow-lg cursor-pointer transition-all border border-slate-900"
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4.5 w-4.5 text-emerald-400 animate-pulse shrink-0" />
              <div className="text-left leading-none">
                <span className="text-xs font-bold block">AI Research Copilot</span>
                <span className="text-[9.5px] text-emerald-300 font-normal">Module 16 Chatbot</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-emerald-300" />
          </button>

        </aside>

        {/* Dynamic Center Stage Workspace Router */}
        <main id="prorite-main-workspace" className="flex-1 min-w-0">
          {activeModule === 'assistant' && (
            <ResearchAssistant 
              user={user}
              projects={projects}
              onProjectCreated={handleProjectCreated}
              activeProject={activeProject}
            />
          )}

          {activeModule === 'builder' && (
            <ProjectBuilder 
              user={user}
              activeProject={activeProject}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeModule === 'literature' && (
            <LiteratureReview 
              user={user}
              activeProject={activeProject}
            />
          )}

          {activeModule === 'rewriter' && (
            <AcademicRewriter />
          )}

          {activeModule === 'originality' && (
            <OriginalityChecker user={user} />
          )}

          {activeModule === 'collaborate' && (
            <CollaborationPortal 
              user={user}
              activeProject={activeProject}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeModule === 'billing' && (
            <LibraryMarketplace 
              user={user}
              onUpdateUser={handleUpdateUser}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {activeModule === 'admin' && (
            <AdminInstitutionDashboards 
              user={user}
              projects={projects}
            />
          )}
        </main>

        {/* Slide-out floating Right Panel: Module 16 Real Interactive Academic Copilot Chatbot */}
        {isCopilotOpen && (
          <aside id="prorite-right-sidebar-copilot" className="fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl animate-slide-in text-xs font-sans">
            
            {/* Slide title */}
            <div className="p-4 bg-slate-999 text-white bg-slate-950 flex justify-between items-center shrink-0 border-b border-emerald-950/20">
              <div className="flex items-center space-x-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-emerald-400" />
                <span className="font-extrabold text-sm text-emerald-50">AI Research Copilot</span>
              </div>
              <button
                id="close-copilot-drawer-btn"
                onClick={() => setIsCopilotOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat list context */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {copilotHistory.map((h, i) => (
                <div key={i} className={`flex flex-col space-y-1 ${h.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{h.role === 'user' ? 'User' : 'ProRite AI'}</span>
                  <div className={`p-3 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                    h.role === 'user' 
                      ? 'bg-emerald-700 text-white rounded-tr-none font-medium' 
                      : 'bg-white text-slate-850 border border-slate-200/60 rounded-tl-none shadow-xs'
                  }`}>
                    <p className="whitespace-pre-wrap">{h.content}</p>
                  </div>
                </div>
              ))}
              {isCopilotThinking && (
                <div className="flex items-center space-x-2 text-slate-400 animate-pulse italic">
                  <div className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce"></div>
                  <div className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce delay-100"></div>
                  <span>Academic writing analysis in progress...</span>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendCopilotQuery} className="p-3 border-t border-slate-100 shrink-0 bg-white">
              <div className="flex gap-2">
                <input
                  id="copilot-input-textbox"
                  type="text"
                  value={copilotMessage}
                  onChange={(e) => setCopilotMessage(e.target.value)}
                  placeholder="Ask any research formulation question..."
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  required
                />
                <button
                  id="submit-copilot-msg-btn"
                  type="submit"
                  disabled={isCopilotThinking}
                  className="bg-slate-950 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-black text-xs px-3.5 py-2 rounded-xl cursor-pointer transition-all"
                >
                  Ask
                </button>
              </div>
            </form>

          </aside>
        )}

      </div>

      {/* Manual Configuration Wizard Dialog */}
      {showConfigWizard && (
        <div id="project-wizard-modal" className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs">
          <div className="bg-white border select-none rounded-2xl p-6 shadow-xl max-w-md w-full relative">
            
            <button
              id="close-wizard-modal-btn"
              onClick={() => setShowConfigWizard(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2 pb-2 border-b">
              <FileText className="h-5 w-5 text-emerald-600" />
              <span>Initiate Custom Project Draft</span>
            </h3>

            <form onSubmit={handleCreateCustomProject} className="space-y-4 mt-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Raw Topic Subject</label>
                <textarea
                  id="wizard-topic-textarea"
                  rows={3}
                  value={newTopicInput}
                  onChange={(e) => setNewTopicInput(e.target.value)}
                  placeholder="e.g. Assessment of Corporate Governance failures in modern digital enterprises..."
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Academic Discipline</label>
                <select
                  id="wizard-discipline-select"
                  value={newDeptInput}
                  onChange={(e) => setNewDeptInput(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {ACADEMIC_DISCIPLINES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  id="wizard-cancel-btn"
                  type="button"
                  onClick={() => setShowConfigWizard(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  id="wizard-execute-btn"
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-850 text-white font-extrabold py-2 rounded-xl transition-all cursor-pointer text-center"
                >
                  Start Project Workspace
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
