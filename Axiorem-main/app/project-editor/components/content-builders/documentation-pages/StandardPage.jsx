import React, { useState } from 'react';
import { Plus, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { useAssetActions } from '../../../../../hooks/useAssetActions';
import { useEditorStore } from '../../../store/useEditorStore';
import { useDocumentationStore } from '../store/useDocumentationStore';
import { uploadEditorAsset } from '../utils/uploadEditorAsset';

const getImageUrl = (element) => {
  const candidate = [element?.imageSrc, element?.imageUrl].find(
    (value) => typeof value === 'string' && value.trim()
  );
  if (!candidate) return null;

  try {
    return new URL(candidate).href;
  } catch {
    return null;
  }
};

export default function StandardPage({ brandColor = "#1a688a" }) {
  const { uploadAsset } = useAssetActions();
  const projectId = useEditorStore((state) => state.projectId);
  const setUploadProgress = useEditorStore((state) => state.setUploadProgress);
  const clearUploadProgress = useEditorStore((state) => state.clearUploadProgress);

  const pages = useDocumentationStore((state) => state.pages);
  const currentPageIndex = useDocumentationStore((state) => state.currentPageIndex);
  const activeElementId = useDocumentationStore((state) => state.activeElementId);

  const setPageTitle = useDocumentationStore((state) => state.setPageTitle);
  const setActiveElementId = useDocumentationStore((state) => state.setActiveElementId);
  const updateElement = useDocumentationStore((state) => state.updateElement);
  const updateAccordionPanel = useDocumentationStore((state) => state.updateAccordionPanel);
  const toggleAccordionPanel = useDocumentationStore((state) => state.toggleAccordionPanel);
  const deleteAccordionPanel = useDocumentationStore((state) => state.deleteAccordionPanel);
  const deleteElement = useDocumentationStore((state) => state.deleteElement);
  const appendElement = useDocumentationStore((state) => state.appendElement);

  const [uploadingElementId, setUploadingElementId] = useState(null);

  const handleImageUpload = async (elementId, file) => {
    if (!file) return;

    setUploadingElementId(elementId);
    try {
      const uploadedAsset = await uploadEditorAsset({
        file,
        projectId,
        uploadAsset,
        setUploadProgress,
        clearUploadProgress,
        label: 'Documentation Image',
      });

      const resolvedUrl =
        uploadedAsset?.url || uploadedAsset?.downloadUrl || uploadedAsset?.uploadUrl || '';
      const resolvedAssetId = uploadedAsset?.assetId || uploadedAsset?.id || null;

      if (resolvedUrl) {
        updateElement(elementId, 'imageSrc', resolvedUrl);
        updateElement(elementId, 'imageAssetId', resolvedAssetId);
        updateElement(elementId, 'imageUrl', resolvedUrl);
        updateElement(elementId, 'assetId', resolvedAssetId);
      }
    } finally {
      setUploadingElementId(null);
    }
  };

  const handleClearImage = (elementId) => {
    updateElement(elementId, 'imageSrc', null);
    updateElement(elementId, 'imageAssetId', null);
    updateElement(elementId, 'imageUrl', '');
    updateElement(elementId, 'assetId', null);
  };

  const handleAddAccordionPanel = (elementId, currentPanels = []) => {
    const generatedId = `panel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const freshPanel = { id: generatedId, title: '', content: '', isExpanded: true };
    updateElement(elementId, 'panels', [...currentPanels, freshPanel]);
  };

  const currentPage = pages[currentPageIndex] || { elements: [] };
  const elements = currentPage.elements || [];
  const pageTitle = currentPage.title || '';

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-slate-800 bg-white">
      
      {/* Page Title Header */}
      <div className="w-full border-b border-transparent focus-within:border-slate-200 pb-1">
        <input
          type="text"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          placeholder="Standard Page Title"
          className="w-full text-xl font-bold bg-transparent focus:outline-none placeholder:text-slate-300"
          style={{ color: brandColor }}
        />
      </div>

      {/* Content Canvas */}
      <div className="w-full flex flex-col gap-6">
        {elements.map((element) => {
          const isFocused = activeElementId === element.id;
          const isUploading = uploadingElementId === element.id;
          const imageUrl = getImageUrl(element);

          return (
            <div
              key={element.id}
              onClick={() => setActiveElementId(element.id)}
              className={`w-full relative group transition-all rounded-sm border ${
                isFocused 
                  ? 'border-blue-400/40 bg-slate-50/20 shadow-xs' 
                  : 'border-transparent hover:border-slate-200/60'
              } p-2 -mx-2`}
            >
              {/* Node Control Toolbar */}
              <div className="absolute right-2 -top-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-1 bg-white border border-slate-200 rounded-sm shadow-xs p-0.5 z-30">
                <select
                  value={element.type}
                  onChange={(e) => updateElement(element.id, 'type', e.target.value)}
                  className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-sm px-1 py-0.5 focus:outline-none cursor-pointer uppercase"
                >
                  <option value="text">Text Node</option>
                  <option value="text_input">Input Field</option>
                  <option value="image">Image Frame</option>
                  <option value="accordion">Accordion Container</option>
                </select>
                {elements.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteElement(element.id); }}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-sm transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Node Configuration Panel */}
              {(element.type === 'text_input' || element.type === 'image') && (
                <div className="w-full bg-slate-50 border border-slate-200 rounded-sm p-3 mb-3 flex flex-col gap-3 text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Node Configuration</span>
                  {element.type === 'text_input' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-600">Placeholder Text</label>
                        <input
                          type="text"
                          value={element.inputPlaceholder || ''}
                          onChange={(e) => updateElement(element.id, 'inputPlaceholder', e.target.value)}
                          className="border border-slate-200 rounded-sm p-1 bg-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-600">Max Characters</label>
                        <input
                          type="number"
                          value={element.inputMaxLength || ''}
                          onChange={(e) => updateElement(element.id, 'inputMaxLength', e.target.value)}
                          className="border border-slate-200 rounded-sm p-1 bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                  {element.type === 'image' && (
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-600">Alternative Title Text</label>
                      <input
                        type="text"
                        value={element.imageAlt || ''}
                        onChange={(e) => updateElement(element.id, 'imageAlt', e.target.value)}
                        className="border border-slate-200 rounded-sm p-1 bg-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TEXT COMPONENT */}
              {element.type === 'text' && (
                <div className="w-full">
                  <textarea
                    rows={1}
                    value={element.content || ''}
                    placeholder="Click to add or update content text..."
                    onChange={(e) => updateElement(element.id, 'content', e.target.value)}
                    className="w-full text-sm text-slate-700 font-normal bg-transparent resize-none focus:outline-none leading-relaxed placeholder:text-slate-300"
                    style={{ height: 'auto' }}
                  />
                </div>
              )}

              {/* IMAGE COMPONENT WITH ASSET UPLOAD */}
              {element.type === 'image' && (
                <div className="w-full py-1">
                  {isUploading ? (
                    <div className="w-48 h-32 border border-slate-200 rounded-sm flex flex-col items-center justify-center bg-slate-50 gap-2">
                      <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
                      <span className="text-[11px] text-slate-500 font-medium">Uploading Asset...</span>
                    </div>
                  ) : imageUrl ? (
                    <div className="relative w-fit max-w-full rounded-sm overflow-hidden border border-slate-100">
                      <img
                        src={imageUrl}
                        alt={element.imageAlt || "Image asset"}
                        className="max-h-48 object-contain rounded-sm"
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleClearImage(element.id); }}
                        className="absolute top-1 right-1 bg-white/80 hover:bg-white text-slate-700 p-1 rounded-sm border border-slate-200 shadow-xs transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-48 h-32 border border-dashed border-slate-200 hover:border-slate-400 rounded-sm flex flex-col items-center justify-center bg-slate-50 cursor-pointer transition-colors gap-2">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span className="text-[11px] text-slate-400 font-medium">Select Image Asset</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(element.id, e.target.files?.[0])}
                      />
                    </label>
                  )}
                </div>
              )}

              {/* ACCORDION COMPONENT */}
              {element.type === 'accordion' && element.panels && (
                <div className="w-full flex flex-col gap-2 py-2">
                  <input
                    type="text"
                    value={element.heading || ''}
                    placeholder="Accordion Group Heading"
                    onChange={(e) => updateElement(element.id, 'heading', e.target.value)}
                    className="text-sm font-bold text-slate-900 bg-transparent focus:outline-none w-full placeholder:text-slate-300"
                  />
                  <div className="w-full flex flex-col border-t border-slate-100">
                    {element.panels.map((panel) => {
                      const isExpanded = panel.isExpanded;
                      return (
                        <div key={panel.id} className="w-full border-b border-slate-100 flex flex-col">
                          <div 
                            onClick={(e) => { e.stopPropagation(); toggleAccordionPanel(element.id, panel.id); }}
                            className="w-full py-3.5 flex items-center justify-between cursor-pointer group/item"
                          >
                            <input
                              type="text"
                              value={panel.title}
                              placeholder="Accordion Title Heading"
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateAccordionPanel(element.id, panel.id, 'title', e.target.value)}
                              className="text-sm font-bold text-slate-900 bg-transparent focus:outline-none flex-1 placeholder:text-slate-300"
                            />
                            <div className="flex items-center gap-2">
                              {element.panels.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); deleteAccordionPanel(element.id, panel.id); }}
                                  className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded-sm transition-opacity"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                              <span className="text-sm font-medium text-[#1a688a] px-1 select-none">
                                {isExpanded ? '—' : '+'}
                              </span>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="w-full pb-4 pr-6 pl-0.5">
                              <textarea
                                rows={2}
                                value={panel.content}
                                placeholder="Panel content details go here..."
                                onChange={(e) => updateAccordionPanel(element.id, panel.id, 'content', e.target.value)}
                                className="w-full text-xs font-normal text-slate-600 bg-transparent resize-none focus:outline-none leading-relaxed placeholder:text-slate-300"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddAccordionPanel(element.id, element.panels);
                      }}
                      className="w-fit mt-2 px-2.5 py-1 border border-dashed border-slate-200 hover:border-slate-400 text-slate-500 hover:text-slate-800 rounded-sm text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Panel
                    </button>
                  </div>
                </div>
              )}

              {/* TEXT INPUT COMPONENT */}
              {element.type === 'text_input' && (
                <div className="w-full flex flex-col gap-2 py-2">
                  <input
                    type="text"
                    value={element.inputDescription || ''}
                    placeholder="Text Input Heading"
                    onChange={(e) => updateElement(element.id, 'inputDescription', e.target.value)}
                    className="text-sm font-bold text-slate-900 bg-transparent focus:outline-none w-full placeholder:text-slate-300"
                  />
                  <div className="w-full border border-slate-200 rounded-sm bg-white px-3 py-2">
                    <span className="text-xs font-normal text-slate-300 block">
                      {element.inputPlaceholder || 'Placeholder text'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Append New Element Action Button */}
        <button
          type="button"
          onClick={() => appendElement('text')}
          className="w-full py-3 border border-dashed border-slate-200 hover:border-slate-400 text-slate-400 hover:text-slate-600 rounded-sm text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Element
        </button>
      </div>
    </div>
  );
}