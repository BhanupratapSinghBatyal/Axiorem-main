import React from 'react';

const AssignmentModal = ({
  isOpen,
  onClose,
  assignmentDifficulty,
  setAssignmentDifficulty,
  numQuestions,
  setNumQuestions,
  assignmentInstructions,
  setAssignmentInstructions,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Set Assignment Details</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
          <select
            value={assignmentDifficulty}
            onChange={(e) => setAssignmentDifficulty(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Number of Questions</label>
          <input
            type="number"
            min="1"
            max="100"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Math.max(1, Math.min(100, parseInt(e.target.value))))}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Additional Instructions</label>
          <textarea
            value={assignmentInstructions}
            onChange={(e) => setAssignmentInstructions(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-32 resize-y"
            placeholder="Enter any specific instructions..."
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;