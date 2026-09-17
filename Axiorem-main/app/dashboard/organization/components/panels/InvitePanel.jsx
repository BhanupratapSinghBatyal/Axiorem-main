import React, { useEffect } from 'react';
import { UserPlus, X, Copy, Check, ChevronDown } from 'lucide-react';

export default function InvitePanel({
  isOpen,
  panelRef,
  currentWorkspaceName,
  activeMembersCount,
  isTeamsPlan,
  generatedInviteUrl,
  copiedLink,
  isProcessing,
  isGeneratingUrl,
  inviteEmail = '',
  inviteRole = 'MEMBER',
  onClose,
  onGenerateLink,
  onCopyLink,
  onSubmit,
  onInviteEmailChange,
  onInviteRoleChange,
}) {
  // Handle ESC key listener for modal accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleActionClick = (e, callback) => {
    e.stopPropagation();
    if (callback) callback(e);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div 
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}
    >
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#2A2A2A] border-l border-slate-700 p-6 space-y-6 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out text-white ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-white stroke-2" />
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">Invite to Workspace</h3>
          </div>
          <button 
            type="button" 
            onClick={(e) => handleActionClick(e, onClose)} 
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 shrink-0">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Environment</span>
            <h4 className="text-sm font-bold tracking-tight text-white uppercase truncate">{currentWorkspaceName}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Seats</span>
              <span className="text-xs font-semibold text-white">{activeMembersCount} Occupied</span>
            </div>
            {isTeamsPlan && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seat Limit</span>
                <span className="text-xs font-semibold text-blue-300">8 Max</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-700/50 shrink-0" />

        <div className="space-y-2 shrink-0">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reusable Invite Link</label>
          {!generatedInviteUrl ? (
            <button
              type="button"
              onClick={(e) => handleActionClick(e, onGenerateLink)}
              disabled={isProcessing || isGeneratingUrl}
              className="w-full bg-[#1b365d] hover:bg-[#24477a] text-white text-[10px] tracking-wider uppercase py-2 px-3 rounded-sm transition-all font-bold disabled:opacity-50 border border-[#1b365d] h-9 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {isProcessing || isGeneratingUrl ? 'Generating Link...' : 'Generate Shareable Link'}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedInviteUrl}
                className="flex-1 bg-transparent px-3 py-2 rounded-sm text-xs text-slate-300 truncate border border-slate-700 font-mono select-all h-9 focus:outline-none"
              />
              <button
                type="button"
                onClick={(e) => handleActionClick(e, onCopyLink)}
                className="p-2 bg-transparent hover:bg-white/10 text-white rounded-sm transition-colors border border-slate-600 flex items-center justify-center shrink-0 w-9 h-9 focus:outline-none"
              >
                {copiedLink ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-slate-700/50 shrink-0" />

        {/* <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
              <input
                type="email"
                required
                value={inviteEmail || ''}
                onChange={(e) => onInviteEmailChange(e.target.value)}
                className="w-full bg-transparent border border-slate-700 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-500 h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assign Role</label>
              <div className="relative w-full">
                <select
                  value={inviteRole}
                  onChange={(e) => onInviteRoleChange(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-slate-700 rounded-sm pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-slate-500 h-9 uppercase tracking-wider font-semibold appearance-none cursor-pointer"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing || !(inviteEmail || '').trim()}
            className="w-full bg-[#1b365d] hover:bg-[#24477a] disabled:opacity-50 text-white text-[10px] font-bold tracking-wider uppercase py-2 px-4 rounded-sm transition-all h-9 border border-[#1b365d] mt-6"
          >
            {isProcessing ? 'Sending Invitation...' : 'Send Direct Email Invitation'}
          </button>
        </form> */}
      </aside>
    </div>
  );
}