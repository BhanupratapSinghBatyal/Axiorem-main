"use client";

import React, { useState } from 'react';
import NextImage from 'next/image';
import { 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  MessageSquare, 
  ArrowUpRight, 
  Play,
  AlertCircle,
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';

// --- CANDIDATE SPECIFIC SCOPED MOCK CONFIGURATIONS ---
const CANDIDATE_METRICS = [
  { label: 'Assessments Completed', value: '14', icon: CheckCircle2, tint: 'bg-white/10 text-white' },
  { label: 'Average Score Metric', value: '89.4%', icon: Award, tint: 'bg-white/10 text-white' },
];

const PENDING_ASSIGNMENTS = [
  { 
    id: 'proj-101',
    name: 'Exploratory Data Analysis - Midterm', 
    program: 'Data Science Bootcamp 2026',
    duration: '45 mins',
    questions: 15,
    points: '30.0',
    urgency: 'Action Required',
    urgencyColor: 'bg-rose-50 text-rose-700 border-rose-100'
  },
  { 
    id: 'proj-102',
    name: 'Advanced SQL Query Optimization', 
    program: 'Database Engineering Track',
    duration: '60 mins',
    questions: 20,
    points: '50.0',
    urgency: 'Available',
    urgencyColor: 'bg-slate-50 text-slate-600 border-slate-100'
  }
];

const COMPLETED_SUBMISSIONS = [
  { 
    name: 'Python Structural Basics Assessment', 
    program: 'Core Programming Track', 
    icon: FileText, 
    color: 'text-emerald-600 bg-emerald-50 border border-emerald-100', 
    score: '92/100', 
    status: 'Verified & Graded',
    date: '3 hours ago' 
  },
  { 
    name: 'Neural Network Hyperparameter Tuning', 
    program: 'Advanced Machine Learning Specialization', 
    icon: BookOpen, 
    color: 'text-blue-600 bg-blue-50 border border-blue-100', 
    score: '85/100', 
    status: 'Verified & Graded',
    date: '2 days ago' 
  },
  { 
    name: 'Linux System Administration Practice', 
    program: 'DevOps Core Infrastructure', 
    icon: FileText, 
    color: 'text-amber-600 bg-amber-50 border border-amber-100', 
    score: 'Pending', 
    status: 'AI Grading Active',
    date: '1 week ago' 
  },
];

const HISTORICAL_ACTIVITY_STREAM = [
  { id: 'act-1', title: 'Assessment Target Submitted', detail: 'Python Structural Basics Assessment successfully logged for manual review.', time: '3 hours ago', icon: CheckCircle2, iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { id: 'act-2', title: 'New Evaluation Target Released', detail: 'Advanced SQL Query Optimization assessment route has been activated by your mentor.', time: '5 hours ago', icon: HelpCircle, iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { id: 'act-3', title: 'AI Automated Feedback Dispatched', detail: 'Automated grading evaluation feedback was compiled for Neural Network Hyperparameter Tuning.', time: '2 days ago', icon: MessageSquare, iconColor: 'text-amber-600 bg-amber-50 border-amber-100' },
];

export default function CandidateDashboardHome() {
  const [activeTab, setActiveTab] = useState('pending'); // Option States: 'pending' | 'completed'

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 sm:space-y-8 bg-[#fafbfe]">
      
      {/* ================= HERO METRIC BLOCK SECTION ================= */}
      <section className="w-full rounded-2xl sm:rounded-3xl relative overflow-hidden p-5 sm:p-8 md:p-10 shadow-lg shadow-slate-100/50 min-h-[200px] flex flex-col justify-between">
        {/* Image Background Layer */}
        <div className="absolute inset-0 z-0">
          <NextImage
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
            alt="Abstract geometric background"
            fill
            priority
            className="object-cover opacity-35 mix-blend-luminosity"
          />
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-slate-950/85 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950/50 via-slate-950/90 to-slate-950 z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="max-w-xl space-y-1.5 sm:space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Candidate Portal</span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white md:text-4xl">
              My Workspace
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-400 leading-relaxed max-w-md">
              Review personal performance analytics, approach assigned evaluation items, and inspect historical grades.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 pt-5 border-t border-white/10 mt-6 max-w-md">
          {CANDIDATE_METRICS.map((metric, idx) => (
            <div key={idx} className="flex items-center gap-3 group">
              <div className={`p-2 rounded-xl transition-transform group-hover:scale-105 shrink-0 ${metric.tint}`}>
                <metric.icon className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="block text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {metric.label}
                </span>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white leading-none">
                  {metric.value}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MAIN ASSESSMENT MONITOR WORKSPACE ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Scoped Assignment Execution Board Container */}
        <section className="xl:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/60 pb-2 gap-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`pb-2 text-sm font-bold tracking-tight border-b-2 transition-all ${
                  activeTab === 'pending' 
                    ? 'border-indigo-600 text-slate-900 font-black' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Assigned Tasks ({PENDING_ASSIGNMENTS.length})
              </button>
              <button 
                onClick={() => setActiveTab('completed')}
                className={`pb-2 text-sm font-bold tracking-tight border-b-2 transition-all ${
                  activeTab === 'completed' 
                    ? 'border-indigo-600 text-slate-900 font-black' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Submission History ({COMPLETED_SUBMISSIONS.length})
              </button>
            </div>

            {activeTab === 'pending' && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-xl self-start sm:self-auto">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Timer locks instantly upon execution initialize</span>
              </div>
            )}
          </div>

          {activeTab === 'pending' ? (
            /* Pending Tasks Display Block Grid */
            <div className="space-y-3">
              {PENDING_ASSIGNMENTS.map((task) => (
                <div 
                  key={task.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-200/80 transition-all"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 border text-[9px] font-black uppercase rounded-md tracking-wider ${task.urgencyColor}`}>
                        {task.urgency}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[200px]">
                        {task.program}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 tracking-tight truncate">
                      {task.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400/90 pt-0.5">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" />{task.duration} Duration</span>
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-slate-400" />{task.questions} Items</span>
                      <span className="hidden sm:inline-block">•</span>
                      <span className="hidden sm:inline-block">{task.points} Max Available Scaled Points</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(`/assignment-player/${task.id}`, '_blank')}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-white stroke-[2.5]" />
                    <span>Launch Evaluation</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Historical Log Outputs List Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMPLETED_SUBMISSIONS.map((project, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-4 hover:shadow-md transition-all group relative"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${project.color}`}>
                      <project.icon className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium truncate">{project.program}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                    <div className="space-y-0.5">
                      <span className="block text-[9px] font-bold text-slate-400/60 uppercase tracking-wide">{project.date}</span>
                      <span className="text-[11px] font-bold text-slate-600">{project.status}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] font-bold text-slate-400/60 uppercase tracking-wide">Result</span>
                      <span className="text-xs font-black text-slate-900 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">{project.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= SIDE BAR ACTIVITY DIAL PROFILE FEEDBACKS ================= */}
        <section className="space-y-4">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">Activity & Verification Stream</h2>
            <p className="text-xs text-slate-400 font-medium">Real-time trace logs detailing submission processing entries.</p>
          </div>

          <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
            {HISTORICAL_ACTIVITY_STREAM.map((activity) => (
              <div key={activity.id} className="p-4 flex items-start gap-3.5 hover:bg-slate-50/50 transition-colors">
                <div className={`p-2 rounded-xl shrink-0 border mt-0.5 ${activity.iconColor}`}>
                  <activity.icon className="h-4 w-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0 space-y-0.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs text-slate-900 tracking-tight">{activity.title}</h4>
                    <span className="text-[9px] font-bold text-slate-400/60 uppercase tracking-wider whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}