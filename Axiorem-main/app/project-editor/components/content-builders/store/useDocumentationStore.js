import { create } from 'zustand';
import { useEditorStore } from '../../../store/useEditorStore';

const INITIAL_GOALS_FORM = {
  title: '',
  description: '',
  linkText: '',
  goalLabel: '',
  placeholder: '',
  counterText: '',
  specifyBtnText: '',
  removeBtnText: '',
  helpLabel: '',
  helpText: ''
};

const INITIAL_ASSESSMENT_FORM = {
  title: '',
  description: '',
  lowRating: '',
  mediumRating: '',
  highRating: '',
  noGoalsText: '',
  helpLabel: '',
  helpText: '',
  legendHeader: '',
  goalHeader: '',
  ratingHeader: ''
};

const INITIAL_EXPORT_FORM = {
  title: '',
  description: '',
  createBtnText: '',
  submitBtnText: '',
  successLabel: '',
  selectAllBtnText: '',
  exportBtnText: '',
  helpLabel: '',
  helpText: '',
  errorText: ''
};

const createDefaultElement = (type = 'text') => {
  const id = `el_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const base = { id, type, isExpanded: true, source: '' };

  switch (type) {
    case 'accordion':
      return {
        ...base,
        accordionTitle: '',
        panels: [{ id: `p_${Date.now()}`, title: '', content: '', isExpanded: true, source: '' }],
        activePanelId: `p_${Date.now()}`
      };
    case 'text_input':
      return {
        ...base,
        inputDescription: '',
        inputPlaceholder: '',
        inputMaxLength: '',
        inputSize: '1 line',
        inputRequired: false
      };
    case 'image':
      return {
        ...base,
        imageSrc: null,
        imageAssetId: null,
        imageAlt: '',
        imageHover: ''
      };
    case 'text':
    default:
      return {
        ...base,
        content: ''
      };
  }
};

export const useDocumentationStore = create((set, get) => ({
  // --- Global State ---
  sectionTitle: '',
  sectionId: null,
  headline: '',
  pages: [
    {
      id: 'page_1',
      type: 'standard',
      title: 'Standard Page',
      source: '',
      elements: [createDefaultElement('text')]
    }
  ],
  currentPageIndex: 0,
  initialized: false,
  activeElementId: null,

  // --- Form Objects ---
  goalsFormData: { ...INITIAL_GOALS_FORM },
  goalsAssessmentFormData: { ...INITIAL_ASSESSMENT_FORM },
  documentExportFormData: { ...INITIAL_EXPORT_FORM },

  // --- Initialization Pipeline ---
  initializeStore: (sectionId, initialData = {}) => {
    if (get().initialized && get().sectionId === sectionId) return;

    const defaultPages = [
      {
        id: 'page_1',
        type: 'standard',
        title: 'Standard Page',
        source: '',
        elements: [createDefaultElement('text')]
      }
    ];

    const pages = initialData.pages?.length ? initialData.pages : defaultPages;
    const currentIndex = initialData.currentPageIndex ?? 0;
    const activePage = pages[currentIndex] || pages[0];

    set({
      sectionId,
      sectionTitle: initialData.sectionTitle || '',
      headline: initialData.headline || '',
      pages,
      currentPageIndex: currentIndex,
      activeElementId: activePage?.elements?.[0]?.id || null,
      goalsFormData: { ...INITIAL_GOALS_FORM, ...initialData.goalsFormData },
      goalsAssessmentFormData: { ...INITIAL_ASSESSMENT_FORM, ...initialData.goalsAssessmentFormData },
      documentExportFormData: { ...INITIAL_EXPORT_FORM, ...initialData.documentExportFormData },
      initialized: true
    });
  },

  initializeFromEditor: (sectionId) => {
    const editorState = useEditorStore.getState();
    const section = editorState.sections?.find((s) => s.id === sectionId);
    if (section) {
      get().initializeStore(sectionId, section.data);
    }
  },

  syncToEditor: () => {
    const {
      sectionId,
      sectionTitle,
      headline,
      pages,
      currentPageIndex,
      goalsFormData,
      goalsAssessmentFormData,
      documentExportFormData
    } = get();

    if (sectionId) {
      useEditorStore.getState().updateSectionData(sectionId, {
        sectionTitle,
        headline,
        pages,
        currentPageIndex,
        goalsFormData,
        goalsAssessmentFormData,
        documentExportFormData
      });
    }
  },

  // --- Validation ---
  isCurrentElementInvalid: () => {
    const { pages, currentPageIndex, activeElementId } = get();
    const currentPage = pages[currentPageIndex];
    if (!currentPage?.elements) return false;

    const activeElement = currentPage.elements.find((el) => el.id === activeElementId);
    if (!activeElement) return false;

    switch (activeElement.type) {
      case 'text':
        return !activeElement.content?.trim();
      case 'text_input':
        return !activeElement.inputDescription?.trim();
      case 'image':
        return !activeElement.imageSrc;
      case 'accordion': {
        if (!activeElement.accordionTitle?.trim()) return true;
        if (!activeElement.panels?.length) return true;
        const activePanel = activeElement.panels.find((p) => p.id === activeElement.activePanelId);
        return !activePanel?.title?.trim() || !activePanel?.content?.trim();
      }
      default:
        return false;
    }
  },

  // --- Page Actions ---
  setSectionTitle: (sectionId, title) => {
    set({ sectionTitle: title });
    useEditorStore.getState().handleSectionTitleChange(sectionId, title);
    get().syncToEditor();
  },

  setHeadline: (headline) => {
    set({ headline });
    get().syncToEditor();
  },

  setCurrentPageIndex: (index) => {
    const { pages } = get();
    const activePage = pages[index];
    set({
      currentPageIndex: index,
      activeElementId: activePage?.elements?.[0]?.id || null
    });
    get().syncToEditor();
  },

  addPageInstance: () => {
    const { pages } = get();
    const newPage = {
      id: `page_${Date.now()}`,
      type: 'standard',
      title: `Page ${pages.length + 1}`,
      source: '',
      elements: [createDefaultElement('text')]
    };
    const updatedPages = [...pages, newPage];

    set({
      pages: updatedPages,
      currentPageIndex: updatedPages.length - 1,
      activeElementId: newPage.elements[0].id
    });
    get().syncToEditor();
  },

  deletePageInstance: (indexToDelete) => {
    const { pages, currentPageIndex } = get();
    if (pages.length <= 1) return;

    const updatedPages = pages.filter((_, idx) => idx !== indexToDelete);
    let nextIndex = currentPageIndex;

    if (currentPageIndex >= updatedPages.length) {
      nextIndex = updatedPages.length - 1;
    } else if (currentPageIndex > indexToDelete) {
      nextIndex = currentPageIndex - 1;
    }

    const activePage = updatedPages[nextIndex];
    set({
      pages: updatedPages,
      currentPageIndex: nextIndex,
      activeElementId: activePage?.elements?.[0]?.id || null
    });
    get().syncToEditor();
  },

  navigatePrevious: () => {
    const { currentPageIndex } = get();
    if (currentPageIndex > 0) {
      get().setCurrentPageIndex(currentPageIndex - 1);
    }
  },

  navigateNext: () => {
    const { currentPageIndex, pages } = get();
    if (currentPageIndex < pages.length - 1) {
      get().setCurrentPageIndex(currentPageIndex + 1);
    }
  },

  updateCurrentPageType: (type) => {
    const { pages, currentPageIndex } = get();
    const typeTitles = {
      standard: 'Standard Page',
      goals: 'Goals Page',
      goals_assessment: 'Goals Assessment',
      document_export: 'Document Export'
    };

    const updatedPages = pages.map((p, idx) =>
      idx === currentPageIndex ? { ...p, type, title: typeTitles[type] || p.title } : p
    );
    set({ pages: updatedPages });
    get().syncToEditor();
  },

  setPageTitle: (title) => {
    const { pages, currentPageIndex } = get();
    const updatedPages = pages.map((p, idx) =>
      idx === currentPageIndex ? { ...p, title } : p
    );
    set({ pages: updatedPages });
    get().syncToEditor();
  },

  reorderPages: (draggedIndex, overIndex) => {
    const { pages, currentPageIndex } = get();
    if (draggedIndex === overIndex) return;

    const updatedPages = [...pages];
    const [draggedItem] = updatedPages.splice(draggedIndex, 1);
    updatedPages.splice(overIndex, 0, draggedItem);

    let nextIndex = currentPageIndex;
    if (currentPageIndex === draggedIndex) {
      nextIndex = overIndex;
    } else if (currentPageIndex > draggedIndex && currentPageIndex <= overIndex) {
      nextIndex = currentPageIndex - 1;
    } else if (currentPageIndex < draggedIndex && currentPageIndex >= overIndex) {
      nextIndex = currentPageIndex + 1;
    }

    set({
      pages: updatedPages,
      currentPageIndex: nextIndex
    });
    get().syncToEditor();
  },

  // --- Element Actions ---
  setActiveElementId: (id) => set({ activeElementId: id }),

  toggleElement: (id) => {
    set((state) => ({
      pages: state.pages.map((p, idx) => {
        if (idx !== state.currentPageIndex) return p;
        return {
          ...p,
          elements: p.elements.map((el) => (el.id === id ? { ...el, isExpanded: !el.isExpanded } : el))
        };
      })
    }));
  },

  updateElement: (id, key, value) => {
    set((state) => ({
      pages: state.pages.map((p, idx) => {
        if (idx !== state.currentPageIndex) return p;
        return {
          ...p,
          elements: p.elements.map((el) => {
            if (el.id !== id) return el;

            if (key === 'type') {
              return createDefaultElement(value);
            }

            return { ...el, [key]: value };
          })
        };
      })
    }));
    get().syncToEditor();
  },

  setMediaField: (elementId, imageSrc, imageAssetId) => {
    const currentPage = get().pages[get().currentPageIndex];
    const currentElement = currentPage?.elements?.find((el) => el.id === elementId);
    if (currentElement?.imageAssetId && currentElement.imageAssetId !== imageAssetId) {
      useEditorStore.getState().queueAssetForDeletion(currentElement.imageAssetId);
    }

    set((state) => ({
      pages: state.pages.map((page, idx) => {
        if (idx !== state.currentPageIndex) return page;
        return {
          ...page,
          elements: page.elements.map((el) =>
            el.id === elementId ? { ...el, imageSrc, imageAssetId } : el
          )
        };
      })
    }));
    get().syncToEditor();
  },

  removeMediaField: (elementId) => {
    const currentPage = get().pages[get().currentPageIndex];
    const currentElement = currentPage?.elements?.find((el) => el.id === elementId);
    if (currentElement?.imageAssetId) {
      useEditorStore.getState().queueAssetForDeletion(currentElement.imageAssetId);
    }

    set((state) => ({
      pages: state.pages.map((page, idx) => {
        if (idx !== state.currentPageIndex) return page;
        return {
          ...page,
          elements: page.elements.map((el) =>
            el.id === elementId ? { ...el, imageSrc: null, imageAssetId: null } : el
          )
        };
      })
    }));
    get().syncToEditor();
  },

  appendElement: (type = 'text') => {
    if (get().isCurrentElementInvalid()) return;

    const newElement = createDefaultElement(type);
    set((state) => ({
      pages: state.pages.map((p, idx) => {
        if (idx !== state.currentPageIndex) return p;
        return { ...p, elements: [...p.elements, newElement] };
      }),
      activeElementId: newElement.id
    }));
    get().syncToEditor();
  },

  insertElement: (targetId, position) => {
    if (get().isCurrentElementInvalid()) return;

    const newElement = createDefaultElement('text');
    set((state) => ({
      pages: state.pages.map((p, idx) => {
        if (idx !== state.currentPageIndex) return p;
        const targetIndex = p.elements.findIndex((el) => el.id === targetId);
        const updatedElements = [...p.elements];
        updatedElements.splice(position === 'above' ? targetIndex : targetIndex + 1, 0, newElement);
        return { ...p, elements: updatedElements };
      }),
      activeElementId: newElement.id
    }));
    get().syncToEditor();
  },

  deleteElement: (id) => {
    set((state) => {
      const updatedPages = state.pages.map((p, idx) => {
        if (idx !== state.currentPageIndex || p.elements.length <= 1) return p;
        return { ...p, elements: p.elements.filter((el) => el.id !== id) };
      });

      const currentPage = updatedPages[state.currentPageIndex];
      const nextActiveId = state.activeElementId === id ? currentPage.elements[0]?.id || null : state.activeElementId;

      return { pages: updatedPages, activeElementId: nextActiveId };
    });
    get().syncToEditor();
  },

  // --- Accordion Panel Actions ---
  updateAccordionPanel: (elementId, panelId, key, value) => {
    set((state) => ({
      pages: state.pages.map((p, idx) => {
        if (idx !== state.currentPageIndex) return p;
        return {
          ...p,
          elements: p.elements.map((el) => {
            if (el.id !== elementId) return el;
            return {
              ...el,
              panels: (el.panels || []).map((panel) => (panel.id === panelId ? { ...panel, [key]: value } : panel))
            };
          })
        };
      })
    }));
    get().syncToEditor();
  },

  toggleAccordionPanel: (elementId, panelId) => {
    set((state) => ({
      pages: state.pages.map((p, idx) => {
        if (idx !== state.currentPageIndex) return p;
        return {
          ...p,
          elements: p.elements.map((el) => {
            if (el.id !== elementId) return el;
            return {
              ...el,
              panels: (el.panels || []).map((panel) =>
                panel.id === panelId ? { ...panel, isExpanded: !panel.isExpanded } : panel
              )
            };
          })
        };
      })
    }));
  },

  insertAccordionPanel: (elementId, targetPanelId, position) => {
    if (get().isCurrentElementInvalid()) return;
    const newPanelId = `p_${Date.now()}`;
    const newPanel = { id: newPanelId, title: '', content: '', isExpanded: true };

    set((state) => ({
      pages: state.pages.map((p, idx) => {
        if (idx !== state.currentPageIndex) return p;
        return {
          ...p,
          elements: p.elements.map((el) => {
            if (el.id !== elementId) return el;
            const targetIndex = el.panels.findIndex((panel) => panel.id === targetPanelId);
            const updatedPanels = [...el.panels];
            updatedPanels.splice(position === 'above' ? targetIndex : targetIndex + 1, 0, newPanel);
            return { ...el, panels: updatedPanels, activePanelId: newPanelId };
          })
        };
      })
    }));
    get().syncToEditor();
  },

  appendAccordionPanel: (elementId) => {
    if (get().isCurrentElementInvalid()) return;
    const newPanelId = `p_${Date.now()}`;

    set((state) => ({
      pages: state.pages.map((p, idx) => {
        if (idx !== state.currentPageIndex) return p;
        return {
          ...p,
          elements: p.elements.map((el) => {
            if (el.id !== elementId) return el;
            return {
              ...el,
              panels: [...(el.panels || []), { id: newPanelId, title: '', content: '', isExpanded: true }],
              activePanelId: newPanelId
            };
          })
        };
      })
    }));
    get().syncToEditor();
  },

  deleteAccordionPanel: (elementId, panelId) => {
    set((state) => ({
      pages: state.pages.map((p, idx) => {
        if (idx !== state.currentPageIndex) return p;
        return {
          ...p,
          elements: p.elements.map((el) => {
            if (el.id !== elementId || el.panels.length <= 1) return el;
            const updatedPanels = el.panels.filter((panel) => panel.id !== panelId);
            const nextActiveId = el.activePanelId === panelId ? updatedPanels[0].id : el.activePanelId;
            return { ...el, panels: updatedPanels, activePanelId: nextActiveId };
          })
        };
      })
    }));
    get().syncToEditor();
  },

  // --- Form Updates ---
  updateGoalsFormData: (key, value) => {
    set((state) => ({ goalsFormData: { ...state.goalsFormData, [key]: value } }));
    get().syncToEditor();
  },

  updateGoalsAssessmentFormData: (key, value) => {
    set((state) => ({ goalsAssessmentFormData: { ...state.goalsAssessmentFormData, [key]: value } }));
    get().syncToEditor();
  },

  updateDocumentExportFormData: (key, value) => {
    set((state) => ({ documentExportFormData: { ...state.documentExportFormData, [key]: value } }));
    get().syncToEditor();
  }
}));