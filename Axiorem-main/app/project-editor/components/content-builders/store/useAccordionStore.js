import { create } from 'zustand';
import { useEditorStore } from '../../../store/useEditorStore';

const generatePanelId = (title = 'panel') => {
  const slug = title.trim() ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'panel';
  return `${slug}_${Date.now()}`;
};

const DEFAULT_PANEL_SCHEMA = {
  title: '',
  content: '',
  mediaUrl: '',
  mediaAssetId: null,
  isExpanded: true,
  source: '',
};

export const useAccordionStore = create((set, get) => ({
  moduleTitle: '',
  panels: [{ id: 'panel_0001', ...DEFAULT_PANEL_SCHEMA }],
  activePanelId: 'panel_0001',
  sectionId: null,
  initialized: false,

  syncToGlobalStore: () => {
    const { sectionId, moduleTitle, panels } = get();
    if (!sectionId) return;

    useEditorStore.getState().updateSectionData(sectionId, {
      accordionTitle: moduleTitle,
      panels,
    });
  },

  initializeStore: (sectionId, initialData) => {
    const currentSectionId = get().sectionId;

    if (get().initialized && currentSectionId === sectionId) {
      return;
    }

    const dataPanels = initialData?.panels || [];
    const panels = dataPanels.length > 0 
      ? dataPanels.map((p) => ({
          ...DEFAULT_PANEL_SCHEMA,
          ...p,
        }))
      : [{ id: 'panel_0001', ...DEFAULT_PANEL_SCHEMA }];

    const moduleTitle = initialData?.accordionTitle || initialData?.title || '';

    set({
      sectionId,
      moduleTitle,
      panels,
      activePanelId: panels[0]?.id || 'panel_0001',
      initialized: true,
    });
  },

  isCurrentPanelInvalid: () => {
    const { panels } = get();
    return panels.some((p) => !p.title.trim() || !p.content.trim());
  },

  setModuleTitle: (title) => {
    set({ moduleTitle: title });
    
    const currentSectionId = get().sectionId;
    if (currentSectionId) {
      useEditorStore.getState().handleSectionTitleChange(currentSectionId, title);
    }
    get().syncToGlobalStore();
  },
  
  setActivePanelId: (id) => set({ activePanelId: id }),

  togglePanel: (id) => set((state) => ({
    panels: state.panels.map((p) => (p.id === id ? { ...p, isExpanded: !p.isExpanded } : p)),
  })),

  updatePanel: (id, key, value) => {
    set((state) => ({
      panels: state.panels.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    }));
    get().syncToGlobalStore();
  },

  insertPanel: (targetId, position) => {
    if (get().isCurrentPanelInvalid()) return;
    
    const newId = generatePanelId();
    const newPanel = { id: newId, ...DEFAULT_PANEL_SCHEMA };
    
    set((state) => {
      const targetIndex = state.panels.findIndex((p) => p.id === targetId);
      const updated = [...state.panels];
      updated.splice(position === 'above' ? targetIndex : targetIndex + 1, 0, newPanel);
      return { panels: updated, activePanelId: newId };
    });

    get().syncToGlobalStore();
  },

  deletePanel: (id) => {
    const { panels } = get();
    const targetPanel = panels.find((p) => p.id === id);

    // Queue asset for cleanup if present
    if (targetPanel?.mediaAssetId) {
      useEditorStore.getState().queueAssetForDeletion(targetPanel.mediaAssetId);
    }

    set((state) => {
      if (state.panels.length <= 1) return state;
      const updated = state.panels.filter((p) => p.id !== id);
      return { 
        panels: updated, 
        activePanelId: state.activePanelId === id ? updated[0].id : state.activePanelId 
      };
    });

    get().syncToGlobalStore();
  },

  appendPanel: () => {
    if (get().isCurrentPanelInvalid()) return;

    const newId = generatePanelId();
    set((state) => ({
      panels: [...state.panels, { id: newId, ...DEFAULT_PANEL_SCHEMA }],
      activePanelId: newId,
    }));

    get().syncToGlobalStore();
  },
}));