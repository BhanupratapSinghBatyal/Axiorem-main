// app/dashboard/page.jsx (DashboardHome)

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Users, FolderOpen, FileText } from "lucide-react";

import { useDashboardMetrics } from "../../hooks/useDashboardData";
import { useCreateProject } from "../../hooks/projects/useCreateProject";
import { useCreateProjectFromSource } from "../../hooks/projects/useCreateProjectFromSource";

import { useEditorStore } from "../project-editor/store/useEditorStore";
import { useAuthStore } from "@/store/useAuthStore";

import DashboardHeader from "./home/DashboardHeader";
import MetricsSection from "./home/MetricsSection";
import PlanBanner from "./home/PlanBanner";
import TemplatesSection from "./home/TemplatesSection";
import ProjectsSection from "./home/ProjectsSection";
import ActivitySection from "./home/ActivitySection";
import CreateProjectModal from "./home/CreateProjectModal";
import TemplateModal from "./home/TemplateModal";
import AnalyticsModal from "./home/AnalyticsModal";

export default function DashboardHome({ defaultAnalyticsOpen = false }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(defaultAnalyticsOpen);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showUploadField, setShowUploadField] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPlanBanner, setShowPlanBanner] = useState(true);

  const fileInputRef = useRef(null);
  const carouselRef = useRef(null);

  const setLoading = useAuthStore((state) => state.setLoading);

  const {
    data: metrics,
    workspace,
    isLoading: isMetricsLoading,
  } = useDashboardMetrics();

  const { createProject, isCreating } = useCreateProject();

  const {
    createProjectFromSource,
    isCreating: isGenerating,
    pipelineProgress,
    estimatedCreditExpense,
    creditExpense,
    creditChargeStatus,
    error: generationError,
    cancelGeneration,
    reset: resetSourceGeneration,
  } = useCreateProjectFromSource();

  const workspaceName = isMetricsLoading
    ? "Loading Workspace..."
    : workspace?.organizationName ||
      workspace?.name ||
      "Default Workspace";

  const billingPlan = workspace?.billingPlan || "";
  const subscriptionTier = workspace?.subscriptionTier || "";

  const isFreePlan =
    billingPlan === "FREE_TIER" ||
    subscriptionTier === "FREE" ||
    !workspace;

  useEffect(() => {
    if (!isMetricsLoading) {
      setLoading(false);
    }
  }, [isMetricsLoading, setLoading]);

  useEffect(() => {
    if (pathname === "/dashboard/analytics") {
      setIsAnalyticsOpen(true);
    }
  }, [pathname]);

  const handleOpenAnalytics = () => {
    setIsAnalyticsOpen(true);
    window.history.pushState(null, "", "/dashboard/analytics");
  };

  const handleCloseAnalytics = () => {
    setIsAnalyticsOpen(false);

    if (pathname === "/dashboard/analytics") {
      router.replace("/dashboard");
    } else {
      window.history.replaceState(null, "", "/dashboard");
    }
  };

  const DYNAMIC_METRICS = [
    {
      label: "Active Members",
      value: isMetricsLoading
        ? "..."
        : metrics?.activeMembersCount ??
          workspace?.activeMembersCount ??
          0,
      icon: Users,
    },
    {
      label: "Total Projects",
      value: isMetricsLoading
        ? "..."
        : metrics?.totalProjectsCount ??
          workspace?.totalProjectsCount ??
          0,
      icon: FolderOpen,
    },
    {
      label: "Resources Saved",
      value: isMetricsLoading
        ? "..."
        : metrics?.resourcesSavedCount ??
          workspace?.resourcesSavedCount ??
          0,
      icon: FileText,
    },
  ];

  const handleCreateScratch = async () => {
    setIsModalOpen(false);

    try {
      const project = await createProject({
        name: "Untitled Project",
        mode: "scratch",
      });

      useEditorStore.getState().resetToNewDocument(project.id);

      router.push(`/project-editor?id=${project.id}`);
    } catch {
      // Handled inside useCreateProject mutation state.
    }
  };

  const handleCreateAI = () => {
    setIsModalOpen(false);
    router.push("/dashboard/ai-assistant");
  };

  const handleTemplateSelect = (template) => {
    resetSourceGeneration?.();

    setSelectedTemplate(template);
    setShowUploadField(false);
    setSelectedFile(null);
  };

  const handleCloseTemplateModal = () => {
    setSelectedTemplate(null);
    setShowUploadField(false);
    setSelectedFile(null);

    resetSourceGeneration?.();
  };

  const handleCancelGeneration = () => {
    cancelGeneration?.();

    setSelectedTemplate(null);
    setShowUploadField(false);
    setSelectedFile(null);

    resetSourceGeneration?.();
  };

  const handleEditTemplateSelf = async () => {
    if (!selectedTemplate) return;

    const templateId = selectedTemplate.id;

    const templateName =
      selectedTemplate.title ||
      selectedTemplate.name ||
      "Untitled Assessment";

    handleCloseTemplateModal();

    try {
      const project = await createProject({
        name: templateName,
        templateId,
        mode: "manual",
      });

      useEditorStore.getState().resetToNewDocument(project.id);

      router.push(`/project-editor?id=${project.id}`);
    } catch {
      // Handled inside useCreateProject mutation state.
    }
  };

  const handleToggleUploadView = () => {
    setShowUploadField(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleExecuteAIFill = async () => {
    if (!selectedTemplate || !selectedFile || isGenerating) return;

    const templateId = selectedTemplate.id;

    const templateName =
      selectedTemplate.title ||
      selectedTemplate.name ||
      "Untitled Assessment";

    try {
      const project = await createProjectFromSource({
        payload: {
          name: templateName,
          templateId,
          file: selectedFile,
        },
      });

      if (!project?.id) {
        throw new Error(
          "Project generation completed without a project ID."
        );
      }

      useEditorStore.getState().resetToNewDocument(project.id);

      setSelectedTemplate(null);
      setShowUploadField(false);
      setSelectedFile(null);

      resetSourceGeneration?.();

      router.push(`/project-editor?id=${project.id}`);
    } catch {
      // Handled inside useCreateProjectFromSource state.
    }
  };

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 sm:space-y-8 bg-[#212121] text-white relative">
      <DashboardHeader
        workspaceName={workspaceName}
        onCreateProject={() => setIsModalOpen(true)}
        onOpenAnalytics={handleOpenAnalytics}
        metrics={metrics}
        isLoading={isMetricsLoading}
      />

      {showPlanBanner && (
        <PlanBanner
          isFreePlan={isFreePlan}
          onDismiss={() => setShowPlanBanner(false)}
        />
      )}

      <TemplatesSection
        onTemplateSelect={handleTemplateSelect}
        carouselRef={carouselRef}
        scrollCarousel={scrollCarousel}
      />

      <ProjectsSection />

      <CreateProjectModal
        isOpen={isModalOpen}
        isCreating={isCreating}
        onClose={() => setIsModalOpen(false)}
        onCreateScratch={handleCreateScratch}
        onCreateAI={handleCreateAI}
      />

      <TemplateModal
        template={selectedTemplate}
        isOpen={!!selectedTemplate}
        isCreating={isCreating}
        isGenerating={isGenerating}
        pipelineProgress={pipelineProgress}
        estimatedCreditExpense={estimatedCreditExpense}
        creditExpense={creditExpense}
        creditChargeStatus={creditChargeStatus}
        generationError={generationError}
        onClose={handleCloseTemplateModal}
        cancelGeneration={handleCancelGeneration}
        onEditTemplateSelf={handleEditTemplateSelf}
        onToggleUploadView={handleToggleUploadView}
        showUploadField={showUploadField}
        selectedFile={selectedFile}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleExecuteAIFill={handleExecuteAIFill}
        setShowUploadField={setShowUploadField}
        setSelectedFile={setSelectedFile}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={handleCloseAnalytics}
      />
    </div>
  );
}