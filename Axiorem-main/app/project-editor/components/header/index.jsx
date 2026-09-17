// src/app/project-editor/components/header/index.jsx[cite: 1]

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  FilePlus,
  FolderOpen,
  Save,
  Eye,
  Edit3,
  History,
  Home,
  Play,
  FileText,
  Send,
  Download,
} from 'lucide-react';

import {
  useEditorStore,
} from '../../store/useEditorStore';

import {
  useAuthStore,
} from '@/store/useAuthStore';

import {
  useLibraryData,
} from '@/hooks/useLibaryData';

import {
  useScormExport,
} from '../../../../hooks/projects/useScormExport';

import SaveProjectDialog from './SaveProjectDialog';
import NewProjectDialog from './NewProjectDialog';
import OpenProjectDialog from './OpenProjectDialog';
import ExportProjectDialogue from './ExportProjectDialouge';

export default function Header({
  onRequestHome,
}) {
  const router = useRouter();

  const projectName =
    useEditorStore(
      (state) =>
        state.projectName ??
        'Untitled Document'
    );

  const setProjectName =
    useEditorStore(
      (state) => state.setProjectName
    );

  const isPreviewModeActive =
    useEditorStore(
      (state) =>
        state.isPreviewModeActive
    );

  const togglePreviewMode =
    useEditorStore(
      (state) =>
        state.togglePreviewMode
    );

  const setCurrentView =
    useEditorStore(
      (state) =>
        state.setCurrentView
    );

  const currentProjectId =
    useEditorStore(
      (state) =>
        state.projectId
    );

  /*
   * The Header owns the export mutation.
   *
   * The export dialog only presents and controls
   * the mutation state.
   */
  const {
    exportScorm,
    isExporting,
    isSuccess: isExportSuccess,
    error: exportError,
    progress,
    reset: resetExport,
  } = useScormExport();

  const {
    projects: allProjects,
    isLoading: isLoadingProjects,
  } = useLibraryData({
    activeTab: 'projects',
    limit: 10,
  });

  const recentProjects = useMemo(() => {
    if (!allProjects) {
      return [];
    }

    return allProjects.filter(
      (proj) =>
        proj.id !== currentProjectId
    );
  }, [
    allProjects,
    currentProjectId,
  ]);

  const user =
    useAuthStore(
      (state) => state.user
    );

  const avatarUrl =
    user?.avatarUrl ||
    user?.avatar ||
    user?.photoURL ||
    user?.picture ||
    user?.profilePicture ||
    '';

  const [
    isFileMenuOpen,
    setIsFileMenuOpen,
  ] = useState(false);

  const [
    isViewMenuOpen,
    setIsViewMenuOpen,
  ] = useState(false);

  const [
    isExportMenuOpen,
    setIsExportMenuOpen,
  ] = useState(false);

  const [
    activeSubmenu,
    setActiveSubmenu,
  ] = useState(null);

  const [
    activeModal,
    setActiveModal,
  ] = useState(null);

  const fileMenuRef =
    useRef(null);

  const viewMenuRef =
    useRef(null);

  const exportMenuRef =
    useRef(null);

  useEffect(() => {
    function handleClickOutside(
      event
    ) {
      if (
        fileMenuRef.current &&
        !fileMenuRef.current.contains(
          event.target
        )
      ) {
        setIsFileMenuOpen(false);
        setActiveSubmenu(null);
      }

      if (
        viewMenuRef.current &&
        !viewMenuRef.current.contains(
          event.target
        )
      ) {
        setIsViewMenuOpen(false);
      }

      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(
          event.target
        )
      ) {
        setIsExportMenuOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const openModal = (
    modalType
  ) => {
    setIsFileMenuOpen(false);
    setIsViewMenuOpen(false);
    setIsExportMenuOpen(false);
    setActiveSubmenu(null);

    if (
      modalType === 'export' &&
      !isExporting
    ) {
      resetExport();
    }

    setActiveModal(modalType);
  };

  const closeModal = () => {
    if (isExporting) {
      return;
    }

    setActiveModal(null);
  };

  const handleTogglePreview = () => {
    togglePreviewMode();
    setIsViewMenuOpen(false);
  };

  const handleBackToHome = () => {
    setIsFileMenuOpen(false);

    if (onRequestHome) {
      onRequestHome();
      return;
    }

    window.location.href =
      '/dashboard/';
  };

  const handleExportScorm =
    async () => {
      try {
        await exportScorm();
      } catch {
        /*
         * Error state remains visible inside
         * ExportProjectDialogue.
         */
      }
    };

  return (
    <>
      <header className="w-full bg-[#292929] px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg shrink-0 z-40 select-none text-white antialiased z-[200]">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <img
            src="/logo.png"
            alt="Axiorem"
            className="w-10 h-10 shrink-0 mt-1 object-contain"
          />

          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={projectName}
                onChange={(event) =>
                  setProjectName(
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="Untitled Document"
                className="font-semibold text-sm uppercase tracking-wider text-white bg-transparent border border-transparent hover:border-slate-600 focus:border-[#1b365d] focus:bg-[#3A3A3A] rounded-sm px-1.5 py-0.5 outline-none transition-colors"
                style={{
                  width: `${Math.max(
                    (projectName || 'Untitled Document').length + 2,
                    18
                  )}ch`,
                }}
              />
            </div>

            <nav className="flex items-center gap-3 mt-0.5 text-xs font-bold uppercase tracking-wider text-slate-400 overflow-x-visible whitespace-nowrap relative">

              {/* FILE MENU */}
              <div
                ref={fileMenuRef}
                className="relative inline-block overflow-visible"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsFileMenuOpen(
                      !isFileMenuOpen
                    );

                    setIsViewMenuOpen(false);
                    setIsExportMenuOpen(false);
                    setActiveSubmenu(null);
                  }}
                  className={`px-1.5 py-0.5 rounded-sm transition-colors ${
                    isFileMenuOpen
                      ? 'bg-slate-700 text-white'
                      : 'hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  File
                </button>

                {isFileMenuOpen && (
                  <div
                    className="absolute left-0 top-full mt-1 w-48 bg-[#3A3A3A] rounded-sm shadow-lg py-1 z-50 text-xs font-medium block uppercase tracking-wider"
                    onMouseLeave={() =>
                      setActiveSubmenu(null)
                    }
                  >
                    <button
                      type="button"
                      onMouseEnter={() =>
                        setActiveSubmenu(null)
                      }
                      onClick={() =>
                        openModal('new')
                      }
                      className="w-full px-3 py-2 flex items-center gap-2.5 text-white hover:bg-slate-600 transition-colors text-left"
                    >
                      <FilePlus className="w-4 h-4 text-white shrink-0" />

                      <span>
                        New
                      </span>
                    </button>

                    {/* OPEN */}
                    <div
                      className="relative"
                      onMouseEnter={() =>
                        setActiveSubmenu(
                          'open'
                        )
                      }
                    >
                      <button
                        type="button"
                        onClick={() =>
                          openModal('open')
                        }
                        className="w-full px-3 py-2 flex items-center justify-between text-white hover:bg-slate-600 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <FolderOpen className="w-4 h-4 text-white shrink-0" />

                          <span>
                            Open
                          </span>
                        </div>

                        <Play className="w-2.5 h-2.5 text-slate-400 fill-slate-400 shrink-0 ml-2" />
                      </button>

                      {activeSubmenu ===
                        'open' && (
                        <div className="absolute left-full top-0 pl-1 -mt-1 w-53 z-50">
                          <div className="w-full bg-[#3A3A3A] rounded-sm shadow-xl py-1 border-l border-slate-600 text-xs font-medium uppercase tracking-wider">
                            <div className="px-3 py-1 text-[10px] text-slate-400 font-bold border-b border-slate-600 mb-1">
                              Recent Projects
                            </div>

                            {isLoadingProjects ? (
                              <div className="px-3 py-1.5 text-slate-400 text-xs">
                                Loading...
                              </div>
                            ) : recentProjects.length ===
                              0 ? (
                              <div className="px-3 py-1.5 text-slate-400 text-xs">
                                No recent projects
                              </div>
                            ) : (
                              recentProjects.map(
                                (proj) => (
                                  <button
                                    key={proj.id}
                                    type="button"
                                    onClick={() => {
                                      router.push(
                                        `/project-editor?id=${encodeURIComponent(
                                          proj.id
                                        )}`
                                      );

                                      setIsFileMenuOpen(
                                        false
                                      );

                                      setActiveSubmenu(
                                        null
                                      );
                                    }}
                                    className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-600 hover:text-white transition-colors truncate block"
                                  >
                                    {proj.name}
                                  </button>
                                )
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SAVE AS */}
                    <div
                      className="relative"
                      onMouseEnter={() =>
                        setActiveSubmenu(
                          'save'
                        )
                      }
                    >
                      <button
                        type="button"
                        onClick={() =>
                          openModal('save')
                        }
                        className="w-full px-3 py-2 flex items-center justify-between text-white hover:bg-slate-600 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Save className="w-4 h-4 text-white shrink-0" />

                          <span>
                            Save as
                          </span>
                        </div>

                        <Play className="w-2.5 h-2.5 text-slate-400 fill-slate-400 shrink-0 ml-2" />
                      </button>

                      {activeSubmenu ===
                        'save' && (
                        <div className="absolute left-full top-0 pl-1 -mt-1 w-45 z-50">
                          <div className="w-full bg-[#3A3A3A] rounded-sm shadow-xl py-1 border-l border-slate-600 text-xs font-medium uppercase tracking-wider">
                            <button
                              type="button"
                              onClick={() =>
                                openModal(
                                  'save'
                                )
                              }
                              className="w-full px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-slate-600 hover:text-white transition-colors text-left"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-300 shrink-0" />

                              <span>
                                Draft
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openModal(
                                  'publish'
                                )
                              }
                              className="w-full px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-slate-600 hover:text-white transition-colors text-left"
                            >
                              <Send className="w-3.5 h-3.5 text-slate-300 shrink-0" />

                              <span>
                                Published
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="my-1 border-t border-slate-600" />

                    <button
                      type="button"
                      onMouseEnter={() =>
                        setActiveSubmenu(null)
                      }
                      onClick={
                        handleBackToHome
                      }
                      className="w-full px-3 py-2 flex items-center gap-2.5 text-white hover:bg-slate-600 transition-colors text-left"
                    >
                      <Home className="w-4 h-4 text-white shrink-0" />

                      <span>
                        Back to Home
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* VIEW MENU */}
              <div
                ref={viewMenuRef}
                className="relative inline-block overflow-visible"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsViewMenuOpen(
                      !isViewMenuOpen
                    );

                    setIsFileMenuOpen(false);
                    setIsExportMenuOpen(false);
                  }}
                  className={`px-1.5 py-0.5 rounded-sm transition-colors ${
                    isViewMenuOpen
                      ? 'bg-slate-700 text-white'
                      : 'hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  View
                </button>

                {isViewMenuOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-[#3A3A3A] rounded-sm shadow-lg py-1 z-50 uppercase tracking-wider text-xs font-medium">
                    <button
                      type="button"
                      onClick={
                        handleTogglePreview
                      }
                      className="w-full px-3 py-2 flex items-center gap-2.5 text-white hover:bg-slate-600 transition-colors text-left"
                    >
                      {isPreviewModeActive ? (
                        <>
                          <Edit3 className="w-4 h-4 text-white shrink-0" />

                          <span>
                            Return to Editor
                          </span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-white shrink-0" />

                          <span>
                            Preview Project
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsViewMenuOpen(
                          false
                        );

                        setCurrentView(
                          'version_history'
                        );
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2.5 text-white hover:bg-slate-600 transition-colors text-left"
                    >
                      <History className="w-4 h-4 text-white shrink-0" />

                      <span>
                        Version History
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* EXPORT MENU */}
              <div
                ref={exportMenuRef}
                className="relative inline-block overflow-visible"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(
                      !isExportMenuOpen
                    );

                    setIsFileMenuOpen(false);
                    setIsViewMenuOpen(false);
                  }}
                  className={`px-1.5 py-0.5 rounded-sm transition-colors ${
                    isExportMenuOpen
                      ? 'bg-slate-700 text-white'
                      : 'hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  Export
                </button>

                {isExportMenuOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-[#3A3A3A] rounded-sm shadow-lg py-1 z-50 uppercase tracking-wider text-xs font-medium">
                    <button
                      type="button"
                      disabled={
                        isExporting
                      }
                      onClick={() =>
                        openModal(
                          'export'
                        )
                      }
                      className="w-full px-3 py-2 flex items-center gap-2.5 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
                    >
                      <Download className="w-4 h-4 text-white shrink-0" />

                      <span>
                        SCORM 1.2
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 shrink-0 self-end md:self-center">
          <div className="w-8 h-8 rounded-sm bg-[#3A3A3A] text-white font-bold text-xs flex items-center justify-center cursor-pointer shrink-0 uppercase tracking-wider overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>
                {user?.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : 'AT'}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* DIALOG ORCHESTRATION */}

      <NewProjectDialog
        isOpen={
          activeModal === 'new'
        }
        onClose={closeModal}
      />

      <OpenProjectDialog
        isOpen={
          activeModal === 'open'
        }
        onClose={closeModal}
      />

      <SaveProjectDialog
        isOpen={
          activeModal === 'save' ||
          activeModal === 'publish'
        }
        isPublishedMode={
          activeModal === 'publish'
        }
        onClose={closeModal}
      />

      <ExportProjectDialogue
        isOpen={
          activeModal === 'export'
        }
        onClose={closeModal}
        onExport={
          handleExportScorm
        }
        isExporting={
          isExporting
        }
        isSuccess={
          isExportSuccess
        }
        error={
          exportError
        }
        progress={
          progress
        }
        projectName={
          projectName
        }
      />
    </>
  );
}