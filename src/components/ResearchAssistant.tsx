import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Loader2, 
  ArrowRight, 
  ExternalLink, 
  Bookmark, 
  ListOrdered,
  BookMarked
} from 'lucide-react';
import { UserProfile, AcademicProject, AcademicSource } from '../types';
import { ACADEMIC_DISCIPLINES, ACADEMIC_RESOURCES } from '../mockData';

interface ResearchAssistantProps {
  user: UserProfile;
  projects: AcademicProject[];
  onProjectCreated: (newProj: AcademicProject) => void;
  activeProject: AcademicProject | null;
}

export default function ResearchAssistant({
  user,
  projects,
  onProjectCreated,
  activeProject
}: ResearchAssistantProps) {
  // Topic development state
  const [topicInput, setTopicInput] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState(user.department);
  const [academicLevel, setAcademicLevel] = useState(user.academicLevel);
  const [isDeveloping, setIsDeveloping] = useState(false);
  const [developedResult, setDevelopedResult] = useState<any | null>(null);
  const [errorText, setErrorText] = useState('');
  const [adoptSuccess, setAdoptSuccess] = useState(false);

  // Resource discovery search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchResults, setSearchResults] = useState<AcademicSource[]>(ACADEMIC_RESOURCES);

  // Topic developer execution
  const handleDevelopTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setIsDeveloping(true);
    setErrorText('');
    setDevelopedResult(null);

    try {
      const response = await fetch('/api/gemini/topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput,
          academicLevel: academicLevel,
          department: selectedDiscipline
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error development status');
      }

      const result = await response.json();
      setDevelopedResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Connecting to research server failed.');
    } finally {
      setIsDeveloping(false);
    }
  };

  // Convert developed topic into a new system workspace project
  const handleAdoptTopic = () => {
    if (!developedResult) return;

    const newProj: AcademicProject = {
      id: `proj-${Date.now()}`,
      title: developedResult.topic || topicInput,
      academicLevel: academicLevel,
      department: selectedDiscipline,
      style: 'APA 7th Edition',
      currentChapter: 1,
      lastUpdated: new Date().toISOString().substring(0, 16).replace('T', ' '),
      chapters: {
        1: {
          title: 'Introduction',
          content: `## 1.1 Background of the Study\n${developedResult.background || ''}\n\n## 1.2 Statement of the Problem\n${developedResult.problemStatement || ''}\n\n## 1.3 Research Objectives\n${developedResult.objectives?.map((o: any, i: number) => `${i+1}. ${o.objective}`).join('\n') || ''}\n\n## 1.4 Research Questions\n${developedResult.objectives?.map((o: any, i: number) => `${i+1}. ${o.question}`).join('\n') || ''}\n\n## 1.5 Scope of the Study\n${developedResult.scope || ''}\n\n## 1.6 Significance of the Study\n${developedResult.significance || ''}`,
          references: []
        }
      },
      tableOfContents: [
        '1. INTRODUCTION',
        '  1.1 Background of the Study',
        '  1.2 Statement of the Problem',
        '  1.3 Objectives of the Study',
        '  1.4 Research Questions',
        '  1.5 Scope of the Study',
        '  1.6 Significance of the Study'
      ],
      comments: [
        {
          id: `comment-${Date.now()}`,
          author: 'ProRite AI Reviewer',
          text: 'Welcome to your newly developed project! This outline was generated with peer-review standards. Custom edit any values inside the Project Builder.',
          chapter: 1,
          timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
          resolved: false
        }
      ],
      versions: []
    };

    onProjectCreated(newProj);
    setTopicInput('');
    setDevelopedResult(null);
    setAdoptSuccess(true);
    setTimeout(() => {
      setAdoptSuccess(false);
    }, 4500);
  };

  // Handle Search in library
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let results = ACADEMIC_RESOURCES;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.authors.toLowerCase().includes(q) || 
        r.abstract?.toLowerCase().includes(q)
      );
    }

    if (filterDiscipline !== 'All') {
      results = results.filter(r => r.department === filterDiscipline);
    }

    if (filterType !== 'All') {
      results = results.filter(r => r.type === filterType);
    }

    setSearchResults(results);
  };

  return (
    <div id="research-assistant-module" className="space-y-8 animate-fade-in">
      
      {adoptSuccess && (
        <div className="bg-emerald-800 text-white p-4.5 rounded-2xl shadow-xl flex items-center justify-between border border-emerald-900/60 animate-bounce">
          <div className="flex items-center space-x-2.5">
            <span className="h-5.5 w-5.5 rounded-lg bg-emerald-900 flex items-center justify-center font-bold text-xs text-emerald-350 shrink-0">✓</span>
            <span className="font-extrabold text-xs">Project Adopted Successfully! Your new thesis workspace is now activated. Navigating...</span>
          </div>
        </div>
      )}

      {/* Title block */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-emerald-950/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full filter blur-3xl opacity-10 transform translate-x-12 -translate-y-12"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-emerald-500/10 text-emerald-350 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border border-emerald-500/20">
            Module 2 & Module 7
          </span>
          <h1 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight mt-3">
            Academic Topic & Research Assistant
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
            Formulate rigorous research questions, set objective parameters, establish conceptual limits, and search regional journal archives seamlessly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Col: Topic Developer Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
              <div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm font-sans">Design Research Foundations</h2>
                <p className="text-[11px] text-slate-500 font-sans">Formulate high-quality objectives, questions, hypotheses, scope, study significance</p>
              </div>
            </div>

            <form onSubmit={handleDevelopTopic} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-705 mb-1">Proposed Subject / Topic Idea</label>
                <textarea
                  id="topic-development-textarea"
                  rows={3}
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g., Performance evaluation of a lightweight convolutional neural network for automated cassava leaf mosaic prediction in Oyo state farms..."
                  className="w-full text-xs text-slate-800 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all resize-none font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-705 mb-1">Academic Level</label>
                  <select
                    id="academic-level-select"
                    value={academicLevel}
                    onChange={(e) => setAcademicLevel(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer font-sans font-bold"
                  >
                    <option value="ND/NCE">ND/NCE</option>
                    <option value="HND">HND</option>
                    <option value="Undergraduate">Undergraduate (BSc/BA)</option>
                    <option value="Final Year">Final Year Student</option>
                    <option value="Master's">Master's (MSc/MBA)</option>
                    <option value="PhD">PhD Candidate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-705 mb-1">Department / Discipline</label>
                  <select
                    id="department-select"
                    value={selectedDiscipline}
                    onChange={(e) => setSelectedDiscipline(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer font-sans font-bold"
                  >
                    {ACADEMIC_DISCIPLINES.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                id="develop-topic-button"
                type="submit"
                disabled={isDeveloping}
                className="w-full bg-emerald-700 hover:bg-emerald-850 disabled:bg-emerald-400 text-white py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-sm"
              >
                {isDeveloping ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing with AI Academics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Develop Chapter 1 Foundations</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Resulting developed output */}
          {errorText && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs">
              <strong>Error developing foundation lines:</strong> {errorText}
            </div>
          )}

          {developedResult && (
            <div id="developed-topic-result" className="bg-slate-50 border border-emerald-100 rounded-2xl p-6 space-y-5 animate-fade-in relative">
              
              {developedResult.isDemoFallback && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs leading-normal border border-amber-100 font-sans">
                  ⚠️ <strong>Demo Blueprint:</strong> Gemini API key is not supplied. A curated professional project outline is displayed below. Introduce details in user secrets to enable real-time Gemini generation!
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-emerald-100 pb-4 gap-4">
                <div>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">Recommended Refined Topic</p>
                  <h3 className="font-extrabold text-slate-900 text-base mt-0.5 leading-snug">{developedResult.topic}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-250 px-2 py-0.5 rounded-full">Level: {academicLevel}</span>
                    <span className="text-[10px] font-bold text-slate-650 bg-white border border-slate-250 px-2 py-0.5 rounded-full">Dept: {selectedDiscipline}</span>
                  </div>
                </div>
                <button
                  id="adopt-project-button"
                  onClick={handleAdoptTopic}
                  className="bg-slate-950 hover:bg-emerald-800 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shrink-0 cursor-pointer shadow-md shadow-emerald-50 border border-slate-900 flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Adopt into Workspace</span>
                </button>
              </div>

              {/* Background & Statement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4.5 rounded-xl border border-slate-200/60 shadow-xs">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5 mb-2">
                    <span className="w-1.5 h-3 bg-emerald-600 rounded-full inline-block"></span>
                    <span>1.1 Background Context</span>
                  </h4>
                  <p className="text-xs text-slate-650 leading-normal line-clamp-6 bg-slate-50/50 p-2.5 rounded-lg whitespace-pre-wrap font-sans">{developedResult.background}</p>
                </div>
                <div className="bg-white p-4.5 rounded-xl border border-slate-200/60 shadow-xs">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5 mb-2">
                    <span className="w-1.5 h-3 bg-rose-600 rounded-full inline-block"></span>
                    <span>1.2 Statement of Problem</span>
                  </h4>
                  <p className="text-xs text-slate-655 leading-normal line-clamp-6 bg-slate-50/50 p-2.5 rounded-lg whitespace-pre-wrap font-sans">{developedResult.problemStatement}</p>
                </div>
              </div>

              {/* Objectives List */}
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5 mb-4 font-sans">
                  <ListOrdered className="h-4 w-4 text-emerald-600" />
                  <span>Chapter 1 Objectives, Questions & Hypotheses</span>
                </h4>
                <div className="space-y-4">
                  {developedResult.objectives?.map((obj: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-emerald-600 pl-3 py-1 bg-slate-50/30 rounded-r-lg p-2">
                      <p className="text-xs font-bold text-emerald-950">Objective {idx + 1}: {obj.objective}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5 text-[11px] text-slate-650">
                        <div>
                          <span className="font-bold text-slate-450 uppercase tracking-widest text-[9px] block">Research Question:</span>
                          <span className="italic">"{obj.question}"</span>
                        </div>
                        {obj.hypothesis && (
                          <div>
                            <span className="font-semibold text-emerald-500 uppercase tracking-widest text-[9px] block">Hypothesis (H₁):</span>
                            <span>{obj.hypothesis}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope & Significance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-800 text-xs mb-1.5">1.5 Scope limits of study</h5>
                  <p className="text-xs text-slate-600 leading-normal">{developedResult.scope}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-800 text-xs mb-1.5">1.6 Practical Significance</h5>
                  <p className="text-xs text-slate-600 leading-normal">{developedResult.significance}</p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Col: Topic Discovery & Resource Library (Module 13 & 18) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 text-sm flex items-center space-x-2 font-sans">
              <BookMarked className="h-5 w-5 text-emerald-700" />
              <span>Academic Library Query</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              Find open journals, books, PubMed & local repository templates.
            </p>

            {/* Academic Search Form */}
            <form onSubmit={handleSearch} className="space-y-3 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="library-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. malaria diagnosis, neural network..."
                  className="w-full pl-9 pr-3 py-2 text-xs text-slate-800 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-sans font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Discipline</label>
                  <select
                    id="search-discipline-filter"
                    value={filterDiscipline}
                    onChange={(e) => setFilterDiscipline(e.target.value)}
                    className="w-full text-[10px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-1.5 cursor-pointer font-bold"
                  >
                    <option value="All">All Disciplines</option>
                    {ACADEMIC_DISCIPLINES.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Source Type</label>
                  <select
                    id="search-type-filter"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full text-[10px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-1.5 cursor-pointer font-bold"
                  >
                    <option value="All">All Types</option>
                    <option value="Journal">Journal</option>
                    <option value="Conference">Conference Paper</option>
                    <option value="Thesis">University Thesis</option>
                    <option value="Book">Research Book</option>
                  </select>
                </div>
              </div>

              <button
                id="search-library-button"
                type="submit"
                className="w-full bg-slate-950 hover:bg-emerald-800 text-white border border-slate-900 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Filter className="h-3.5 w-3.5 text-emerald-450" />
                <span>Apply Library Filters</span>
              </button>
            </form>

            {/* List results */}
            <div className="mt-5 space-y-3 max-h-96 overflow-y-auto pr-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{searchResults.length} Verified Publications Found</span>
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-100 rounded-xl font-sans">
                  No matching publications located.
                </div>
              ) : (
                searchResults.map(res => (
                  <div key={res.id} className="bg-slate-50/65 border border-slate-150 p-3.5 rounded-xl space-y-2 hover:border-slate-350 transition-all text-xs font-sans">
                    <div className="flex justify-between items-start gap-1">
                      <span className="bg-emerald-50 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase border border-emerald-100">
                        {res.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Ctrl: {res.doi || 'Open'}</span>
                    </div>

                    <h4 className="font-bold text-slate-800 leading-snug">{res.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{res.authors} ({res.year})</p>
                    
                    {res.abstract && (
                      <p className="text-[10px] text-slate-400 italic line-clamp-3 bg-white p-2 rounded border border-slate-50">{res.abstract}</p>
                    )}

                    <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-100 text-slate-400">
                      <span>Cites: {res.citeCount || 0}</span>
                      <a 
                        href="https://scholar.google.com" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-emerald-700 hover:underline flex items-center space-x-0.5 font-bold"
                      >
                        <span>Crossref Lookup</span>
                        <ExternalLink className="h-2.5 w-2.5 text-emerald-750" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
