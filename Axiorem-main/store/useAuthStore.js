import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      // Volatile State Primitives (Cleared automatically on refresh unless re-hydrated from a server session)
      user: null,
      workspaces: [],
      hasActiveWorkspace: false,
      isAuthenticated: false,
      isLoading: true,

      /**
       * Dynamically calculates and formats the current active workspace based on state primitives.
       */
      getCurrentWorkspace: () => {
        const currentUser = get().user;
        const list = get().workspaces || [];
        if (!currentUser) return null;

        const targetId = currentUser.lastAccessedWorkspaceId || currentUser.personalWorkspaceId;
        
        // FIXED: Explicitly aligns cross-reference fields checking both target key schemas
        const rawWorkspace = list.find((ws) => ws.organizationId === targetId || ws.id === targetId) || list[0] || null;

        if (!rawWorkspace) return null;

        return {
          ...rawWorkspace,
          organizationName: rawWorkspace.organizationName || rawWorkspace.name || "Default Workspace",
          activeMembersCount: rawWorkspace.activeMembersCount ?? rawWorkspace.membersCount ?? 0,
          totalProjectsCount: rawWorkspace.totalProjectsCount ?? rawWorkspace.projectsCount ?? 0,
          resourcesSavedCount: rawWorkspace.resourcesSavedCount ?? rawWorkspace.resourcesCount ?? 0,
        };
      },

      /**
       * Ingests the structure returned by the auth API endpoint into volatile memory.
       */
      setSession: (payloadWrapper) => {
        if (!payloadWrapper) return;
        
        // FIXED: Force standard parsing out of the corrected uniform backend response payload context wrapper
        const targetedUserData = payloadWrapper.user;
        if (!targetedUserData) return;

        const normalizedAvatarUrl =
          targetedUserData.avatarUrl ||
          targetedUserData.avatar ||
          targetedUserData.photoURL ||
          targetedUserData.picture ||
          targetedUserData.profilePicture ||
          '';

        const { 
          id, 
          email, 
          name, 
          occupationRole, 
          personalWorkspaceId, 
          lastAccessedWorkspaceId, 
          hasActiveWorkspace, 
          compliance, 
          workspaces 
        } = targetedUserData;

        set({
          user: {
            id,
            email,
            name,
            avatarUrl: normalizedAvatarUrl,
            occupationRole,
            personalWorkspaceId,
            lastAccessedWorkspaceId,
            compliance: {
              hasAcceptedTerms: compliance?.hasAcceptedTerms || false,
              termsVersionAccepted: compliance?.termsVersionAccepted || '',
              hasAcceptedPrivacyPolicy: compliance?.hasAcceptedPrivacyPolicy || false,
              privacyPolicyVersion: compliance?.privacyPolicyVersion || ''
            }
          },
          workspaces: workspaces || [],
          hasActiveWorkspace: !!hasActiveWorkspace,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      /**
       * Updates the active workspace track state when toggling context.
       */
      setLastAccessedWorkspace: (workspaceId) => {
        set((state) => ({
          user: state.user ? { ...state.user, lastAccessedWorkspaceId: workspaceId } : null
        }));
      },

      /**
       * Sets the global loading state.
       */
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      /**
       * Purges all state slices and drops persistence keys on logout.
       */
      clearSession: () => {
        set({
          user: null,
          workspaces: [],
          hasActiveWorkspace: false,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'axiorem-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // CRITICAL: Strips user, workspaces, and compliance structures entirely out of LocalStorage.
      // This maintains the persistent flag required for auto-routing layouts, but mandates fresh DB re-hydration.
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);