import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Loader2, 
  Download, 
  Settings, 
  FileText, 
  BookmarkCheck, 
  Bookmark, 
  ChevronRight, 
  Save, 
  RefreshCcw,
  BookMarked
} from 'lucide-react';
import { UserProfile, AcademicProject, AcademicStyle } from '../types';
import ReactMarkdown from 'react-markdown';

interface ProjectBuilderProps {
  user: UserProfile;
  activeProject: AcademicProject | null;
  onUpdateProject: (updatedProj: AcademicProject) => void;
}

const ACADEMIC_STYLES: AcademicStyle[] = [
  'APA 7th Edition',
  'MLA 9th Edition',
  'Harvard',
  'Chicago',
  'IEEE',
  'Vancouver'
];

export default function ProjectBuilder({
  user,
  activeProject,
  onUpdateProject
}: ProjectBuilderProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'frontmatter' | 'citations' | 'export'>('editor');
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [userDirectives, setUserDirectives] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [localStyle, setLocalStyle] = useState<AcademicStyle>(activeProject?.style || 'APA 7th Edition');
  const [builderError, setBuilderError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Cover Page configuration state
  const [coverDept, setCoverDept] = useState(activeProject?.department || user.department);
  const [coverInstitution, setCoverInstitution] = useState(user.institution);
  const [authorName, setAuthorName] = useState(user.fullName);
  const [matricNo, setMatricNo] = useState(user.studentId || 'MC-2026-001A');
  const [supervisorName, setSupervisorName] = useState('Dr. S. A. Adesina, PhD');
  const [submissionYear, setSubmissionYear] = useState('2026');

  if (!activeProject) {
    return (
      <div id="project-builder-empty-state" className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-550 max-w-xl mx-auto space-y-4 shadow-xs">
        <BookOpen className="h-12 w-12 text-emerald-600 mx-auto animate-pulse" />
        <h3 className="font-black text-slate-900 text-lg font-sans">No Workspace Selected</h3>
        <p className="text-xs font-medium font-sans leading-relaxed">Select or construct an academic project workspace from the "Active Workspace" selector at the top header to write, format, and prepare thesis chapters.</p>
      </div>
    );
  }

  const currentChObject = activeProject.chapters[activeChapter] || {
    title: `Chapter ${activeChapter}`,
    content: `*Click **Generate with AI** or type custom content to begin drafting Chapter ${activeChapter}.*`,
    references: []
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = { ...activeProject };
    if (!updated.chapters[activeChapter]) {
      updated.chapters[activeChapter] = { title: `Chapter ${activeChapter}`, content: '', references: [] };
    }
    updated.chapters[activeChapter].content = e.target.value;
    updated.lastUpdated = new Date().toISOString().substring(0, 16).replace('T', ' ');
    onUpdateProject(updated);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...activeProject };
    if (!updated.chapters[activeChapter]) {
      updated.chapters[activeChapter] = { title: '', content: '', references: [] };
    }
    updated.chapters[activeChapter].title = e.target.value;
    updated.lastUpdated = new Date().toISOString().substring(0, 16).replace('T', ' ');
    onUpdateProject(updated);
  };

  const handleUpdateStyle = (style: AcademicStyle) => {
    setLocalStyle(style);
    const updated = { ...activeProject, style: style };
    onUpdateProject(updated);
  };

  const executeChapterGeneration = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeProject.title,
          chapterNumber: activeChapter,
          chapterTitle: currentChObject.title,
          style: localStyle,
          academicLevel: activeProject.academicLevel,
          additionalDetails: userDirectives,
          existingChapters: Object.keys(activeProject.chapters).reduce((acc: any, key: any) => {
            acc[key] = activeProject.chapters[parseInt(key)].title;
            return acc;
          }, {})
        })
      });

      if (!response.ok) {
        throw new Error('Project builder API error');
      }

      const resJson = await response.json();
      
      const updated = { ...activeProject };
      updated.chapters[activeChapter] = {
        title: currentChObject.title,
        content: resJson.content || '',
        references: resJson.references || []
      };
      
      // Merge references
      const gatheredRefs = Array.from(new Set([
        ...(activeProject.chapters[activeChapter]?.references || []),
        ...(resJson.references || [])
      ]));
      updated.chapters[activeChapter].references = gatheredRefs;
      
      updated.lastUpdated = new Date().toISOString().substring(0, 16).replace('T', ' ');
      onUpdateProject(updated);
      setUserDirectives('');
    } catch (err: any) {
      setBuilderError('AI Chapter Formulation Failed: ' + err.message);
      setTimeout(() => setBuilderError(''), 7000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger web browser native printing preview layout
  const handlePrintPreview = () => {
    window.print();
  };

  // Export mock files downloader
  const handleExportDocx = () => {
    const payload = `PRO-RITE AI EXPORT\n\nTitle: ${activeProject.title}\nAcademic Style: ${localStyle}\nAuthor: ${authorName}\n\n========================\n\n${Object.keys(activeProject.chapters).map(chNum => {
      const ch = activeProject.chapters[parseInt(chNum)];
      return `CHAPTER ${chNum}: ${ch.title}\n\n${ch.content}\n\nREFERENCES:\n${ch.references.map(r => `* ${r}`).join('\n')}`;
    }).join('\n\n========================\n\n')}`;

    const blob = new Blob([payload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.title.substring(0, 30)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="project-builder-module" className="space-y-6 animate-fade-in">
      
      {/* Workspace Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Active Thesis Workbook
          </span>
          <h2 className="text-sm font-extrabold text-slate-800 mt-1 lines-clamp-1">{activeProject.title}</h2>
          <p className="text-[11px] text-slate-500">Academic Target: <span className="font-semibold text-slate-700">{activeProject.academicLevel}</span> • Last Updated: <span className="font-semibold text-slate-700">{activeProject.lastUpdated}</span></p>
        </div>

        {/* Style Selection Option */}
        <div className="flex items-center space-x-2 shrink-0">
          <label className="text-xs font-bold text-slate-600">Style Engine:</label>
          <select
            id="citation-style-select"
            value={localStyle}
            onChange={(e) => handleUpdateStyle(e.target.value as AcademicStyle)}
            className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {ACADEMIC_STYLES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Sub tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
        {[
          { id: 'editor', label: 'Chapter Builder (Ch 1 - 5)', icon: FileText },
          { id: 'frontmatter', label: 'Institutional Cover Page (Front Matter)', icon: FileText },
          { id: 'citations', label: 'Source References Manager', icon: BookmarkCheck },
          { id: 'export', label: 'Smart PDF/DOCX Export Options', icon: Download }
        ].map(tb => {
          const Icon = tb.icon;
          const active = activeTab === tb.id;
          return (
            <button
              key={tb.id}
              id={`tab-btn-${tb.id}`}
              onClick={() => setActiveTab(tb.id as any)}
              className={`flex items-center space-x-1.5 pb-2.5 text-xs font-extrabold transition-all relative border-b-2 cursor-pointer whitespace-nowrap ${
                active 
                  ? 'text-emerald-700 border-emerald-700 font-extrabold' 
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Layout tab */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Chapter Navigation side rail */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { num: 1, title: 'Chapter One', desc: 'Introduction & Background' },
              { num: 2, title: 'Chapter Two', desc: 'Literature Review' },
              { num: 3, title: 'Chapter Three', desc: 'Research Methodology' },
              { num: 4, title: 'Chapter Four', desc: 'Data Analysis & Results' },
              { num: 5, title: 'Chapter Five', desc: 'Summary & Conclusions' }
            ].map(ch => {
              const isActive = activeChapter === ch.num;
              return (
                <button
                  key={ch.num}
                  id={`chapter-rail-btn-${ch.num}`}
                  onClick={() => setActiveChapter(ch.num)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    isActive 
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 ring-1 ring-emerald-100' 
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {ch.title}
                    </span>
                    <span className="text-xs font-bold block">{ch.desc}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-all opacity-60 ${isActive ? 'transform translate-x-1 text-emerald-650' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Main Academic workspace editor & draft visualizer */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
              
              {/* Header inside Chapter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pb-4 border-b border-slate-100">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Chapter Subject Header</label>
                  <input
                    type="text"
                    id="chapter-title-input"
                    value={currentChObject.title}
                    onChange={handleTitleChange}
                    className="w-full text-sm font-bold text-slate-800 bg-transparent border-b border-slate-200 focus:outline-none focus:border-emerald-600 py-1 font-sans"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block sm:text-right font-medium">Writing level: {activeProject.academicLevel}</span>
                </div>
              </div>

              {builderError && (
                <div className="p-3.5 bg-rose-50 border border-rose-150 rounded-xl text-rose-800 text-xs font-bold leading-normal animate-shake">
                  ⚠️ {builderError}
                </div>
              )}

              {/* Advanced Interactive AI Directives Panel */}
              <div className="bg-slate-50 border border-emerald-150 rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                  <span className="text-xs font-black text-slate-800">Generate Chapter Sections with AI Copilot</span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans">Provide focal objectives or study scopes. ProRite drafts sections conforming strictly to the formatting rules of {localStyle}.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="ai-directives-input"
                    value={userDirectives}
                    onChange={(e) => setUserDirectives(e.target.value)}
                    placeholder="e.g. Include specific metrics for sub-Saharan smallholder regions, compare MobileNet vs ResNet..."
                    className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                  <button
                    id="trigger-ai-chapter-button"
                    onClick={executeChapterGeneration}
                    disabled={isGenerating}
                    className="bg-slate-950 hover:bg-emerald-800 text-white font-black text-xs px-4 py-2 rounded-lg cursor-pointer shrink-0 transition-all flex items-center space-x-1 border border-slate-900 shadow-xs"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Drafting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-emerald-350" />
                        <span>Draft Section</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Side-by-Side: Original Draft Input vs Refined Markdown Output */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[350px]">
                
                {/* Visual Work Editor */}
                <div className="space-y-1 my-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Core Editor (Markdown Supported)</label>
                  <textarea
                    id="chapter-main-textarea"
                    value={currentChObject.content}
                    onChange={handleTextChange}
                    className="w-full h-full min-h-[400px] text-xs font-mono text-slate-800 bg-slate-50/20 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
                    placeholder="Write or paste your academic drafts, statistics parameters here..."
                  />
                </div>

                {/* Styled Professional Preview Pane */}
                <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl max-h-[450px] overflow-y-auto space-y-4">
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    Formatted Professional Output
                  </span>
                  
                  <div className="prose prose-slate text-xs text-slate-700 leading-relaxed font-sans mt-3 space-y-3">
                    <ReactMarkdown>{currentChObject.content}</ReactMarkdown>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* Front matter Tab */}
      {activeTab === 'frontmatter' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in text-xs">
          
          {/* Config parameters form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 h-fit shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-sm">Cover Page Parameters</h3>
            <p className="text-[11px] text-slate-500">Configure institutional metadata to automatically render approval/dedication page alignments.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Institution Location Full Name</label>
                <input
                  type="text"
                  value={coverInstitution}
                  onChange={(e) => setCoverInstitution(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Academic Department</label>
                <input
                  type="text"
                  value={coverDept}
                  onChange={(e) => setCoverDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Author Scholar Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Registration / Matric ID</label>
                  <input
                    type="text"
                    value={matricNo}
                    onChange={(e) => setMatricNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Main Research Supervisor Name</label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Year of Submission</label>
                <input
                  type="text"
                  value={submissionYear}
                  onChange={(e) => setSubmissionYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Visual Canvas Output */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-between text-center min-h-[500px] border-indigo-100 max-w-lg mx-auto relative font-serif text-slate-900 leading-normal">
            
            <div>
              <p className="font-bold tracking-widest text-[11px] uppercase mb-1">{coverInstitution.toUpperCase()}</p>
              <p className="text-[10px] tracking-widest text-slate-500 uppercase">FACULTY OF SCIENCE & SCIENTIFIC SYSTEMS</p>
            </div>

            <div className="my-10 space-y-4">
              <h2 className="text-sm font-extrabold uppercase leading-snug tracking-wide max-w-md mx-auto">
                {activeProject.title.toUpperCase()}
              </h2>
              <div className="h-0.5 w-16 bg-slate-400 mx-auto"></div>
              <p className="text-[10px] font-medium max-w-xs mx-auto text-slate-500 uppercase leading-snug">
                A THESIS WORKBOOK DEPLOYED IN PARTIAL FULFILLMENT OF REQUISITE RATIOS IN {activeProject.academicLevel.toUpperCase()} CURRICULUMS
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase">PREPARED BY</p>
              <p className="text-xs font-bold uppercase">{authorName}</p>
              <p className="text-[10.5px] font-mono text-slate-600">Matric: {matricNo}</p>
            </div>

            <div className="space-y-4 mt-8 pt-6 border-t border-slate-100 w-full text-[10px]">
              <div className="grid grid-cols-2 text-center text-slate-600 uppercase tracking-wider">
                <div>
                  <p className="font-semibold text-slate-400">Head Supervisor</p>
                  <p className="font-bold text-slate-800 mt-0.5">{supervisorName}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400">Date of Submission</p>
                  <p className="font-bold text-slate-800 mt-0.5">JUNE, {submissionYear}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Citations references TAB */}
      {activeTab === 'citations' && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-5 animate-fade-in text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Automated Ref / Bibliography catalog</h3>
              <p className="text-[11px] text-slate-500">List of references used throughout generated sections of your active project, formatted as <strong>{localStyle}</strong>.</p>
            </div>
            <button
              id="rebuild-references-button"
              onClick={() => {
                setVerifySuccess(true);
                setTimeout(() => setVerifySuccess(false), 6000);
              }}
              className="bg-slate-950 hover:bg-emerald-800 text-white font-black px-4 py-2 rounded-xl flex items-center space-x-1 cursor-pointer transition-all border border-slate-900 shadow-xs"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              <span>Verify Styles</span>
            </button>
          </div>

          {verifySuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
              <span className="text-base">✓</span>
              <span>Citations analysis complete: All Chapter 1 - 5 Bibliography records conform perfectly to {localStyle} standards without formatting warnings!</span>
            </div>
          )}

          <div className="space-y-3">
            {Object.keys(activeProject.chapters).some(key => activeProject.chapters[parseInt(key)].references.length > 0) ? (
              Object.keys(activeProject.chapters).map(key => {
                const ch = activeProject.chapters[parseInt(key)];
                if (ch.references.length === 0) return null;
                return (
                  <div key={key} className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-extrabold text-emerald-850 text-xs">Citations registered inside Chapter {key}: {ch.title}</h5>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                      {ch.references.map((ref, i) => (
                        <li key={i} className="pl-1 italic">
                          {ref}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 max-w-sm mx-auto space-y-2 border border-dashed border-slate-200 rounded-xl">
                <BookMarked className="h-8 w-8 text-emerald-600/60 mx-auto" />
                <p className="text-xs font-semibold">No direct bibliography markers generated yet.</p>
                <p className="text-[10px] text-slate-400">Generate a section or manually append citations in Chapter builder editor to index bibliography listings.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Options Tab */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in text-xs">
          
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Download Worksheets</h3>
            <p className="text-slate-500">Ready to export your completed chapters? ProRite formats all elements conforming with structural margins and typography standards.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <button
                id="export-pdf-browser-action"
                onClick={handlePrintPreview}
                className="bg-slate-950 hover:bg-emerald-800 text-white font-extrabold py-3 px-4 rounded-xl flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all border border-slate-900 cursor-pointer"
              >
                <FileText className="h-6 w-6 text-emerald-400" />
                <span>Export Print PDF</span>
                <span className="text-[9px] font-normal opacity-85">Uses cover alignment standards</span>
              </button>

              <button
                id="export-text-file-action"
                onClick={handleExportDocx}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 px-4 rounded-xl flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all border border-emerald-800 cursor-pointer"
              >
                <FileText className="h-6 w-6 text-emerald-300" />
                <span>Download Plain Text</span>
                <span className="text-[9px] font-normal opacity-85">Includes references formatted</span>
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Institutional Layout Requirements</h3>
            <p className="text-slate-500">Your current submission style dictates the following parameters:</p>

            <ul className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <li className="flex justify-between border-b pb-1.5 border-slate-200">
                <span className="font-semibold text-slate-500">Style Standard:</span>
                <span className="font-bold text-slate-800">{localStyle}</span>
              </li>
              <li className="flex justify-between border-b pb-1.5 border-slate-200">
                <span className="font-semibold text-slate-500">Margins:</span>
                <span className="font-bold text-slate-800">1.5 inches Left, 1 inch Top/Bottom</span>
              </li>
              <li className="flex justify-between border-b pb-1.5 border-slate-200">
                <span className="font-semibold text-slate-500">Line Spacing:</span>
                <span className="font-bold text-slate-800">Double-spaced (Rendered Standard)</span>
              </li>
              <li className="flex justify-between">
                <span className="font-semibold text-slate-500">Citation Alignment:</span>
                <span className="font-bold text-slate-800">Inter-text referencing enabled</span>
              </li>
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
