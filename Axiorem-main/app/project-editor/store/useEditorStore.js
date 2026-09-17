import { create } from 'zustand';

const CONTENT_DEFAULTS = Object.freeze({
  cover_page: { 
    subheading: "", 
    backgroundUrl: "", 
    backgroundUrlAssetId: null,
    logoUrl: "", 
    logoUrlAssetId: null,
    brandColor: "#0f172a" 
  },
  accordion: { accordionTitle: "", panels: [] },
  documentation: { 
    sectionTitle: "", 
    headline: "", 
    pages: [{ id: 'page_1', type: 'standard', title: 'Standard Page', elements: [{ id: 'el_1', type: 'text', content: '', isExpanded: true }] }],
    currentPageIndex: 0,
    goalsFormData: { title: '', description: '', linkText: '', goalLabel: '', placeholder: '', counterText: '', specifyBtnText: '', removeBtnText: '', helpLabel: '', helpText: '' },
    goalsAssessmentFormData: { title: '', description: '', lowRating: '', mediumRating: '', highRating: '', noGoalsText: '', helpLabel: '', helpText: '', legendHeader: '', goalHeader: '', ratingHeader: '' },
    documentExportFormData: { title: '', description: '', createBtnText: '', submitBtnText: '', successLabel: '', selectAllBtnText: '', exportBtnText: '', helpLabel: '', helpText: '', errorText: '' }
  },
  information_wall: { 
    sectionTitle: "Information Wall", 
    headline: "Default Headline", 
    panels: [{ id: 'page_default_1', type: 'standard', altText: '', hoverText: '', infoText: '', imageUrl: '', assetId: null, isExpanded: true }] 
  },
  course_presentation: { 
    slides: [],
    bodyImageAssetId: null,
    bodyLeftImageAssetId: null,
    bodyRightImageAssetId: null,
  },
  quiz: { 
    sectionTitle: 'Interactive Quiz', 
    shuffleQuestions: false, 
    timeLimit: 0, 
    passingScore: 80, 
    revealAnswers: true, 
    revealResults: true,
    questions: [] 
  }
});

const generateSectionId = (title = "section") => `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}_${Date.now()}`;

const ensureInitialCoverPage = (assignmentName) => [
  {
    id: "root-cover-page",
    title: assignmentName || "Untitled Document",
    contentType: "cover_page",
    deletable: false,
    movable: false,
    data: { ...CONTENT_DEFAULTS.cover_page }
  }
];

