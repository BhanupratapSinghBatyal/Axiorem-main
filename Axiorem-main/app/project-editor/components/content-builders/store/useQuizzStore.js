import { create } from 'zustand';
import { useEditorStore } from '../../../store/useEditorStore';

const generateUniqueQuestionId = (prefix = 'q') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const createDefaultQuestion = (forcedId) => ({
  id: forcedId || generateUniqueQuestionId(),
  type: 'mcq',
  title: '',
  question: '',
  points: 1,
  options: [''],
  correctAnswers: [],
  mediaType: null,
  mediaUrl: null,
  mediaAssetId: null,
  minCharacters: 0,
  maxCharacters: 1000,
  isExpanded: true,
  source: ''
});

export const useQuizzStore = create((set, get) => ({
  // --- Global Quiz State ---
  sectionId: null,
  sectionTitle: '',
  shuffleQuestions: false,
  timeLimit: 0,
  passingScore: 80,
  revealAnswers: true,
  revealResults: true,
  questions: [],
  activeQuestionId: null,
  initialized: false,

  // --- Initialization Pipeline ---
  initializeStore: (sectionId, initialData = {}, forceReinit = false) => {
    if (!forceReinit && get().initialized && get().sectionId === sectionId) return;

    const defaultQuestion = createDefaultQuestion();
    const questions = Array.isArray(initialData.questions) && initialData.questions.length > 0
      ? initialData.questions.map(q => ({
          ...q,
          options: q.options || [],
          mediaUrl: q.mediaUrl || '',
          mediaAssetId: q.mediaAssetId || null,
        }))
      : [defaultQuestion];
    
    const activeQuestionId = initialData.activeQuestionId || questions[0]?.id || null;

    set({
      sectionId,
      sectionTitle: initialData.sectionTitle || '',
      shuffleQuestions: initialData.shuffleQuestions ?? false,
      timeLimit: initialData.timeLimit ?? 0,
      passingScore: initialData.passingScore ?? 80,
      revealAnswers: initialData.revealAnswers ?? true,
      revealResults: initialData.revealResults ?? true,
      questions,
      activeQuestionId,
      initialized: true,
    });
  },

  initializeFromEditor: (sectionId, forceReinit = false) => {
    const editorState = useEditorStore.getState();
    const section = editorState.sections?.find(s => s.id === sectionId);
    if (section) {
      get().initializeStore(sectionId, section.data, forceReinit);
    }
  },

  syncToEditor: () => {
    const { 
      sectionId, 
      sectionTitle, 
      shuffleQuestions, 
      timeLimit, 
      passingScore, 
      revealAnswers,
      revealResults, 
      questions, 
      activeQuestionId 
    } = get();

    if (!sectionId) return;

    useEditorStore.getState().updateSectionData(sectionId, {
      sectionTitle,
      shuffleQuestions,
      timeLimit,
      passingScore,
      revealAnswers,
      revealResults,
      questions,
      activeQuestionId
    });
  },

  // --- Configuration Actions ---
  setTitle: (title) => {
    const { sectionId } = get();
    set({ sectionTitle: title });

    if (sectionId) {
      const editorStore = useEditorStore.getState();
      if (typeof editorStore.handleSectionTitleChange === 'function') {
        editorStore.handleSectionTitleChange(sectionId, title);
      }
    }
    get().syncToEditor();
  },

  setShuffleQuestions: (shuffleQuestions) => {
    set({ shuffleQuestions });
    get().syncToEditor();
  },

  setTimeLimit: (timeLimit) => {
    set({ timeLimit: Math.max(0, Number(timeLimit) || 0) });
    get().syncToEditor();
  },

  setPassingScore: (passingScore) => {
    set({ passingScore: Math.min(100, Math.max(0, Number(passingScore) || 0)) });
    get().syncToEditor();
  },

  setRevealAnswers: (revealAnswers) => {
    set({ revealAnswers });
    get().syncToEditor();
  },

  setRevealResults: (revealResults) => {
    set({ revealResults });
    get().syncToEditor();
  },

  setActiveQuestionId: (id) => {
    set({ activeQuestionId: id });
    get().syncToEditor();
  },

  // --- Question Management Actions ---
  toggleQuestionExpanded: (id) => {
    set((state) => ({
      questions: state.questions.map(q => 
        q.id === id ? { ...q, isExpanded: !q.isExpanded } : q
      )
    }));
    get().syncToEditor();
  },

  addQuestion: () => {
    const newQuestion = createDefaultQuestion();
    set((state) => ({
      questions: [...state.questions, newQuestion],
      activeQuestionId: newQuestion.id
    }));
    get().syncToEditor();
  },

  insertQuestion: (targetId, position, forcedId) => {
    const { questions } = get();
    const index = questions.findIndex(q => q.id === targetId);
    if (index === -1) return;

    const newQuestion = createDefaultQuestion(forcedId);
    const updatedQuestions = [...questions];
    const insertionIndex = position === 'above' ? index : index + 1;
    updatedQuestions.splice(insertionIndex, 0, newQuestion);

    set({
      questions: updatedQuestions,
      activeQuestionId: newQuestion.id
    });
    get().syncToEditor();
  },

  deleteQuestion: (id) => {
    const { questions, activeQuestionId } = get();
    if (questions.length <= 1) return;

    const updatedQuestions = questions.filter(q => q.id !== id);
    const nextActiveId = activeQuestionId === id ? updatedQuestions[0]?.id || null : activeQuestionId;

    set({
      questions: updatedQuestions,
      activeQuestionId: nextActiveId
    });
    get().syncToEditor();
  },

  updateQuestionField: (id, field, value) => {
    set((state) => ({
      questions: state.questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
    get().syncToEditor();
  },

  setMediaField: (questionId, mediaUrl, mediaAssetId) => {
    const currentQuestion = get().questions.find((q) => q.id === questionId);
    if (currentQuestion?.mediaAssetId && currentQuestion.mediaAssetId !== mediaAssetId) {
      useEditorStore.getState().queueAssetForDeletion(currentQuestion.mediaAssetId);
    }

    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? { ...q, mediaUrl, mediaAssetId }
          : q
      )
    }));
    get().syncToEditor();
  },

  removeMediaField: (questionId) => {
    const currentQuestion = get().questions.find((q) => q.id === questionId);
    if (currentQuestion?.mediaAssetId) {
      useEditorStore.getState().queueAssetForDeletion(currentQuestion.mediaAssetId);
    }

    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? { ...q, mediaUrl: null, mediaType: null, mediaAssetId: null }
          : q
      )
    }));
    get().syncToEditor();
  },

  changeQuestionType: (id, type) => {
    set((state) => ({
      questions: state.questions.map(q => {
        if (q.id !== id) return q;
        return {
          ...q,
          type,
          points: q.points || 1,
          options: type === 'mcq' ? (q.options?.length ? q.options : ['']) : [],
          correctAnswers: type === 'mcq' ? q.correctAnswers || [] : []
        };
      })
    }));
    get().syncToEditor();
  },

  // --- Option & Constraint Actions ---
  addOption: (id) => {
    set((state) => ({
      questions: state.questions.map(q => 
        q.id === id ? { ...q, options: [...(q.options || []), ''] } : q
      )
    }));
    get().syncToEditor();
  },

  updateOptionText: (qId, optIdx, text) => {
    set((state) => ({
      questions: state.questions.map(q => {
        if (q.id !== qId) return q;
        const updatedOptions = [...(q.options || [])];
        updatedOptions[optIdx] = text;
        return { ...q, options: updatedOptions };
      })
    }));
    get().syncToEditor();
  },

  deleteOption: (qId, optIdx) => {
    set((state) => ({
      questions: state.questions.map(q => {
        if (q.id !== qId) return q;
        const currentOptions = q.options || [];
        if (currentOptions.length <= 1) return q;

        const updatedOptions = currentOptions.filter((_, i) => i !== optIdx);
        const updatedCorrect = (q.correctAnswers || [])
          .filter(idx => idx !== optIdx)
          .map(idx => (idx > optIdx ? idx - 1 : idx));

        return {
          ...q,
          options: updatedOptions,
          correctAnswers: updatedCorrect
        };
      })
    }));
    get().syncToEditor();
  },

  toggleCorrectAnswer: (qId, optIdx) => {
    set((state) => ({
      questions: state.questions.map(q => {
        if (q.id !== qId) return q;
        const currentCorrect = q.correctAnswers || [];
        const exists = currentCorrect.includes(optIdx);
        return {
          ...q,
          correctAnswers: exists 
            ? currentCorrect.filter(idx => idx !== optIdx)
            : [...currentCorrect, optIdx]
        };
      })
    }));
    get().syncToEditor();
  },

  updateTextualConstraints: (questionId, minCharacters, maxCharacters) => {
    set((state) => ({
      questions: state.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              minCharacters: Math.max(0, Number(minCharacters) || 0), 
              maxCharacters: Math.max(0, Number(maxCharacters) || 0) 
            } 
          : q
      )
    }));
    get().syncToEditor();
  },

  resetStore: () => {
    set({
      sectionId: null,
      sectionTitle: '',
      shuffleQuestions: false,
      timeLimit: 0,
      passingScore: 80,
      revealAnswers: true,
      revealResults: true,
      questions: [createDefaultQuestion()],
      activeQuestionId: null,
      initialized: false,
    });
  }
}));