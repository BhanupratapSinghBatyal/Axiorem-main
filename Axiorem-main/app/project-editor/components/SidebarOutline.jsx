import React, { useEffect, useState } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  FolderTree, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  Inbox, 
  History, 
  Trash2, 
  Sparkles, 
  Settings, 
  CornerDownLeft,
  GripVertical,
  Lock
} from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import VersionHistory from './VersionHistory';
import AIAssistantPreviewModal from './AiAssistantPreviewModal';

export default function SidebarOutline() {
  const {
    currentView,
    setCurrentView,
    sections,
    activeSectionId,
    sectionsExpanded,
    toggleSection,
    setActiveSectionId,
    deleteSection,
    appendNewContentNode,
    updateSectionField,
    isAddContentOpen,
    setAddContentOpen,
    reorderSections
  } = useEditorStore();

  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [aiChatMessage, setAiChatMessage] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const activeSection = sections.find((s) => s.id === activeSectionId);

  useEffect(() => {
    if (isAddContentOpen) {
      setCurrentView("add_content");
    } else if (currentView === "add_content") {
      setAddContentOpen(true);
    }
  }, [isAddContentOpen]);

  useEffect(() => {
    if (currentView !== "add_content") {
      setAddContentOpen(false);
    } else {
      setAddContentOpen(true);
    }
  }, [currentView]);

  const handleSelectBlueprint = (item) => {
    if (activeSection && !activeSection.contentType) {
      updateSectionField(activeSection.id, 'contentType', item.type);
      updateSectionField(activeSection.id, 'title', item.label);
    } else {
      appendNewContentNode(item.type, item.label);
    }
  };

  const getContentItems = (sec) => {
    if (!sec?.data) return [];
    switch (sec.contentType) {
      case 'information_wall':
        return (sec.data.panels || []).map(p => p.altText || 'Untitled Panel');
      case 'quiz':
        return (sec.data.questions || []).map(q => q.title || q.question || 'Untitled Question');
      case 'accordion':
        return (sec.data.items || sec.data.panels || []).map(i => i.title || 'Untitled Item');
      case 'documentation':
        return (sec.data.pages || []).map(p => p.title || 'Untitled Page');
      case 'course_presentation':
        return (sec.data.slides || []).map(s => s.title || 'Untitled Slide');
      default:
        return [];
    }
  };

  const confirmDelete = () => {
    if (sectionToDelete) {
      deleteSection(sectionToDelete.id);
      setSectionToDelete(null);
    }
  };

  /* Drag and Drop Handlers with Cover Page Locking Logic */
  const handleDragStart = (index, isCoverPage) => {
    if (isCoverPage) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e, targetIndex, isTargetCoverPage) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex || isTargetCoverPage) return;

    const updatedSections = [...sections];
    const [draggedItem] = updatedSections.splice(draggedIndex, 1);
    updatedSections.splice(targetIndex, 0, draggedItem);

    setDraggedIndex(targetIndex);
    reorderSections(updatedSections);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const suggestedAiPrompts = [
    "Generate layout evaluation matrix matching goals page",
    "Inject compliance assessment row fields",
    "Optimize tabular preview structural borders"
  ];

  return (
    <>
      <aside className="w-64 bg-[#292929] shadow-lg flex flex-col min-h-0 shrink-0 hidden lg:flex select-none text-white antialiased relative">
        
        {/* Primary Sidebar Header */}
        <div className="p-4 border-b border-slate-700 flex items-center gap-2">
          <button 
            type="button"
            onClick={() => currentView !== "menu" && setCurrentView("menu")}
            disabled={currentView === "menu"}
            className={`p-1.5 rounded-sm text-slate-400 transition-colors ${
              currentView === "menu" ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-700 hover:text-white cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <span className="font-bold text-xs uppercase tracking-wider text-white">
            {currentView === "menu" && "Workspace Engine"}
            {currentView === "add_content" && "Add Content"}
            {currentView === "content_plan" && "Content Plan"}
            {currentView === "version_history" && "Version History"}
            {currentView === "ai_editor" && "AI Assistant Panel"}
          </span>
        </div>

        {currentView === "version_history" ? (
          <div className="flex-1 min-h-0 w-full border-t-0">
            <VersionHistory onClose={() => setCurrentView("menu")} />
          </div>
        ) : currentView === "ai_editor" ? (
          
          /* AI CHAT VIEW PANE */
          <div className="flex-1 flex flex-col min-h-0 bg-[#292929] text-slate-200">
            <div className="w-full flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-[#292929]">
              <span className="text-xs font-bold text-slate-300 normal-case tracking-normal">New Chat</span>
              <div className="flex items-center gap-1">
                <button type="button" className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                  <History className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
            </div>

            <div className="p-3 bg-[#292929] border-t border-slate-700 flex flex-col gap-2">
              <div className="flex flex-col gap-1.5 w-full select-none">
                {suggestedAiPrompts.map((promptText, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAiChatMessage(promptText)}
                    className="w-full text-left text-[11px] font-normal text-slate-300 bg-[#3A3A3A] hover:bg-[#4A4A4A] rounded px-2.5 py-1.5 tracking-normal normal-case truncate transition-all duration-150"
                  >
                    {promptText}
                  </button>
                ))}
              </div>

              <div className="w-full border border-slate-700 focus-within:border-slate-600 bg-[#3A3A3A] rounded-md flex flex-col transition-all p-2 mt-1">
                <textarea
                  value={aiChatMessage}
                  onChange={(e) => setAiChatMessage(e.target.value)}
                  placeholder="Describe what you need. Press @ for context, / for Skills."
                  className="w-full min-h-[56px] text-xs font-normal normal-case tracking-normal text-slate-100 bg-transparent border-0 focus:outline-none resize-none leading-relaxed placeholder:text-slate-500"
                />
                
                <div className="w-full flex items-center justify-between pt-1.5 border-t border-slate-700/60 mt-1">
                  <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors px-1 py-0.5 rounded hover:bg-slate-700/60">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <div className="flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 tracking-tight">
                      <span>Auto</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!aiChatMessage?.trim()}
                    className={`p-1.5 rounded-md transition-all ${
                      aiChatMessage?.trim() 
                        ? 'bg-[#1b365d] hover:bg-[#2a4a7a] text-white shadow-sm cursor-pointer' 
                        : 'bg-slate-700 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <CornerDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 flex flex-col justify-between">
            
            {currentView === "menu" && (
              <div className="space-y-0.5 w-full">
                <button
                  type="button"
                  onClick={() => setCurrentView("add_content")}
                  className="w-full text-left px-3 py-2 rounded-sm hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4 text-slate-400" />
                  Add Content
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-sm hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  AI Editor
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView("content_plan")}
                  className="w-full text-left px-3 py-2 rounded-sm hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                >
                  <FolderTree className="w-4 h-4 text-slate-400" />
                  Content Plan
                </button>
              </div>
            )}

            {currentView === "add_content" && (
              <div className="w-full space-y-2 mt-1">
                <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider px-1 block mb-1.5">
                  Select Compliance Blueprint
                </span>

                {[
                  { label: 'Accordion', sub: 'Executive Summary Policy', type: 'accordion' },
                  { label: 'Documentation Tool', sub: 'SOP / Checklist Extraction', type: 'documentation' },
                  { label: 'Information Wall', sub: 'Jargon Simplifier Matrix', type: 'information_wall' },
                  { label: 'Course Presentation', sub: 'Corporate Training Deck', type: 'course_presentation' },
                  { label: 'Interactive Quiz', sub: 'Full Compliance Assessment', type: 'quiz' }
                ].map((item) => (
                  <button 
                    key={item.type}
                    type="button"
                    onClick={() => handleSelectBlueprint(item)}
                    className="w-full text-left p-2.5 rounded-sm bg-[#3A3A3A] transition-all cursor-pointer flex flex-col gap-0.5 group"
                  >
                    <span className="font-bold text-xs text-white uppercase tracking-wider group-hover:text-slate-200">{item.label}</span>
                    <span className="text-[10px] font-medium text-slate-400 leading-tight tracking-wider lowercase first-letter:uppercase">{item.sub}</span>
                  </button>
                ))}
              </div>
            )}

            {currentView === "content_plan" && (
              <div className="flex-1 flex flex-col justify-between h-full w-full">
                {sections.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto uppercase tracking-wider">
                    <Inbox className="w-5 h-5 text-slate-500 mb-1.5 stroke-[1.5]" />
                    <span className="text-slate-400 font-bold text-[10px]">No active segments</span>
                  </div>
                ) : (
                  <div className="space-y-1 w-full">
                    {sections.map((sec, index) => {
                      const isExpanded = !!sectionsExpanded[sec.id];
                      const isActive = activeSectionId === sec.id;
                      const innerItems = getContentItems(sec);
                      const isCoverPage = sec.id === "root-cover-page" || sec.contentType === "cover_page";

                      return (
                        <div 
                          key={sec.id} 
                          draggable={!isCoverPage}
                          onDragStart={() => handleDragStart(index, isCoverPage)}
                          onDragOver={(e) => handleDragOver(e, index, isCoverPage)}
                          onDragEnd={handleDragEnd}
                          className={`w-full flex flex-col gap-0.5 border border-transparent rounded-sm group/section transition-all ${
                            isCoverPage 
                              ? 'cursor-not-allowed opacity-90' 
                              : 'cursor-grab active:cursor-grabbing hover:bg-slate-700/30'
                          } ${
                            draggedIndex === index ? 'opacity-40 scale-95' : 'opacity-100'
                          }`}
                        >
                          <div 
                            onClick={() => {
                              setActiveSectionId(sec.id);
                            }}
                            className={`flex items-center justify-between p-2 rounded-sm transition-colors ${
                              isActive ? 'bg-[#1b365d] text-white' : 'hover:bg-slate-700'
                            }`}
                          >
                            <div className="flex-1 min-w-0 flex items-center gap-1">
                              {isCoverPage ? (
                                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" title="Fixed Cover Page Position" />
                              ) : (
                                <GripVertical className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover/section:opacity-100 transition-opacity shrink-0" />
                              )}
                              
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSection(sec.id);
                                }}
                                className="text-slate-400 shrink-0 p-0.5 hover:bg-white/10 rounded-sm transition-colors"
                              >
                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-white" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                              </button>
                              <span className="bg-transparent font-bold px-1 w-full truncate uppercase tracking-wider text-white">
                                {sec.title || ''}
                              </span>
                            </div>

                            {!isCoverPage && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSectionToDelete(sec);
                                }}
                                className="text-slate-400 hover:text-red-400 p-1 rounded-sm opacity-0 group-hover/section:opacity-100 transition-opacity ml-1 shrink-0 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {isExpanded && (
                            <div className="pl-6 pr-2 py-1 flex flex-col gap-1 border-l border-slate-700 ml-3.5">
                              {innerItems.length === 0 ? (
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider py-1 pl-1 flex items-center gap-1">
                                  <Layers className="w-3 h-3 text-slate-500" /> Nothing to see here
                                </div>
                              ) : (
                                innerItems.map((itemText, idx) => (
                                  <div 
                                    key={idx} 
                                    className="text-[10px] text-slate-300 hover:text-white font-medium tracking-normal normal-case truncate py-1 px-1.5 rounded-sm hover:bg-slate-700 transition-colors"
                                  >
                                    {itemText}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal Overlay */}
        {sectionToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
            <div className="bg-[#2a2a2a] border border-slate-700 w-full max-w-sm rounded-lg p-5 shadow-2xl text-left select-none animate-in scale-in-95 duration-150">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Confirm Deletion
              </h3>
              <p className="text-xs text-slate-400 font-medium normal-case leading-relaxed mb-5">
                Are you sure you want to permanently delete <span className="text-white font-bold uppercase">"{sectionToDelete.title || 'Untitled Section'}"</span>? This architectural node and all contained nested item properties cannot be recovered.
              </p>
              <div className="flex items-center justify-end gap-2.5 text-[11px] font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setSectionToDelete(null)}
                  className="px-3 py-2 rounded bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md cursor-pointer"
                >
                  Delete Content
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* AI Assistant Coming Soon Modal */}
      <AIAssistantPreviewModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </>
  );
}