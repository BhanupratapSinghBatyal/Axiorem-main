// src/hooks/useAssetActions.js

import { useMutation, useQueryClient } from '@tanstack/react-query';

const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

const requestUploadSessionApi = async ({ originalFileName, mimeType, fileSizeBytes, projectId = null }) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/assets/upload-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      originalFileName,
      mimeType,
      fileSizeBytes,
      projectId,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to initiate upload session (${res.status})`);
  }

  return res.json();
};

/**
 * Directly stream binary file payload to GCS via XHR to capture progress metrics
 */
const uploadFileToGcsApi = ({ uploadUrl, file, onProgress }) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Direct storage upload failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during storage upload.'));
    xhr.send(file);
  });
};

const completeUploadSessionApi = async (assetId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/assets/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ assetId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to complete upload session (${res.status})`);
  }

  return res.json();
};

const deleteAssetApi = async (assetId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/assets/${assetId}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete asset (${res.status})`);
  }

  return true;
};

const copyAssetApi = async ({ assetId, targetProjectId }) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/assets/${assetId}/copy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ targetProjectId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to copy asset (${res.status})`);
  }

  return res.json();
};

export function useAssetActions() {
  const queryClient = useQueryClient();

  const uploadAssetMutation = useMutation({
    mutationFn: async ({ file, projectId = null, onProgress }) => {
      const session = await requestUploadSessionApi({
        originalFileName: file.name,
        mimeType: file.type,
        fileSizeBytes: file.size,
        projectId,
      });

      await uploadFileToGcsApi({
        uploadUrl: session.uploadUrl,
        file,
        onProgress,
      });

      const completedAsset = await completeUploadSessionApi(session.assetId);
      return completedAsset;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      if (variables.projectId) {
        queryClient.invalidateQueries({ queryKey: ['project-assets', variables.projectId] });
      }
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (assetId) => deleteAssetApi(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['project-assets'] });
    },
  });

  const purgePendingDeletionsMutation = useMutation({
    mutationFn: async (assetIds = []) => {
      if (!assetIds.length) return;
      await Promise.allSettled(assetIds.map((id) => deleteAssetApi(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['project-assets'] });
    }
  });

  const copyAssetMutation = useMutation({
    mutationFn: ({ assetId, targetProjectId }) => copyAssetApi({ assetId, targetProjectId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['project-assets', variables.targetProjectId] });
    },
  });

  return {
    uploadAsset: uploadAssetMutation.mutateAsync,
    isUploading: uploadAssetMutation.isPending,
    uploadError: uploadAssetMutation.error?.message || null,

    deleteAsset: deleteAssetMutation.mutateAsync,
    isDeleting: deleteAssetMutation.isPending,
    deleteError: deleteAssetMutation.error?.message || null,

    purgePendingDeletions: purgePendingDeletionsMutation.mutateAsync,

    copyAsset: copyAssetMutation.mutateAsync,
    isCopying: copyAssetMutation.isPending,
    copyError: copyAssetMutation.error?.message || null,
  };
}