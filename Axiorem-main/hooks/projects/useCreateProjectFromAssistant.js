"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

const BACKEND_BASE_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
).replace(/\/$/, "");

class ProjectGenerationCancelledError extends Error {
  constructor() {
    super("AI assistant project generation was cancelled.");
    this.name = "ProjectGenerationCancelledError";
  }
}

const isCancellationError = (error) =>
  error instanceof ProjectGenerationCancelledError ||
  (error instanceof Error && error.name === "AbortError");

function normalizeRequestPayload(variables) {
  if (!variables || typeof variables !== "object" || Array.isArray(variables)) {
    throw new Error(
      "AI assistant project generation payload must be a valid object."
    );
  }
  if (Object.prototype.hasOwnProperty.call(variables, "payload")) {
    const payload = variables.payload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error(
        "AI assistant project generation payload must be a valid object."
      );
    }
    return payload;
  }
  return variables;
}

const createProjectFromAssistantRequest = async (
  payload,
  onProgress,
  signal
) => {
  const { name, description, templateId, file, settings, generation, input } =
    payload || {};

  if (!file) throw new Error("Source document file is required.");
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("AI assistant input must be a valid object.");
  }
  if (signal?.aborted) throw new ProjectGenerationCancelledError();

  const formData = new FormData();

  formData.append(
    "name",
    typeof name === "string" && name.trim() ? name.trim() : "Untitled Project"
  );
  formData.append("file", file);
  formData.append("input", JSON.stringify(input));

  if (typeof templateId === "string" && templateId.trim()) {
    formData.append("templateId", templateId.trim());
  }

  if (typeof description === "string" && description.trim()) {
    formData.append("description", description.trim());
  }

  if (settings && typeof settings === "object" && !Array.isArray(settings)) {
    formData.append("settings", JSON.stringify(settings));
  }

  if (
    generation &&
    typeof generation === "object" &&
    !Array.isArray(generation)
  ) {
    formData.append("generation", JSON.stringify(generation));
  }

  let response;
  try {
    response = await fetch(
      `${BACKEND_BASE_URL}/api/v1/projects/generate-from-ai-assistant`,
      {
        method: "POST",
        headers: { Accept: "text/event-stream" },
        credentials: "include",
        body: formData,
        signal,
      }
    );
  } catch (error) {
    if (signal?.aborted || isCancellationError(error)) {
      throw new ProjectGenerationCancelledError();
    }
    throw error;
  }

  if (!response.ok) {
    let message = "Failed to generate project using AI assistant.";
    try {
      const errorData = await response.json();
      message =
        errorData?.message ||
        errorData?.error ||
        errorData?.details ||
        message;
    } catch {}
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("AI-assistant generation response stream is unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completedProject = null;
  let pipelineError = null;

  const processEvent = (rawEvent) => {
    let eventName = "message";
    const dataLines = [];

    for (const line of rawEvent.split(/\r?\n/)) {
      if (line.startsWith(":")) continue;
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
        continue;
      }
      if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trimStart());
      }
    }

    const data = dataLines.join("\n");
    if (!data.trim()) return;

    let event;
    try {
      event = JSON.parse(data);
    } catch {
      return;
    }

    if (eventName !== "pipeline") return;
    if (typeof onProgress === "function") onProgress(event);

    if (event.step === "completed" && event.project) {
      completedProject = event.project;
      return;
    }

    if (event.status === "completed" && event.project && !completedProject) {
      completedProject = event.project;
    }

    if (event.status === "failed" || event.step === "error") {
      pipelineError =
        event.message || "AI assistant project generation failed.";
    }
  };

  try {
    while (true) {
      if (signal?.aborted) throw new ProjectGenerationCancelledError();

      let readResult;
      try {
        readResult = await reader.read();
      } catch (error) {
        if (signal?.aborted || isCancellationError(error)) {
          throw new ProjectGenerationCancelledError();
        }
        throw error;
      }

      const { value, done } = readResult;
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() || "";

      for (const rawEvent of events) {
        if (!rawEvent.trim()) continue;
        if (
          rawEvent
            .split(/\r?\n/)
            .every((line) => line.trim().startsWith(":"))
        ) {
          continue;
        }
        if (signal?.aborted) throw new ProjectGenerationCancelledError();
        processEvent(rawEvent);
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) processEvent(buffer);

    if (signal?.aborted) throw new ProjectGenerationCancelledError();
    if (pipelineError) throw new Error(pipelineError);
    if (!completedProject) {
      throw new Error(
        "AI assistant generation stream ended without a completed project."
      );
    }

    return completedProject;
  } finally {
    try {
      await reader.cancel();
    } catch {}
    reader.releaseLock();
  }
};

export function useCreateProjectFromAssistant() {
  const [pipelineProgress, setPipelineProgress] = useState([]);
  const [isCancelled, setIsCancelled] = useState(false);
  const abortControllerRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async (variables) => {
      const payload = normalizeRequestPayload(variables);

      if (
        abortControllerRef.current &&
        !abortControllerRef.current.signal.aborted
      ) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setPipelineProgress([]);
      setIsCancelled(false);

      try {
        return await createProjectFromAssistantRequest(
          payload,
          (event) => {
            if (!controller.signal.aborted) {
              setPipelineProgress((previous) => [...previous, event]);
            }
          },
          controller.signal
        );
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },

    onError: (error) => {
      const isCancel = isCancellationError(error);
      if (isCancel) setIsCancelled(true);

      setPipelineProgress((previous) => [
        ...previous,
        isCancel
          ? {
              step: "cancelled",
              status: "cancelled",
              message: "AI assistant project generation was cancelled.",
            }
          : {
              step: "error",
              status: "failed",
              message:
                error?.message || "AI assistant project generation failed.",
            },
      ]);
    },
  });

  const cancelGeneration = () => {
    const controller = abortControllerRef.current;
    if (!controller || controller.signal.aborted) return;
    setIsCancelled(true);
    controller.abort();
  };

  const reset = () => {
    cancelGeneration();
    abortControllerRef.current = null;
    setPipelineProgress([]);
    setIsCancelled(false);
    mutation.reset();
  };

  const executeMutation = async (variables) => {
    try {
      return await mutation.mutateAsync(variables);
    } catch (error) {
      if (isCancellationError(error)) return null;
      throw error;
    }
  };

  const isCancellationFailure = isCancellationError(mutation.error);
  const cancelled = isCancelled || isCancellationFailure;
  const errMessage = isCancellationFailure
    ? null
    : mutation.error?.message || null;

  return {
    createProjectFromAssistant: executeMutation,
    cancelGeneration,
    pipelineProgress,
    latestProgress: pipelineProgress.at(-1) ?? null,
    status: mutation.isPending
      ? "creating"
      : cancelled
      ? "cancelled"
      : mutation.isError
      ? "error"
      : mutation.isSuccess
      ? "success"
      : "idle",
    isCreating: mutation.isPending,
    isGenerating: mutation.isPending,
    isCancelled: cancelled,
    error: errMessage,
    generationError: errMessage,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset,
  };
}