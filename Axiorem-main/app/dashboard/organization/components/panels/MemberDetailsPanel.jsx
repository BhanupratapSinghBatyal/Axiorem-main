import React, { useState } from 'react';
import { X, Shield, CalendarDays, Activity, Coins, AlertTriangle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString();
}

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
}

export default function MemberDetailsPanel({
  isOpen,
  panelRef,
  member,
  onClose,
  onPromote,
  onDemote,
  onRemove,
  currentWorkspaceRole,
  currentUserEmail,
  isProcessing
}) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'PROMOTE', 'DEMOTE', or 'REMOVE'

  const isAdminOrOwner = ['ADMIN', 'OWNER'].includes(currentWorkspaceRole?.toUpperCase());
  const isSelf = member?.email === currentUserEmail;
  const isActionDisabled = !isAdminOrOwner || isSelf || isProcessing;
  
  const isMemberRole = member?.role?.toUpperCase() === 'MEMBER';
  
  const handleRoleAction = () => {
    setModalType(isMemberRole ? 'PROMOTE' : 'DEMOTE');
    setIsConfirmModalOpen(true);
  };

  const handleRemoveClick = () => {
    setModalType('REMOVE');
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    if (modalType === 'REMOVE') {
      await onRemove(member);
    } else if (modalType === 'PROMOTE') {
      await onPromote(member);
    } else if (modalType === 'DEMOTE') {
      await onDemote(member);
    }
    setIsConfirmModalOpen(false);
  };

  const permissions = [
    'Promote Other Members to Admin',
    'Demote Other Admins to Members',
    'Create Shareable link to add members to the workspace',
    'Remove members from the workspace',
    'Delete Projects and Resources from the workspace'
  ];

  return (
    <>
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div onClick={onClose} className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
        
        <aside
          ref={panelRef}
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#2A2A2A] border-l border-slate-700 p-6 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-white" />
              <h3 className="text-xs font-bold tracking-widest text-white uppercase">Member Profile</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            {member?.avatar ? <img src={member.avatar} className="w-14 h-14 rounded-full object-cover" /> : 
             <div className="w-14 h-14 rounded-full bg-[#3A3A3A] flex items-center justify-center text-sm font-bold">{getInitials(member?.name)}</div>}
            <div>
              <h4 className="text-sm font-bold text-white uppercase">{member?.name}</h4>
              <p className="text-xs text-slate-400">{member?.email}</p>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto">
            <DetailItem icon={CalendarDays} label="Joined Date" value={formatDate(member?.joinedAt)} />
            <DetailItem icon={Shield} label="Access Level" value={member?.role || 'MEMBER'} />
            {/* <DetailItem icon={Coins} label="Credits Used" value="320 / 1000" /> */}
            
            {/* <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h5>
              <div className="space-y-3">
                {member?.recentActivity?.length ? (
                  member.recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2 text-slate-300 min-w-0">
                        <Activity className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span className="truncate">{activity.description}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase shrink-0 whitespace-nowrap">
                        {activity.date}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-3 text-slate-300">
                      <div className="flex items-center gap-2 min-w-0">
                        <Activity className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Created project <span className="text-white font-medium">Physics Curriculum Framework</span></span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase shrink-0">25 Jul, 2024</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-slate-300">
                      <div className="flex items-center gap-2 min-w-0">
                        <Activity className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Uploaded resource <span className="text-white font-medium">Political Science.pdf</span></span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase shrink-0">25 Jul, 2024</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-slate-300">
                      <div className="flex items-center gap-2 min-w-0">
                        <Activity className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Invited <span className="text-white font-medium">john.doe@example.com</span> to workspace</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase shrink-0">21 Jul, 2024</span>
                    </div>
                  </div>
                )}
              </div>
            </div> */}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-700">
            <button 
              onClick={handleRoleAction} 
              disabled={isActionDisabled}
              className="h-9 bg-[#1b365d] text-white text-[10px] font-bold uppercase rounded-sm disabled:opacity-30"
            >
              {isMemberRole ? 'Promote to Admin' : 'Demote to Member'}
            </button>
            <button 
              onClick={handleRemoveClick} 
              disabled={isActionDisabled}
              className="h-9 border border-red-900 text-red-400 text-[10px] font-bold uppercase rounded-sm hover:bg-red-900/10 disabled:opacity-30"
            >
              Remove Member
            </button>
          </div>
        </aside>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fade-in">
          <div className="bg-[#1E1E1E] border border-slate-800 p-8 rounded-sm w-full max-w-md shadow-2xl space-y-6">
            
            {modalType === 'REMOVE' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-red-500">
                  <AlertTriangle className="h-5 w-5 stroke-[2.5]" /> 
                  <h3 className="text-base font-bold uppercase tracking-wider">Confirm Removal</h3>
                </div>
                <div className="border-t border-slate-800 my-2" />
                <p className="text-sm text-slate-300 leading-relaxed uppercase tracking-wide">
                  Remove <span className="text-white font-bold underline underline-offset-4">{member?.name}</span> from the active organization workspace? This change is irreversible.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {modalType === 'PROMOTE' ? (
                    <>
                      <ArrowUpCircle className="text-blue-500 h-5 w-5 stroke-[2.5]" />
                      <h3 className="text-base font-bold uppercase tracking-wider text-white">Grant Admin Rights</h3>
                    </>
                  ) : (
                    <>
                      <ArrowDownCircle className="text-amber-500 h-5 w-5 stroke-[2.5]" />
                      <h3 className="text-base font-bold uppercase tracking-wider text-white">Revoke Admin Rights</h3>
                    </>
                  )}
                </div>
                <div className="border-t border-slate-800 my-2" />
                <p className="text-sm text-slate-300 uppercase tracking-wide">
                  {modalType === 'PROMOTE' 
                    ? `Elevating ${member?.name}. The operator account will gain the following core privileges:` 
                    : `Demoting ${member?.name}. The operator account will lose access to the following privileges:`}
                </p>
                <ul className="text-xs text-slate-400 space-y-3 border-l border-slate-800 pl-4 py-1 uppercase tracking-wider font-medium">
                  {permissions.map((p, i) => (
                    <li key={i} className="list-none flex items-start gap-2">
                      <span className="text-slate-600 font-bold">[{i + 1}]</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-slate-800 pt-4 flex gap-4">
              <button 
                type="button"
                onClick={() => setIsConfirmModalOpen(false)} 
                className="flex-1 h-10 border border-slate-700 bg-transparent hover:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors rounded-sm"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleConfirm} 
                disabled={isProcessing} 
                className={`flex-1 h-10 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm ${
                  modalType === 'REMOVE' 
                    ? 'bg-red-950/40 border border-red-800 hover:bg-red-900 text-red-200' 
                    : 'bg-[#1b365d] border border-blue-900 hover:bg-[#24477a] text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? 'Processing Framework Update...' : 'Execute Confirmation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
      <Icon className="h-3.5 w-3.5" /> <span>{label}</span>
    </div>
    <p className="text-xs font-semibold text-white pl-5 uppercase">{value}</p>
  </div>
);