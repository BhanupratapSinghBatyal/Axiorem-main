"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Brain, 
  Users, 
  ShieldCheck, 
  LifeBuoy, 
  Bell, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export default function CandidateDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getActiveMenu = () => {
    if (pathname === '/candidate-dashboard' || pathname === '/candidate-dashboard/') return 'Home';
    if (pathname === '/candidate-dashboard/assessments') return 'Assessments';
    if (pathname === '/candidate-dashboard/ai-assistant') return 'AI Assistant';
    if (pathname === '/candidate-dashboard/organization') return 'Organization';
    return pathname.split('/').pop();
  };

  const [activeMenu, setActiveMenu] = useState(getActiveMenu());

  const handleNavClick = (name) => {
    setActiveMenu(name);
    setIsSidebarOpen(false);
    const routes = {
      'Home': '/candidate-dashboard',
      'Assessments': '/candidate-dashboard/assessments',
      'AI Assistant': '/candidate-dashboard/ai-assistant',
      'Organization': '/candidate-dashboard/organization',
    };
    if (routes[name]) {
      router.push(routes[name]);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="space-y-7">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Syllabai Logo"
              height="36"
              width="36"
              className="shrink-0"
              style={{ objectFit: 'contain' }}
            />
            <span className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "Figtree", fontWeight: "800" }}>
              Syllabai
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            {[
              { name: 'Home', icon: Home },
              { name: 'Assessments', icon: BookOpen },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  activeMenu === item.name 
                    ? 'bg-[#156d95]/10 text-[#156d95]' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="h-[18px] w-[18px] stroke-[2.2]" />
                {item.name}
              </button>
            ))}
          </div>

          
        </div>
      </div>

      <div className="pt-4 border-t border-border space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-muted-foreground hover:bg-muted">
          <ShieldCheck className="h-[18px] w-[18px] stroke-[2.2]" />
          Privacy Policy
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-muted-foreground hover:bg-muted">
          <LifeBuoy className="h-[18px] w-[18px] stroke-[2.2]" />
          Support
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans antialiased overflow-hidden relative">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 h-full bg-white border-r border-border flex flex-col justify-between py-6 pl-6 pr-3 overflow-y-auto z-50 transition-transform duration-300 lg:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      <aside className="hidden lg:flex w-64 h-full bg-white border-r border-border flex flex-col justify-between py-6 pl-6 pr-3 overflow-y-auto shrink-0 select-none">
        <SidebarContent />
      </aside>

      <main className="flex-1 h-full flex flex-col overflow-hidden">
        
        <header className="h-16 w-full px-4 sm:px-8 flex items-center justify-between border-b border-border bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-border bg-white text-muted-foreground hover:bg-muted transition-colors"
            >
              <Menu className="h-5 w-5 stroke-[2]" />
            </button>
            <div className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              Welcome, Candidate !
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-muted text-muted-foreground relative transition-colors">
              <Bell className="h-5 w-5 stroke-[2]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            <div className="flex items-center gap-2 pl-2 border-l border-border cursor-pointer group">
              <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-xs text-muted-foreground overflow-hidden">
                CA
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>
        </header>

        {children}
      </main>

    </div>
  );
}