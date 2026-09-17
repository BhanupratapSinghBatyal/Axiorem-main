"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Info, 
  ChevronDown, 
  Download, 
  Users, 
  FolderOpen,
  FileText,
  SlidersHorizontal,
  List,
  LayoutGrid,
  FileIcon,
  MoreVertical,
  Building,
  Trash2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useOrganizationData } from '../../../hooks/useOrganizationData';
import { useWorkspaceInvitations } from '../../../hooks/useWorkspaceInvitations';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useWorkspaceActions } from '../../../hooks/useWorkspaceActions';
import { useWorkspaceStore } from './useWorkspaceStore';
import { useOrganizationProjectData, useOrganizationProjectActions } from '../../../hooks/useOrganizationProjectData';
import InvitePanel from './components/panels/InvitePanel';
import MemberDetailsPanel from './components/panels/MemberDetailsPanel';
import ProjectDetailsPanel from './components/panels/ProjectDetailsPanel';
import DataTable from './components/shared/DataTable';
import Toast from './components/shared/Toast';
import LeaveWorkspaceModal from './components/modal/LeaveWorkspaceModal';
import OrganizationSkeleton from './OrganizationSkeleton';


const FILES_DATA = [
  // {
  //   id: 'f1',
  //   name: 'Workplace Safety Manual.pdf',
  //   type: 'pdf',
  //   date: '25 Jul, 2024',
  //   size: '2.4 MB',
  // },
  // {
  //   id: 'f2',
  //   name: 'Equipment Inspection Register.xlsx',
  //   type: 'xlsx',
  //   date: '24 Jul, 2024',
  //   size: '1.8 MB',
  // },
  // {
  //   id: 'f3',
  //   name: 'Global Supply Chain Procedures.pdf',
  //   type: 'pdf',
  //   date: '23 Jul, 2024',
  //   size: '57.84 MB',
  // },
  // {
  //   id: 'f4',
  //   name: 'Employee Code of Conduct.docx',
  //   type: 'docx',
  //   date: '23 Jul, 2024',
  //   size: '5.6 MB',
  // },
  // {
  //   id: 'f5',
  //   name: 'Annual Compliance Training.ppt',
  //   type: 'ppt',
  //   date: '23 Jul, 2024',
  //   size: '48.5 MB',
  // },
  // {
  //   id: 'f6',
  //   name: 'Quarterly Risk Assessment.xlsx',
  //   type: 'xlsx',
  //   date: '22 Jul, 2024',
  //   size: '2.6 MB',
  // },
  // {
  //   id: 'f7',
  //   name: 'Data Protection Policy.doc',
  //   type: 'doc',
  //   date: '22 Jul, 2024',
  //   size: '5.4 MB',
  // },
  // {
  //   id: 'f8',
  //   name: 'Incident Response Procedures.ppt',
  //   type: 'ppt',
  //   date: '21 Jul, 2024',
  //   size: '4.3 MB',
  // },
];

