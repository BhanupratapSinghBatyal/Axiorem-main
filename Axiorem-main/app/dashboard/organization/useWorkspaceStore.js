import { create } from 'zustand';

export const useWorkspaceStore = create((set, get) => ({
  // UI State
  activeTab: 'Members',
  viewMode: 'list',
  isWorkspaceDropdownOpen: false,
  isInvitePanelOpen: false,
  isLeaveModalOpen: false,
  activeMenuId: null,
  isMemberPanelOpen: false,
  selectedMember: null,
  isProjectPanelOpen: false,
  selectedProject: null,
  
  // Interaction State
  inviteEmail: '',
  inviteRole: 'MEMBER',
  feedbackMessage: { type: '', text: '' },
  isSwitchingWorkspace: false,
  generatedInviteUrl: '',
  copiedLink: false,
  isGeneratingUrl: false,

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setIsWorkspaceDropdownOpen: (isOpen) => set({ isWorkspaceDropdownOpen: isOpen }),
  toggleWorkspaceDropdown: () => set((state) => ({ isWorkspaceDropdownOpen: !state.isWorkspaceDropdownOpen })),
  setIsInvitePanelOpen: (isOpen) => set({ isInvitePanelOpen: isOpen, generatedInviteUrl: '', copiedLink: false }),
  setIsLeaveModalOpen: (isOpen) => set({ isLeaveModalOpen: isOpen }),
  setActiveMenuId: (id) => set({ activeMenuId: id }),
  setInviteEmail: (email) => set({ inviteEmail: email }),
  setInviteRole: (role) => set({ inviteRole: role }),
  setIsMemberPanelOpen: (isOpen) => set({ isMemberPanelOpen: isOpen }),
  setSelectedMember: (member) => set({ selectedMember: member }),
  setIsProjectPanelOpen: (isOpen) => set({ isProjectPanelOpen: isOpen }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setFeedbackMessage: (feedbackMessage) => set({ feedbackMessage }),

  // Logic Actions
  handleGenerateShareableLink: async (sendInvitation) => {
    set({ feedbackMessage: { type: '', text: '' }, isGeneratingUrl: true });
    try {
      const result = await sendInvitation({ email: '', role: get().inviteRole, isReusable: true });
      const serverUrl = result?.deliveryMatrix?.invitationUrl;
      if (serverUrl) set({ generatedInviteUrl: serverUrl });
      else throw new Error("Invitation token channel payload address structurally absent.");
    } catch (err) {
      set({ feedbackMessage: { type: 'error', text: err.message || 'Failed to acquire backend shareable link context.' } });
    } finally {
      set({ isGeneratingUrl: false });
    }
  },

  handleCopyLink: async () => {
    const { generatedInviteUrl } = get();
    if (!generatedInviteUrl) return;
    try {
      await navigator.clipboard.writeText(generatedInviteUrl);
      set({ copiedLink: true });
      setTimeout(() => set({ copiedLink: false }), 2000);
    } catch (err) {
      console.error('Failed to copy workspace token path link.', err);
    }
  },

  handleSendInviteSubmit: async (e, sendInvitation) => {
    e.preventDefault();
    const { inviteEmail, inviteRole } = get();
    if (!inviteEmail.trim()) return;
    set({ feedbackMessage: { type: '', text: '' } });
    try {
      await sendInvitation({ email: inviteEmail.trim(), role: inviteRole, isReusable: false });
      set({ feedbackMessage: { type: 'success', text: 'Workspace entry invitation successfully transferred to destination.' }, inviteEmail: '' });
    } catch (err) {
      set({ feedbackMessage: { type: 'error', text: err.message || 'Upstream provisioning pipeline exception encountered.' } });
    }
  },

  handleSelectWorkspace: async (workspace, normalizedWorkspace) => {
    const workspaceId = workspace?.workspaceId || workspace?.id;
    if (!workspaceId || workspaceId === (normalizedWorkspace?.workspaceId || normalizedWorkspace?.id)) {
      set({ isWorkspaceDropdownOpen: false });
      return;
    }

    set({ isSwitchingWorkspace: true });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/api/v1/users/active-workspace`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ workspaceId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || data?.details || 'Failed to switch active workspace.');
      }
      set({ isWorkspaceDropdownOpen: false });
      window.location.reload();
    } catch (error) {
      set({ feedbackMessage: { type: 'error', text: error.message || 'Failed to switch workspace.' } });
    } finally {
      set({ isSwitchingWorkspace: false });
    }
  }
}));