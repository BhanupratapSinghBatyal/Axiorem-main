// app/dashboard/home/ActivitySection.jsx
import React from 'react';
import { CheckCircle2, Share2, MessageSquare } from 'lucide-react';

const RECENT_ACTIVITIES = [
  { id: 'act-1', title: 'Assignment Submitted', detail: 'Sarah Wijaya completed Python Basics Assessment', time: '10 mins ago', icon: CheckCircle2 },
  { id: 'act-2', title: 'Resource Shared', detail: 'Alex Rivera shared a Resource in your organization', time: '1 hour ago', icon: Share2 },
  { id: 'act-3', title: 'Comment Added', detail: 'Michael Chen left feedback on Physics Lesson Plan', time: '3 hours ago', icon: MessageSquare },
];

export default function ActivitySection() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">Recent Activity</h2>
          <p className="text-xs text-slate-300 hidden sm:block">Live matrix of tactical interactions and operational data state updates.</p>
        </div>
      </div>

      <div className="w-full bg-[#3A3A3A] shadow-md rounded-sm overflow-hidden divide-y divide-slate-600">
        {RECENT_ACTIVITIES.map((activity) => (
          <div key={activity.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-3.5 min-w-0">
              <activity.icon className="h-4 w-4 stroke-[2] text-white shrink-0 mt-1" />
              <div className="min-w-0">
                <h4 className="font-semibold text-xs sm:text-sm text-white tracking-tight">{activity.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 truncate">{activity.detail}</p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap uppercase tracking-wider shrink-0">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
