/**
 * Converts the canonical editor document into the backend API payload.
 */
export function serializeEditorDocument(editorState) {
  if (!editorState) {
    throw new Error('Editor state snapshot is required for document serialization.');
  }

  const {
    projectName,
    brandColor,
    hasTimeLimit,
    timeLimitMinutes,
    answerRevealMode,
    requireFullscreen,
    enableAiGrading,
    candidateInstructions,
    sections = [],
  } = editorState;

  // Identify cover page by type or dynamic ID fallback
  const coverPageSection = sections.find(s => s.type === 'cover_page' || s.id === 'root-cover-page');
  const coverPageTitle = coverPageSection?.title || projectName;

  const serializedSections = sections.map((section) => {
    const isCoverPage = section.type === 'cover_page' || section.id === 'root-cover-page';
    const isQuiz = section.contentType === 'quiz' || section.type === 'quiz';

    if (isCoverPage) {
      return { ...section, title: coverPageTitle };
    }

    if (isQuiz) {
      return {
        ...section,
        data: {
          ...(section.data || {}),
          revealResults: section.data?.revealResults ?? true,
        },
      };
    }

    return section;
  });

  return {
    name: projectName,
    brandColor,
    settings: {
      brandColor,
      hasTimeLimit,
      timeLimitMinutes,
      answerRevealMode,
      requireFullscreen,
      enableAiGrading,
      candidateInstructions,
    },
    // Top-level mirrors for backward compatibility
    requireFullscreen,
    enableAiGrading,
    candidateInstructions,
    sections: serializedSections,
  };
}

/**
 * Converts a backend API project payload into a clean, deserialized document.
 */
export function deserializeEditorDocument(projectResponse) {
  if (!projectResponse) {
    throw new Error('Project response payload is required for document deserialization.');
  }

  console.log('Project Response:', projectResponse);

  const {
    id,
    name,
    brandColor,
    sections = [],
    settings = {},
  } = projectResponse;

  if (!id) {
    console.warn('Project ID is missing from the project response.');
  }

  // Identify cover page by type or dynamic ID fallback
  const coverPageSection = sections.find(s => s.type === 'cover_page' || s.id === 'root-cover-page');
  const coverPageTitle = coverPageSection?.data.title || name;

  return {
    id,
    projectName: name,
    brandColor: brandColor ?? settings.brandColor,

    // Document Assessment Settings with root/settings fallbacks
    hasTimeLimit: settings.hasTimeLimit ?? projectResponse.hasTimeLimit,
    timeLimitMinutes: settings.timeLimitMinutes ?? projectResponse.timeLimitMinutes,
    answerRevealMode: settings.answerRevealMode ?? projectResponse.answerRevealMode,
    requireFullscreen: settings.requireFullscreen ?? projectResponse.requireFullscreen,
    enableAiGrading: settings.enableAiGrading ?? projectResponse.enableAiGrading,
    candidateInstructions: settings.candidateInstructions ?? projectResponse.candidateInstructions,

    // Authored document structure
    sections: sections.map(s => 
      (s.type === 'cover_page' || s.id === 'root-cover-page') 
        ? { ...s, title: coverPageTitle } 
        : s
    ),
  };
}