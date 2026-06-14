import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Compass, 
  FileText, 
  ShieldCheck, 
  Users, 
  Award, 
  ArrowRight, 
  GraduationCap, 
  TrendingUp, 
  Cpu, 
  Wallet,
  CheckCircle2,
  Workflow,
  Zap,
  Building
} from 'lucide-react';

interface HomepageLandingProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function HomepageLanding({
  onGetStarted,
  onLoginClick,
  onRegisterClick
}: HomepageLandingProps) {
  return (
    <div id="homepage-landing-root" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white pb-12">
      
      {/* Dynamic Top Navigation Bar */}
      <nav id="landing-navbar" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-700 text-white p-2 rounded-xl shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-base font-black tracking-tight text-slate-900 font-sans">
              ProRite<span className="text-emerald-700">.AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-600">
            <a href="#features-section" className="hover:text-emerald-800 transition-colors">Platform Features</a>
            <a href="#how-it-works" className="hover:text-emerald-800 transition-colors font-sans">Workflow</a>
            <a href="#institution-impact" className="hover:text-emerald-800 transition-colors">Institutions</a>
            <a href="#fees" className="hover:text-emerald-800 transition-colors">Pricing & Plans</a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="landing-login-btn"
              onClick={onLoginClick}
              className="text-xs font-bold text-slate-700 hover:text-emerald-850 px-4 py-2 rounded-xl transition-all hover:bg-slate-50 cursor-pointer"
            >
              Sign In
            </button>
            <button
              id="landing-signup-btn"
              onClick={onRegisterClick}
              className="bg-slate-950 hover:bg-emerald-900 text-white text-xs font-black px-4.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header Presentation */}
      <header className="relative py-16 md:py-24 overflow-hidden bg-white border-b border-slate-200/60">
        <div className="absolute inset-0 bg-radial-[circle_at_80%_20%] from-emerald-50/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full text-emerald-800 animate-pulse text-[11px] font-black uppercase tracking-wider mx-auto">
            <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Modern End-to-End Academic Writing Suite</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Formulate, Scaffold and Validate Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-900 underline decoration-emerald-200 decoration-wavy">Academic Thesis</span> in Real-Time
          </h1>

          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-semibold">
            An advanced writing assistant engineered strictly to align topic foundations, Chapter 1-5 structural designs, originality assessments, and citation parameters.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <button
              id="hero-cta-get-started"
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-emerald-700/10 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Build Active Thesis Draft</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#features-section"
              className="w-full sm:w-auto text-center border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-6 py-3.5 rounded-2xl transition-all cursor-pointer"
            >
              Learn Platform Subsystems
            </a>
          </div>

          {/* Core Metrics Highlight */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto border-t border-slate-100">
            {[
              { label: 'Chapters Supported', val: 'Ch 1 - 5' },
              { label: 'Citations Formatted', val: 'APA, MLA, IEEE, +' },
              { label: 'Originality Assessor', val: 'Real-time Similarity' },
              { label: 'Academic Tone Adjuster', val: '4 Editing Scales' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-black text-emerald-800 font-mono tracking-tight">{stat.val}</p>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features Grid Details */}
      <section id="features-section" className="py-16 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10.5px] font-black uppercase text-emerald-800 tracking-widest block font-mono">Comprehensive Modules</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Structured Peer Review Subsystems</h2>
          <p className="text-slate-500 text-xs md:text-sm max-w-xl mx-auto font-medium">
            ProRite delivers precise assistance at each milestone of the academic cycle, ensuring compliant, authentic outputs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Topic Development & Backgrounds',
              desc: 'Develop raw research interests into polished titles with clear statements of problem, key operational objectives, and empirical scope definitions.',
              icon: Compass,
              id: 'm-compass'
            },
            {
              title: 'Chapter 1-5 Thesis Builder',
              desc: 'Draft comprehensive methodologies, empirical calculations, literature mappings, and results frameworks aligned with strict institutional checklists.',
              icon: FileText,
              id: 'm-editor'
            },
            {
              title: 'Thematic Literature Review',
              desc: 'Conduct automatic literature reviews. Extract related academic journals and insert appropriate in-text references mapped directly into your style parameter.',
              icon: BookOpen,
              id: 'm-review'
            },
            {
              title: 'Originality & Similarity Index',
              desc: 'Submit text and analyze the originality matrix against major academic archives. Detect spelling flaws, missing citations, and formatting voids.',
              icon: ShieldCheck,
              id: 'm-shield'
            },
            {
              title: 'Academic Tone Paraphraser',
              desc: 'Transition raw notes or informal bullet-points into high-grade publisher syntax. Supports dissertation, journal format, and research paper presets.',
              icon: Sparkles,
              id: 'm-spark'
            },
            {
              title: 'Interactive Supervisor portal',
              desc: 'Share live workspace links to remote supervisors. Let academic advisors write corrections and resolve outstanding structural requirements.',
              icon: Users,
              id: 'm-users'
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                id={item.id} 
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 inline-block">
                    <Icon className="h-5 w-5 text-emerald-800" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm leading-snug">{item.title}</h3>
                  <p className="text-slate-500 font-medium text-xs leading-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow Timeline Section */}
      <section id="how-it-works" className="bg-white border-y border-slate-200/60 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10.5px] font-black uppercase text-emerald-805 tracking-widest block font-mono">The ProRite Way</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Structured Implementation Workflow</h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto font-medium">Four robust milestones translating raw research interests into finalized published formats.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Input Area Interest', detail: 'Specify your academic discipline, institutional directives, research limits, and reference guidelines (APA, Chicago).' },
              { step: '02', title: 'Dynamic Structural Drafts', detail: 'Develop comprehensive chapter parameters using our live builders. Coordinate layout transitions step-by-step.' },
              { step: '03', title: 'Assess Originality index', detail: 'Review similarity stats. Fix identified citation blocks, update phrasing, and index your complete references registry.' },
              { step: '04', title: 'Connect Academic Supervisor', detail: 'Deploy immediate revision links to advisors for real-time reviews. Clear feedback logs and download draft packages.' }
            ].map((wk, i) => (
              <div key={i} className="space-y-3 relative">
                <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                  <span className="text-2xl font-black font-mono text-emerald-700/20">{wk.step}</span>
                  <div className="bg-emerald-50 h-2 w-2 rounded-full border border-emerald-500"></div>
                </div>
                <h4 className="font-bold text-slate-850 text-xs">{wk.title}</h4>
                <p className="text-slate-500 font-medium text-[11px] leading-relaxed">{wk.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University & Institutional Integrations */}
      <section id="institution-impact" className="py-16 max-w-5xl mx-auto px-6 space-y-12">
        <div className="bg-emerald-950 text-white p-8 md:p-12 rounded-3xl border border-emerald-900/40 relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center space-x-1 bg-emerald-900 text-emerald-300 border border-emerald-800/40 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Building className="h-3.5 w-3.5" />
              <span>Campus Level Support</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black tracking-tight leading-snug">Empowering University Systems</h3>
            <p className="text-emerald-250 text-xs leading-relaxed font-semibold">
              Aligning entire disciplines, research modules, and compliance checks with standard central admin panels. Deployed seamlessly for continuous faculty evaluation parameters.
            </p>
          </div>
          <button
            id="institution-get-started"
            onClick={onGetStarted}
            className="bg-white hover:bg-slate-105 text-emerald-950 px-5 py-3 rounded-2xl font-black text-xs shrink-0 transition-all cursor-pointer"
          >
            Review Institutional Portal
          </button>
        </div>
      </section>

    </div>
  );
}
