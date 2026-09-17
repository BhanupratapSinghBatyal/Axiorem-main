"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FolderOpen,
  FileText,
  Plus,
  AlertCircle,
} from "lucide-react";

import { useLibraryData } from "../../../hooks/useLibaryData";
import { useCreateProject } from "../../../hooks/projects/useCreateProject";

import { useEditorStore } from "../../project-editor/store/useEditorStore";

import ItemDetailsPanel from "./components/ItemDetailsPanel";
import EmptyState from "./components/EmptyState";

import CreateProjectModal from "../home/CreateProjectModal";
import ResourcePreviewModal from "../home/ResourcePreviewModal";

function formatDate(value) {
  if (!value) return "N/A";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function LibrarySkeleton({ viewMode }) {
  const dummyItems = Array.from({ length: 6 });

  if (viewMode === "list") {
    return (
      <div className="w-full bg-[#3A3A3A] rounded-sm shadow-md overflow-hidden animate-pulse">
        <div className="block md:hidden divide-y divide-slate-600">
          {dummyItems.map((_, index) => (
            <div key={index} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 w-full">
                <div className="h-4 w-4 bg-slate-600 rounded-sm shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-3 bg-slate-600 rounded-sm w-3/4" />
                  <div className="h-2.5 bg-slate-600 rounded-sm w-1/2" />
                </div>
              </div>
              <div className="h-4 w-4 bg-slate-600 rounded-sm shrink-0" />
            </div>
          ))}
        </div>

        <table className="hidden md:table w-full border-collapse text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-600 uppercase tracking-wider text-slate-300 bg-slate-700/40 font-bold">
              <th className="py-3 px-4 w-12 font-bold">S No.</th>
              <th className="py-3 px-4 font-bold">Name</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold">Modified Date</th>
              <th className="py-3 px-4 font-bold">Sections</th>
              <th className="py-3 px-4 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {dummyItems.map((_, index) => (
              <tr key={index}>
                <td className="py-4 px-4">
                  <div className="h-3 bg-slate-600 rounded-sm w-6" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-slate-600 rounded-sm shrink-0" />
                    <div className="h-3 bg-slate-600 rounded-sm w-48" />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-3 bg-slate-600 rounded-sm w-16" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-3 bg-slate-600 rounded-sm w-24" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-3 bg-slate-600 rounded-sm w-20" />
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="h-4 w-4 bg-slate-600 rounded-sm ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
      {dummyItems.map((_, index) => (
        <div
          key={index}
          className="bg-[#3A3A3A] rounded-sm p-4 flex flex-col justify-between space-y-4 shadow-md h-28"
        >
          <div className="flex items-start justify-between">
            <div className="h-5 w-5 bg-slate-600 rounded-sm" />
            <div className="h-4 w-4 bg-slate-600 rounded-sm" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-600 rounded-sm w-3/4" />
            <div className="flex items-center justify-between">
              <div className="h-2.5 bg-slate-600 rounded-sm w-16" />
              <div className="h-2.5 bg-slate-600 rounded-sm w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LibraryPage() {
  const router = useRouter();
  const PAGE_SIZE = 10;

  const [activeTab, setActiveTab] = useState("projects");
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isResourcePreviewModalOpen, setIsResourcePreviewModalOpen] = useState(false);

  const panelRef = useRef(null);

  const { createProject, isCreating } = useCreateProject();

  const {
    projects,
    totalProjects,
    page,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    isLoading,
    isError,
    error,
  } = useLibraryData({
    activeTab,
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const rawData = activeTab === "projects" ? projects || [] : [];

  const activeData = rawData
    .map((item) => {
      const createdAt = item.createdAt || item.created_at || null;
      const updatedAt = item.updatedAt || item.updated_at || item.date || null;

      return {
        ...item,
        createdAt,
        updatedAt,
        date: formatDate(updatedAt),
        size:
          item.size ??
          (item.sectionCount !== undefined
            ? `${item.sectionCount} SECTIONS`
            : "0 SECTIONS"),
      };
    })
    .filter((item) => {
      if (!searchQuery.trim()) {
        return true;
      }
      return item.name?.toLowerCase().includes(searchQuery.toLowerCase().trim());
    });

  const projectCountBadge = isLoading ? "..." : totalProjects;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isPanelOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setIsPanelOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPanelOpen]);

  const handleCreateScratch = async () => {
    setIsCreateProjectModalOpen(false);

    try {
      const project = await createProject({
        name: "Untitled Project",
        mode: "scratch",
      });

      if (!project?.id) {
        throw new Error("Project creation completed without a project ID.");
      }

      useEditorStore.getState().resetToNewDocument(project.id);
      router.push(`/project-editor?id=${encodeURIComponent(project.id)}`);
    } catch {
      // Error managed via useCreateProject
    }
  };

  const handleCreateAI = () => {
    setIsCreateProjectModalOpen(false);
    router.push("/dashboard/ai-assistant");
  };

  const handlePreviousPage = () => {
    if (!hasPreviousPage || isLoading) return;
    setCurrentPage((previous) => Math.max(previous - 1, 1));
  };

  const handleNextPage = () => {
    if (!hasNextPage || isLoading) return;
    setCurrentPage((previous) => previous + 1);
  };

  const handleNavigateToItem = (item) => {
    if (activeTab === "projects") {
      router.push(`/project-editor?id=${encodeURIComponent(item.id)}`);
    }
  };

  const handleOpenPanel = (item, event) => {
    event.stopPropagation();
    setSelectedItem(item);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleOpenCreateProject = () => {
    if (activeTab === "projects") {
      setIsCreateProjectModalOpen(true);
      return;
    }

    setIsResourcePreviewModalOpen(true);
  };

  const handleTabChange = (tab) => {
    if (tab === "resources") {
      setIsResourcePreviewModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleCloseResourceModal = () => {
    setIsResourcePreviewModalOpen(false);
    setActiveTab("projects");
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 bg-[#212121] text-white antialiased h-full w-full relative min-h-0">
      <div className="flex flex-col gap-6">
        <div className="border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => handleTabChange("projects")}
                className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors relative ${
                  activeTab === "projects"
                    ? "border-[#1b365d] text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <FolderOpen className="h-4 w-4 stroke-2" />
                <span>Projects</span>
                <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded-sm bg-slate-700 text-white font-semibold">
                  {projectCountBadge}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("resources")}
                className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors relative ${
                  activeTab === "resources"
                    ? "border-[#1b365d] text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="h-4 w-4 stroke-2" />
                <span>Resources</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateProject}
              disabled={activeTab === "projects" && isCreating}
              className="hidden sm:flex mb-2 bg-[#1b365d] hover:bg-[#2a4a7a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs px-4 py-2 rounded-sm transition-colors items-center gap-1.5 shrink-0 uppercase tracking-wider shadow-md"
            >
              <Plus className="w-4 h-4 stroke-2" />
              <span>{activeTab === "projects" ? "New Project" : "New Resource"}</span>
            </button>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-bold tracking-wider text-white uppercase">
                All {activeTab === "projects" ? "Projects" : "Resources"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
                {/* <button
                  type="button"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm bg-[#3A3A3A] text-xs font-medium text-white hover:bg-slate-600 transition-colors uppercase tracking-wider shadow-sm"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </button> */}

                <div className="flex items-center bg-[#3A3A3A] rounded-sm p-0.5 shrink-0 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-sm transition-colors ${
                      viewMode === "list" ? "bg-slate-600 text-white" : "text-slate-400"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-sm transition-colors ${
                      viewMode === "grid" ? "bg-slate-600 text-white" : "text-slate-400"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {activeTab === "projects" && isLoading ? (
            <LibrarySkeleton viewMode={viewMode} />
          ) : activeTab === "projects" && isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-red-300 bg-[#3A3A3A] rounded-sm shadow-md space-y-2">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <span className="text-xs uppercase tracking-wider font-semibold">
                {error || "Failed to load projects"}
              </span>
            </div>
          ) : activeTab === "projects" && activeData.length === 0 ? (
            <EmptyState
              activeTab={activeTab}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
            />
          ) : activeTab === "projects" && viewMode === "list" ? (
            <div className="w-full bg-[#3A3A3A] rounded-sm shadow-md overflow-visible">
              <div className="block md:hidden divide-y divide-slate-600">
                {activeData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNavigateToItem(item)}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FolderOpen className="h-4 w-4 stroke-2 text-white shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs text-white truncate uppercase tracking-wider">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2 font-medium uppercase tracking-wider">
                          <span>{item.date}</span>
                          <span className="w-1 h-1 bg-slate-500" />
                          <span>{item.size}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => handleOpenPanel(item, event)}
                      className="p-2 rounded-sm hover:bg-slate-500 text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <table className="hidden md:table w-full border-collapse text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-600 font-bold uppercase tracking-wider text-slate-300 bg-slate-700/40">
                    <th className="py-3 px-4 w-12 font-bold">S No.</th>
                    <th className="py-3 px-4 font-bold">Name</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Modified Date</th>
                    <th className="py-3 px-4 font-bold">Sections</th>
                    <th className="py-3 px-4 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600">
                  {activeData.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => handleNavigateToItem(item)}
                      className="hover:bg-slate-600 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-4 font-semibold text-slate-300">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="py-4 px-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <FolderOpen className="h-4 w-4 stroke-2 text-white shrink-0" />
                          <span className="truncate max-w-md transition-colors font-semibold uppercase tracking-wider">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300 uppercase tracking-wider font-medium">
                        {item.status}
                      </td>
                      <td className="py-4 px-4 text-slate-300 uppercase tracking-wider font-medium">
                        {item.date}
                      </td>
                      <td className="py-4 px-4 text-slate-300 uppercase tracking-wider font-medium">
                        {item.size}
                      </td>
                      <td
                        className="py-4 px-4 text-right overflow-visible"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(event) => handleOpenPanel(item, event)}
                          className="p-1 rounded-sm hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === "projects" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigateToItem(item)}
                  className="bg-[#3A3A3A] rounded-sm p-4 flex flex-col justify-between space-y-4 shadow-md transition-colors group relative overflow-visible cursor-pointer hover:bg-slate-600"
                >
                  <div className="flex items-start justify-between">
                    <FolderOpen className="h-5 w-5 stroke-2 text-white shrink-0" />
                    <button
                      type="button"
                      onClick={(event) => handleOpenPanel(item, event)}
                      className="p-1 rounded-sm hover:bg-slate-500 text-slate-400 hover:text-white transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-xs text-white line-clamp-1 uppercase tracking-wider">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      <span>{item.date}</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "projects" && !isError && totalProjects > 0 && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={!hasPreviousPage || isLoading}
                className="inline-flex items-center gap-1 rounded-sm border border-slate-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Page {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={!hasNextPage || isLoading}
                className="inline-flex items-center gap-1 rounded-sm border border-slate-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      </div>

      <ItemDetailsPanel
        isOpen={isPanelOpen}
        panelRef={panelRef}
        item={selectedItem}
        activeTab={activeTab}
        onClose={handleClosePanel}
      />

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        isCreating={isCreating}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreateScratch={handleCreateScratch}
        onCreateAI={handleCreateAI}
      />

      {isResourcePreviewModalOpen && (
        <ResourcePreviewModal
          isOpen={isResourcePreviewModalOpen}
          onClose={handleCloseResourceModal}
        />
      )}

      <button
        type="button"
        onClick={handleOpenCreateProject}
        disabled={activeTab === "projects" && isCreating}
        className="sm:hidden fixed bottom-6 right-6 bg-[#1b365d] active:bg-[#2a4a7a] disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-sm shadow-md z-40 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 stroke-2" />
      </button>
    </div>
  );
}