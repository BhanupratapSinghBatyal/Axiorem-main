import React from 'react';
import { FolderOpen, FileIcon, MoreVertical } from 'lucide-react';
import EmptyState from './EmptyState';

function MemberRowActions({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-1 rounded-sm hover:bg-slate-700 text-slate-400 hover:text-white transition-colors focus:outline-none"
      aria-label="Open member details"
    >
      <MoreVertical className="h-4 w-4" />
    </button>
  );
}

function ContentActionButton({ item, onProjectAction }) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => onProjectAction?.(item)}
        className="p-1 rounded-sm hover:bg-slate-700 text-slate-400 hover:text-white transition-colors focus:outline-none"
        aria-label={`Actions for ${item.name}`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  );
}

function TableSkeleton({ isMembersVariant, activeTab }) {
  const rows = Array.from({ length: 5 });

  if (isMembersVariant) {
    return (
      <div className="w-full bg-[#3A3A3A] rounded-sm shadow-md overflow-hidden animate-pulse">
        {/* Desktop Skeleton */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-175">
            <thead>
              <tr className="border-b border-slate-600 bg-slate-700/40">
                <th className="py-3 px-4 w-12"><div className="h-3 bg-slate-600 rounded w-6" /></th>
                <th className="py-3 px-4"><div className="h-3 bg-slate-600 rounded w-20" /></th>
                <th className="py-3 px-4"><div className="h-3 bg-slate-600 rounded w-12" /></th>
                <th className="py-3 px-4"><div className="h-3 bg-slate-600 rounded w-24" /></th>
                <th className="py-3 px-4"><div className="h-3 bg-slate-600 rounded w-32" /></th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600">
              {rows.map((_, i) => (
                <tr key={i}>
                  <td className="py-4 px-4"><div className="h-3 bg-slate-600 rounded w-4" /></td>
                  <td className="py-4 px-4"><div className="h-3 bg-slate-600 rounded w-32" /></td>
                  <td className="py-4 px-4"><div className="h-4 bg-slate-600 rounded w-16" /></td>
                  <td className="py-4 px-4"><div className="h-3 bg-slate-600 rounded w-20" /></td>
                  <td className="py-4 px-4"><div className="h-3 bg-slate-600 rounded w-40" /></td>
                  <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-600 rounded w-4 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Skeleton */}
        <div className="block md:hidden divide-y divide-slate-600">
          {rows.map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="space-y-1.5 w-3/4">
                  <div className="h-3 bg-slate-600 rounded w-1/2" />
                  <div className="h-2.5 bg-slate-600 rounded w-3/4" />
                </div>
                <div className="h-4 bg-slate-600 rounded w-4" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-2.5 bg-slate-600 rounded w-24" />
                <div className="h-4 bg-slate-600 rounded w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#3A3A3A] rounded-sm shadow-md overflow-hidden animate-pulse">
      {/* Desktop Skeleton */}
      <div className="hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-600 bg-slate-700/40">
              <th className="py-3 px-4 w-12"><div className="h-3 bg-slate-600 rounded w-6" /></th>
              <th className="py-3 px-4"><div className="h-3 bg-slate-600 rounded w-24" /></th>
              <th className="py-3 px-4"><div className="h-3 bg-slate-600 rounded w-16" /></th>
              <th className="py-3 px-4"><div className="h-3 bg-slate-600 rounded w-24" /></th>
              <th className="py-3 px-4"><div className="h-3 bg-slate-600 rounded w-16" /></th>
              <th className="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {rows.map((_, i) => (
              <tr key={i}>
                <td className="py-4 px-4"><div className="h-3 bg-slate-600 rounded w-4" /></td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-slate-600 rounded shrink-0" />
                    <div className="h-3 bg-slate-600 rounded w-48" />
                  </div>
                </td>
                <td className="py-4 px-4"><div className="h-3 bg-slate-600 rounded w-16" /></td>
                <td className="py-4 px-4"><div className="h-3 bg-slate-600 rounded w-20" /></td>
                <td className="py-4 px-4"><div className="h-3 bg-slate-600 rounded w-12" /></td>
                <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-600 rounded w-4 ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Skeleton */}
      <div className="block md:hidden divide-y divide-slate-600">
        {rows.map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full">
              <div className="h-4 w-4 bg-slate-600 rounded shrink-0" />
              <div className="space-y-1.5 w-3/4">
                <div className="h-3 bg-slate-600 rounded w-2/3" />
                <div className="h-2.5 bg-slate-600 rounded w-1/3" />
              </div>
            </div>
            <div className="h-4 bg-slate-600 rounded w-4 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DataTable({
  variant,
  members = [],
  items = [],
  isLoading = false,
  activeTab = 'Projects',
  searchQuery = '',
  onClearSearch,
  onMemberAction,
  onProjectAction,
  onProjectClick,
}) {
  const isMembersVariant = variant === 'members';
  const Icon = activeTab === 'Projects' ? FolderOpen : FileIcon;

  const formatDate = (dateInput) => {
    if (!dateInput) return '—';
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString();
  };

  if (isLoading) {
    return <TableSkeleton isMembersVariant={isMembersVariant} activeTab={activeTab} />;
  }

  if (isMembersVariant) {
    if (members.length === 0) {
      return (
        <div className="w-full bg-[#3A3A3A] rounded-sm shadow-md p-8 text-center text-xs text-slate-400 uppercase tracking-wider font-semibold">
          No members found in organization.
        </div>
      );
    }

    return (
      <div className="w-full bg-[#3A3A3A] rounded-sm shadow-md overflow-visible">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-slate-300 min-w-175">
            <thead>
              <tr className="border-b border-slate-600 font-bold uppercase tracking-wider text-slate-300 bg-slate-700/40">
                <th className="py-3 px-4 w-12">S No.</th>
                <th className="py-3 px-4 font-bold">Member</th>
                <th className="py-3 px-4 font-bold">Role</th>
                <th className="py-3 px-4 font-bold">Date Added</th>
                <th className="py-3 px-4 font-bold">Email Address</th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600">
              {members.map((member, index) => {
                const isPrivileged = member.role === 'OWNER' || member.role === 'ADMIN';
                return (
                  <tr key={member.id || member.email || index} className="hover:bg-slate-600 transition-colors">
                    <td className="py-4 px-4 font-medium text-white">{index + 1}</td>
                    <td className="py-4 px-4 font-medium text-white">{member.name}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wider uppercase ${isPrivileged ? 'bg-[#1b365d] text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300 whitespace-nowrap">{formatDate(member.joinedAt)}</td>
                    <td className="py-4 px-4 text-slate-300">{member.email}</td>
                    <td className="py-4 px-4 text-right">
                      <MemberRowActions onClick={() => onMemberAction?.(member)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-slate-600">
          {members.map((member, index) => {
            const isPrivileged = member.role === 'OWNER' || member.role === 'ADMIN';
            return (
              <div key={member.id || member.email || index} className="p-4 space-y-2.5 hover:bg-slate-600 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-white text-xs">{index + 1}. {member.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{member.email}</p>
                  </div>
                  <MemberRowActions onClick={() => onMemberAction?.(member)} />
                </div>
                <div className="flex items-center justify-between gap-4 pt-0.5 text-[10px]">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Added:</span>
                    <span className="text-slate-300">{formatDate(member.joinedAt)}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-sm font-semibold tracking-wider uppercase ${isPrivileged ? 'bg-[#1b365d] text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {member.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState 
        activeTab={activeTab} 
        searchQuery={searchQuery} 
        onClearSearch={onClearSearch} 
      />
    );
  }

  return (
    <div className="w-full bg-[#3A3A3A] rounded-sm shadow-md overflow-visible">
      {/* Mobile View */}
      <div className="block md:hidden divide-y divide-slate-600">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-600 transition-colors">
            <button
              type="button"
              onClick={() => onProjectClick?.(item)}
              className="flex items-center gap-3 min-w-0 text-left bg-transparent border-0 p-0 focus:outline-none"
            >
              <Icon className="h-4 w-4 stroke-2 text-white shrink-0" />
              <div className="min-w-0">
                <h4 className="font-semibold text-xs text-white truncate uppercase tracking-wider">{item.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2 uppercase tracking-wider font-medium">
                  <span>{item.date}</span>
                  <span className="w-1 h-1 bg-slate-500" />
                  <span>{item.size}</span>
                </p>
              </div>
            </button>
            <ContentActionButton item={item} onProjectAction={onProjectAction} />
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <table className="hidden md:table w-full border-collapse text-left text-xs text-slate-300">
        <thead>
          <tr className="border-b border-slate-600 font-bold uppercase tracking-wider text-slate-300 bg-slate-700/40">
            <th className="py-3 px-4 w-12">S No.</th>
            <th className="py-3 px-4 font-bold">Name</th>
            <th className="py-3 px-4 font-bold">Status</th>
            <th className="py-3 px-4 font-bold">Modified Date</th>
            <th className="py-3 px-4 font-bold">{activeTab === 'Projects' ? 'Sections' : 'Size'}</th>
            <th className="py-3 px-4 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-600">
          {items.map((item, index) => (
            <tr key={item.id} className="hover:bg-slate-600 transition-colors group">
              <td className="py-4 px-4 font-medium text-white">{index + 1}</td>
              <td className="py-4 px-4 font-medium text-white">
                <button
                  type="button"
                  onClick={() => onProjectClick?.(item)}
                  className="flex items-center gap-3 text-left bg-transparent border-0 p-0 focus:outline-none text-white hover:text-slate-200"
                >
                  <Icon className="h-4 w-4 stroke-2 text-white shrink-0" />
                  <span className="truncate max-w-md font-semibold uppercase tracking-wider">{item.name}</span>
                </button>
              </td>
              <td className="py-4 px-4 text-slate-300 uppercase tracking-wider font-medium">{item.status}</td>
              <td className="py-4 px-4 text-slate-300 uppercase tracking-wider font-medium">{item.date}</td>
              <td className="py-4 px-4 text-slate-300 uppercase tracking-wider font-medium">{item.size}</td>
              <td className="py-4 px-4 text-right">
                <ContentActionButton item={item} onProjectAction={onProjectAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}