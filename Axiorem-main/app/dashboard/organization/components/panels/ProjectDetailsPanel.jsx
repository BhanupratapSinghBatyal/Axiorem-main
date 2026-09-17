import React, { useState } from 'react';
import {
  X,
  FolderOpen,
  Calendar,
  HardDrive,
  Activity,
  Archive,
  Trash2,
  Building,
  AlertTriangle,
  FileText,
  UserCheck,
  Copy,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLibraryActions } from '../../../../../hooks/useLibraryActions';

function formatDate(value) {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        <span>{label}</span>
      </div>
      <p className="text-xs font-semibold text-white pl-5 uppercase">{value}</p>
    </div>
  );
}

function ConfirmationModal({
  isOpen,
  type,
  itemName,
  targetWorkspaceName,
  error,
  isExecuting,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fade-in">
      <div className="bg-[#1E1E1E] border border-slate-800 p-8 rounded-sm w-full max-w-md shadow-2xl space-y-6">
        {type === 'DELETE' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
              <h3 className="text-base font-bold uppercase tracking-wider">Delete Confirmation</h3>
            </div>
            <div className="border-t border-slate-800 my-2" />
            <p className="text-sm text-slate-300 leading-relaxed uppercase tracking-wide">
              Permanently erase <span className="text-white font-bold underline underline-offset-4">{itemName}</span> from system storage? This operation is absolute and non-reversible.
            </p>
          </div>
        )}

        {/* {type === 'ARCHIVE' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <Archive className="h-5 w-5 stroke-[2.5]" />
              <h3 className="text-base font-bold uppercase tracking-wider">Archive Item</h3>
            </div>
            <div className="border-t border-slate-800 my-2" />
            <p className="text-sm text-slate-300 leading-relaxed uppercase tracking-wide">
              Transfer <span className="text-white font-bold underline underline-offset-4">{itemName}</span> to cold storage? Read-only access will be enforced.
            </p>
          </div>
        )} */}

        {type === 'SHARE' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500">
              <Building className="h-5 w-5 stroke-[2.5]" />
              <h3 className="text-base font-bold uppercase tracking-wider">Organization Deployment</h3>
            </div>
            <div className="border-t border-slate-800 my-2" />
            <p className="text-sm text-slate-300 leading-relaxed uppercase tracking-wide">
              Do you want to share <span className="text-white font-bold underline underline-offset-4">{itemName}</span> with target organization <span className="text-blue-400 font-bold underline underline-offset-4">{targetWorkspaceName}</span>?
            </p>
          </div>
        )}

        {type === 'COPY' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500">
              <Copy className="h-5 w-5 stroke-[2.5]" />
              <h3 className="text-base font-bold uppercase tracking-wider">Copy to Library</h3>
            </div>
            <div className="border-t border-slate-800 my-2" />
            <p className="text-sm text-slate-300 leading-relaxed uppercase tracking-wide">
              Duplicate <span className="text-white font-bold underline underline-offset-4">{itemName}</span> into your library?
            </p>
          </div>
        )}

        {error && (
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide bg-red-950/40 border border-red-900 p-2 rounded-sm">
            {error}
          </p>
        )}

        <div className="border-t border-slate-800 pt-4 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isExecuting}
            className="flex-1 h-10 border border-slate-700 bg-transparent hover:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors rounded-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isExecuting}
            className={`flex-1 h-10 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm ${
              type === 'DELETE'
                ? 'bg-red-950/40 border border-red-800 hover:bg-red-900 text-red-200'
                : 'bg-[#1b365d] border border-blue-900 hover:bg-[#24477a] text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isExecuting ? 'Executing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailsPanel({
  isOpen,
  panelRef,
  item,
  activeTab = 'projects',
  onClose,
  onArchive,
  onShareOrg,
  onCopy,
  isProcessing = false,
  currentWorkspaceRole,
}) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const { deleteProject, shareProjectToOrg, isDeleting, deleteError } = useLibraryActions();

  const isProject = activeTab === 'projects';
  const itemTypeLabel = isProject ? 'Project' : 'Resource';
  const isInsufficientRole = currentWorkspaceRole && !['ADMIN', 'OWNER'].includes(currentWorkspaceRole);

  const handleActionClick = (type) => {
    setModalType(type);
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!item?.id) return;

    try {
      if (modalType === 'DELETE') {
        await deleteProject(item.id);
        setIsConfirmModalOpen(false);
        onClose();
      } else if (modalType === 'SHARE') {
        if (onShareOrg) {
          await onShareOrg(item);
        } else if (shareProjectToOrg) {
          await shareProjectToOrg(item.id);
        }
        setIsConfirmModalOpen(false);
      } else if (modalType === 'ARCHIVE' && onArchive) {
        await onArchive(item);
        setIsConfirmModalOpen(false);
      } else if (modalType === 'COPY' && onCopy) {
        await onCopy(item);
        setIsConfirmModalOpen(false);
      }
    } catch (err) {
      console.error('Error during action:', err);
      // Handled via state/hook propagation
    }
  };

  const activeError = modalType === 'DELETE' ? deleteError : null;
  const isExecuting = isProcessing || (modalType === 'DELETE' && isDeleting);

  return (
    <>
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        <aside
          ref={panelRef}
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#2A2A2A] border-l border-slate-700 p-6 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
            <div className="flex items-center gap-2">
              {isProject ? <FolderOpen className="h-4 w-4 text-white" /> : <FileText className="h-4 w-4 text-white" />}
              <h3 className="text-xs font-bold tracking-widest text-white uppercase">{itemTypeLabel} Profile</h3>
            </div>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-start gap-4 mb-8 bg-[#212121] p-4 rounded-sm border border-slate-800">
            <div className="w-10 h-10 rounded-sm bg-[#3A3A3A] flex items-center justify-center shrink-0">
              {isProject ? <FolderOpen className="h-5 w-5 text-white" /> : <FileText className="h-5 w-5 text-white" />}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider truncate">{item?.name || 'UNNAMED'}</h4>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                Created By: <span className="text-slate-300">{item?.createdBy || 'N/A'}</span>
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-1">
            <DetailItem icon={Calendar} label="Modified Date" value={formatDate(item?.updatedAt || item?.date)} />
            <DetailItem icon={HardDrive} label={isProject ? 'Sections' : 'File Size'} value={item?.sectionCount ?? item?.size ?? 'N/A'} />
            {item?.type && <DetailItem icon={FileText} label="Type Specification" value={String(item.type).toUpperCase()} />}
            {item?.owner && <DetailItem icon={UserCheck} label="Owner / Author" value={item.owner} />}

            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Log & Activity</h5>
              <div className="space-y-3">
                {item?.history?.length ? (
                  item.history.map((log, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2 text-slate-300 min-w-0">
                        <Activity className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
                        <span className="truncate uppercase text-[11px] font-medium">{log.description}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase shrink-0 whitespace-nowrap">
                        {log.date}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-3 text-slate-300">
                      <div className="flex items-center gap-2 min-w-0">
                        <Activity className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate text-[11px] font-medium uppercase">Last modification applied</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase shrink-0">{formatDate(item?.updatedAt || item?.date)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-slate-300">
                      <div className="flex items-center gap-2 min-w-0">
                        <Activity className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate text-[11px] font-medium uppercase">Created On</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase shrink-0">{formatDate(item?.createdAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-6 border-t border-slate-700 mt-auto">
            <button
              type="button"
              onClick={() => handleActionClick('COPY')}
              disabled={isExecuting}
              className="w-full h-9 bg-[#1b365d] hover:bg-[#24477a] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy to Library</span>
            </button>

            <div className="grid grid-cols-1 gap-2">
              {/* <button
                type="button"
                onClick={() => handleActionClick('ARCHIVE')}
                disabled={isExecuting}
                className="h-9 border border-slate-600 bg-transparent hover:bg-slate-700/50 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-30"
              >
                <Archive className="h-3.5 w-3.5" />
                <span>Archive</span>
              </button> */}

              {isInsufficientRole ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      disabled
                      className="h-9 border border-red-900 bg-red-950/20 hover:bg-red-900/40 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-30 cursor-not-allowed"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Only Admins and Owners can delete projects.
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button
                  type="button"
                  onClick={() => handleActionClick('DELETE')}
                  disabled={isExecuting}
                  className="h-9 border border-red-900 bg-red-950/20 hover:bg-red-900/40 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        type={modalType}
        itemName={item?.name || 'UNNAMED PROJECT'}
        targetWorkspaceName={'ACTIVE WORKSPACE'}
        error={activeError}
        isExecuting={isExecuting}
        onConfirm={handleConfirm}
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </>
  );
}