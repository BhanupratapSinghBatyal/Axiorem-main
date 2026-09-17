import { useEditorStore } from "../../../app/project-editor/store/useEditorStore";

export const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

/**
 * Shared HTTP response handler for backend requests.
 */
export const handleJsonResponse = async (res, defaultErrorMessage) => {
  const contentType = res.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const textError = await res.text();
    throw new Error(`Server Error (${res.status}): ${textError || res.statusText}`);
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.details || data?.error || `${defaultErrorMessage} (${res.status}).`);
  }

  return data;
};

/**
 * Resolves project ID from editor state or window location search parameters.
 */
export const resolveProjectId = () => {
  const stateSnapshot = useEditorStore.getState();
  let projectId = stateSnapshot.projectId || stateSnapshot.id;

  if (!projectId && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    projectId = urlParams.get('id');

    if (projectId) {
      stateSnapshot.setProjectId(projectId);
    }
  }

  return projectId;
};