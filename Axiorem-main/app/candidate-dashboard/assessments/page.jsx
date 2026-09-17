"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  MoreVertical,
  FileText,
  Plus,
  CheckCircle2,
  Clock
} from 'lucide-react';

const GRADED_DATA = [
  { id: 'g1', name: 'Physics Assessment - Grade 7', type: 'Graded', score: '92%', date: '25 Jul, 2024', duration: '45 min', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'g2', name: 'Mathematics Quiz - Algebra', type: 'Graded', score: '85%', date: '24 Jul, 2024', duration: '30 min', color: 'text-blue-600 bg-blue-50' },
  { id: 'g3', name: 'History Quiz - World War II', type: 'Graded', score: '78%', date: '20 Jul, 2024', duration: '40 min', color: 'text-blue-600 bg-blue-50' },
  { id: 'g4', name: 'English Literature - Shakespeare', type: 'Graded', score: '95%', date: '18 Jul, 2024', duration: '60 min', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'g5', name: 'Chemistry - Periodic Table', type: 'Graded', score: '88%', date: '15 Jul, 2024', duration: '35 min', color: 'text-blue-600 bg-blue-50' },
];

const IN_REVIEW_DATA = [
  { id: 'r1', name: 'Computer Science - Algorithms', type: 'In Review', date: '26 Jul, 2024', duration: '50 min', color: 'text-amber-600 bg-amber-50' },
  { id: 'r2', name: 'Biology - Genetics Basics', type: 'In Review', date: '26 Jul, 2024', duration: '40 min', color: 'text-amber-600 bg-amber-50' },
  { id: 'r3', name: 'Economics - Supply & Demand', type: 'In Review', date: '25 Jul, 2024', duration: '30 min', color: 'text-amber-600 bg-amber-50' },
];

export default function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState('graded'); 
  const [viewMode, setViewMode] = useState('list');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const activeData = activeTab === 'graded' ? GRADED_DATA : IN_REVIEW_DATA;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    if (activeMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuId]);

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 bg-[#fafbfe]">
      
      {/* ================= TOP TAB NAVIGATION ================= */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => { setActiveTab('graded'); setActiveMenuId(null); }}
              className={`flex items-center gap-2 pb-3 text-sm font-bold tracking-tight border-b-2 transition-all relative ${
                activeTab === 'graded'
                  ? 'border-[#156d95] text-[#156d95]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Graded</span>
              <span className="text-xs ml-0.5 px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                {GRADED_DATA.length}
              </span>
            </button>
            
            <button
              onClick={() => { setActiveTab('in-review'); setActiveMenuId(null); }}
              className={`flex items-center gap-2 pb-3 text-sm font-bold tracking-tight border-b-2 transition-all relative ${
                activeTab === 'in-review'
                  ? 'border-[#156d95] text-[#156d95]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>In Review</span>
              <span className="text-xs ml-0.5 px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                {IN_REVIEW_DATA.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => window.open('/assignment-player', '_blank')}
            className="hidden sm:flex mb-2 bg-[#0f111a] hover:bg-[#202436] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* Directory Controls */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground capitalize">
              {activeTab === 'graded' ? 'Graded Assessments' : 'Assessments in Review'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input 
                type="text" 
                placeholder="Search assessments..."
                className="w-full bg-white border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#156d95] text-foreground placeholder-muted-foreground/60 transition-all"
              />
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto mt-1 sm:mt-0">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button>
              
              <div className="flex items-center border border-border bg-white rounded-xl p-0.5 shrink-0">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#156d95]/10 text-[#156d95]' : 'text-muted-foreground'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#156d95]/10 text-[#156d95]' : 'text-muted-foreground'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Layout Rendering */}
        {viewMode === 'list' ? (
          <div className="w-full bg-white rounded-2xl border border-border overflow-visible shadow-sm">
            
            {/* Mobile Card-list */}
            <div className="block md:hidden divide-y divide-border">
              {activeData.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl shrink-0 ${item.color}`}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate cursor-pointer hover:text-[#156d95] transition-colors">{item.name}</h4>
                      <p className="text-xs text-muted-foreground/80 mt-0.5 flex items-center gap-2">
                        <span>{item.date}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{item.duration}</span>
                        {item.score && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="font-bold text-emerald-600">{item.score}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="relative shrink-0">
                    <button 
                      onClick={(e) => toggleMenu(item.id, e)}
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground/60"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {activeMenuId === item.id && (
                      <div 
                        ref={menuRef} 
                        className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100 text-left"
                      >
                        <button
                          onClick={() => setActiveMenuId(null)}
                          className="w-full px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5 text-muted-foreground/80" />
                          <span>View Details</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <table className="hidden md:table w-full border-collapse text-left text-sm text-muted-foreground">
              <thead>
                <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground/60 bg-muted">
                  <th className="py-3 px-6 w-8">
                    <input type="checkbox" className="rounded border-border text-[#156d95] focus:ring-[#156d95]" />
                  </th>
                  <th className="py-3 px-4 font-bold">Name</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Duration</th>
                  <th className="py-3 px-4 font-bold">{activeTab === 'graded' ? 'Score' : 'Status'}</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeData.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/60 transition-colors group">
                    <td className="py-4 px-6">
                      <input type="checkbox" className="rounded border-border text-[#156d95] focus:ring-[#156d95]" />
                    </td>
                    <td className="py-4 px-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="truncate max-w-md cursor-pointer hover:text-[#156d95] transition-colors">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{item.date}</td>
                    <td className="py-4 px-4 text-muted-foreground">{item.duration}</td>
                    <td className="py-4 px-4">
                      {item.score ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3 h-3" />
                          {item.score}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right overflow-visible">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={(e) => toggleMenu(item.id, e)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground/60 hover:text-foreground transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {activeMenuId === item.id && (
                          <div 
                            ref={menuRef} 
                            className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100 text-left"
                          >
                            <button
                              onClick={() => setActiveMenuId(null)}
                              className="w-full px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                            >
                              <FileText className="h-3.5 w-3.5 text-muted-foreground/80" />
                              <span>View Details</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeData.map((item) => (
              <div key={item.id} className="bg-white border border-border rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow group relative overflow-visible">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="relative">
                    <button 
                      onClick={(e) => toggleMenu(item.id, e)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground/60 hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {activeMenuId === item.id && (
                      <div 
                        ref={menuRef} 
                        className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100 text-left"
                      >
                        <button
                          onClick={() => setActiveMenuId(null)}
                          className="w-full px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5 text-muted-foreground/80" />
                          <span>View Details</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-[#156d95] transition-colors cursor-pointer">{item.name}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.date}</span>
                    <span>{item.duration}</span>
                  </div>
                  {item.score && (
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.score}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mobile FAB */}
      <button 
        onClick={() => window.open('/assignment-player', '_blank')}
        className="sm:hidden fixed bottom-6 right-6 bg-[#0f111a] active:bg-[#202436] text-white p-4 rounded-full shadow-2xl z-40 transition-transform flex items-center justify-center border border-slate-800"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

    </div>
  );
}