"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

const BACKEND_BASE_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
).replace(/\/$/, "");

class ProjectGenerationCancelledError extends Error {
  constructor(message = "Project generation was cancelled.") {
    super(message);
    this.name = "ProjectGenerationCancelledError";
  }
}

const isCancellationError = (error) =>
  error instanceof ProjectGenerationCancelledError ||
  (error instanceof Error && error.name === "AbortError");

const toFiniteNumber = (value, fallback = null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const createProjectFromSource = async (payload, onProgress, signal) => {
  const { name, description, templateId, file, settings, generation } = payload || {};

  if (!file) throw new Error("Source document file is required.");
  if (!templateId) throw new Error("Template ID is required.");
  if (signal?.aborted) throw new ProjectGenerationCancelledError();

  const formData = new FormData();
  formData.append("name", name || "Untitled Project");
  formData.append("templateId", templateId);
  formData.append("file", file);

  if (description) formData.append("description", description);
  if (settings) formData.append("settings", JSON.stringify(settings));
  if (generation) formData.append("generation", JSON.stringify(generation));

  let response;

  try {
    response = await fetch(
      `${BACKEND_BASE_URL}/api/v1/projects/generate-output-from-source`,
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
    let message = "Failed to generate project from source document.";

    try {
      const errorData = await response.json();
      message =
        errorData?.message ||
        errorData?.error ||
        errorData?.details ||
        message;
    } catch {}

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (!response.body) {
    throw new Error("Source-generation response stream is unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let completedProject = null;
  let pipelineError = null;
  let cancellationMessage = null;
  let finalCreditExpense = null;
  let finalCreditChargeStatus = null;

  const processEvent = (rawEvent) => {
    let eventName = "message";
    let data = "";

    for (const line of rawEvent.split(/\r?\n/)) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        data += line.slice(5).trim();
      }
    }

    if (!data) return;

    let event;

    try {
      event = JSON.parse(data);
    } catch {
      return;
    }

    if (eventName !== "pipeline") return;

    if (typeof onProgress === "function") {
      onProgress(event);
    }

    if (event.status === "completed" && event.project) {
      completedProject = event.project;
    }

    if (event.status === "failed") {
      pipelineError =
        event.message ||
        "Project generation failed.";
    }

    if (event.status === "cancelled") {
      cancellationMessage =
        event.message ||
        "Project generation was cancelled.";
    }

    const creditExpense = toFiniteNumber(
      event.creditExpense,
      null
    );

    if (creditExpense !== null) {
      finalCreditExpense = creditExpense;
    }

    if (event.creditChargeStatus) {
      finalCreditChargeStatus =
        event.creditChargeStatus;
    }
  };

  try {
    while (true) {
      if (signal?.aborted) {
        throw new ProjectGenerationCancelledError();
      }

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

      buffer += decoder.decode(value, {
        stream: true,
      });

      const events = buffer.split(/\r?\n\r?\n/);

      buffer = events.pop() || "";

      for (const rawEvent of events) {
        if (!rawEvent.trim()) continue;

        if (
          rawEvent
            .split(/\r?\n/)
            .every((line) => line.startsWith(":"))
        ) {
          continue;
        }

        if (signal?.aborted) {
          throw new ProjectGenerationCancelledError();
        }

        processEvent(rawEvent);
      }
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      processEvent(buffer);
    }

    if (signal?.aborted) {
      throw new ProjectGenerationCancelledError();
    }

    if (cancellationMessage) {
      throw new ProjectGenerationCancelledError(
        cancellationMessage
      );
    }

    if (pipelineError) {
      throw new Error(pipelineError);
    }

    if (!completedProject) {
      throw new Error(
        "Project generation stream ended without a completed project."
      );
    }

    return {
      project: completedProject,
      creditExpense: finalCreditExpense,
      creditChargeStatus: finalCreditChargeStatus,
    };
  } finally {
    try {
      await reader.cancel();
    } catch {}

    reader.releaseLock();
  }
};

export function useCreateProjectFromSource() {
  const [pipelineProgress, setPipelineProgress] = useState([]);
  const [estimatedCreditExpense, setEstimatedCreditExpense] = useState(0);
  const [creditExpense, setCreditExpense] = useState(null);
  const [creditChargeStatus, setCreditChargeStatus] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);

  const abortControllerRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async ({ payload }) => {
      if (
        abortControllerRef.current &&
        !abortControllerRef.current.signal.aborted
      ) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();

      abortControllerRef.current = controller;

      setPipelineProgress([]);
      setEstimatedCreditExpense(0);
      setCreditExpense(null);
      setCreditChargeStatus(null);
      setIsCancelled(false);

      try {
        const result = await createProjectFromSource(
          payload,
          (event) => {
            if (controller.signal.aborted) return;

            setPipelineProgress((prev) => [
              ...prev,
              event,
            ]);

            const liveEstimate = toFiniteNumber(
              event.estimatedCreditExpense,
              null
            );

            if (liveEstimate !== null) {
              setEstimatedCreditExpense(liveEstimate);
            }

            const settledExpense = toFiniteNumber(
              event.creditExpense,
              null
            );

            if (settledExpense !== null) {
              setCreditExpense(settledExpense);
            }

            if (event.creditChargeStatus) {
              setCreditChargeStatus(
                event.creditChargeStatus
              );
            }
          },
          controller.signal
        );

        if (result.creditExpense !== null) {
          setCreditExpense(result.creditExpense);
        }

        if (result.creditChargeStatus) {
          setCreditChargeStatus(
            result.creditChargeStatus
          );
        }

        return result.project;
      } finally {
        if (
          abortControllerRef.current === controller
        ) {
          abortControllerRef.current = null;
        }
      }
    },

    onError: (error) => {
      const isCancel = isCancellationError(error);

      if (isCancel) {
        setIsCancelled(true);
      }

      setPipelineProgress((prev) => [
        ...prev,
        isCancel
          ? {
              step: "cancelled",
              status: "cancelled",
              message:
                error?.message ||
                "Project generation was cancelled.",
              creditExpense: 0,
              creditChargeStatus: "not_charged",
            }
          : {
              step: "failed",
              status: "failed",
              message:
                error?.message ||
                "Project generation failed.",
              creditExpense: 0,
              creditChargeStatus: "not_charged",
            },
      ]);
    },
  });

  const cancelGeneration = () => {
    const controller = abortControllerRef.current;

    if (
      !controller ||
      controller.signal.aborted
    ) {
      return;
    }

    setIsCancelled(true);
    controller.abort();
  };

  const reset = () => {
    cancelGeneration();

    abortControllerRef.current = null;

    setPipelineProgress([]);
    setEstimatedCreditExpense(0);
    setCreditExpense(null);
    setCreditChargeStatus(null);
    setIsCancelled(false);

    mutation.reset();
  };

  const isCancellationFailure =
    isCancellationError(mutation.error);

  const cancelled =
    isCancelled ||
    isCancellationFailure;

  const errMessage =
    isCancellationFailure
      ? null
      : mutation.error?.message || null;

  return {
    createProjectFromSource:
      mutation.mutateAsync,

    cancelGeneration,

    pipelineProgress,

    latestProgress:
      pipelineProgress.at(-1) ?? null,

    estimatedCreditExpense,

    creditExpense,

    creditChargeStatus,

    status:
      mutation.isPending
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