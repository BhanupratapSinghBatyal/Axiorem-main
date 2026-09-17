import { BookOpen, PenTool, Brain, Car as Cards, Presentation } from 'lucide-react';

export const projectTypes = [
  {
    type: 'lesson',
    name: 'Lesson Planning',
    description: 'Create detailed lesson plans with objectives, activities, and resources',
    icon: BookOpen,
  },
  {
    type: 'assignment',
    name: 'Assignments',
    description: 'Generate quizzes, tests, and homework assignments',
    icon: PenTool,
  },
  {
    type: 'summarization',
    name: 'Summarization',
    description: 'Create concise summaries and study materials',
    icon: Brain,
  },
  {
    type: 'flashcards',
    name: 'Flashcard Generation',
    description: 'Generate interactive flashcards for effective memorization and review',
    icon: Cards,
  },
  {
    type: 'presentation',
    name: 'Presentation Generator',
    description: 'Create engaging slide presentations with key points and visuals',
    icon: Presentation,
  },
];