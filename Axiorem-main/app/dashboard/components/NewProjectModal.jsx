import React from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { projectTypes } from '../constants/projectTypes';

const ProjectTypeButton = ({ type, onClick }) => (
  <button
    className="group p-6 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left bg-white hover:bg-blue-50"
    onClick={onClick}
  >
    <div className="flex items-center space-x-4 mb-4">
      <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors relative">
        <type.icon className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-800">{type.name}</h3>
    </div>
    <p className="text-sm text-gray-600">{type.description}</p>
  </button>
);

const NewProjectModal = ({ isOpen, onClose, onLessonPlanning, onAssignment, onFlashcards, onPresentation }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[800px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Create New Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {projectTypes.map((type) =>
            type.type === 'lesson' ? (
              <ProjectTypeButton key={type.type} type={type} onClick={onLessonPlanning} />
            ) : type.type === 'assignment' ? (
              <ProjectTypeButton key={type.type} type={type} onClick={onAssignment} />
            ) : type.type === 'flashcards' ? (
              <ProjectTypeButton key={type.type} type={type} onClick={onFlashcards} />
            ): type.type==='presentation'?(<ProjectTypeButton key={type.type} type={type} onClick={onPresentation} />)  : (
              <Link href={`/services/${type.type}`} target="_blank" key={type.type}>
                <ProjectTypeButton type={type} onClick={onClose} />
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;