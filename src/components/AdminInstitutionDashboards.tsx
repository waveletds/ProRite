import React from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  GitBranch, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Coins 
} from 'lucide-react';
import { UserProfile, AcademicProject } from '../types';

interface AdminInstitutionDashboardsProps {
  user: UserProfile;
  projects: AcademicProject[];
}

export default function AdminInstitutionDashboards({
  user,
  projects
}: AdminInstitutionDashboardsProps) {
  return (
    <div id="admin-institution-dashboard" className="space-y-6 animate-fade-in text-xs font-sans">
      
      {/* Overview stats layout */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { title: 'Registered Students', value: '47,219', icon: Users, change: '+14% this semester' },
          { title: 'Documents Formulated', value: '521,410', icon: BookOpen, change: '+8,204 weekly' },
          { title: 'Partner Institutions', value: '114', icon: TrendingUp, change: '12 pending enrollment' },
          { title: 'Active Assistant Queries', value: '19.4m', icon: Cpu, change: '99.8% service uptime' }
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{stat.title}</span>
                <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <Icon className="h-4 w-4 text-emerald-750" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <span className="text-[9.5px] text-emerald-805 font-bold">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Module 19: University Dashboard */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Institution Monitoring (Module 19)</h3>
              <p className="text-[11px] text-slate-500">Aggregate metrics matching: <strong>{user.institution}</strong> faculty catalogs.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Oyo Cooperative Research Submissions', value: '82%', target: '90%', status: 'Active' },
              { label: 'Computer Science Visual Leaf Diagnostic papers', value: '94%', target: '94%', status: 'Complete' },
              { label: 'School of Accounting Corporate Audits review', value: '64%', target: '80%', status: 'Revision Phase' }
            ].map(row => (
              <div key={row.label} className="bg-slate-50/60 border border-slate-100 p-3 rounded-xl flex justify-between gap-4 text-xs">
                <div className="space-y-0.5 flex-1">
                  <p className="font-bold text-slate-805">{row.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Compliance score: <span className="font-bold text-slate-600">{row.value}</span> / Institutional expectation: {row.target}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    row.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                      : row.status === 'Complete' 
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 20: Administrator Controller Gate */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm">System Admin Guard (Module 20)</h3>
            <p className="text-[11px] text-slate-500">System metrics configuration panel.</p>
          </div>

          <div className="space-y-4 font-sans">
            
            {/* API parameters */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-1.5 text-slate-800 font-extrabold">
                <Cpu className="h-4.5 w-4.5 text-emerald-700 font-extrabold" />
                <span>Active Gemini LLM Models:</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 text-[10.5px] font-medium">
                <li className="flex justify-between border-b pb-1 border-slate-150">
                  <span>Standard Model:</span>
                  <span className="font-bold text-slate-900 text-xs">gemini-2.5-flash</span>
                </li>
                <li className="flex justify-between border-b pb-1 border-slate-150">
                  <span>Deep Reasoning Model:</span>
                  <span className="font-bold text-slate-900 text-xs">gemini-2.5-pro</span>
                </li>
                <li className="flex justify-between">
                  <span>Server Ingress Route:</span>
                  <span className="font-mono text-emerald-800 font-bold">/api/gemini/chapter</span>
                </li>
              </ul>
            </div>

            {/* Billing indicators */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-1.5 text-slate-800 font-extrabold">
                <Coins className="h-4.5 w-4.5 text-emerald-700" />
                <span>Payment Gateways Integration</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-600">
                <div className="bg-white p-2 border border-slate-150 rounded">
                  <span className="text-slate-950 font-black">Paystack</span>
                  <p className="text-[9px] text-emerald-800 mt-1 font-bold">Active</p>
                </div>
                <div className="bg-white p-2 border border-slate-150 rounded">
                  <span className="text-emerald-800 font-black">Flutterwave</span>
                  <p className="text-[9px] text-emerald-800 mt-1 font-bold">Active</p>
                </div>
                <div className="bg-white p-2 border border-slate-150 rounded">
                  <span className="text-slate-950 font-black">Monnify</span>
                  <p className="text-[9px] text-emerald-805 mt-1 font-bold">Active</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
