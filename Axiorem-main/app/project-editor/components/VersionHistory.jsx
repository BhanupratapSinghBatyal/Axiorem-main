import React, { useState } from 'react';
import { Calendar, MoreVertical, Edit2, RotateCcw, Copy, ArrowLeftRight, Check, Loader2, AlertCircle } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { useProjectHistory, useRestoreVersion } from '@/hooks/projects/useVersionHistoryActions';

export default function VersionHistory({ onRestore, onRename, onMakeCopy, onCompare }) {
  const projectId = useEditorStore((state) => state.projectId);
  const activeVersionId = useEditorStore((state) => state.activeVersionId);

  // Wire actual exported hooks
  const { history: versions, isLoading, isError, error } = useProjectHistory(projectId);
  const { restoreVersion, isRestoring } = useRestoreVersion();

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingVersionId, setEditingVersionId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const startRename = (version) => {
    setEditingVersionId(version.id);
    setEditTitle(version.label || version.name || '');
    setActiveMenuId(null);
  };

  const saveRename = async (id) => {
    if (!editTitle.trim()) {
      setEditingVersionId(null);
      return;
    }
    if (onRename) {
      await onRename(id, editTitle.trim());
    }
    setEditingVersionId(null);
  };

  const handleRestore = async (version) => {
    setActiveMenuId(null);
    try {
      await restoreVersion(version.id);
      if (onRestore) {
        onRestore(version);
      }
    } catch (err) {
      console.error('Failed to restore version:', err);
    }
  };

  const handleMakeCopy = (version) => {
    setActiveMenuId(null);
    if (onMakeCopy) {
      onMakeCopy(version);
    }
  };

  const handleCompare = (version) => {
    setActiveMenuId(null);
    if (onCompare) {
      onCompare(version);
    }
  };

  const formatVersionDateTime = (rawTimestamp) => {
    if (!rawTimestamp) return { date: 'Unknown Date', time: '' };
    const dateObj = new Date(rawTimestamp);
    if (isNaN(dateObj.getTime())) return { date: rawTimestamp, time: '' };

    const date = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const time = dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return { date, time };
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-[#292929] flex items-center justify-center text-slate-400 text-xs font-semibold uppercase tracking-wider gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        <span>Loading Iterations...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full bg-[#292929] flex flex-col items-center justify-center p-4 text-center text-red-400 text-xs font-medium gap-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span>{error || 'Failed to retrieve version history records.'}</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#292929] flex flex-col min-h-0 select-none font-sans text-white antialiased">
      {/* Filter Toolbar Track */}
      <div className="px-2 py-1.5 border-b border-slate-700 bg-[#292929]">
        <button 
          type="button"
          className="w-full flex items-center justify-between border border-slate-600 bg-[#3A3A3A] rounded-lg px-2 py-1.5 text-[11px] font-semibold text-white hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Last modified</span>
          </div>
        </button>
      </div>

      {/* Timeline Iterations Stream */}
      <div className="flex-1 overflow-y-auto p-3 relative">
        <div className="absolute left-4.25 top-4 bottom-4 w-0.5 bg-slate-700" />

        {(!versions || versions.length === 0) ? (
          <div className="text-center py-8 text-slate-400 text-xs uppercase tracking-wider font-medium">
            No version history available
          </div>
        ) : (
          <div className="space-y-5 relative">
            {versions.map((version) => {
              const isEditing = editingVersionId === version.id;
              const isCurrent = version.isCurrent ?? version.id === activeVersionId;
              const { date, time } = formatVersionDateTime(version.createdAt || version.date);
              const label = version.label || version.name || 'Untitled Snapshot';
              const author = version.createdBy || version.author?.name || version.author || 'Unknown user';

              return (
                <div key={version.id} className="flex items-start gap-2.5 group relative">
                  <div className="relative z-10 flex items-center justify-center mt-1">
                    <div className={`w-2.5 h-2.5 rounded-full border-2 bg-[#292929] transition-all ${
                      isCurrent 
                        ? 'border-[#0b57d0] ring-4 ring-blue-500/20' 
                        : 'border-slate-600 group-hover:border-slate-400'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="font-bold text-[11px] text-white truncate">
                        {date}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                        {time}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <input 
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveRename(version.id)}
                          className="text-[11px] font-semibold text-white border border-blue-400 bg-[#3A3A3A] rounded px-1.5 py-0.5 w-full focus:outline-none"
                          autoFocus
                        />
                        <button 
                          type="button"
                          onClick={() => saveRename(version.id)}
                          className="p-1 text-emerald-400 hover:bg-slate-700 rounded transition-colors"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[11px] font-medium text-slate-300 truncate flex-1">
                          {label}
                        </span>
                        {isCurrent && (
                          <span className="px-1 rounded bg-emerald-600 border border-emerald-700 text-white text-[9px] font-bold tracking-wide shrink-0 uppercase">
                            Current
                          </span>
                        )}
                      </div>
                    )}

                    <span className="text-[10px] font-normal text-slate-400">
                      By {author}
                    </span>
                  </div>

                  <div className="relative shrink-0 self-start mt-0.5">
                    <button
                      type="button"
                      disabled={isRestoring}
                      onClick={(e) => toggleMenu(e, version.id)}
                      className={`p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer ${
                        activeMenuId === version.id ? 'opacity-100 bg-slate-700' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {activeMenuId === version.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                        <div className="absolute right-0 mt-0.5 w-40 bg-[#3A3A3A] border border-slate-600 rounded-lg shadow-md p-1 z-40 flex flex-col">
                          
                          <button
                            type="button"
                            onClick={() => handleRestore(version)}
                            className="w-full text-left px-2 py-1 text-[11px] font-medium text-white hover:bg-slate-600 transition-colors rounded flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3 text-slate-400" />
                            Restore
                          </button>
                         
                         
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}