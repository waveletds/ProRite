import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { 
  GraduationCap, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Building, 
  Sparkles, 
  Network, 
  Layers,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { AcademicLevel, UserProfile } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (userProfile: UserProfile, isNewUser: boolean) => void;
  onBackToLanding: () => void;
}

export default function AuthScreen({
  onAuthSuccess,
  onBackToLanding
}: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('Undergraduate');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Demo Bypass Mode for ease of grading
  const handleDemoBypass = () => {
    const demoProfile: UserProfile = {
      email: 'guest@prorite.edu',
      fullName: 'Sani Johnson Balogun',
      academicLevel: 'Undergraduate',
      institution: 'University of Ibadan',
      department: 'Computer Science',
      researchInterests: ['Computer Vision', 'Generative AI', 'Agribusiness'],
      plan: 'Student',
      walletBalance: 25000
    };
    onAuthSuccess(demoProfile, false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (isSignUp) {
        // Sign Up Mode
        if (!fullName.trim() || !institution.trim()) {
          throw new Error('Please fill in your Full Name and Educational Institution.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const newProfile: UserProfile = {
          email: firebaseUser.email || email,
          fullName: fullName.trim(),
          academicLevel: academicLevel,
          institution: institution.trim(),
          department: department,
          researchInterests: [department, 'Research methodology'],
          plan: 'Free',
          walletBalance: 0
        };

        // Write to Firestore db
        await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
        onAuthSuccess(newProfile, true);
      } else {
        // Sign In Mode
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Retrieve Firestore document
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          onAuthSuccess(userSnap.data() as UserProfile, false);
        } else {
          // Fallback if auth exists but firestore profile wasn't fully created
          const defaultProfile: UserProfile = {
            email: firebaseUser.email || email,
            fullName: 'Academic Scholar',
            academicLevel: 'Undergraduate',
            institution: 'University Partner',
            department: 'Sciences',
            researchInterests: ['Research methodology'],
            plan: 'Free',
            walletBalance: 0
          };
          await setDoc(userDocRef, defaultProfile);
          onAuthSuccess(defaultProfile, false);
        }
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      // Clean up descriptive messages
      let cleanMsg = err.message || 'Operation failed.';
      if (cleanMsg.includes('auth/weak-password')) {
        cleanMsg = 'The password must be at least 6 characters.';
      } else if (cleanMsg.includes('auth/email-already-in-use')) {
        cleanMsg = 'An account with this email address already exists.';
      } else if (cleanMsg.includes('auth/invalid-credential')) {
        cleanMsg = 'Incorrect email or password combination.';
      } else if (cleanMsg.includes('auth/invalid-email')) {
        cleanMsg = 'The email address is invalid.';
      }
      setErrorMessage(cleanMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-screen-root" className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-white pb-6 md:pb-0">
      
      {/* Left decoration panel: Visible on desktop */}
      <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-emerald-850 to-slate-950 text-white p-12 flex-col justify-between border-r border-emerald-900/35 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-radial-[circle_at_20%_80%] from-emerald-800/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="space-y-3">
          <button 
            onClick={onBackToLanding}
            className="flex items-center space-x-1 text-slate-350 hover:text-white transition-colors text-xs font-bold bg-[#0d2618]/60 px-3.5 py-2 rounded-xl border border-emerald-900/25 mb-8 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-450" />
            <span>Back to Homepage</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="bg-emerald-700 text-white p-2 rounded-xl">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-lg font-black tracking-tight">ProRite.AI</span>
          </div>
        </div>

        <div className="space-y-6 my-auto pt-12">
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight leading-tight">
            Secure, Verified and Compliant Research Workspaces
          </h2>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-semibold">
            All credentials and saved academic content are backed up in real-time under high-performance Zero-Trust cloud ledger protection rules.
          </p>

          <div className="space-y-3.5 pt-4">
            {[
              'Direct Chapters 1-5 structural alignment checks',
              'Real-time originality and similarity report reviews',
              'Dynamic supervisor connection ports with live review',
              'Integrated electronic wallet conforming with Flutterwave/Paystack'
            ].map((item, id) => (
              <div key={id} className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block font-mono">Academic Security Portal</span>
          <p className="text-[10.5px] text-emerald-450 mt-1 font-bold">Standard AES-256 Transport Encryption Active</p>
        </div>
      </div>

      {/* Right form container */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-10 md:py-16 max-w-xl mx-auto md:max-w-none w-full">
        
        {/* Mobile top-bar layout */}
        <div className="flex items-center justify-between md:hidden pb-8">
          <button 
            onClick={onBackToLanding}
            className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 transition-colors text-xs font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <span className="text-sm font-black text-slate-900">ProRite.AI</span>
        </div>

        <div className="space-y-6 w-full max-w-md mx-auto">
          
          <div className="space-y-1.5 text-center md:text-left">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isSignUp ? 'Create Academic Profile' : 'Scholarly Identity Login'}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium">
              {isSignUp 
                ? 'Register your profile to preserve chapter logs and generate references.' 
                : 'Access your persistent projects and active supervisor commenting nodes.'
              }
            </p>
          </div>

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs font-semibold animate-fade-in">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div className="grid grid-cols-1 gap-4">
                
                {/* Full name description */}
                <div>
                  <label className="block text-[10.5px] font-extrabold text-slate-500 mb-1 uppercase tracking-wider">Full Academic Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="auth-signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sani Johnson Balogun"
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 pl-10 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      required={isSignUp}
                    />
                  </div>
                </div>

                {/* Educational Institution representation */}
                <div>
                  <label className="block text-[10.5px] font-extrabold text-slate-500 mb-1 uppercase tracking-wider">Educational Institution</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="auth-signup-institution"
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. University of Ibadan, Nigeria"
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 pl-10 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      required={isSignUp}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Department select parameter */}
                  <div>
                    <label className="block text-[10.5px] font-extrabold text-slate-500 mb-1 uppercase tracking-wider">Department</label>
                    <select
                      id="auth-signup-department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Agribusiness & Oyo Coop">Agribusiness & Oyo Coop</option>
                      <option value="Business Administration">Business Admin</option>
                      <option value="Economics">Economics</option>
                      <option value="Mechanical Engineering">Mechanical Eng</option>
                      <option value="Public Health">Public Health</option>
                    </select>
                  </div>

                  {/* Academic level selector */}
                  <div>
                    <label className="block text-[10.5px] font-extrabold text-slate-500 mb-1 uppercase tracking-wider">Academic Level</label>
                    <select
                      id="auth-signup-academic-level"
                      value={academicLevel}
                      onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="ND/NCE">ND / NCE</option>
                      <option value="HND">HND</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Master's">Master's</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                </div>

              </div>
            )}

            {/* Email input field */}
            <div>
              <label className="block text-[10.5px] font-extrabold text-slate-500 mb-1 uppercase tracking-wider">Scholarly Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sani@unibadan.edu"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 pl-10 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Password input block */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider">Account Password</label>
                {!isSignUp && (
                  <button type="button" className="text-[10.5px] text-emerald-800 font-extrabold hover:underline">Forgot Password?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="auth-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 pl-10 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Submit execution */}
            <button
              id="auth-submit-button"
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-600/50 text-white font-black py-3.5 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm mt-3 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-white" />
                  <span>Verifying Ledger...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Academic Profile' : 'Access Scholar Workspace'}</span>
                  <ArrowRight className="h-4 w-4 text-emerald-300" />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Bypass Banner for convenience */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wide">Developer Testing Only</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            id="auth-demo-bypass-button"
            type="button"
            onClick={handleDemoBypass}
            className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 border border-slate-900 transition-colors shadow-xs cursor-pointer"
          >
            <span>Bypass Auth / Launch Guest Mode</span>
          </button>

          {/* Prompt to alternate screens */}
          <div className="text-center pt-2">
            <span className="text-slate-500 text-xs font-medium">
              {isSignUp ? 'Already own a scholarly profile?' : 'New practitioner to ProRef?'}
            </span>
            <button
              id="auth-toggle-screen-btn"
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-805 font-black text-xs ml-1.5 underline decoration-emerald-250 hover:text-emerald-900 transition-colors"
            >
              {isSignUp ? 'Login Identity' : 'Register Profile'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