export const useEditorStore = create((set, get) => ({
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),

  currentView: "menu",
  sectionsExpanded: {},
  isFileMenuOpen: false,
  isViewMenuOpen: false,
  activeModal: null,
  isPreviewModeActive: false,
  toast: null,

  // Map tracking targeted asset upload states: [key = `${sectionId}_${targetField}`]: { uploading: boolean, progress: number }
  activeUploads: {},

  projectId: null,
  projectName: "Untitled Document",
  brandColor: "#0f172a",
  sections: ensureInitialCoverPage("Untitled Document"),
  activeSectionId: "root-cover-page",
  hasTimeLimit: false,
  timeLimitMinutes: 30,
  answerRevealMode: "side-by-side",
  requireFullscreen: false,
  enableAiGrading: false,
  candidateInstructions: "",
  isAddContentOpen: false,

  pendingAssetDeletions: [],

  setAssetUploadState: (key, uploading, progress = 0) => set((state) => ({
    activeUploads: {
      ...state.activeUploads,
      [key]: uploading ? { uploading: true, progress } : undefined
    }
  })),

  uploadAssetOptimistic: async ({ file, sectionId, targetField, assetIdField, uploadAssetFn }) => {
    if (!file || !uploadAssetFn) return;

    const uploadKey = `${sectionId}_${targetField}`;
    const previousData = get().getSectionData(sectionId);
    const previousAssetId = previousData[assetIdField];
    const previousUrl = previousData[targetField];

    // Local object blob for immediate layout rendering
    const previewUrl = URL.createObjectURL(file);

    // Immediate state mutation & inline loading initialization
    get().updateSectionData(sectionId, { [targetField]: previewUrl });
    get().setAssetUploadState(uploadKey, true, 0);

    try {
      const projectId = get().projectId;

      const res = await uploadAssetFn({
        file,
        projectId,
        onProgress: (progress) => {
          get().setAssetUploadState(uploadKey, true, progress);
        }
      });

      const resolvedUrl = res?.url || res?.uploadUrl || '';
      const resolvedAssetId = res?.assetId || res?.id || null;

      if (!resolvedUrl) {
        throw new Error("Ingestion finalized without returning a valid media URL.");
      }

      // Reconcile optimistic blob URL with persistent remote asset
      get().updateSectionData(sectionId, {
        [targetField]: resolvedUrl,
        [assetIdField]: resolvedAssetId
      });

      if (previousAssetId) {
        get().queueAssetForDeletion(previousAssetId);
      }
    } catch (err) {
      // Rollback to prior valid state on upload failure
      get().updateSectionData(sectionId, {
        [targetField]: previousUrl,
        [assetIdField]: previousAssetId
      });
      get().showToast(err.message || "Asset ingestion failed.", "error");
    } finally {
      URL.revokeObjectURL(previewUrl);
      get().setAssetUploadState(uploadKey, false, 0);
    }
  },

  queueAssetForDeletion: (assetId) => {
    if (!assetId) return;
    set((state) => ({
      pendingAssetDeletions: [...new Set([...state.pendingAssetDeletions, assetId])],
    }));
  },

  unqueueAssetForDeletion: (assetId) => {
    if (!assetId) return;
    set((state) => ({
      pendingAssetDeletions: state.pendingAssetDeletions.filter((id) => id !== assetId),
    }));
  },

  clearPendingDeletions: () => set({ pendingAssetDeletions: [] }),

  hydrateStore: (projectPayload) => {
    if (!projectPayload) return;

    const doc = projectPayload.data || projectPayload;
    
    const projectName = doc.projectName || doc.name || "Untitled Document";
    const brandColor = doc.brandColor || doc.settings?.brandColor || "#0f172a";
    
    const settings = doc.settings || {};
    const requireFullscreen = doc.requireFullscreen ?? settings.requireFullscreen ?? false;
    const enableAiGrading = doc.enableAiGrading ?? settings.enableAiGrading ?? false;
    const candidateInstructions = doc.candidateInstructions ?? settings.candidateInstructions ?? "";
    const hasTimeLimit = doc.hasTimeLimit ?? settings.hasTimeLimit ?? false;
    const timeLimitMinutes = doc.timeLimitMinutes ?? settings.timeLimitMinutes ?? 30;
    const answerRevealMode = doc.answerRevealMode ?? settings.answerRevealMode ?? "side-by-side";

    const rawSections = Array.isArray(doc.sections) && doc.sections.length > 0
      ? doc.sections
      : ensureInitialCoverPage(projectName);

    const parsedSections = rawSections.map((sec) => {
      const type = sec.contentType;
      const defaults = CONTENT_DEFAULTS[type] ? JSON.parse(JSON.stringify(CONTENT_DEFAULTS[type])) : {};
      return {
        ...sec,
        data: {
          ...defaults,
          ...(sec.data || {})
        }
      };
    });

    set({
      projectId: doc.id || null,
      projectName,
      brandColor,
      hasTimeLimit,
      timeLimitMinutes,
      answerRevealMode,
      requireFullscreen,
      enableAiGrading,
      candidateInstructions,
      sections: parsedSections,
      activeSectionId: parsedSections[0]?.id || "root-cover-page",
      pendingAssetDeletions: [],
      activeUploads: {},
      isDirty: false,
      
      sectionsExpanded: parsedSections.reduce((acc, sec) => {
        acc[sec.id] = true;
        return acc;
      }, {})
    });
  },

  setProjectId: (projectId) => set({ projectId }),
  setCurrentView: (currentView) => set({ currentView }),
  setIsFileMenuOpen: (isFileMenuOpen) => set({ isFileMenuOpen }),
  setIsViewMenuOpen: (isViewMenuOpen) => set({ isViewMenuOpen }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setCandidateInstructions: (candidateInstructions) => set({ candidateInstructions, isDirty: true }),
  setBrandColor: (brandColor) => set({ brandColor, isDirty: true }),
  setProjectName: (projectName) => set({ projectName, isDirty: true }),
  setActiveSectionId: (activeSectionId) => set({ activeSectionId }),
  setAddContentOpen: (isOpen) => set({ isAddContentOpen: isOpen }),
  setIsPreviewModeActive: (isPreviewModeActive) => set({ isPreviewModeActive }),
  togglePreviewMode: () => set((state) => ({ isPreviewModeActive: !state.isPreviewModeActive })),
  showToast: (message, type = 'error') => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),

  resetToNewDocument: () => {
    const defaultName = "Untitled Document";
    set({
      projectId: null,
      projectName: defaultName,
      brandColor: "#0f172a",
      sections: ensureInitialCoverPage(defaultName),
      activeSectionId: "root-cover-page",
      hasTimeLimit: false,
      candidateInstructions: "",
      isPreviewModeActive: false,
      pendingAssetDeletions: [],
      activeUploads: {},
      isDirty: false,
      sectionsExpanded: { "root-cover-page": true }
    });
  },

  toggleSection: (sectionId) => set((state) => ({
    sectionsExpanded: { ...state.sectionsExpanded, [sectionId]: !state.sectionsExpanded[sectionId] }
  })),
  
  updateSectionTitle: (id, newTitle) => set((state) => ({
    isDirty: true,
    sections: state.sections.map((s) => s.id === id ? { ...s, title: newTitle } : s)
  })),

  reorderSections: (newSections) => set((state) => {
    const coverNode = state.sections.find(s => s.id === "root-cover-page") || ensureInitialCoverPage(state.projectName)[0];
    const filteredPayload = newSections.filter(s => s.id !== "root-cover-page");
    return { sections: [coverNode, ...filteredPayload], isDirty: true };
  }),

  handleSectionTitleChange: (sectionId, title) => set((state) => ({
    isDirty: true,
    sections: state.sections.map(s => {
      if (s.id !== sectionId) return s;

      const updatedData = { ...s.data };
      if (s.contentType === 'accordion') {
        updatedData.accordionTitle = title;
      } else {
        updatedData.title = title;
        updatedData.sectionTitle = title;
      }

      return {
        ...s,
        title,
        data: updatedData
      };
    })
  })),

  updateSectionField: (id, field, value) => set((state) => ({
    isDirty: true,
    sections: state.sections.map((s) => {
      if (s.id !== id) return s;
      
      const updatedSection = { ...s, [field]: value };
      
      if (field === 'contentType' && value && CONTENT_DEFAULTS[value]) {
        updatedSection.data = JSON.parse(JSON.stringify(CONTENT_DEFAULTS[value]));
      }
      
      return updatedSection;
    })
  })),

  appendNewContentNode: (contentType, title) => {
    const id = generateSectionId(title);
    const defaults = CONTENT_DEFAULTS[contentType] ? JSON.parse(JSON.stringify(CONTENT_DEFAULTS[contentType])) : {};
    
    if (contentType === 'accordion') {
      defaults.accordionTitle = title;
    } else {
      defaults.title = title;
      defaults.sectionTitle = title;
    }

    const newSection = {
      id,
      title,
      contentType,
      source: '',
      data: defaults
    };

    set((state) => ({
      sections: [...state.sections, newSection],
      sectionsExpanded: { ...state.sectionsExpanded, [id]: true },
      activeSectionId: id,
      currentView: "content_plan",
      isDirty: true
    }));
  },

  updateSectionData: (sectionId, newData) => set((state) => ({
    isDirty: true,
    sections: state.sections.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        data: {
          ...s.data,
          ...newData
        }
      };
    })
  })),

  getSectionData: (sectionId) => get().sections.find(s => s.id === sectionId)?.data || {},

  deleteSection: (id) => {
    if (id === "root-cover-page") {
      get().showToast("Cannot delete the cover page. It is required for all documents.", "error");
      return;
    }
    set((state) => {
      const sections = state.sections.filter(s => s.id !== id);
      return {
        sections,
        isDirty: true,
        activeSectionId: state.activeSectionId === id ? (sections[0]?.id || null) : state.activeSectionId
      };
    });
  }
}));