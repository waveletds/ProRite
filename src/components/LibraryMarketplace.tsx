import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Wallet, 
  CreditCard, 
  Check, 
  Sparkles, 
  Award, 
  Building, 
  Users, 
  Download,
  DollarSign,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { UserProfile, MarketplaceTemplate, WalletTransaction } from '../types';
import { MARKETPLACE_TEMPLATES } from '../mockData';

interface LibraryMarketplaceProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onAddTransaction: (tx: WalletTransaction) => void;
}

export default function LibraryMarketplace({
  user,
  onUpdateUser,
  onAddTransaction
}: LibraryMarketplaceProps) {
  const [fundingAmount, setFundingAmount] = useState('5000');
  const [selectedGateway, setSelectedGateway] = useState<'Paystack' | 'Monnify' | 'Flutterwave'>('Flutterwave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutTemplate, setCheckoutTemplate] = useState<MarketplaceTemplate | null>(null);

  // Success and Error banner messages
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setErrorBanner(null);
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  const showError = (msg: string) => {
    setSuccessBanner(null);
    setErrorBanner(msg);
    setTimeout(() => setErrorBanner(null), 6000);
  };

  // Fund Wallet Executor
  const handleFundWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(fundingAmount);
    if (isNaN(amt) || amt <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const updatedUser = { ...user, walletBalance: user.walletBalance + amt };
      onUpdateUser(updatedUser);

      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'credit',
        amount: amt,
        purpose: `Wallet funding via ${selectedGateway} gateway`,
        date: new Date().toISOString().substring(0, 16).replace('T', ' '),
        gateway: selectedGateway
      };
      onAddTransaction(newTx);
      
      setIsProcessing(false);
      setFundingAmount('5000');
      showSuccess(`Successfully added ₦${amt.toLocaleString()} to your academic wallet!`);
    }, 1200);
  };

  // Buy template executor
  const handleBuyTemplate = (tpl: MarketplaceTemplate) => {
    if (user.walletBalance < tpl.price) {
      showError(`Insufficient funds. Please fund your wallet with at least ₦${(tpl.price - user.walletBalance).toLocaleString()} via Flutterwave/Paystack to purchase this template.`);
      return;
    }

    const updatedUser = { ...user, walletBalance: user.walletBalance - tpl.price };
    onUpdateUser(updatedUser);

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'debit',
      amount: tpl.price,
      purpose: `Purchased Template: "${tpl.title}"`,
      date: new Date().toISOString().substring(0, 16).replace('T', ' ')
    };
    onAddTransaction(newTx);
    showSuccess(`Thank you! "${tpl.title}" has been successfully purchased and downloaded into your drafts catalogue.`);
  };

  // Upgrade Plan executor
  const handleUpgradePlan = (plan: 'Student' | 'Researcher' | 'Institution', cost: number) => {
    if (user.plan === plan) {
      showError(`You are already subscribed to the ${plan} Plan!`);
      return;
    }
    if (user.walletBalance < cost) {
      showError(`Insufficient funds. Your wallet balance is ₦${user.walletBalance.toLocaleString()}. Please credit your account with ₦${(cost - user.walletBalance).toLocaleString()} to proceed.`);
      return;
    }

    const updatedUser = { ...user, plan: plan, walletBalance: user.walletBalance - cost };
    onUpdateUser(updatedUser);

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'debit',
      amount: cost,
      purpose: `Upgraded subscription to: "${plan} Plan"`,
      date: new Date().toISOString().substring(0, 16).replace('T', ' ')
    };
    onAddTransaction(newTx);
    showSuccess(`Success! Your account is now upgraded to the premium ${plan} Plan. Expanded research modules are unlocked!`);
  };

  return (
    <div id="marketplace-billing-module" className="space-y-8 animate-fade-in text-xs font-sans">
      
      {/* Inline Notifications */}
      {successBanner && (
        <div className="bg-emerald-50 text-emerald-850 p-4 rounded-xl border border-emerald-100 flex items-start space-x-2.5 animate-fade-in">
          <Check className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <p className="font-bold text-xs leading-relaxed">{successBanner}</p>
        </div>
      )}

      {errorBanner && (
        <div className="bg-rose-50 text-rose-850 p-4 rounded-xl border border-rose-100 flex items-start space-x-2.5 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="font-bold text-xs leading-relaxed">{errorBanner}</p>
        </div>
      )}

      {/* Wallet overview & Crediting Forms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Wallet Balance ledger card */}
        <div className="bg-gradient-to-br from-emerald-850 to-slate-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between border border-emerald-905/35">
          <div className="space-y-1">
            <span className="text-[10px] text-emerald-300 font-extrabold uppercase tracking-widest block font-mono">ProRite Academic Wallet</span>
            <div className="flex items-baseline space-x-1 mt-1.5">
              <span className="text-xl font-extrabold text-emerald-400">₦</span>
              <span className="text-3xl font-black font-mono tracking-tight text-white">{user.walletBalance.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="pt-6 border-t border-emerald-900/40 mt-4 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-emerald-400 block uppercase font-bold text-[9.5px]">Active Tier</span>
              <p className="font-black text-xs">{user.plan} Account</p>
            </div>
            <div className="bg-[#0c2417] text-emerald-300 p-2.5 rounded-xl border border-emerald-900/60">
              <Wallet className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Instantly Fund Wallet module */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm md:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-850 text-sm flex items-center space-x-1.5">
            <CreditCard className="h-4 w-4 text-emerald-705" />
            <span>Fund Wallet via Instant Checkout</span>
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">Fund your account instantly using safe local processing options conforming with Paystack, Monnify and Flutterwave cards.</p>

          <form onSubmit={handleFundWallet} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Amount to Add (NGN)</label>
              <input
                id="wallet-funding-amount-input"
                type="number"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                placeholder="5000"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Payment Gateway Provider</label>
              <select
                id="payment-gateway-select"
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Flutterwave">Flutterwave Core Processing</option>
                <option value="Paystack">Paystack Payments API</option>
                <option value="Monnify">Monnify Transfer SDK</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                id="submit-wallet-funding-button"
                type="submit"
                disabled={isProcessing}
                className="w-full bg-slate-950 hover:bg-emerald-850 disabled:bg-slate-300 text-white p-2 text-xs font-black rounded-lg cursor-pointer flex items-center justify-center space-x-1 transition-all h-9"
              >
                {isProcessing ? (
                  <span>Securing SDK...</span>
                ) : (
                  <>
                    <span>Credit Wallet</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-450" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

          {/* Subscription Pricing Models section */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-900 text-sm flex items-center space-x-1.5">
          <Award className="h-4.5 w-4.5 text-emerald-700" />
          <span>Membership & Premium Plans</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
          {[
            { 
              name: 'Free Plan', 
              price: 0, 
              desc: 'Limited AI questions and simple word counts reviews.',
              highlights: ['Max 3 developed subjects', 'Standard citation formatting', 'Non-custom cover parameters'],
              action: () => showSuccess('You are on the standard Free tier by default as a guest user.')
            },
            { 
              name: 'Student Plan', 
              price: 5000, 
              desc: 'Full project draft and automatic reference generator tools.',
              highlights: ['Unlimited subject formulations', 'Full Chapter 1-5 support', 'Unlock APA/MLA engines', 'Cover and list formatter'],
              action: () => handleUpgradePlan('Student', 5000)
            },
            { 
              name: 'Researcher Plan', 
              price: 15000, 
              desc: 'Deep analytical literature assessments and thesis writing.',
              highlights: ['Advanced thematic structures', 'Originality similarity index', 'Comprehensive citation gaps analysis', '24/7 supervisor comment nodes'],
              action: () => handleUpgradePlan('Researcher', 15000)
            },
            { 
              name: 'Institution Plan', 
              price: 85000, 
              desc: 'Multi-seat access mapping entire university campuses.',
              highlights: ['Unrestricted access seats', 'Custom departmental requirements', 'Campus-wide repository index', 'Full metrics dashboards'],
              action: () => handleUpgradePlan('Institution', 85000)
            }
          ].map(plan => {
            const isCurrent = user.plan === plan.name.split(' ')[0] || (user.plan === 'Student' && plan.name === 'Student Plan');
            return (
              <div 
                key={plan.name} 
                className={`bg-white border rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all ${
                  isCurrent 
                    ? 'border-emerald-600 ring-2 ring-emerald-50 bg-emerald-50/10' 
                    : 'border-slate-200/90'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-slate-900 text-xs">{plan.name}</h4>
                    {isCurrent && (
                      <span className="bg-emerald-50 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase border border-emerald-100">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="py-2">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-extrabold text-emerald-800 font-mono">₦</span>
                      <p className="text-3xl font-black font-mono tracking-tight text-slate-950">
                        {plan.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-0.5 font-bold">One-time / month</span>
                  </div>
                  <p className="text-[11px] text-slate-550 leading-normal font-semibold">{plan.desc}</p>
                  
                  <ul className="space-y-1.5 text-[10.5px] border-t border-slate-100 pt-3">
                    {plan.highlights.map((h, i) => (
                      <li key={i} className="flex items-center space-x-1 text-slate-600 font-medium">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  id={`upgrade-plan-btn-${plan.name.split(' ')[0]}`}
                  onClick={plan.action}
                  disabled={isCurrent}
                  className={`w-full text-xs font-black py-2.5 rounded-xl mt-5 transition-all cursor-pointer ${
                    isCurrent 
                      ? 'bg-emerald-50 text-emerald-800 cursor-not-allowed border border-emerald-200' 
                      : 'bg-slate-950 hover:bg-emerald-950/90 text-white shadow-xs'
                  }`}
                >
                  {isCurrent ? 'Active Plan' : `Get ${plan.name.split(' ')[0]}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project template Marketplace (Module 14) */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-900 text-sm flex items-center space-x-1.5">
          <ShoppingBag className="h-4.5 w-4.5 text-emerald-700 font-extrabold" />
          <span>Academic Document Marketplace</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MARKETPLACE_TEMPLATES.map(tpl => (
            <div key={tpl.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="bg-emerald-50 text-emerald-850 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-100">
                  {tpl.category}
                </span>
                <h4 className="font-bold text-slate-800 text-xs mt-2 leading-snug">{tpl.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{tpl.description}</p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-450 pt-1 font-semibold">
                  <span>Author: <strong className="font-extrabold text-slate-750">{tpl.author}</strong></span>
                  <span>•</span>
                  <span>Downloads: {tpl.downloads}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-baseline space-x-0.5">
                  <span className="text-[10px] font-bold text-emerald-800 font-mono">₦</span>
                  <span className="font-mono font-extrabold text-slate-950 text-xs tracking-tight">{tpl.price.toLocaleString()}</span>
                </div>
                <button
                  id={`purchase-tpl-btn-${tpl.id}`}
                  onClick={() => handleBuyTemplate(tpl)}
                  className="bg-slate-950 hover:bg-emerald-850 text-white font-black px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-all border border-slate-950 shadow-xs"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-450" />
                  <span>Buy Draft</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
