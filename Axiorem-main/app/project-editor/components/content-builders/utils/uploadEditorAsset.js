export async function uploadEditorAsset({
  file,
  projectId = null,
  uploadAsset,
  setUploadProgress,
  clearUploadProgress,
  label = 'Asset Upload',
}) {
  if (!file) return null;

  if (setUploadProgress) {
    setUploadProgress({ active: true, label, stage: 'requesting' });
    setUploadProgress({ stage: 'uploading' });
  }

  try {
    return await uploadAsset({ file, projectId });
  } finally {
    if (clearUploadProgress) {
      setTimeout(() => {
        clearUploadProgress();
      }, 600);
    }
  }
}