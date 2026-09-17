"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  BarChart2, 
  Brain, 
  Users, 
  ShieldCheck, 
  LifeBuoy, 
  Bell, 
  ChevronDown,
  Menu,
  X,
  CreditCard,
  FileText,
  LogOut,
  Trash2,
  AlertTriangle,
  Loader2,
  Mail
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreditDetails } from '../../hooks/useCreditDetails';
import InvitationInterceptModal from './InvitationInterceptModal';
import AuthLayout from "@/app/dashboard-layout";
import { logoutRequest, deleteAccountRequest } from '../services/authService';

import termsData from '../../utils/terms_and_conditions.json';
import privacyData from '../../utils/privacy_policy.json';

// --- SKELETON LOADERS ---

function SidebarSkeleton() {
  return (
    <div className="flex flex-col justify-between h-full w-full animate-pulse">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2 h-16">
          <div className="h-8 w-8 bg-[#3A3A3A] rounded-xs shrink-0" />
          <div className="h-5 w-28 bg-[#3A3A3A] rounded-xs" />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-full bg-[#333333] rounded-xs" />
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-3 w-16 bg-[#3A3A3A] rounded-xs mx-3 mb-2" />
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-8 w-full bg-[#333333] rounded-xs" />
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-3 w-16 bg-[#3A3A3A] rounded-xs mx-3 mb-2" />
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-8 w-full bg-[#333333] rounded-xs" />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-4">
        <div className="h-10 w-full bg-[#333333] rounded-xs" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 w-full bg-[#333333] rounded-xs" />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <header className="h-14 w-full px-8 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.25)] bg-[#292929] sticky top-0 z-10 shrink-0 animate-pulse">
      <div className="h-6 w-6 bg-[#3A3A3A] rounded-xs lg:hidden" />
      <div className="flex items-center gap-4 shrink-0 ml-auto">
        <div className="h-4 w-4 bg-[#3A3A3A] rounded-xs" />
        <div className="flex items-center gap-2 pl-4">
          <div className="h-6 w-6 rounded-xs bg-[#3A3A3A]" />
          <div className="h-3 w-3 bg-[#3A3A3A] rounded-xs" />
        </div>
      </div>
    </header>
  );
}

// --- MAIN LAYOUT ---

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreditHovered, setIsCreditHovered] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal State Controls
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState(null);

  const dropdownRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const getCurrentWorkspace = useAuthStore((state) => state.getCurrentWorkspace);
  
  const currentWorkspace = getCurrentWorkspace();

  const termsList = Array.isArray(termsData) ? termsData : termsData?.sections || [];
  const privacyList = Array.isArray(privacyData) ? privacyData : privacyData?.sections || [];

  // Query credit balance using useCreditDetails hook
  const { 
    totalCredits: fetchedTotalCredits, 
    availableCredits, 
    isLoading: isBillingLoading 
  } = useCreditDetails();

  const isLoading = !user || !currentWorkspace || isBillingLoading;

  const billingPlan = currentWorkspace?.billingPlan || '';
  const subscriptionTier = currentWorkspace?.subscriptionTier || '';
  const isFreePlan = billingPlan === 'FREE_TIER' || subscriptionTier === 'FREE' || !currentWorkspace;
  
  const avatarUrl = user?.avatarUrl || "";
  const userName = user?.name || "User";

  const userInitials = userName
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || "US";

  const totalCredits = fetchedTotalCredits || 0; 
  const remainingCredits = availableCredits || 0;
  const remainingPercentage = totalCredits > 0 
    ? Math.min(100, Math.round((remainingCredits / totalCredits) * 100)) 
    : 0;

  const getActiveMenu = () => {
    if (pathname === '/dashboard' || pathname === '/dashboard/') return 'Home';
    if (pathname === '/dashboard/library') return 'Library';
    if (pathname === '/dashboard/analytics') return 'Analytics';
    if (pathname === '/dashboard/ai-assistant') return 'AI Assistant';
    if (pathname === '/dashboard/organization') return 'Organization';
    if (pathname === '/dashboard/billing') return 'Billing';
    if (pathname === '/dashboard/plans') return 'Subscriptions';
    return pathname.split('/').pop();
  };

  const [activeMenu, setActiveMenu] = useState(getActiveMenu());

  useEffect(() => {
    setActiveMenu(getActiveMenu());
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (name) => {
    setActiveMenu(name);
    setIsSidebarOpen(false);
    const routes = {
      'Home': '/dashboard',
      'Library': '/dashboard/library',
      'Analytics': '/dashboard/analytics',
      'AI Assistant': '/dashboard/ai-assistant',
      'Organization': '/dashboard/organization',
      'Billing': '/dashboard/billing',
      'Subscriptions': '/dashboard/plans',
    };
    if (routes[name]) {
      router.push(routes[name]);
    }
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    setIsProcessing(true);
    try {
      await logoutRequest();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (logout) {
        await logout();
      }
      setIsProcessing(false);
      router.push('/');
    }
  };

  const handleDeleteAccountConfirm = async () => {
    setShowDeleteModal(false);
    setIsDeletingAccount(true);
    setIsProcessing(true);
    try {
      await deleteAccountRequest();
      if (logout) {
        await logout();
      }
      router.push('/');
    } catch (error) {
      console.error('Account deletion error:', error);
      alert(error.message || 'Failed to delete account.');
    } finally {
      setIsDeletingAccount(false);
      setIsProcessing(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between px-2 h-16">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Axiorem Logo"
              height="32"
              width="32"
              className="shrink-0"
              style={{ objectFit: 'contain' }}
            />
            <span className="text-lg font-black tracking-wider text-white uppercase">
              Axiorem
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-xs hover:bg-[#3A3A3A] text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            {[
              { name: 'Home', icon: Home },
              { name: 'Library', icon: BookOpen },
              { name: 'Analytics', icon: BarChart2 },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xs text-[11px] font-bold uppercase tracking-wider transition-all ${
                  activeMenu === item.name 
                    ? 'bg-[#1b365d] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-[#3A3A3A]'
                }`}
              >
                <item.icon className="h-4 w-4 stroke-[2] shrink-0 text-white" />
                {item.name}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <span className="block px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Set Up</span>
            {[
              { name: 'AI Assistant', icon: Brain },
              { name: 'Organization', icon: Users },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xs text-[11px] font-bold uppercase tracking-wider transition-all ${
                  activeMenu === item.name 
                    ? 'bg-[#1b365d] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-[#3A3A3A]'
                }`}
              >
                <item.icon className="h-4 w-4 stroke-[2] shrink-0 text-white" />
                {item.name}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <span className="block px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Access</span>
            {[
              { name: 'Billing', icon: CreditCard },
              { name: 'Subscriptions', icon: CreditCard },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xs text-[11px] font-bold uppercase tracking-wider transition-all ${
                  activeMenu === item.name 
                    ? 'bg-[#1b365d] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-[#3A3A3A]'
                }`}
              >
                <item.icon className="h-4 w-4 stroke-[2] shrink-0 text-white" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-4">
        {isFreePlan ? (
          <div className="w-full flex flex-col gap-1.5 p-3 bg-[#1e1e1e] border border-[#333333] rounded-xs select-none text-[11px] font-bold text-slate-300">
            <span>Current Plan: Free Tier</span>
          </div>
        ) : (
          <div 
            onMouseEnter={() => setIsCreditHovered(true)}
            onMouseLeave={() => setIsCreditHovered(false)}
            className="flex flex-col gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 w-full cursor-default select-none mx-auto"
          >
            <div className="flex justify-between items-center">
              <span>Credits Remaining</span>
              <span className="font-mono text-white">
                {isCreditHovered ? `${remainingCredits}/${totalCredits} UTS` : `${remainingPercentage}%`}
              </span>
            </div>
            <div className="w-full bg-[#212121] h-1 rounded-xs overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-xs transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                style={{ width: `${remainingPercentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <button 
            onClick={() => {
              setIsSidebarOpen(false);
              setActiveLegalModal('privacy');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xs text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-[#3A3A3A] transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-white" />
            Privacy Policy
          </button>
          <button 
            onClick={() => {
              setIsSidebarOpen(false);
              setActiveLegalModal('terms');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xs text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-[#3A3A3A] transition-colors"
          >
            <FileText className="h-4 w-4 text-white" />
            Terms of Service
          </button>
          <button 
            onClick={() => {
              setIsSidebarOpen(false);
              setShowSupportModal(true);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xs text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-[#3A3A3A] transition-colors"
          >
            <LifeBuoy className="h-4 w-4 text-white" />
            Support
          </button>
        </div>
      </div>
    </>
  );

  return (
    <AuthLayout>
      <div className="flex h-screen w-full bg-[#292929] text-white font-sans antialiased overflow-hidden relative">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <aside className={`fixed inset-y-0 left-0 w-64 h-full bg-[#292929] shadow-[4px_0_24px_rgba(0,0,0,0.3)] flex flex-col justify-between p-4 overflow-y-auto z-50 transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {isLoading ? <SidebarSkeleton /> : <SidebarContent />}
        </aside>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 h-full bg-[#292929] shadow-[4px_0_24px_rgba(0,0,0,0.2)] flex flex-col justify-between p-4 overflow-y-auto shrink-0 select-none z-0">
          {isLoading ? <SidebarSkeleton /> : <SidebarContent />}
        </aside>

        <main className="flex-1 h-full flex flex-col overflow-hidden">
          {isLoading ? (
            <HeaderSkeleton />
          ) : (
            <header className="h-14 w-full px-8 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.25)] bg-[#292929] sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-1.5 rounded-xs bg-[#3A3A3A] text-white shadow-md transition-colors"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <div className="relative" ref={dropdownRef}>
                  <div 
                    onClick={() => !isProcessing && setIsProfileDropdownOpen((prev) => !prev)}
                    className={`flex items-center gap-2 pl-4 cursor-pointer group ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="h-6 w-6 rounded-xs bg-[#3A3A3A] overflow-hidden flex items-center justify-center font-mono font-bold text-[10px] text-white shadow-md border border-[#4A4A4A] select-none relative">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt={userName} 
                          className="h-full w-full object-cover block"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="tracking-tighter text-slate-200 group-hover:text-white transition-colors">
                          {userInitials}
                        </span>
                      )}
                    </div>
                    <ChevronDown className={`h-3 w-3 text-slate-400 group-hover:text-white transition-transform duration-150 ${
                      isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`} />
                  </div>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-[#3A3A3A] rounded-sm shadow-xl py-1 z-[9999] uppercase tracking-wider text-xs font-medium block">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setShowLogoutModal(true);
                        }}
                        disabled={isProcessing}
                        className="w-full px-3 py-2 flex items-center gap-2.5 text-white hover:bg-slate-600 transition-colors text-left disabled:opacity-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-white shrink-0" />
                        <span>Log Out</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setShowDeleteModal(true);
                        }}
                        disabled={isProcessing}
                        className="w-full px-3 py-2 flex items-center gap-2.5 text-rose-400 hover:bg-slate-600 hover:text-rose-300 transition-colors text-left disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>
          )}

          <div className="flex-1 overflow-auto bg-[#292929]">
            {children}
          </div>
        </main>

        <Suspense fallback={null}>
          <InvitationInterceptModal />
        </Suspense>

        {/* --- MODALS --- */}

        {/* SUPPORT MODAL */}
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#2A2A2A] border border-slate-700 rounded-sm shadow-2xl overflow-hidden text-white antialiased">
              <div className=" px-5 py-4  flex items-center justify-between">
                <div className="flex items-center gap-2">
                 
                  <span className="text-xs font-bold tracking-widest text-slate-200 uppercase">
                    Support Channels
                  </span>
                </div>
                <button 
                  onClick={() => setShowSupportModal(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-xs text-slate-300">
                <div className="space-y-2  p-4 rounded-sm ">
                  <div className="flex items-center gap-2 text-slate-100 font-bold uppercase tracking-wider text-[11px]">
                    
                    <span>Technical & Product Support</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    Got an issue with the app, found a bug, or have a feature request? Reach out to us at:
                  </p>
                  <a 
                    href="mailto:support@axioremapp.com" 
                    className="inline-flex items-center gap-1.5 pt-1 text-blue-400 hover:text-blue-300 font-mono text-xs underline underline-offset-2 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    support@axioremapp.com
                  </a>
                </div>

                <div className="space-y-2  p-4 rounded-sm ">
                  <div className="flex items-center gap-2 text-slate-100 font-bold uppercase tracking-wider text-[11px]">
                    
                    <span>Sales & Billing Inquiries</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    Have questions about plans, credit allocations, enterprise tiers, or custom billing? Contact sales at:
                  </p>
                  <a 
                    href="mailto:sales@axioremapp.com" 
                    className="inline-flex items-center gap-1.5 pt-1 text-blue-400 hover:text-blue-300 font-mono text-xs underline underline-offset-2 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    sales@axioremapp.com
                  </a>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-700/60 bg-[#212121] flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#1b365d] hover:bg-[#24477a] rounded-sm border border-blue-400 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LEGAL DOCUMENT MODAL (TnC / PP) */}
        {activeLegalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-3xl bg-[#2A2A2A] border border-slate-700 rounded-sm shadow-2xl overflow-hidden text-white antialiased flex flex-col max-h-[85vh]">
              <div className="bg-[#212121] px-6 py-4 border-b border-slate-700/60 flex items-center justify-between shrink-0">
                <span className="text-sm font-bold tracking-widest text-slate-200 uppercase">
                  {activeLegalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                </span>
                <button 
                  onClick={() => setActiveLegalModal(null)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] text-slate-300 text-xs sm:text-sm leading-relaxed home-scrollbar">
                {(activeLegalModal === 'terms' ? termsList : privacyList).map((item, index) => (
                  <div key={item.id || index} className="space-y-2">
                    {item.title && (
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 mt-2">
                        {item.number ? `${item.number}. ${item.title}` : item.title}
                      </h3>
                    )}
                    {Array.isArray(item.paragraphs) ? (
                      item.paragraphs.map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))
                    ) : (
                      <p>{typeof item.paragraphs === 'string' ? item.paragraphs : item.content || item.description || item.text || ''}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-slate-700/60 bg-[#212121] flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveLegalModal(null)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#1b365d] hover:bg-[#24477a] rounded-sm border border-blue-400 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOGOUT CONFIRMATION MODAL */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[#2A2A2A] border border-slate-700 rounded-sm shadow-2xl overflow-hidden text-white antialiased">
              <div className="bg-[#212121] px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Confirm Logout
                </span>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Are you sure you want to log out of your session?
                </p>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(false)}
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-transparent hover:bg-white/10 rounded-sm border border-slate-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLogoutConfirm}
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#1b365d] hover:bg-[#24477a] rounded-sm border border-blue-400 transition-colors cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE ACCOUNT CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[#2A2A2A] border border-slate-700 rounded-sm shadow-2xl overflow-hidden text-white antialiased">
              <div className="bg-[#212121] px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-bold tracking-widest text-rose-400 uppercase">
                    Delete Account
                  </span>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  This action is permanent. All your workspace data, configurations, and history will be completely erased.
                </p>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-transparent hover:bg-white/10 rounded-sm border border-slate-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccountConfirm}
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 rounded-sm border border-rose-500 transition-colors cursor-pointer"
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETING ACCOUNT LOADING MODAL */}
        {isDeletingAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-sm bg-[#2A2A2A] border border-slate-700 rounded-sm shadow-2xl p-6 text-center space-y-4 text-white antialiased">
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Deleting User Account
                </h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Purging associated resources and terminating session...
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  );
}