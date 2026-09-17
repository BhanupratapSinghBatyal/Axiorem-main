import { create } from 'zustand';
import { useEditorStore } from '../../../store/useEditorStore';

export const useCoursePresentationStore = create((set, get) => ({
  sectionId: null,
  initialized: false,
  brandColor: '#1a688a',
  template: 'title_subtitle',
  title: '',
  subtitle: '',
  body: '',
  bodyType: 'text',
  bodyImage: '',
  bodyImageAssetId: null,
  bodyLeft: '',
  bodyLeftType: 'text',
  bodyLeftImage: '',
  bodyLeftImageAssetId: null,
  bodyRight: '',
  bodyRightType: 'text',
  bodyRightImage: '',
  bodyRightImageAssetId: null,

  syncToEditor: () => {
    const {
      sectionId,
      brandColor,
      template,
      title,
      subtitle,
      body,
      bodyType,
      bodyImage,
      bodyImageAssetId,
      bodyLeft,
      bodyLeftType,
      bodyLeftImage,
      bodyLeftImageAssetId,
      bodyRight,
      bodyRightType,
      bodyRightImage,
      bodyRightImageAssetId,
    } = get();

    if (!sectionId) return;

    useEditorStore.getState().updateSectionData(sectionId, {
      brandColor,
      template,
      title,
      subtitle,
      body,
      bodyType,
      bodyImage,
      bodyImageAssetId,
      bodyLeft,
      bodyLeftType,
      bodyLeftImage,
      bodyLeftImageAssetId,
      bodyRight,
      bodyRightType,
      bodyRightImage,
      bodyRightImageAssetId,
    });
  },

  initializeStore: (sectionId, initialData) => {
    if (get().initialized && get().sectionId === sectionId) return;

    const globalBrandColor = useEditorStore.getState().brandColor || '#1a688a';

    set({
      sectionId,
      brandColor: initialData?.brandColor || globalBrandColor,
      template: initialData?.template || 'title_subtitle',
      title: initialData?.title || '',
      subtitle: initialData?.subtitle || '',
      body: initialData?.body || '',
      bodyType: initialData?.bodyType || 'text',
      bodyImage: initialData?.bodyImage || '',
      bodyImageAssetId: initialData?.bodyImageAssetId || null,
      bodyLeft: initialData?.bodyLeft || '',
      bodyLeftType: initialData?.bodyLeftType || 'text',
      bodyLeftImage: initialData?.bodyLeftImage || '',
      bodyLeftImageAssetId: initialData?.bodyLeftImageAssetId || null,
      bodyRight: initialData?.bodyRight || '',
      bodyRightType: initialData?.bodyRightType || 'text',
      bodyRightImage: initialData?.bodyRightImage || '',
      bodyRightImageAssetId: initialData?.bodyRightImageAssetId || null,
      initialized: true,
    });
  },

  updateField: (field, value) => {
    set({ [field]: value });

    if (field === 'title') {
      const currentSectionId = get().sectionId;
      if (currentSectionId) {
        useEditorStore.getState().handleSectionTitleChange(currentSectionId, value);
      }
    }

    get().syncToEditor();
  },

  setMediaField: (imageField, url, assetIdField, assetId) => {
    const currentAssetId = get()[assetIdField];
    if (currentAssetId && currentAssetId !== assetId) {
      useEditorStore.getState().queueAssetForDeletion(currentAssetId);
    }

    set({
      [imageField]: url,
      [assetIdField]: assetId,
    });

    get().syncToEditor();
  },

  removeMediaField: (imageField, assetIdField) => {
    const currentAssetId = get()[assetIdField];
    if (currentAssetId) {
      useEditorStore.getState().queueAssetForDeletion(currentAssetId);
    }

    set({
      [imageField]: '',
      [assetIdField]: null,
    });

    get().syncToEditor();
  },

  setMediaField: (imageField, url, assetIdField, assetId) => {
    const currentAssetId = get()[assetIdField];
    if (currentAssetId && currentAssetId !== assetId) {
      useEditorStore.getState().queueAssetForDeletion(currentAssetId);
    }

    set({
      [imageField]: url,
      [assetIdField]: assetId,
    });

    get().syncToEditor();
  },

  removeMediaField: (imageField, assetIdField) => {
    const currentAssetId = get()[assetIdField];
    if (currentAssetId) {
      useEditorStore.getState().queueAssetForDeletion(currentAssetId);
    }

    set({
      [imageField]: '',
      [assetIdField]: null,
    });

    get().syncToEditor();
  },
}));