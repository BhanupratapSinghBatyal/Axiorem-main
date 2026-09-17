import { create } from 'zustand';
import { useEditorStore } from '../../../store/useEditorStore';

const generateUniquePanelId = (prefix = 'panel') => 
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const createDefaultPanel = (forcedId) => ({
  id: forcedId || generateUniquePanelId(),
  type: 'standard', 
  altText: '',     
  hoverText: '',    
  infoText: '',     
  imageUrl: '',     
  assetId: null,
  isExpanded: true,
  source: ''
});

export const useInformationWallStore = create((set, get) => ({
  sectionId: null,
  sectionTitle: '',
  headline: '',
  panels: [createDefaultPanel('page_default_1')],
  initialized: false,

  initializeStore: (sectionId, initialData = {}, forceReinit = false) => {
    const currentSectionId = get().sectionId;
    const isAlreadyInitialized = get().initialized;

    const defaultPanels = [createDefaultPanel('page_default_1')];
    const rawPanels = Array.isArray(initialData.panels) && initialData.panels.length > 0 
      ? initialData.panels 
      : defaultPanels;

    const panels = rawPanels.map((panel) => ({
      ...panel,
      imageUrl: panel.imageUrl || '',
      assetId: panel.assetId || null
    }));

    if (!forceReinit && isAlreadyInitialized && currentSectionId === sectionId) {
      const currentPanels = get().panels;

      let needsReconcile = false;
      const updatedPanels = currentPanels.map((localPanel) => {
        const incoming = panels.find((p) => p.id === localPanel.id);
        if (!incoming) return localPanel;

        if (
          (incoming.imageUrl && incoming.imageUrl !== localPanel.imageUrl) ||
          (incoming.assetId && incoming.assetId !== localPanel.assetId)
        ) {
          needsReconcile = true;
          return { 
            ...localPanel, 
            imageUrl: incoming.imageUrl, 
            assetId: incoming.assetId 
          };
        }
        return localPanel;
      });

      if (needsReconcile) {
        set({ panels: updatedPanels });
      }
      return;
    }

    set({
      sectionId,
      sectionTitle: initialData.sectionTitle || initialData.title || '',
      headline: initialData.headline || '',
      panels,
      initialized: true,
    });
  },

  initializeFromEditor: (sectionId, forceReinit = false) => {
    const editorState = useEditorStore.getState();
    const section = editorState.sections?.find((s) => s.id === sectionId);
    if (section) {
      get().initializeStore(sectionId, section.data, forceReinit);
    }
  },

  syncToEditor: () => {
    const { sectionId, sectionTitle, headline, panels } = get();
    if (!sectionId) return;

    useEditorStore.getState().updateSectionData(sectionId, {
      sectionTitle,
      headline,
      panels
    });
  },

  handleTitleChange: (title) => {
    const { sectionId } = get();
    set({ sectionTitle: title });

    if (sectionId) {
      const editorStore = useEditorStore.getState();
      if (typeof editorStore.handleSectionTitleChange === 'function') {
        editorStore.handleSectionTitleChange(sectionId, title);
      }
    }
    
    get().syncToEditor();
  },

  handleHeadlineChange: (headline) => {
    set({ headline });
    get().syncToEditor();
  },

  togglePanel: (id) => {
    set((state) => ({
      panels: state.panels.map((panel) =>
        panel.id === id ? { ...panel, isExpanded: !panel.isExpanded } : panel
      )
    }));
    get().syncToEditor();
  },

  updatePanelField: (id, key, value) => {
    set((state) => ({
      panels: state.panels.map((panel) =>
        panel.id === id ? { ...panel, [key]: value } : panel
      )
    }));
    get().syncToEditor();
  },

  insertPanel: (targetId, position, forcedId) => {
    const { panels } = get();
    const targetIdx = panels.findIndex((panel) => panel.id === targetId);
    if (targetIdx === -1) return;

    const newPanel = createDefaultPanel(forcedId);
    const updatedPanels = [...panels];
    const insertionIndex = position === 'above' ? targetIdx : targetIdx + 1;
    
    updatedPanels.splice(insertionIndex, 0, newPanel);

    set({ panels: updatedPanels });
    get().syncToEditor();
  },

  deletePanel: (id) => {
    const { panels } = get();
    if (panels.length <= 1) return;

    set({ panels: panels.filter((panel) => panel.id !== id) });
    get().syncToEditor();
  },

  appendPanel: (forcedId) => {
    const { panels } = get();
    set({ panels: [...panels, createDefaultPanel(forcedId)] });
    get().syncToEditor();
  },

  resetStore: () => {
    set({
      sectionId: null,
      sectionTitle: '',
      headline: '',
      panels: [createDefaultPanel('page_default_1')],
      initialized: false,
    });
  }
}));