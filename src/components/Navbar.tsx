import React from 'react';
import { 
  BookOpen, 
  Wallet, 
  Award, 
  Sparkles, 
  User, 
  ChevronDown, 
  Building,
  LogOut
} from 'lucide-react';
import { UserProfile, AcademicProject } from '../types';

interface NavbarProps {
  user: UserProfile;
  projects: AcademicProject[];
  activeProject: AcademicProject | null;
  onSelectProject: (id: string) => void;
  onOpenUpgrade: () => void;
  onOpenWallet: () => void;
  activeModule: string;
  onLogout?: () => void;
}

export default function Navbar({
  user,
  projects,
  activeProject,
  onSelectProject,
  onOpenUpgrade,
  onOpenWallet,
  activeModule,
  onLogout
}: NavbarProps) {
  return (
    <header id="prorite-navbar" className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-950 text-emerald-400 p-2.5 rounded-xl shadow-md border border-emerald-950/20 flex items-center justify-center">
              <BookOpen className="h-5.5 w-5.5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">ProRite</span>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-emerald-100 flex items-center space-x-0.5">
                  <Sparkles className="h-2.5 w-2.5 text-emerald-600 animate-pulse" />
                  <span>AI</span>
                </span>
              </div>
              <p className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase -mt-0.5">Academic OS</p>
            </div>
          </div>

          {/* Active Project Selection Selector */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Workspace:</span>
            <div className="relative">
              <select
                id="workspace-project-selector"
                value={activeProject?.id || ''}
                onChange={(e) => onSelectProject(e.target.value)}
                className="block w-64 pl-3 pr-10 py-1.5 text-xs font-bold text-slate-850 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.title.length > 55 ? `${proj.title.substring(0, 55)}...` : proj.title}
                  </option>
                ))}
                <option value="new">+ Start A New Project</option>
              </select>
            </div>
          </div>

          {/* User Meta & Action Triggers */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Wallet Balance Display */}
            <button
              id="wallet-trigger-button"
              onClick={onOpenWallet}
              className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg shadow-sm font-bold transition-all text-xs cursor-pointer border border-emerald-800"
              title="Click to top-up wallet"
            >
              <Wallet className="h-4 w-4 text-emerald-300 shrink-0" />
              <span className="hidden sm:inline text-emerald-100 font-medium">Wallet:</span>
              <span className="font-mono text-white">₦{user.walletBalance.toLocaleString()}</span>
            </button>

            {/* Subscription Tier badge */}
            <div className="relative group">
              <button
                id="plan-badge-button"
                onClick={onOpenUpgrade}
                className="flex items-center space-x-1.5 bg-slate-950 hover:bg-slate-900 text-white border border-slate-900 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Award className="h-4 w-4 shrink-0 text-emerald-450" />
                <span>{user.plan}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 text-emerald-450" />
              </button>
            </div>

            {/* User Profile Overview */}
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-750 font-bold text-xs ring-2 ring-emerald-50">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-3">{user.fullName}</p>
                <span className="text-[10px] text-slate-400 flex items-center mt-0.5">
                  <Building className="h-2.5 w-2.5 mr-0.5 shrink-0" />
                  {user.institution.length > 20 ? `${user.institution.substring(0, 20)}...` : user.institution}
                </span>
              </div>
            </div>

            {/* Logout Trigger button */}
            {onLogout && (
              <button
                id="navbar-logout-btn"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-emerald-800 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                title="Log Out scholarly session"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
