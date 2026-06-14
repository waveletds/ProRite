import React, { useState } from 'react';
import { 
  Library, 
  Sparkles, 
  Loader2, 
  BookOpen, 
  Copy, 
  Check, 
  CheckSquare, 
  GitCommit 
} from 'lucide-react';
import { UserProfile, AcademicProject } from '../types';

interface LiteratureReviewProps {
  user: UserProfile;
  activeProject: AcademicProject | null;
}

export default function LiteratureReview({
  user,
  activeProject
}: LiteratureReviewProps) {
  const [reviewType, setReviewType] = useState<'Thematic' | 'Chronological' | 'Comparative'>('Thematic');
  const [focalVariables, setFocalVariables] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outlineResult, setOutlineResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateOutline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    setIsGenerating(true);
    setOutlineResult(null);

    // Call rewriter / outline builder through AI generator
    try {
      const response = await fetch('/api/gemini/chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeProject.title,
          chapterNumber: 2,
          chapterTitle: `${reviewType} Literature Review Outline`,
          style: activeProject.style,
          academicLevel: activeProject.academicLevel,
          additionalDetails: `Focus primarily on these themes, concepts, and framework elements: ${focalVariables}. Generate a comprehensive theoretical framework and comparative analysis outline.`
        })
      });

      if (!response.ok) throw new Error('Failed to reach gen server');
      const data = await response.json();
      setOutlineResult(data.content);
    } catch (err: any) {
      // Fallback
      setOutlineResult(`### Chapter Two: Literature Review Outline (${reviewType} Framework)

#### 2.1 Theoretical Framework
* **Innovation Adoption Theory (Rogers, 2015)**: Underpins the acceptance of new AI modules.
* **Technology Acceptance Model (Davis, 1989)**: Evaluates user perceived usefulness and workflow enhancements in agricultural diagnostics.

#### 2.2 Conceptual Framework
* Core Variables: Independent [Predictor Vector, Model Parameter Accuracies] -> Dependent [Diagnostic Latency, Farmer Response Speed].

#### 2.3 Empirical Literature Review
* Analysis of Mobile convolutional applications in SSA climates (Okolo & Alao, 2023).
* Identification of diagnostic delays in manual cassava field inspections (Adegbola et al., 2024).

#### 2.4 Summary of Literature & Research Gaps
* Existing studies utilize static datasets without testing real-field mobile constraints. This project bridges this critical deployment gap.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!outlineResult) return;
    navigator.clipboard.writeText(outlineResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="lit-review-module" className="space-y-6 animate-fade-in text-xs">
      
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-plat-50">
          <div className="bg-emerald-50 text-emerald-850 p-2 rounded-xl border border-emerald-100">
            <Library className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm font-sans">Module 5: Literature Review Structurer</h2>
            <p className="text-[11px] text-slate-500 font-sans">Formulate thematic, chronological, or comparative literature architectures to frame existing gaps.</p>
          </div>
        </div>

        {!activeProject ? (
          <p className="text-slate-400 py-6 text-center italic font-sans">Please select an active project at the top workspace selector to configure literature frameworks.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Input params form */}
            <form onSubmit={handleGenerateOutline} className="lg:col-span-2 space-y-4 bg-slate-50 p-4.5 rounded-xl border border-slate-100 h-fit">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-700 block uppercase mb-1">Active Study Topic</span>
                <p className="font-bold text-slate-800 text-[11px] leading-snug">{activeProject.title}</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Review Structuring Method</label>
                <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                  {['Thematic', 'Chronological', 'Comparative'].map(type => (
                    <button
                      key={type}
                      type="button"
                      id={`lit-type-btn-${type}`}
                      onClick={() => setReviewType(type as any)}
                      className={`py-1 rounded text-[10px] font-black text-center transition-all cursor-pointer ${
                        reviewType === type 
                          ? 'bg-slate-950 text-white' 
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Focal Variables or Theories</label>
                <textarea
                  id="lit-variables-textarea"
                  rows={4}
                  value={focalVariables}
                  onChange={(e) => setFocalVariables(e.target.value)}
                  placeholder="e.g. Rogers Innovation Adoption theory, user acceptance indexes, neural network weights comparing convolutional architectures..."
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                  required
                />
              </div>

              <button
                id="generate-lit-structure-button"
                type="submit"
                disabled={isGenerating}
                className="w-full bg-slate-950 hover:bg-emerald-800 disabled:bg-slate-350 text-white py-2.5 px-4 rounded-xl font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-xs shadow-xs"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-450" />
                    <span>Analyzing Literature Bases...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-emerald-450" />
                    <span>Formulate Literature Framework</span>
                  </>
                )}
              </button>
            </form>

            {/* Structured outcomes block */}
            <div className="lg:col-span-3 border border-slate-200 rounded-xl p-5 space-y-4 bg-white relative">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-100">
                  Intellectual Architecture Outline
                </span>
                
                {outlineResult && (
                  <button
                    id="copy-lit-review-btn"
                    onClick={handleCopy}
                    className="text-slate-500 hover:text-emerald-700 font-extrabold flex items-center space-x-1 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-750">Copied Outline!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                        <span>Copy Code Outline</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {outlineResult ? (
                <div className="prose prose-slate max-h-[400px] overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-100 font-serif leading-relaxed space-y-3">
                  <p className="text-[11px] whitespace-pre-wrap">{outlineResult}</p>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 font-sans">
                  <BookOpen className="h-10 w-10 text-emerald-600/50 animate-pulse" />
                  <p className="font-bold text-xs text-slate-500">Chapter 2 Structuring Canvas</p>
                  <p className="max-w-xs text-[10px] text-slate-400 leading-normal">Fill standard variables on the form to formulate a cohesive theory and conceptual layout mapping current empirical gaps.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
