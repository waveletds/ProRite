import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  MessageSquare, 
  Check, 
  History, 
  Loader2, 
  ChevronRight,
  Send,
  Workflow,
  Plus
} from 'lucide-react';
import { UserProfile, AcademicProject, SupervisorComment } from '../types';

interface CollaborationPortalProps {
  user: UserProfile;
  activeProject: AcademicProject | null;
  onUpdateProject: (updatedProj: AcademicProject) => void;
}

export default function CollaborationPortal({
  user,
  activeProject,
  onUpdateProject
}: CollaborationPortalProps) {
  const [commentInput, setCommentInput] = useState('');
  const [selectedChFilter, setSelectedChFilter] = useState<number>(1);
  const [compareVersion, setCompareVersion] = useState<any | null>(null);
  
  // Custom states replacing generic alert banners
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState<string | null>(null);
  const [versionLoadMsg, setVersionLoadMsg] = useState<string | null>(null);

  if (!activeProject) {
    return (
      <div id="collaboration-portal-empty" className="bg-white border rounded-2xl p-12 text-center text-slate-500 max-w-xl mx-auto space-y-4 animate-fade-in text-xs font-sans">
        <Users className="h-10 w-10 text-emerald-600/50 mx-auto animate-pulse" />
        <h3 className="font-bold text-slate-900 text-sm">Workspace Collaboration</h3>
        <p className="text-slate-400">Select an active thesis topic at the top selection dropdown to share drafts and review structural recommendations from supervisors.</p>
      </div>
    );
  }

  // Adding comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: SupervisorComment = {
      id: `c-${Date.now()}`,
      author: `${user.fullName} (Author)`,
      text: commentInput,
      chapter: selectedChFilter,
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
      resolved: false
    };

    const updated = { ...activeProject };
    updated.comments = [...(activeProject.comments || []), newComment];
    onUpdateProject(updated);
    setCommentInput('');
  };

  // Toggle resolved status
  const handleToggleResolve = (id: string) => {
    const updated = { ...activeProject };
    updated.comments = (activeProject.comments || []).map(c => {
      if (c.id === id) {
        return { ...c, resolved: !c.resolved };
      }
      return c;
    });
    onUpdateProject(updated);
  };

  const activeComments = (activeProject.comments || []).filter(c => c.chapter === selectedChFilter);

  // Compute total completion ratio
  const activeChapterCount = Object.keys(activeProject.chapters).length;
  const projectPercentage = Math.min(Math.round((activeChapterCount / 5) * 100), 100);

  const handleCopySupervisorLink = () => {
    navigator.clipboard.writeText(`https://prorite.edu/review/${activeProject.id}`);
    setIsUrlCopied(true);
    setTimeout(() => setIsUrlCopied(false), 2500);
  };

  const handleCommitSnapshot = () => {
    setSnapshotSuccessMsg(`Successfully committed immediate snapshot verification hash at: HASH-${Math.floor(Math.random() * 90000) + 10000}`);
    setTimeout(() => setSnapshotSuccessMsg(null), 5000);
  };

  const handleLoadRevision = (versName: string, versId: string) => {
    setCompareVersion({ id: versId, name: versName });
    setVersionLoadMsg(`Loaded historical draft snapshot: "${versName}"`);
    setTimeout(() => setVersionLoadMsg(null), 4000);
  };

  return (
    <div id="collaboration-portal-module" className="space-y-6 animate-fade-in text-xs font-sans">
      
      {/* Collaboration metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progress Tracker Card */}
        <div className="bg-white border rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
            <Workflow className="h-4.5 w-4.5 text-emerald-700" />
            <span>Progress Tracking (Ch 1 - 5)</span>
          </h3>
          <p className="text-slate-500">A visual alignment rating of your completed chapters and submission tasks.</p>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Overall Completion:</span>
              <span>{projectPercentage}%</span>
            </div>
            
            {/* Visual Progress bar container */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full transition-all duration-500"
                style={{ width: `${projectPercentage}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 text-[10.5px] text-slate-500 pt-2 gap-2 border-t border-slate-100 mt-2 font-medium">
              <div>
                <span>Chapters Active:</span>
                <p className="font-black text-slate-900 text-xs">{activeChapterCount} of 5</p>
              </div>
              <div>
                <span>Ref list Status:</span>
                <p className="font-black text-slate-900 text-xs text-emerald-800">Indexed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Draft panel */}
        <div className="bg-white border rounded-2xl p-5 shadow-xs md:col-span-2 space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
            <Users className="h-4.5 w-4.5 text-emerald-700" />
            <span>Supervisor Board Connection</span>
          </h3>
          <p className="text-slate-500 font-medium">Provide permission parameters. Share active chapters and receive academic feedback notifications.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2 items-stretch">
            <div className="flex-1 bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col justify-center">
              <span className="font-black text-[10px] uppercase text-emerald-705 block">External Supervisor Link</span>
              <p className="font-mono text-slate-650 text-xs leading-normal mt-0.5 break-all select-all font-bold">https://prorite.edu/review/{activeProject.id}</p>
            </div>
            <button
              id="copy-supervisor-link-button"
              type="button"
              onClick={handleCopySupervisorLink}
              className={`font-black px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer h-11 shrink-0 ${
                isUrlCopied 
                  ? 'bg-emerald-800 text-white' 
                  : 'bg-slate-950 hover:bg-emerald-900 text-white'
              }`}
            >
              <Check className={`h-3.5 w-3.5 ${isUrlCopied ? 'block' : 'hidden'}`} />
              <span>{isUrlCopied ? 'Copied Link!' : 'Copy Supervisor URL'}</span>
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Side: Version Control revisions history */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5 pb-2 border-b border-stone-100">
            <History className="h-4 w-4 text-emerald-700" />
            <span>Active Version Control (Module 17)</span>
          </h4>

          {versionLoadMsg && (
            <div className="bg-emerald-50 text-emerald-850 p-2 rounded-xl border border-emerald-100 text-[10.5px] font-bold animate-fade-in">
              {versionLoadMsg}
            </div>
          )}

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {[
              { id: 'v-1', name: 'Baseline Subject Alignment Draft', time: '2026-06-11 12:00', size: '2.4kb' },
              { id: 'v-2', name: 'Post-Advisor Feedback Updates', time: '2026-06-12 18:32', size: '4.8kb' },
              { id: 'v-3', name: 'Added Mobile convolutional matrices Chapter 2', time: '2026-06-14 01:10', size: '9.2kb' }
            ].map(vers => {
              const selected = compareVersion?.id === vers.id;
              return (
                <div 
                  key={vers.id} 
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selected ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50'
                  }`}
                  onClick={() => handleLoadRevision(vers.name, vers.id)}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 text-xs leading-snug">{vers.name}</span>
                    <span className="text-[10px] font-mono text-emerald-805 font-black bg-white px-1.5 py-0.2 rounded border border-emerald-100">{vers.size}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{vers.time}</p>
                </div>
              );
            })}
          </div>

          <button
            id="commit-version-button"
            onClick={handleCommitSnapshot}
            className="w-full bg-slate-950 hover:bg-emerald-850 text-white font-black text-xs py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-450 animate-pulse" />
            <span>Commit Instant Rev Snapshot</span>
          </button>

          {snapshotSuccessMsg && (
            <div className="bg-emerald-50 text-emerald-850 p-2.5 rounded-xl border border-emerald-100 text-[11px] font-medium leading-relaxed">
              {snapshotSuccessMsg}
            </div>
          )}
        </div>

        {/* Right Side: Chapter Comments Form & resolved notes */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5 pb-2 border-b border-slate-100">
            <MessageSquare className="h-4 w-4 text-emerald-700" />
            <span>Supervisor Board Comments Checklist</span>
          </h4>

          {/* Chapter filter selector */}
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-500 text-[10px] uppercase">Filter Comments Chapter:</span>
            <select
              id="comments-chapter-selector"
              value={selectedChFilter}
              onChange={(e) => setSelectedChFilter(parseInt(e.target.value))}
              className="bg-white border border-slate-250 rounded-lg p-1.5 font-bold text-slate-850 text-[11px] cursor-pointer focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>Chapter {n}</option>
              ))}
            </select>
          </div>

          {/* Existing Comments listing */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {activeComments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic font-medium">No notes created for Chapter {selectedChFilter} yet.</div>
            ) : (
              activeComments.map(c => (
                <div key={c.id} className={`p-4 rounded-xl border flex justify-between gap-3 text-xs ${
                  c.resolved ? 'bg-slate-50/50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-black text-slate-850">{c.author}</span>
                      <span className="text-[10px] text-slate-400">• {c.timestamp}</span>
                    </div>
                    <p className={`text-slate-650 font-semibold ${c.resolved ? 'line-through' : ''}`}>{c.text}</p>
                    {c.resolved && (
                      <span className="text-[9px] bg-emerald-50 text-emerald-850 font-black px-1.5 py-0.5 rounded border border-emerald-155">Resolved</span>
                    )}
                  </div>

                  <button
                    id={`toggle-resolve-btn-${c.id}`}
                    onClick={() => handleToggleResolve(c.id)}
                    className={`h-7 w-7 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                      c.resolved 
                        ? 'bg-emerald-50 border-emerald-250 text-emerald-705' 
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-emerald-800'
                    }`}
                    title={c.resolved ? 'Mark unresolved' : 'Mark resolved'}
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Adding comment form block */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              id="comment-input"
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={`Add comment or feedback for Chapter ${selectedChFilter}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all text-xs font-medium"
              required
            />
            <button
              id="send-comment-button"
              type="submit"
              className="bg-slate-950 hover:bg-emerald-850 text-white p-2.5 rounded-xl cursor-pointer flex items-center justify-center shrink-0 transition-colors"
            >
              <Send className="h-4.5 w-4.5 text-emerald-400" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
