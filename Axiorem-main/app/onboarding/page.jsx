"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useAuthMutations } from '../../hooks/useAuthMutations';
import termsData from '../../utils/terms_and_conditions.json';
import privacyData from '../../utils/privacy_policy.json';

const ROLES = [
  {
    id: 'teacher',
    title: "I'm working as a teacher / professor",
    description: "Teaching and delivering academic materials within a school, university, or educational institution",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14v7" />
      </svg>
    )
  },
  {
    id: 'course-coordinator',
    title: "I'm working as an instructional designer / coordinator",
    description: "Managing course development, technical curriculum planning, and digital asset structures",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5a2 2 0 012-2h2a2 2 0 012 2v0a2 2 0 012 2h-2a2 2 0 00-2 2v0a2 2 0 01-2 2H9a2 2 0 01-2-2v0a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l2 2 4-4" />
      </svg>
    )
  },
  {
    id: 'operations-manager',
    title: "I'm an operations manager / director",
    description: "Converting facility manuals, standard operating procedures, and safety documentation into structured protocols",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17m0 0V4m0 0h4" />
      </svg>
    )
  },
  {
    id: 'compliance-officer',
    title: "I'm a compliance officer / legal auditor",
    description: "Evaluating regional regulatory guidelines, HIPAA/OSHA rules, and policy frameworks for liability mitigation",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    id: 'hr-training-manager',
    title: "I'm working as an HR / L&D manager",
    description: "Orchestrating internal workforce training programs, onboarding materials, and company handbook distributions",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'product-engineer',
    title: "I'm a product manager / technical engineer",
    description: "Simplifying complex technical product documentation, developer API specs, and maintenance guides",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    id: 'executive-leadership',
    title: "I'm an executive / board advisor",
    description: "Extracting core operational updates, financial positions, and policy metrics from complex business sheets",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    id: 'enterprise',
    title: "I am representing an enterprise organization",
    description: "Deploying multi-tier operational tracking, custom compliance assessments, and scalable team usage modules",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  // {
  //   id: 'candidate',
  //   title: "I'm a candidate / employee reviewer",
  //   description: "Accessing standard training verification tasks, localized checklists, or internal organization reviews",
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v12m0 0l-3-3m3 3l3-3" />
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  //     </svg>
  //   )
  // }
];

function OnboardingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const workspaceName = searchParams.get('workspaceName');

  const { checkIdentity, registerUser } = useAuthMutations();

  const [step, setStep] = useState(1); 
  const [selectedRole, setSelectedRole] = useState('teacher');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [onboardingData, setOnboardingData] = useState({
    oauthId: '',
    email: '',
    name: '',
    avatarUrl: '',
    occupationRole: 'teacher',
    termsAccepted: false,
    privacyAccepted: false,
    termsVersion: 'v2026.1.0',
    privacyVersion: 'v2026.1.0'
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const routeTerminalDestination = (userPayload) => {
    setStep(5);
    setShowWelcome(true);

    const queryParams = token ? `?token=${token}&workspaceName=${encodeURIComponent(workspaceName)}` : '';

    const targetRoute = userPayload?.occupationRole === 'candidate' 
      ? `/candidate-dashboard${queryParams}` 
      : `/dashboard${queryParams}`;

    setTimeout(() => { window.location.href = targetRoute; }, 2500);
  };

  const handleGoogleLogin = () => {
    if (!window.google) return;

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope: 'email profile openid',
      ux_mode: 'popup',
      redirect_uri: 'postmessage',
      callback: async (response) => {
        if (response.code) {
          setErrorMessage('');

          checkIdentity.mutate(response.code, {
            onSuccess: (data) => {
              if (data.isExistingUser && data.payload?.user) {
                routeTerminalDestination(data.payload.user);
              } else if (data.verifiedPayload) {
                setOnboardingData(prev => ({
                  ...prev,
                  oauthId: data.verifiedPayload.oauthId,
                  email: data.verifiedPayload.email,
                  name: data.verifiedPayload.name,
                  avatarUrl: data.verifiedPayload.avatarUrl
                }));
                setStep(2);
              } else {
                setErrorMessage('Identity mapping context generation missing.');
              }
            },
            onError: (err) => {
              setErrorMessage(err.message || 'Identity verification failure.');
            }
          });
        }
      },
    });

    client.requestCode();
  };

  const handleRoleSelectionSubmit = () => {
    setOnboardingData(prev => ({ ...prev, occupationRole: selectedRole }));
    setStep(3);
  };

  const handleTermsAccept = () => {
    setOnboardingData(prev => ({ ...prev, termsAccepted: true }));
    setStep(4);
  };

  const handlePrivacyAccept = () => {
    setErrorMessage('');

    if (!onboardingData.oauthId) {
      setErrorMessage('Identity context expired. Restart authentication flow.');
      setStep(1);
      return;
    }

    const finalPayload = {
      ...onboardingData,
      privacyAccepted: true
    };

    registerUser.mutate(finalPayload, {
      onSuccess: (data) => {
        const verifiedUser = data?.payload?.user || finalPayload;
        routeTerminalDestination(verifiedUser);
      },
      onError: (err) => {
        setErrorMessage(err.message || 'Identity processing transaction failure.');
      }
    });
  };

  const currentRole = ROLES.find(r => r.id === selectedRole) || ROLES[0];
  const isSubmitting = registerUser.isPending || checkIdentity.isPending;

  const termsList = Array.isArray(termsData) ? termsData : termsData?.sections || [];
  const privacyList = Array.isArray(privacyData) ? privacyData : privacyData?.sections || [];

  if (step === 5) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#292929] font-sans antialiased transition-opacity duration-500 ${showWelcome ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
          <h1 className="text-[32px] font-normal tracking-tight text-white">Welcome to</h1>
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg">
              <img 
                src="/logo.png" 
                alt="Axiorem Brand Mark" 
                className="h-10 w-10 object-contain" 
              />
            </div>
            <span className="text-[36px] tracking-tight text-white" style={{ fontFamily: "Figtree", fontWeight: "700" }}>Axiorem</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans antialiased overflow-x-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 w-full h-full z-0 bg-[#292929]">
        {(step === 1 || step === 2) && (
          <img src={`/backgrounds/bg_${step}.png`} alt="Background" className="w-full h-full object-cover opacity-20" />
        )}
        {(step === 3 || step === 4) && (
          <img src="/backgrounds/bg_2.png" alt="Background" className="w-full h-full object-cover opacity-15 filter blur-sm" />
        )}
      </div>

      <div className="relative z-10 w-full min-h-screen flex lg:flex-row flex-col justify-between items-center">
        
        {/* Left Panel: Form Container */}
        <div className="relative w-full max-w-xl mx-4 my-6 p-6 sm:p-10 lg:m-0 lg:p-12 md:p-20 lg:w-[50%] lg:max-w-none lg:min-h-screen bg-[#292929] lg:rounded-none rounded-2xl shadow-2xl lg:shadow-none flex flex-col justify-between space-y-8 overflow-y-auto max-h-[92vh] lg:max-h-none text-white">

          <div className="flex items-center gap-2">
            <button className="flex items-center text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-200">
              <img src="/logo.png" alt="Axiorem Logo" height="32" width="32" className="mr-2" style={{ objectFit: 'contain' }} />
              <span style={{ fontFamily: "Figtree", fontWeight: "800" }}>Axiorem</span>
            </button>
          </div>

          {(errorMessage || checkIdentity.isError || registerUser.isError) && (
            <div className="p-3 text-xs bg-red-500/20 border border-red-500/50 rounded text-red-200">
              {errorMessage || checkIdentity.error?.message || registerUser.error?.message}
            </div>
          )}

          {step === 1 && (
            <div className="w-full space-y-6 py-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Log in to your Account</h1>
                <p className="text-sm text-slate-400">Welcome back! Select method to log in:</p>
              </div>

              {token && workspaceName && (
                <div className="p-3.5 rounded-lg border border-blue-500/30 bg-[#1b365d]/20 text-left animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="block text-[10px] font-bold tracking-widest text-blue-400 uppercase">Pending Invitation Context</span>
                  <p className="text-xs text-slate-300 mt-1 leading-normal">
                    Authenticate to securely register membership authorization details for workspace: <strong className="text-blue-300">{decodeURIComponent(workspaceName)}</strong>
                  </p>
                </div>
              )}

              <button
                onClick={handleGoogleLogin}
                disabled={!gsiLoaded || isSubmitting}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-[#3A3A3A] px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-600 w-full disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span>{isSubmitting ? 'Verifying...' : gsiLoaded ? 'Continue with Google' : 'Loading...'}</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="w-full space-y-6 py-4">
              <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Who are you</h1>
                <p className="text-sm text-slate-400">Before we begin, we need some small details.</p>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 p-4 bg-[#3A3A3A] border border-slate-600 rounded-sm hover:border-blue-500/80 transition-all text-left group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-1 text-blue-400 shrink-0 mt-0.5">{currentRole.icon}</div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold tracking-wider text-white uppercase group-hover:text-blue-200 transition-colors">{currentRole.title}</span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal truncate">{currentRole.description}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1.5 z-30 bg-[#2E2E2E] border border-slate-700 rounded-sm shadow-2xl max-h-[260px] overflow-y-auto divide-y divide-slate-700/60 home-scrollbar">
                    {ROLES.map((role) => (
                      <div
                        key={role.id}
                        onClick={() => { setSelectedRole(role.id); setIsDropdownOpen(false); }}
                        className={`flex items-start gap-3 p-3.5 cursor-pointer transition-colors ${selectedRole === role.id ? 'bg-[#1b365d]/40 border-l-2 border-blue-500' : 'hover:bg-slate-700/60 border-l-2 border-transparent'}`}
                      >
                        <div className={`p-1 shrink-0 mt-0.5 ${selectedRole === role.id ? 'text-blue-400' : 'text-slate-400'}`}>{role.icon}</div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold tracking-wider text-white uppercase">{role.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{role.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <button onClick={handleRoleSelectionSubmit} className="w-full bg-[#1b365d] hover:bg-[#2a4a7a] text-white py-3 rounded-sm font-bold transition-all shadow-lg shadow-[#1b365d]/20 text-sm tracking-wide uppercase">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="w-full flex flex-col space-y-5 py-2 animate-in fade-in duration-300">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white font-sans">Terms of Service</h1>
                <p className="text-xs text-slate-400 mt-1 font-medium">Updated September 2026</p>
              </div>
              <div className="w-full border-t border-slate-700/60 my-1"></div>
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 text-slate-300 text-xs sm:text-sm leading-relaxed home-scrollbar font-normal">
                {termsList.map((item, index) => (
                  <div key={item.id || index} className="space-y-2">
                    {item.title && (
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mt-2">
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
              <div className="pt-4 flex justify-end items-center">
                <button onClick={handleTermsAccept} className="bg-[#1b365d] hover:bg-[#2a4a7a] text-white font-bold px-8 py-3.5 rounded-sm text-xs tracking-wider uppercase transition-colors shadow-md shadow-[#1b365d]/20">
                  I Agree
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="w-full flex flex-col space-y-5 py-2 animate-in fade-in duration-300">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white font-sans">Privacy Policy</h1>
                <p className="text-xs text-slate-400 mt-1 font-medium">Updated September 2026</p>
              </div>
              <div className="w-full border-t border-slate-700/60 my-1"></div>
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 text-slate-300 text-xs sm:text-sm leading-relaxed home-scrollbar font-normal">
                {privacyList.map((item, index) => (
                  <div key={item.id || index} className="space-y-2">
                    {item.title && (
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mt-2">
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
              <div className="pt-4 flex justify-end items-center">
                <button 
                  onClick={handlePrivacyAccept} 
                  disabled={isSubmitting}
                  className="bg-[#1b365d] hover:bg-[#2a4a7a] text-white font-bold px-8 py-3.5 rounded-sm text-xs tracking-wider uppercase transition-colors shadow-md shadow-[#1b365d]/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'I Agree'}
                </button>
              </div>
            </div>
          )}

          <div className="text-center text-[11px] text-slate-400 pt-2">
            &copy; 2026 Axiorem. All rights reserved.
          </div>
        </div>

        {/* Right Panel: Persistent Header Text Overlay */}
        <div className="hidden lg:flex lg:w-[50%] min-h-screen items-center justify-center p-12 relative">
          <div className="max-w-md text-left space-y-4 animate-in fade-in duration-500">
            <h2 className="font-serif text-3xl xl:text-4xl font-medium leading-snug text-slate-100 tracking-tight select-none">
              From Lengthy Compliance Manuals to Courses within 5 minutes
            </h2>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#292929] text-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}