export default function OrganizationPage() {
  const router = useRouter();
  const PROJECTS_PAGE_SIZE = 10;
  const [currentProjectsPage, setCurrentProjectsPage] = useState(1);
  const { workspace: normalizedWorkspace, isLoading, activeWorkspaces, members } = useOrganizationData();
  const { sendInvitation, isProcessing } = useWorkspaceInvitations();
  const {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    isWorkspaceDropdownOpen,
    setIsWorkspaceDropdownOpen,
    isInvitePanelOpen,
    setIsInvitePanelOpen,
    isLeaveModalOpen,
    setIsLeaveModalOpen,
    activeMenuId,
    setActiveMenuId,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    feedbackMessage,
    setFeedbackMessage,
    isSwitchingWorkspace,
    generatedInviteUrl,
    copiedLink,
    isGeneratingUrl,
    handleGenerateShareableLink,
    handleCopyLink,
    handleSendInviteSubmit,
    handleSelectWorkspace,
    isMemberPanelOpen,
    setIsMemberPanelOpen,
    selectedMember,
    setSelectedMember,
    isProjectPanelOpen,
    setIsProjectPanelOpen,
    selectedProject,
    setSelectedProject,
  } = useWorkspaceStore();
  const { leaveWorkspace, terminateMember, promoteMember, demoteMember, isProcessing: isActionProcessing } = useWorkspaceActions(setFeedbackMessage);
  const {
    projects,
    totalProjects,
    page: projectsPage,
    totalPages: projectsTotalPages,
    hasPreviousPage: hasPreviousProjectsPage,
    hasNextPage: hasNextProjectsPage,
    isLoading: isProjectsLoading,
  } = useOrganizationProjectData({
    activeTab: activeTab.toLowerCase(),
    page: currentProjectsPage,
    limit: PROJECTS_PAGE_SIZE,
  });

  const { duplicateProject, isDuplicating } = useOrganizationProjectActions();

  const activeWorkspace = activeWorkspaces?.find(w => w.isLastAccessed);
  const isRestrictedByPlan = ['FREE', 'INDIVIDUAL'].includes(normalizedWorkspace?.subscriptionTier?.toUpperCase());
  const isInsufficientRole = activeWorkspace && !activeWorkspace.isPersonal && !['ADMIN', 'OWNER'].includes(activeWorkspace.role);
  const shouldDisableInvite = isRestrictedByPlan || isInsufficientRole;

  const currentWorkspaceName = normalizedWorkspace?.name || "Default Workspace";
  const metrics = normalizedWorkspace?.metricsSnapshot;

  const menuRef = useRef(null);
  const workspaceDropdownRef = useRef(null);
  const panelRef = useRef(null);
  const memberPanelRef = useRef(null);
  const projectPanelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // Ignore clicks on elements that were detached during state updates
      if (!document.body.contains(event.target)) return;

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
      
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target)) {
        setIsWorkspaceDropdownOpen(false);
      }

      if (
        isInvitePanelOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !event.target.closest('.invite-trigger-btn')
      ) {
        setIsInvitePanelOpen(false);
      }

      if (
        isMemberPanelOpen &&
        memberPanelRef.current &&
        !memberPanelRef.current.contains(event.target) &&
        !event.target.closest('.member-actions-trigger-btn')
      ) {
        setIsMemberPanelOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isInvitePanelOpen, isMemberPanelOpen, isWorkspaceDropdownOpen, activeMenuId]);

  const toggleMenu = (id, e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === id ? null : id); };
  const handleWorkspaceSelect = (workspace) => handleSelectWorkspace(workspace, normalizedWorkspace);
  const handleGenerateShareableLinkClick = () => handleGenerateShareableLink(sendInvitation);
  const handleSendInviteSubmitClick = (event) => handleSendInviteSubmit(event, sendInvitation);
  const handleOpenMemberPanel = (member) => {
    setSelectedMember(member);
    setIsMemberPanelOpen(true);
  };
  const handleCloseMemberPanel = () => setIsMemberPanelOpen(false);

  const handleOpenProjectPanel = (project) => {
    setSelectedProject(project);
    setIsProjectPanelOpen(true);
  };
  const handleCloseProjectPanel = () => setIsProjectPanelOpen(false);

  const handleCopy = async (item) => {
    try {
      await duplicateProject(item.id);
      setFeedbackMessage({
        type: 'success',
        text: `Successfully copied project to library.`,
      });
    } catch (error) {
      console.error('Error copying project:', error);
      setFeedbackMessage({
        type: 'error',
        text: `Failed to copy project: ${error.message}`,
      });
    }
  };

  const handleNavigateToProject = (project) => {
    router.push(`/project-editor?id=${encodeURIComponent(project.id)}`);
  };

    const handlePromoteMember = async (member) => {
  if (!member?.membershipId || !activeWorkspace?.id) return;

  try {
    await promoteMember({
      workspaceId: activeWorkspace.id,
      membershipId: member.membershipId
    });
    setFeedbackMessage({
      type: 'success',
      text: `Successfully promoted ${member?.name || 'the user'}.`
    });
    setIsMemberPanelOpen(false);
  }
  catch {
    setFeedbackMessage({
      type: 'error',
      text: `${member?.name || 'Member'} promotion failed.`,
    });
  };
};

  const handleDemoteMember = async (member) => {
  if (!member?.membershipId || !activeWorkspace?.id) return;

  try {
    await demoteMember({
      workspaceId: activeWorkspace.id,
      membershipId: member.membershipId
    });
    setFeedbackMessage({
      type: 'success',
      text: `Successfully demoted ${member?.name || 'the user'}.`
    });
    setIsMemberPanelOpen(false);
  }
  catch {
    setFeedbackMessage({
      type: 'error',
      text: `${member?.name || 'Member'} demotion failed.`,
    });
  };
};

  const handleRemoveMember = async (member) => {
    if (!member?.membershipId || !activeWorkspace?.id) return;

    try {
      await terminateMember({
        workspaceId: activeWorkspace.id,
        membershipId: member.membershipId
      });
      setFeedbackMessage({
        type: 'success',
        text: `Successfully terminated membership for ${member?.name || 'the user'}.`
      });
      setIsMemberPanelOpen(false);
    } catch {
      // The hook already routes the error into the shared toast store.
    }
  };

  const tabs = [
    { name: 'Members', icon: Users, count: metrics?.activeMembers ?? 0 },
    { name: 'Projects', icon: FolderOpen, count: metrics?.totalProjects ?? 0 },
    { name: 'Resources', icon: FileText, count: metrics?.resourcesSaved ?? 0 }
  ];

  const activeData = activeTab === 'Projects' ? projects : FILES_DATA;

  useEffect(() => {
    setCurrentProjectsPage(1);
  }, [activeTab]);

  const handlePreviousProjectsPage = () => {
    if (!hasPreviousProjectsPage || isProjectsLoading) return;
    setCurrentProjectsPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextProjectsPage = () => {
    if (!hasNextProjectsPage || isProjectsLoading) return;
    setCurrentProjectsPage((prev) => prev + 1);
  };

  const ActionMenu = ({ id }) => (
    <div ref={menuRef} className="absolute right-0 mt-1.5 w-48 bg-[#3A3A3A] rounded-sm shadow-lg z-50 py-1 text-left">
      <button onClick={() => setActiveMenuId(null)} className="w-full px-3 py-1.5 text-xs text-white hover:bg-slate-600 flex items-center gap-2 transition-colors">
        <Building className="h-3.5 w-3.5" /> <span>Share with Organization</span>
      </button>
      <div className="border-t border-slate-600 my-1" />
      <button onClick={() => setActiveMenuId(null)} className="w-full px-3 py-1.5 text-xs text-red-300 hover:bg-slate-600 flex items-center gap-2 transition-colors">
        <Trash2 className="h-3.5 w-3.5" /> <span>Delete</span>
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-[#292929] text-white font-sans antialiased overflow-hidden relative">
        <OrganizationSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#212121] antialiased text-white min-h-screen relative">
      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 relative justify-between" ref={workspaceDropdownRef}>
            <div className="relative flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                {isLoading ? "Loading..." : currentWorkspaceName}
              </span>
              <button
                type="button"
                onClick={() => setIsWorkspaceDropdownOpen((current) => !current)}
                className="p-0.5 rounded-sm hover:bg-slate-700 text-slate-300 transition-colors"
                aria-haspopup="menu"
                aria-expanded={isWorkspaceDropdownOpen}
                aria-label="Switch active workspace"
              >
                <ChevronDown className="h-3 w-3" />
              </button>

              {isWorkspaceDropdownOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-sm border border-slate-700 bg-[#2A2A2A] shadow-2xl">
                  <div className="border-b border-slate-700 px-3 py-2">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Active Workspaces</p>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-1">
                    {activeWorkspaces?.length ? (
                      activeWorkspaces.map((workspace) => {
                        const workspaceId = workspace?.workspaceId || workspace?.id;
                        const isCurrent = workspaceId === (normalizedWorkspace?.workspaceId || normalizedWorkspace?.id);

                        return (
                          <button
                            key={workspaceId}
                            type="button"
                            onClick={() => handleWorkspaceSelect(workspace)}
                            disabled={isSwitchingWorkspace}
                            className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-[#3A3A3A] disabled:cursor-not-allowed disabled:opacity-60 ${isCurrent ? 'bg-[#212121]' : ''}`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="truncate text-xs font-medium text-white">
                                  {workspace?.name || workspace?.organizationName || 'Workspace'}
                                </span>
                                {isCurrent && (
                                  <span className="rounded-sm border border-[#1b365d] bg-[#1b365d]/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-blue-200">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                                {workspace?.role || 'Member'}
                              </p>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-3 text-xs text-slate-400">No workspaces available.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider bg-slate-700 px-2 py-0.5 rounded-sm">
              {normalizedWorkspace?.subscriptionTier || "FREE"} PLAN
            </span>
          </div>
          <h1 className="text-xl font-medium tracking-tight text-white">Workspace Settings</h1>
        </div>

        <div className="border-b border-slate-700">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                  <button key={tab.name} onClick={() => { setActiveTab(tab.name); setActiveMenuId(null); }} className={`flex items-center gap-2 px-1 py-2 border-b-2 text-xs transition-all ${isActive ? 'border-[#1b365d] text-white' : 'border-transparent text-slate-300 hover:text-white'}`}>
                    <tab.icon className="h-3.5 w-3.5" /> <span>{tab.name}</span>
                    <span className={`text-[10px] px-1 rounded-sm ${isActive ? 'bg-slate-600' : 'bg-[#3A3A3A]'}`}>{tab.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeTab === 'Members' ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-300">Overview</h2>
              <div className="flex flex-col items-stretch gap-2">
                {shouldDisableInvite ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex">
                        <button disabled className="flex text-xs px-3 py-1.5 rounded-sm items-center gap-1.5 h-8 bg-slate-600 text-slate-300 cursor-not-allowed opacity-60">
                          <UserPlus className="w-3.5 h-3.5" /> <span>Create Workspace Invite</span>
                        </button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {isRestrictedByPlan 
                        ? "Upgrade to Teams or Enterprise to Create Invites and Collaborate" 
                        : "Only Admins and Owners can manage workspace invitations."}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <button onClick={() => setIsInvitePanelOpen(true)} className="invite-trigger-btn flex bg-[#1b365d] hover:bg-[#2a4a7a] text-white text-xs px-3 py-1.5 rounded-sm items-center justify-center gap-1.5 h-8">
                    <UserPlus className="w-3.5 h-3.5" /> <span>Create Workspace Invite</span>
                  </button>
                )}
                {!activeWorkspace?.isPersonal && (
                  <button 
                    type="button" 
                    onClick={() => setIsLeaveModalOpen(true)}
                    className="flex bg-transparent hover:bg-red-900/20 text-red-400 hover:text-red-300 text-xs font-medium px-3 py-1.5 rounded-sm items-center justify-center gap-1.5 h-8 border border-red-900 transition-colors uppercase tracking-wider"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-2" /> 
                    <span>Leave Workspace</span>
                  </button>
                )}
              </div>
            </div>

            {/* Micro Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#3A3A3A] rounded-sm p-4 shadow-md flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-xl font-medium tracking-tight text-white">
                    {metrics?.activeAdmins ?? 0}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span>Admin</span>
                    <Info className="h-3 w-3 cursor-pointer" />
                  </div>
                </div>
                <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                  {members?.filter(member => member.role === 'OWNER' || member.role === 'ADMIN').slice(0, 2).map((member, index) => (
                    <img key={index} src={member.avatar || 'https://via.placeholder.com/24'} alt={member.name} className="w-6 h-6 rounded-sm border-2 border-[#3A3A3A]" />
                  ))}
                </div>
              </div>

              <div className="bg-[#3A3A3A] rounded-sm p-4 shadow-md flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-xl font-medium tracking-tight text-white">
                    {metrics?.activeMembers ?? 0}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span>Members</span>
                    <Info className="h-3 w-3 cursor-pointer" />
                  </div>
                </div>
                <div className="flex items-center shrink-0">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {members?.filter(member => member.role === 'MEMBER').slice(0, 3).map((member, index) => (
                      <img key={index} src={member.avatar || 'https://via.placeholder.com/24'} alt={member.name} className="w-6 h-6 rounded-sm border-2 border-[#3A3A3A]" />
                    ))}
                  </div>
                  {members?.filter(member => member.role === 'MEMBER').length > 3 && (
                    <span className="text-[10px] font-medium text-slate-300 ml-1.5">+{members.filter(member => member.role === 'MEMBER').length - 3}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
              {/* <div className="relative w-full lg:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Enter a name or email address" 
                  className="w-full bg-[#3A3A3A] rounded-sm pl-8 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1b365d] text-white placeholder-slate-400"
                />
              </div> */}

              {/* <div className="grid grid-cols-2 sm:flex items-center justify-end gap-1.5 w-full lg:w-auto">
                <button className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-sm bg-[#3A3A3A] text-xs text-slate-300 hover:bg-slate-600 w-full sm:w-auto sm:min-w-17.5">
                  <span>All</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>
                <button className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-sm bg-[#3A3A3A] text-xs text-slate-300 hover:bg-slate-600 w-full sm:w-auto sm:min-w-20">
                  <span>Active</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>
                <button className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#3A3A3A] text-xs text-white hover:bg-slate-600 transition-all w-full sm:w-auto">
                  <Download className="h-3.5 w-3.5 shrink-0" />
                  <span>Download CSV</span>
                </button>
              </div> */}
            </div>

            <DataTable
              variant="members"
              members={members || []}
              onMemberAction={handleOpenMemberPanel}
            />
          </div>
        ) : (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-medium text-slate-300 capitalize">
                  All {activeTab.toLowerCase()}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                {/* <div className="relative w-full sm:w-56">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={`Search ${activeTab.toLowerCase()}...`}
                    className="w-full bg-[#3A3A3A] rounded-sm pl-8 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1b365d] text-white placeholder-slate-400 transition-all"
                  />
                </div> */}
                
                <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto mt-0.5 sm:mt-0">
                  {/* <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-[#3A3A3A] text-xs text-slate-300 hover:bg-slate-600 transition-colors">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filter
                  </button> */}
                  
                  <div className="flex items-center bg-[#3A3A3A] rounded-sm p-0.5 shrink-0">
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-1 rounded-sm transition-all ${viewMode === 'list' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-1 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === 'list' ? (
              <DataTable
                variant="content"
                items={activeData}
                isLoading={isProjectsLoading}
                activeTab={activeTab}
                activeMenuId={activeMenuId}
                onToggleMenu={toggleMenu}
                ActionMenu={ActionMenu}
                onProjectAction={handleOpenProjectPanel}
                onProjectClick={handleNavigateToProject}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeData.map((item) => (
                  <div key={item.id} className="bg-[#3A3A3A] rounded-sm p-4 flex flex-col justify-between space-y-4 transition-colors group relative overflow-visible shadow-md hover:shadow-lg">
                    <div className="flex items-start justify-between">
                      {activeTab === 'Projects' ? <FolderOpen className="h-5 w-5 text-white" /> : <FileIcon className="h-5 w-5 text-white" />}
                      <div className="relative">
                        <button 
                          onClick={(e) => toggleMenu(item.id, e)}
                          className="p-1 rounded-sm hover:bg-slate-700 text-slate-400 hover:text-white"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                        {activeMenuId === item.id && <ActionMenu id={item.id} />}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-medium text-xs text-white line-clamp-1 transition-colors cursor-pointer">{item.name}</h3>
                      <div className="flex items-center justify-between text-[10px] text-slate-300">
                        <span>{item.date}</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Projects' && totalProjects > 0 && (
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePreviousProjectsPage}
                  disabled={!hasPreviousProjectsPage || isProjectsLoading}
                  className="inline-flex items-center gap-1 rounded-sm border border-slate-600 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </button>

                <span className="text-xs text-slate-300">
                  Page {projectsPage} / {projectsTotalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNextProjectsPage}
                  disabled={!hasNextProjectsPage || isProjectsLoading}
                  className="inline-flex items-center gap-1 rounded-sm border border-slate-600 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      <InvitePanel
        isOpen={isInvitePanelOpen}
        panelRef={panelRef}
        currentWorkspaceName={currentWorkspaceName}
        activeMembersCount={metrics?.activeMembers ?? 0}
        isTeamsPlan={normalizedWorkspace?.subscriptionTier?.toUpperCase() === 'TEAMS'}
        generatedInviteUrl={generatedInviteUrl}
        copiedLink={copiedLink}
        isProcessing={isProcessing}
        isGeneratingUrl={isGeneratingUrl}
        inviteEmail={inviteEmail}
        inviteRole={inviteRole}
        feedbackMessage={feedbackMessage}
        onClose={() => setIsInvitePanelOpen(false)}
        onGenerateLink={handleGenerateShareableLinkClick}
        onCopyLink={handleCopyLink}
        onSubmit={handleSendInviteSubmitClick}
        onInviteEmailChange={setInviteEmail}
        onInviteRoleChange={setInviteRole}
      />
      <MemberDetailsPanel
        isOpen={isMemberPanelOpen}
        panelRef={memberPanelRef}
        member={selectedMember}
        onClose={handleCloseMemberPanel}
        onPromote={handlePromoteMember}
        onDemote={handleDemoteMember}
        onRemove={handleRemoveMember}
        currentWorkspaceRole={activeWorkspace?.role}
        currentUserEmail={normalizedWorkspace?.userEmail || ""}
        isProcessing={isActionProcessing}
      />
      <ProjectDetailsPanel
        isOpen={isProjectPanelOpen}
        panelRef={projectPanelRef}
        item={selectedProject}
        activeTab={activeTab}
        onClose={handleCloseProjectPanel}
        onCopy={handleCopy}
        isProcessing={isDuplicating}
        currentWorkspaceRole={activeWorkspace?.role}
      />
      {feedbackMessage?.text ? (
        <Toast
          message={feedbackMessage.text}
          type={feedbackMessage.type || 'success'}
          onClose={() => setFeedbackMessage({ type: '', text: '' })}
        />
      ) : null}
      <LeaveWorkspaceModal
        isOpen={isLeaveModalOpen}
        isProcessing={isProcessing}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={async () => {
          try {
            await leaveWorkspace(activeWorkspace.id || activeWorkspace.workspaceId);
            window.location.reload();
          } catch {
            // The hook already routes the error into the shared toast store.
          }
        }}
      />
    </div>
  );
}
